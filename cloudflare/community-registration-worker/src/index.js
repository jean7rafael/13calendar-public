/* ===========================================================
   API SEGURA DO CADASTRO COMUNITÁRIO

   O Worker valida o Turnstile, grava somente dados públicos
   voluntários e mantém todo cadastro pendente de moderação.
=========================================================== */

const MAXIMUM_BODY_BYTES = 12_000;
const MAXIMUM_AVATAR_BYTES = 524_288;
const MAXIMUM_TURNSTILE_TOKEN_LENGTH = 2_048;
const ALLOWED_AVATAR_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_SOCIAL_NETWORKS = new Set(['instagram', 'facebook', 'other']);
const ALLOWED_STATUSES = new Set(['pending', 'approved', 'rejected']);
const PENDING_RETENTION_DAYS = 60;
const REJECTED_RETENTION_DAYS = 30;

import {
  refreshAndReadCommunityAnalytics,
  refreshCommunityAnalytics,
} from './analytics.js';
import {
  connectTelegramNotifications,
  notifyPendingRegistration,
  readTelegramNotificationStatus,
} from './telegram.js';

export default {
  async fetch(request, env, context) {
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
        return await createRegistration(request, env, corsHeaders, context);
      }

      if (request.method === 'POST' && url.pathname === '/registrations/remove') {
        return await removeOwnRegistration(request, env, corsHeaders);
      }

      if (request.method === 'GET' && url.pathname === '/members') {
        return await listApprovedMembers(request, env, corsHeaders);
      }

      if (request.method === 'GET' && url.pathname.startsWith('/avatars/')) {
        return await readPublicAvatar(env, corsHeaders, url.pathname);
      }

      if (request.method === 'GET' && url.pathname === '/analytics/stats') {
        const analytics = await refreshAndReadCommunityAnalytics(env);

        return jsonResponse(analytics, 200, corsHeaders, {
          'Cache-Control': 'public, max-age=300',
        });
      }

      if (request.method === 'GET' && url.pathname === '/admin/registrations') {
        return await listAdminRegistrations(request, env, corsHeaders, url);
      }

      if (
        request.method === 'POST' &&
        url.pathname.endsWith('/deletion-code') &&
        url.pathname.startsWith('/admin/registrations/')
      ) {
        return await createAdministrativeDeletionCode(request, env, corsHeaders, url.pathname);
      }

      if (
        request.method === 'PUT' &&
        url.pathname.endsWith('/avatar') &&
        url.pathname.startsWith('/admin/registrations/')
      ) {
        return await uploadRegistrationAvatar(request, env, corsHeaders, url.pathname);
      }

      if (
        request.method === 'DELETE' &&
        url.pathname.endsWith('/avatar') &&
        url.pathname.startsWith('/admin/registrations/')
      ) {
        return await removeRegistrationAvatar(request, env, corsHeaders, url.pathname);
      }

      if (request.method === 'PATCH' && url.pathname.startsWith('/admin/registrations/')) {
        return await moderateRegistration(request, env, corsHeaders, url.pathname);
      }

      if (request.method === 'PUT' && url.pathname.startsWith('/admin/registrations/')) {
        return await updateRegistration(request, env, corsHeaders, url.pathname);
      }

      if (request.method === 'DELETE' && url.pathname.startsWith('/admin/registrations/')) {
        return await deleteRegistration(request, env, corsHeaders, url.pathname);
      }

      if (request.method === 'GET' && url.pathname === '/admin/notifications') {
        return await readNotificationStatus(request, env, corsHeaders);
      }

      if (
        request.method === 'POST' &&
        url.pathname === '/admin/notifications/telegram/connect'
      ) {
        return await connectTelegramForAdministrator(request, env, corsHeaders);
      }

      return jsonResponse({ error: 'not_found' }, 404, corsHeaders);
    } catch (error) {
      console.error('Community registration error', error);
      return jsonResponse({ error: 'internal_error' }, 500, corsHeaders);
    }
  },

  /* A atualização diária mantém um histórico maior que a janela da API. */
  async scheduled(_controller, env, context) {
    context.waitUntil(
      Promise.all([
        refreshCommunityAnalytics(env),
        purgeExpiredRegistrations(env),
      ]),
    );
  },
};

/* ===========================================================
   CRIAÇÃO DE UM CADASTRO PENDENTE
=========================================================== */

