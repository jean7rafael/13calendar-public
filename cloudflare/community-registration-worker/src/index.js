/* ===========================================================
   API SEGURA DO CADASTRO COMUNITÁRIO

   O Worker valida o Turnstile, grava somente dados públicos
   voluntários e mantém todo cadastro pendente de moderação.
=========================================================== */

const MAXIMUM_BODY_BYTES = 12_000;
const MAXIMUM_TURNSTILE_TOKEN_LENGTH = 2_048;
const ALLOWED_SOCIAL_NETWORKS = new Set(['instagram', 'facebook', 'other']);
const ALLOWED_STATUSES = new Set(['approved', 'rejected']);

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const corsHeaders = createCorsHeaders(origin, env.ALLOWED_ORIGINS);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (origin && !corsHeaders.get('Access-Control-Allow-Origin')) {
      return jsonResponse({ error: 'origin_not_allowed' }, 403);
    }

    const url = new URL(request.url);

    try {
      if (request.method === 'POST' && url.pathname === '/registrations') {
        return await createRegistration(request, env, corsHeaders);
      }

      if (request.method === 'GET' && url.pathname === '/members') {
        return await listApprovedMembers(env, corsHeaders);
      }

      if (request.method === 'GET' && url.pathname === '/admin/registrations') {
        return await listPendingRegistrations(request, env, corsHeaders);
      }

      if (request.method === 'PATCH' && url.pathname.startsWith('/admin/registrations/')) {
        return await moderateRegistration(request, env, corsHeaders, url.pathname);
      }

      return jsonResponse({ error: 'not_found' }, 404, corsHeaders);
    } catch (error) {
      console.error('Community registration error', error);
      return jsonResponse({ error: 'internal_error' }, 500, corsHeaders);
    }
  },
};

/* ===========================================================
   CRIAÇÃO DE UM CADASTRO PENDENTE
=========================================================== */

async function createRegistration(request, env, corsHeaders) {
  const contentLength = Number(request.headers.get('Content-Length') || 0);

  if (contentLength > MAXIMUM_BODY_BYTES) {
    return jsonResponse({ error: 'payload_too_large' }, 413, corsHeaders);
  }

  const payload = await request.json();
  const registration = normalizeRegistration(payload);

  if (!registration) {
    return jsonResponse({ error: 'invalid_registration' }, 400, corsHeaders);
  }

  const turnstileIsValid = await verifyTurnstile(
    payload.turnstileToken,
    env.TURNSTILE_SECRET_KEY,
    request.headers.get('CF-Connecting-IP'),
    env.TURNSTILE_EXPECTED_ACTION,
    env.TURNSTILE_HOSTNAMES,
  );

  if (!turnstileIsValid) {
    return jsonResponse({ error: 'turnstile_failed' }, 400, corsHeaders);
  }

  try {
    await env.DB.prepare(
      `INSERT INTO community_registrations (
        id, public_name, social_network, social_profile,
        locale, country, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`,
    )
      .bind(
        crypto.randomUUID(),
        registration.publicName,
        registration.socialNetwork,
        registration.socialProfile,
        registration.locale,
        registration.country,
        new Date().toISOString(),
      )
      .run();
  } catch (error) {
    if (String(error).includes('UNIQUE constraint failed')) {
      return jsonResponse({ error: 'already_registered' }, 409, corsHeaders);
    }

    throw error;
  }

  return jsonResponse({ status: 'pending' }, 201, corsHeaders);
}

/* ===========================================================
   LISTA PÚBLICA SOMENTE DE CADASTROS APROVADOS
=========================================================== */

async function listApprovedMembers(env, corsHeaders) {
  const result = await env.DB.prepare(
    `SELECT public_name AS publicName,
            social_network AS socialNetwork,
            social_profile AS socialProfile,
            country
       FROM community_registrations
      WHERE status = 'approved'
      ORDER BY reviewed_at DESC, created_at DESC
      LIMIT 500`,
  ).all();

  return jsonResponse({ members: result.results || [] }, 200, corsHeaders, {
    'Cache-Control': 'public, max-age=300',
  });
}

/* ===========================================================
   MODERAÇÃO PROTEGIDA POR SEGREDO ADMINISTRATIVO
=========================================================== */

async function listPendingRegistrations(request, env, corsHeaders) {
  if (!(await isAuthorizedAdministrator(request, env.ADMIN_API_TOKEN))) {
    return jsonResponse({ error: 'unauthorized' }, 401, corsHeaders);
  }

  const result = await env.DB.prepare(
    `SELECT id,
            public_name AS publicName,
            social_network AS socialNetwork,
            social_profile AS socialProfile,
            locale,
            country,
            created_at AS createdAt
       FROM community_registrations
      WHERE status = 'pending'
      ORDER BY created_at ASC
      LIMIT 200`,
  ).all();

  return jsonResponse({ registrations: result.results || [] }, 200, corsHeaders);
}