async function createRegistration(request, env, corsHeaders, context) {
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

  const id = crypto.randomUUID();
  const deletionSecret = createSecureSecret();
  const deletionTokenHash = await hashText(deletionSecret);

  try {
    /* Uma recusa não prende o perfil para sempre. A nova manifestação
       substitui o registro rejeitado e volta a passar pela moderação. */
    await env.DB.prepare(
      `DELETE FROM community_registrations
        WHERE social_network = ?
          AND social_profile = ?
          AND status = 'rejected'`,
    )
      .bind(registration.socialNetwork, registration.socialProfile)
      .run();

    await env.DB.prepare(
      `INSERT INTO community_registrations (
        id, public_name, social_network, social_profile,
        locale, country, status, created_at, deletion_token_hash
      ) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
    )
      .bind(
        id,
        registration.publicName,
        registration.socialNetwork,
        registration.socialProfile,
        registration.locale,
        registration.country,
        new Date().toISOString(),
        deletionTokenHash,
      )
      .run();
  } catch (error) {
    if (String(error).includes('UNIQUE constraint failed')) {
      return jsonResponse({ error: 'already_registered' }, 409, corsHeaders);
    }

    throw error;
  }

  /* O cadastro já foi salvo: uma falha externa não altera o resultado público. */
  context.waitUntil(
    notifyPendingRegistration(env).catch((error) => {
      console.error(
        JSON.stringify({
          message: 'telegram_notification_failed',
          code: error?.code || 'unknown_error',
        }),
      );
    }),
  );

  return jsonResponse(
    {
      status: 'pending',
      deletionCode: `${id}.${deletionSecret}`,
    },
    201,
    corsHeaders,
    { 'Cache-Control': 'no-store' },
  );
}

/* ===========================================================
   LISTA PÚBLICA SOMENTE DE CADASTROS APROVADOS
=========================================================== */

async function listApprovedMembers(request, env, corsHeaders) {
  const result = await env.DB.prepare(
    `SELECT public_name AS publicName,
            social_network AS socialNetwork,
            social_profile AS socialProfile,
            country,
            id,
            CASE WHEN avatar_data IS NULL THEN 0 ELSE 1 END AS hasAvatar,
            avatar_updated_at AS avatarUpdatedAt
       FROM community_registrations
      WHERE status = 'approved'
      ORDER BY reviewed_at DESC, created_at DESC
      LIMIT 500`,
  ).all();

  const members = (result.results || []).map((member) => ({
    publicName: member.publicName,
    socialNetwork: member.socialNetwork,
    socialProfile: member.socialProfile,
    country: member.country,
    avatarUrl: member.hasAvatar
      ? createAvatarUrl(request, member.id, member.avatarUpdatedAt)
      : null,
  }));

  return jsonResponse({ members }, 200, corsHeaders, {
    'Cache-Control': 'public, max-age=300',
  });
}

/* ===========================================================
   MODERAÇÃO PROTEGIDA POR SEGREDO ADMINISTRATIVO
=========================================================== */

async function listAdminRegistrations(request, env, corsHeaders, url) {
  if (!(await isAuthorizedAdministrator(request, env.ADMIN_API_TOKEN))) {
    return jsonResponse({ error: 'unauthorized' }, 401, corsHeaders);
  }

  const requestedStatus = String(url.searchParams.get('status') || 'pending').toLowerCase();
  const selectedStatus = requestedStatus === 'all' ? null : requestedStatus;

  if (selectedStatus && !ALLOWED_STATUSES.has(selectedStatus)) {
    return jsonResponse({ error: 'invalid_status' }, 400, corsHeaders);
  }

  const statusClause = selectedStatus ? 'WHERE status = ?' : '';
  const statement = env.DB.prepare(
    `SELECT id,
            public_name AS publicName,
            social_network AS socialNetwork,
            social_profile AS socialProfile,
            locale,
            country,
            status,
            created_at AS createdAt,
            reviewed_at AS reviewedAt,
            updated_at AS updatedAt,
            CASE WHEN avatar_data IS NULL THEN 0 ELSE 1 END AS hasAvatar,
            avatar_updated_at AS avatarUpdatedAt,
            CASE WHEN deletion_token_hash IS NULL THEN 0 ELSE 1 END AS hasDeletionCode
       FROM community_registrations
      ${statusClause}
      ORDER BY CASE status
                 WHEN 'pending' THEN 0
                 WHEN 'approved' THEN 1
                 ELSE 2
               END,
               CASE WHEN status = 'pending' THEN created_at END ASC,
               CASE WHEN status = 'approved'
                    THEN COALESCE(updated_at, reviewed_at, created_at) END DESC,
               CASE WHEN status = 'rejected'
                    THEN COALESCE(updated_at, reviewed_at, created_at) END DESC
      LIMIT 200`,
  );
  const result = selectedStatus
    ? await statement.bind(selectedStatus).all()
    : await statement.all();

  const registrations = (result.results || []).map((registration) => ({
    ...registration,
    hasDeletionCode: Boolean(registration.hasDeletionCode),
    avatarUrl: registration.hasAvatar
      ? createAvatarUrl(request, registration.id, registration.avatarUpdatedAt)
      : null,
  }));

  return jsonResponse({ registrations }, 200, corsHeaders, {
    'Cache-Control': 'no-store',
  });
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
        SET status = ?, reviewed_at = ?, updated_at = ?
      WHERE id = ?`,
  )
    .bind(status, new Date().toISOString(), new Date().toISOString(), id)
    .run();

  if (!result.meta?.changes) {
    return jsonResponse({ error: 'registration_not_found' }, 404, corsHeaders);
  }

  return jsonResponse({ status }, 200, corsHeaders);
}

/* ===========================================================
   CORREÇÃO E EXCLUSÃO ADMINISTRATIVAS
=========================================================== */

async function updateRegistration(request, env, corsHeaders, pathname) {
  if (!(await isAuthorizedAdministrator(request, env.ADMIN_API_TOKEN))) {
    return jsonResponse({ error: 'unauthorized' }, 401, corsHeaders);
  }

  const id = readRegistrationId(pathname);
  const registration = normalizeRegistration(await request.json());

  if (!id || !registration) {
    return jsonResponse({ error: 'invalid_registration' }, 400, corsHeaders);
  }

  try {
    const result = await env.DB.prepare(
      `UPDATE community_registrations
          SET public_name = ?,
              social_network = ?,
              social_profile = ?,
              locale = ?,
              country = ?,
              updated_at = ?
        WHERE id = ?`,
    )
      .bind(
        registration.publicName,
        registration.socialNetwork,
        registration.socialProfile,
        registration.locale,
        registration.country,
        new Date().toISOString(),
        id,
      )
      .run();

    if (!result.meta?.changes) {
      return jsonResponse({ error: 'registration_not_found' }, 404, corsHeaders);
    }
  } catch (error) {
    if (String(error).includes('UNIQUE constraint failed')) {
      return jsonResponse({ error: 'already_registered' }, 409, corsHeaders);
    }

    throw error;
  }

  return jsonResponse({ status: 'updated' }, 200, corsHeaders);
}

async function deleteRegistration(request, env, corsHeaders, pathname) {
  if (!(await isAuthorizedAdministrator(request, env.ADMIN_API_TOKEN))) {
    return jsonResponse({ error: 'unauthorized' }, 401, corsHeaders);
  }

  const id = readRegistrationId(pathname);

  if (!id) {
    return jsonResponse({ error: 'invalid_registration' }, 400, corsHeaders);
  }

  const result = await env.DB.prepare('DELETE FROM community_registrations WHERE id = ?')
    .bind(id)
    .run();

  if (!result.meta?.changes) {
    return jsonResponse({ error: 'registration_not_found' }, 404, corsHeaders);
  }

  return jsonResponse({ status: 'deleted' }, 200, corsHeaders);
}

function readRegistrationId(pathname) {
  return decodeURIComponent(pathname.split('/').pop() || '').trim();
}

function readRegistrationIdBeforeAction(pathname, action) {
  const match = pathname.match(new RegExp(`^/admin/registrations/([^/]+)/${action}$`));

  return match ? decodeURIComponent(match[1]).trim() : '';
}

/* ===========================================================
   FOTO ADMINISTRADA E CÓDIGO DE AUTOEXCLUSÃO
=========================================================== */

async function uploadRegistrationAvatar(request, env, corsHeaders, pathname) {
  if (!(await isAuthorizedAdministrator(request, env.ADMIN_API_TOKEN))) {
    return jsonResponse({ error: 'unauthorized' }, 401, corsHeaders);
  }

  const id = readRegistrationIdBeforeAction(pathname, 'avatar');
  const contentType = String(request.headers.get('Content-Type') || '')
    .split(';')[0]
    .trim()
    .toLowerCase();
  const declaredLength = Number(request.headers.get('Content-Length') || 0);

  if (!id || !ALLOWED_AVATAR_TYPES.has(contentType)) {
    return jsonResponse({ error: 'invalid_avatar' }, 400, corsHeaders);
  }

  if (declaredLength > MAXIMUM_AVATAR_BYTES) {
    return jsonResponse({ error: 'avatar_too_large' }, 413, corsHeaders);
  }

  const existing = await readRegistrationAssets(env, id);

  if (!existing) {
    return jsonResponse({ error: 'registration_not_found' }, 404, corsHeaders);
  }

  const avatar = await request.arrayBuffer();

  if (!avatar.byteLength || avatar.byteLength > MAXIMUM_AVATAR_BYTES) {
    return jsonResponse({ error: 'avatar_too_large' }, 413, corsHeaders);
  }

  const updatedAt = new Date().toISOString();

  await env.DB.prepare(
    `UPDATE community_registrations
        SET avatar_data = ?,
            avatar_content_type = ?,
            avatar_updated_at = ?,
            updated_at = ?
      WHERE id = ?`,
  )
    .bind(avatar, contentType, updatedAt, updatedAt, id)
    .run();

  return jsonResponse(
    { status: 'updated', avatarUrl: createAvatarUrl(request, id, updatedAt) },
    200,
    corsHeaders,
  );
}

async function removeRegistrationAvatar(request, env, corsHeaders, pathname) {
  if (!(await isAuthorizedAdministrator(request, env.ADMIN_API_TOKEN))) {
    return jsonResponse({ error: 'unauthorized' }, 401, corsHeaders);
  }

  const id = readRegistrationIdBeforeAction(pathname, 'avatar');
  const existing = id ? await readRegistrationAssets(env, id) : null;

  if (!existing) {
    return jsonResponse({ error: 'registration_not_found' }, 404, corsHeaders);
  }

  const updatedAt = new Date().toISOString();
  await env.DB.prepare(
    `UPDATE community_registrations
        SET avatar_data = NULL,
            avatar_content_type = NULL,
            avatar_updated_at = NULL,
            updated_at = ?
      WHERE id = ?`,
  )
    .bind(updatedAt, id)
    .run();

  return jsonResponse({ status: 'updated' }, 200, corsHeaders);
}

async function readPublicAvatar(env, corsHeaders, pathname) {
  const id = decodeURIComponent(pathname.replace(/^\/avatars\//, '')).trim();

  if (!id || id.includes('/')) {
    return jsonResponse({ error: 'invalid_avatar' }, 400, corsHeaders);
  }

  const avatar = await env.DB.prepare(
    `SELECT avatar_data AS avatarData,
            avatar_content_type AS avatarContentType
       FROM community_registrations
      WHERE id = ? AND status = 'approved'`,
  )
    .bind(id)
    .first();

  if (!avatar?.avatarData) {
    return jsonResponse({ error: 'avatar_not_found' }, 404, corsHeaders);
  }

  const headers = new Headers(corsHeaders);
  headers.set('Content-Type', avatar.avatarContentType || 'image/jpeg');
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');

  return new Response(new Uint8Array(avatar.avatarData), { status: 200, headers });
}

async function createAdministrativeDeletionCode(request, env, corsHeaders, pathname) {
  if (!(await isAuthorizedAdministrator(request, env.ADMIN_API_TOKEN))) {
    return jsonResponse({ error: 'unauthorized' }, 401, corsHeaders);
  }

  const id = readRegistrationIdBeforeAction(pathname, 'deletion-code');

  if (!id) {
    return jsonResponse({ error: 'invalid_registration' }, 400, corsHeaders);
  }

  const deletionSecret = createSecureSecret();
  const deletionTokenHash = await hashText(deletionSecret);
  const updatedAt = new Date().toISOString();
  const result = await env.DB.prepare(
    `UPDATE community_registrations
        SET deletion_token_hash = ?, updated_at = ?
      WHERE id = ?`,
  )
    .bind(deletionTokenHash, updatedAt, id)
    .run();

  if (!result.meta?.changes) {
    return jsonResponse({ error: 'registration_not_found' }, 404, corsHeaders);
  }

  return jsonResponse(
    { deletionCode: `${id}.${deletionSecret}` },
    200,
    corsHeaders,
    { 'Cache-Control': 'no-store' },
  );
}

async function removeOwnRegistration(request, env, corsHeaders) {
  const contentLength = Number(request.headers.get('Content-Length') || 0);

  if (contentLength > MAXIMUM_BODY_BYTES) {
    return jsonResponse({ error: 'payload_too_large' }, 413, corsHeaders);
  }

  const payload = await request.json();
  const deletionCode = String(payload?.deletionCode || '').trim();
  const separatorIndex = deletionCode.indexOf('.');
  const id = deletionCode.slice(0, separatorIndex);
  const deletionSecret = deletionCode.slice(separatorIndex + 1);

  if (separatorIndex < 1 || !id || deletionSecret.length < 32) {
    return jsonResponse({ error: 'invalid_deletion_code' }, 400, corsHeaders);
  }

  const turnstileIsValid = await verifyTurnstile(
    payload.turnstileToken,
    env.TURNSTILE_SECRET_KEY,
    request.headers.get('CF-Connecting-IP'),
    env.TURNSTILE_DELETION_ACTION || 'community_deletion',
    env.TURNSTILE_HOSTNAMES,
  );

  if (!turnstileIsValid) {
    return jsonResponse({ error: 'turnstile_failed' }, 400, corsHeaders);
  }

  const existing = await readRegistrationAssets(env, id);
  const suppliedHash = await hashText(deletionSecret);

  if (
    !existing?.deletion_token_hash ||
    !(await areEqualSecrets(suppliedHash, existing.deletion_token_hash))
  ) {
    return jsonResponse({ error: 'invalid_deletion_code' }, 400, corsHeaders);
  }

  await env.DB.prepare('DELETE FROM community_registrations WHERE id = ?')
    .bind(id)
    .run();

  return jsonResponse({ status: 'deleted' }, 200, corsHeaders);
}

async function readRegistrationAssets(env, id) {
  return env.DB.prepare(
    `SELECT deletion_token_hash
       FROM community_registrations
      WHERE id = ?`,
  )
    .bind(id)
    .first();
}

function createAvatarUrl(request, id, version) {
  const url = new URL(request.url);
  url.pathname = `/avatars/${encodeURIComponent(id)}`;
  url.search = version ? `?v=${encodeURIComponent(version)}` : '';
  return url.toString();
}

function createSecureSecret() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);

  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

async function hashText(value) {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(String(value)),
  );

  return Array.from(
    new Uint8Array(digest),
    (byte) => byte.toString(16).padStart(2, '0'),
  ).join('');
}

async function areEqualSecrets(left, right) {
  const encoder = new TextEncoder();
  const [leftDigest, rightDigest] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(String(left))),
    crypto.subtle.digest('SHA-256', encoder.encode(String(right))),
  ]);

  return crypto.subtle.timingSafeEqual(leftDigest, rightDigest);
}

/* A limpeza automática aplica a política publicada sem tocar nos
   perfis aprovados, que permanecem até a retirada do consentimento. */
async function purgeExpiredRegistrations(env) {
  const pendingLimit = new Date(Date.now() - PENDING_RETENTION_DAYS * 86_400_000).toISOString();
  const rejectedLimit = new Date(Date.now() - REJECTED_RETENTION_DAYS * 86_400_000).toISOString();

  await env.DB.prepare(
    `DELETE FROM community_registrations
      WHERE (status = 'pending' AND created_at < ?)
         OR (status = 'rejected' AND COALESCE(reviewed_at, created_at) < ?)`,
  )
    .bind(pendingLimit, rejectedLimit)
    .run();
}

/* ===========================================================
   CONFIGURAÇÃO ADMINISTRATIVA DOS AVISOS
=========================================================== */

async function readNotificationStatus(request, env, corsHeaders) {
  if (!(await isAuthorizedAdministrator(request, env.ADMIN_API_TOKEN))) {
    return jsonResponse({ error: 'unauthorized' }, 401, corsHeaders);
  }

  const telegram = await readTelegramNotificationStatus(env);

  return jsonResponse({ telegram }, 200, corsHeaders, {
    'Cache-Control': 'no-store',
  });
}

async function connectTelegramForAdministrator(request, env, corsHeaders) {
  if (!(await isAuthorizedAdministrator(request, env.ADMIN_API_TOKEN))) {
    return jsonResponse({ error: 'unauthorized' }, 401, corsHeaders);
  }

  try {
    const telegram = await connectTelegramNotifications(env);
    return jsonResponse({ telegram }, 200, corsHeaders);
  } catch (error) {
    const errorCode = error?.code || 'telegram_connection_failed';
    const status = errorCode === 'telegram_chat_not_found' ? 404 : 503;

    console.error(
      JSON.stringify({
        message: 'telegram_connection_failed',
        code: errorCode,
      }),
    );

    return jsonResponse({ error: errorCode }, status, corsHeaders);
  }
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
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
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