async function moderateRegistration(request, env, corsHeaders, pathname) {
  if (!(await isAuthorizedAdministrator(request, env.ADMIN_API_TOKEN))) {
    return jsonResponse({ error: 'unauthorized' }, 401, corsHeaders);
  }

  const id = decodeURIComponent(pathname.split('/').pop() || '');
  const { status } = await request.json();

  if (!id || !ALLOWED_STATUSES.has(status)) {
    return jsonResponse({ error: 'invalid_moderation' }, 400, corsHeaders);
  }

  const result = await env.DB.prepare(
    `UPDATE community_registrations
        SET status = ?, reviewed_at = ?
      WHERE id = ? AND status = 'pending'`,
  )
    .bind(status, new Date().toISOString(), id)
    .run();

  if (!result.meta?.changes) {
    return jsonResponse({ error: 'registration_not_found' }, 404, corsHeaders);
  }

  return jsonResponse({ status }, 200, corsHeaders);
}

/* ===========================================================
   VALIDAÇÃO E NORMALIZAÇÃO DOS DADOS
=========================================================== */

function normalizeRegistration(payload) {
  const publicName = normalizeText(payload?.publicName, 60);
  const socialNetwork = String(payload?.socialNetwork || '').toLowerCase();
  const socialProfile = normalizeText(payload?.socialProfile, 160);
  const locale = normalizeText(payload?.locale, 16) || 'en-US';
  const countryCandidate = String(payload?.country || '').toUpperCase();
  const country = /^[A-Z]{2}$/.test(countryCandidate) ? countryCandidate : null;

  if (!publicName || !socialProfile || !ALLOWED_SOCIAL_NETWORKS.has(socialNetwork)) {
    return null;
  }

  return { publicName, socialNetwork, socialProfile, locale, country };
}

function normalizeText(value, maximumLength) {
  return String(value || '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maximumLength);
}

async function verifyTurnstile(token, secret, remoteIp, expectedAction, allowedHostnamesValue) {
  const normalizedToken = typeof token === 'string' ? token.trim() : '';
  const allowedHostnames = new Set(
    String(allowedHostnamesValue || '')
      .split(',')
      .map((hostname) => hostname.trim().toLowerCase())
      .filter(Boolean),
  );

  if (
    !normalizedToken ||
    normalizedToken.length > MAXIMUM_TURNSTILE_TOKEN_LENGTH ||
    !secret ||
    !expectedAction ||
    allowedHostnames.size === 0
  ) {
    return false;
  }

  try {
    const verificationResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        signal: AbortSignal.timeout(10_000),
        body: new URLSearchParams({
          secret,
          response: normalizedToken,
          remoteip: remoteIp || '',
          idempotency_key: crypto.randomUUID(),
        }),
      },
    );

    if (!verificationResponse.ok) {
      return false;
    }

    const verification = await verificationResponse.json();

    return (
      verification.success === true &&
      verification.action === expectedAction &&
      allowedHostnames.has(String(verification.hostname || '').toLowerCase())
    );
  } catch {
    // Falhas de rede, timeout e respostas inválidas são recusadas com segurança.
    return false;
  }
}

async function isAuthorizedAdministrator(request, expectedToken) {
  const suppliedToken = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');

  if (!expectedToken || !suppliedToken) {
    return false;
  }

  const encoder = new TextEncoder();
  const [suppliedDigest, expectedDigest] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(suppliedToken)),
    crypto.subtle.digest('SHA-256', encoder.encode(expectedToken)),
  ]);

  return crypto.subtle.timingSafeEqual(suppliedDigest, expectedDigest);
}

/* ===========================================================
   RESPOSTAS JSON E CORS RESTRITO
=========================================================== */

function createCorsHeaders(origin, allowedOriginsValue = '') {
  const headers = new Headers({
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    Vary: 'Origin',
  });
  const allowedOrigins = String(allowedOriginsValue)
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (origin && allowedOrigins.includes(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
  }

  return headers;
}

function jsonResponse(payload, status = 200, baseHeaders = new Headers(), extraHeaders = {}) {
  const headers = new Headers(baseHeaders);
  headers.set('Content-Type', 'application/json; charset=utf-8');

  Object.entries(extraHeaders).forEach(([name, value]) => headers.set(name, value));

  return new Response(JSON.stringify(payload), { status, headers });
}
