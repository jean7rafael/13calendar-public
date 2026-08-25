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

import puppeteer from '@cloudflare/puppeteer';
import { refreshAndReadCommunityAnalytics, refreshCommunityAnalytics } from './analytics.js';
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
        request.method === 'POST' &&
        url.pathname.endsWith('/avatar/capture') &&
        url.pathname.startsWith('/admin/registrations/')
      ) {
        return await captureRegistrationAvatarForAdministrator(
          request,
          env,
          corsHeaders,
          url.pathname,
        );
      }

      if (
        request.method === 'DELETE' &&
        url.pathname.endsWith('/avatar') &&
        url.pathname.startsWith('/admin/registrations/')
      ) {
        return await removeRegistrationAvatar(request, env, corsHeaders, url.pathname);
      }

      if (request.method === 'PATCH' && url.pathname.startsWith('/admin/registrations/')) {
        return await moderateRegistration(request, env, corsHeaders, url.pathname, context);
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

      if (request.method === 'POST' && url.pathname === '/admin/notifications/telegram/connect') {
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
        captureMissingApprovedAvatars(env),
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

  /* O cadastro já foi salvo: avisos e captura da foto acontecem em segundo
     plano. A foto pode ser guardada enquanto o perfil está pendente, mas o
     endpoint público só a entrega depois da aprovação. */
  context.waitUntil(
    Promise.allSettled([
      notifyPendingRegistration(env).catch((error) => {
        console.error(
          JSON.stringify({
            message: 'telegram_notification_failed',
            code: error?.code || 'unknown_error',
          }),
        );
      }),
      captureRegistrationAvatar(env, id, { allowPending: true }).then((capture) => {
        if (capture.ok) return;

        console.info(
          JSON.stringify({
            message: 'registration_avatar_capture_deferred',
            registrationId: id,
            code: capture.error,
          }),
        );
      }),
    ]),
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
      ORDER BY created_at ASC, id ASC
      LIMIT 500`,
  ).all();

  const members = (result.results || []).map((member, sortOrder) => ({
    publicName: member.publicName,
    socialNetwork: member.socialNetwork,
    socialProfile: member.socialProfile,
    country: member.country,
    sortOrder,
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
               CASE WHEN status = 'pending' THEN created_at END DESC,
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

async function moderateRegistration(request, env, corsHeaders, pathname, context) {
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

  /* A aprovação dispara a foto automaticamente, mas nunca atrasa nem
     invalida a moderação se a rede social estiver indisponível. */
  if (status === 'approved') {
    context.waitUntil(
      captureRegistrationAvatar(env, id).catch((error) => {
        console.error(
          JSON.stringify({
            message: 'automatic_avatar_capture_failed',
            registrationId: id,
            code: error?.code || 'unknown_error',
          }),
        );
      }),
    );
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

  const updatedAt = await storeRegistrationAvatar(env, id, avatar, contentType);

  return jsonResponse(
    { status: 'updated', avatarUrl: createAvatarUrl(request, id, updatedAt) },
    200,
    corsHeaders,
  );
}

/* A captura automática tenta primeiro os metadados públicos e, quando
   necessário, abre a página com o navegador do Worker. O arquivo é copiado
   para o D1, sem expor cookies ou sessões do moderador. */
async function captureRegistrationAvatarForAdministrator(request, env, corsHeaders, pathname) {
  if (!(await isAuthorizedAdministrator(request, env.ADMIN_API_TOKEN))) {
    return jsonResponse({ error: 'unauthorized' }, 401, corsHeaders);
  }

  const id = readRegistrationIdBeforeAction(pathname, 'avatar/capture');

  if (!id) {
    return jsonResponse({ error: 'invalid_registration' }, 400, corsHeaders);
  }

  const capture = await captureRegistrationAvatar(env, id, { force: true });

  if (!capture.ok) {
    return jsonResponse({ error: capture.error }, capture.status || 422, corsHeaders);
  }

  return jsonResponse(
    { status: 'updated', avatarUrl: createAvatarUrl(request, id, capture.updatedAt) },
    200,
    corsHeaders,
  );
}

async function captureRegistrationAvatar(env, id, { allowPending = false, force = false } = {}) {
  const registration = await env.DB.prepare(
    `SELECT social_network AS socialNetwork,
            social_profile AS socialProfile,
            status,
            CASE WHEN avatar_data IS NULL THEN 0 ELSE 1 END AS hasAvatar,
            avatar_updated_at AS avatarUpdatedAt
       FROM community_registrations
      WHERE id = ?`,
  )
    .bind(id)
    .first();

  const acceptedStatus =
    registration?.status === 'approved' || (allowPending && registration?.status === 'pending');

  if (!registration || !acceptedStatus) {
    return { ok: false, error: 'registration_not_found', status: 404 };
  }

  if (registration.hasAvatar && !force) {
    return { ok: true, updatedAt: registration.avatarUpdatedAt };
  }

  const profileUrl = createSocialProfileUrl(registration.socialNetwork, registration.socialProfile);

  if (!profileUrl) {
    return { ok: false, error: 'avatar_capture_unsupported', status: 422 };
  }

  /* Primeiro preservamos o caminho leve para redes que publicam og:image.
     Se o HTML inicial não trouxer a foto, o Browser Run abre o perfil como
     uma página real e captura somente o elemento visual do avatar. */
  const metadataCapture = await captureAvatarFromProfileMetadata(profileUrl);
  const capturedAvatar = metadataCapture.ok
    ? metadataCapture
    : await captureAvatarWithBrowser(env, profileUrl, registration.socialProfile);

  if (!capturedAvatar.ok) return capturedAvatar;

  const updatedAt = await storeRegistrationAvatar(
    env,
    id,
    capturedAvatar.avatar,
    capturedAvatar.contentType,
  );

  return { ok: true, updatedAt };
}

/* ===========================================================
   CAPTURA PÚBLICA DA FOTO DE PERFIL
=========================================================== */

async function captureAvatarFromProfileMetadata(profileUrl) {
  try {
    const profileResponse = await fetch(profileUrl, {
      redirect: 'follow',
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'User-Agent': 'Mozilla/5.0 (compatible; 13CalendarCommunity/1.0)',
      },
      signal: AbortSignal.timeout(12_000),
    });

    if (!profileResponse.ok) {
      return { ok: false, error: 'avatar_profile_unavailable', status: 422 };
    }

    const imageUrl = readOpenGraphImage(await profileResponse.text());

    return imageUrl
      ? downloadPublicAvatar(imageUrl)
      : { ok: false, error: 'avatar_image_not_found', status: 422 };
  } catch {
    return { ok: false, error: 'avatar_profile_unavailable', status: 422 };
  }
}

async function captureAvatarWithBrowser(env, profileUrl, socialProfile) {
  if (!env.BROWSER) {
    return { ok: false, error: 'avatar_browser_unavailable', status: 503 };
  }

  let browser;

  try {
    browser = await puppeteer.launch(env.BROWSER);
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
    );
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });
    const navigationResponse = await page.goto(profileUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 15_000,
    });

    if (navigationResponse?.status() === 401 || navigationResponse?.status() === 403) {
      return { ok: false, error: 'avatar_profile_restricted', status: 422 };
    }

    if (navigationResponse?.status() === 404 || navigationResponse?.status() === 410) {
      return { ok: false, error: 'avatar_profile_not_found', status: 404 };
    }

    if (navigationResponse?.status() === 429) {
      return { ok: false, error: 'avatar_browser_busy', status: 503 };
    }

    await page.waitForNetworkIdle({ idleTime: 500, timeout: 4_000 }).catch(() => undefined);

    /* Algumas redes inserem og:image somente depois de executar JavaScript. */
    const renderedImageUrl = readOpenGraphImage(await page.content());

    if (renderedImageUrl) {
      const renderedMetadataCapture = await downloadPublicAvatar(renderedImageUrl);
      if (renderedMetadataCapture.ok) return renderedMetadataCapture;
    }

    const imageHandles = await page.$$('img');
    const normalizedProfile = String(socialProfile || '')
      .replace(/^@/, '')
      .replace(/^https?:\/\/[^/]+\//i, '')
      .replace(/[/?#].*$/, '')
      .toLowerCase();
    let bestCandidate = null;

    /* O perfil pode mudar de marcação sem aviso. Em vez de depender de uma
       classe interna, avaliamos somente imagens visíveis, quase quadradas e
       com sinais semânticos de foto de perfil. Logos e ícones são rejeitados. */
    for (const handle of imageHandles) {
      const candidate = await handle.evaluate((image, expectedProfile) => {
        const rect = image.getBoundingClientRect();
        const style = window.getComputedStyle(image);
        const alt = String(image.getAttribute('alt') || '').toLowerCase();
        const source = String(image.currentSrc || image.src || '').toLowerCase();
        const context = String(image.parentElement?.textContent || '')
          .toLowerCase()
          .slice(0, 240);
        const visible =
          rect.width >= 40 &&
          rect.height >= 40 &&
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          Number(style.opacity || 1) > 0;
        const ratio = rect.width / Math.max(rect.height, 1);
        const forbidden = /logo|icon|sprite|emoji|badge|qr code/.test(`${alt} ${source}`);

        if (!visible || ratio < 0.72 || ratio > 1.38 || forbidden) return null;

        let score = 0;
        if (/profile|avatar|perfil|foto do perfil|photo de profil|profilbild/.test(alt))
          score += 120;
        if (expectedProfile && `${alt} ${context}`.includes(expectedProfile)) score += 90;
        if (image.closest('header, main')) score += 35;
        if (rect.width >= 80 && rect.width <= 320) score += 30;
        if (rect.top >= 0 && rect.top <= 520) score += 20;
        if (Number.parseFloat(style.borderRadius || '0') >= Math.min(rect.width, rect.height) / 3) {
          score += 20;
        }

        return { score, width: rect.width, height: rect.height };
      }, normalizedProfile);

      if (
        candidate &&
        candidate.score >= 55 &&
        (!bestCandidate || candidate.score > bestCandidate.score)
      ) {
        bestCandidate = { handle, score: candidate.score };
      }
    }

    if (!bestCandidate) {
      const finalUrl = page.url().toLowerCase();
      const pageText = await page
        .$eval('body', (body) => String(body.innerText || '').toLowerCase().slice(0, 4_000))
        .catch(() => '');

      if (
        /\/login|\/accounts\/login|\/checkpoint|\/challenge/.test(finalUrl) ||
        /log in to continue|sign in to continue|faça login para continuar|inicie sessão para continuar/.test(
          pageText,
        )
      ) {
        return { ok: false, error: 'avatar_profile_restricted', status: 422 };
      }

      if (
        /page isn't available|page not found|content isn't available|página não está disponível|página não encontrada/.test(
          pageText,
        )
      ) {
        return { ok: false, error: 'avatar_profile_not_found', status: 404 };
      }

      return { ok: false, error: 'avatar_image_not_found', status: 422 };
    }

    let screenshot = await bestCandidate.handle.screenshot({
      type: 'webp',
      quality: 82,
      optimizeForSpeed: true,
    });

    if (screenshot.byteLength > MAXIMUM_AVATAR_BYTES) {
      screenshot = await bestCandidate.handle.screenshot({
        type: 'webp',
        quality: 58,
        optimizeForSpeed: true,
      });
    }

    if (!screenshot.byteLength || screenshot.byteLength > MAXIMUM_AVATAR_BYTES) {
      return { ok: false, error: 'avatar_too_large', status: 413 };
    }

    return {
      ok: true,
      avatar: copyArrayBuffer(screenshot),
      contentType: 'image/webp',
    };
  } catch (error) {
    console.info(
      JSON.stringify({
        message: 'browser_avatar_capture_failed',
        code: error?.name || 'unknown_error',
      }),
    );
    return classifyBrowserCaptureFailure(error);
  } finally {
    if (browser) await browser.close().catch(() => undefined);
  }
}

/* Erros internos do navegador mudam de texto entre versões. Esta classificação
   converte somente causas reconhecíveis em códigos públicos estáveis. */
function classifyBrowserCaptureFailure(error) {
  const description = `${error?.name || ''} ${error?.message || ''}`.toLowerCase();

  if (/429|rate.?limit|quota|limit exceeded|too many|session limit|capacity/.test(description)) {
    return { ok: false, error: 'avatar_browser_busy', status: 503 };
  }

  if (/timeout|timed out|navigation|net::|network|dns|fetch/.test(description)) {
    return { ok: false, error: 'avatar_profile_unavailable', status: 502 };
  }

  return { ok: false, error: 'avatar_image_unavailable', status: 422 };
}

async function downloadPublicAvatar(imageUrl) {
  try {
    const imageResponse = await fetch(imageUrl, {
      redirect: 'follow',
      headers: { Accept: 'image/jpeg,image/png,image/webp' },
      signal: AbortSignal.timeout(12_000),
    });
    const contentType = String(imageResponse.headers.get('Content-Type') || '')
      .split(';')[0]
      .trim()
      .toLowerCase();
    const declaredLength = Number(imageResponse.headers.get('Content-Length') || 0);

    if (
      !imageResponse.ok ||
      !ALLOWED_AVATAR_TYPES.has(contentType) ||
      declaredLength > MAXIMUM_AVATAR_BYTES
    ) {
      return { ok: false, error: 'avatar_image_unavailable', status: 422 };
    }

    const avatar = await imageResponse.arrayBuffer();

    if (!avatar.byteLength || avatar.byteLength > MAXIMUM_AVATAR_BYTES) {
      return { ok: false, error: 'avatar_too_large', status: 413 };
    }

    return { ok: true, avatar, contentType };
  } catch {
    return { ok: false, error: 'avatar_image_unavailable', status: 422 };
  }
}

function copyArrayBuffer(value) {
  const source = value instanceof Uint8Array ? value : new Uint8Array(value);
  const copy = new Uint8Array(source.byteLength);
  copy.set(source);
  return copy.buffer;
}

async function captureMissingApprovedAvatars(env) {
  const result = await env.DB.prepare(
    `SELECT id
       FROM community_registrations
      WHERE status = 'approved' AND avatar_data IS NULL
      ORDER BY reviewed_at ASC, created_at ASC
      LIMIT 5`,
  ).all();

  for (const registration of result.results || []) {
    try {
      await captureRegistrationAvatar(env, registration.id);
    } catch (error) {
      console.error(
        JSON.stringify({
          message: 'scheduled_avatar_capture_failed',
          registrationId: registration.id,
          code: error?.code || 'unknown_error',
        }),
      );
    }
  }
}

async function storeRegistrationAvatar(env, id, avatar, contentType) {
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

  return updatedAt;
}

function createSocialProfileUrl(socialNetwork, socialProfile) {
  const network = String(socialNetwork || '').toLowerCase();
  const profile = String(socialProfile || '').trim();

  if (!['instagram', 'facebook'].includes(network) || !profile) return '';

  if (/^https?:\/\//i.test(profile)) {
    try {
      const url = new URL(profile);
      const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
      const expectedHostname = network === 'instagram' ? 'instagram.com' : 'facebook.com';

      return hostname === expectedHostname || hostname.endsWith(`.${expectedHostname}`)
        ? url.toString()
        : '';
    } catch {
      return '';
    }
  }

  const username = profile.replace(/^@/, '').replace(/^\/+|\/+$/g, '');

  if (!username || username.includes('/')) return '';

  return network === 'instagram'
    ? `https://www.instagram.com/${encodeURIComponent(username)}/`
    : `https://www.facebook.com/${encodeURIComponent(username)}`;
}

function readOpenGraphImage(html) {
  const metaTags = String(html || '').match(/<meta\b[^>]*>/gi) || [];

  for (const tag of metaTags) {
    const property = readHtmlAttribute(tag, 'property') || readHtmlAttribute(tag, 'name');

    if (property?.toLowerCase() !== 'og:image') continue;

    const content = decodeHtmlAttribute(readHtmlAttribute(tag, 'content'));

    try {
      const imageUrl = new URL(content);
      if (['http:', 'https:'].includes(imageUrl.protocol)) return imageUrl.toString();
    } catch {
      // Metadados inválidos são ignorados e mantêm o avatar de fallback.
    }
  }

  return '';
}

function readHtmlAttribute(tag, attribute) {
  const match = tag.match(new RegExp(`\\b${attribute}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
  return match?.[2] || '';
}

function decodeHtmlAttribute(value) {
  return String(value || '')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_match, hexadecimal) =>
      String.fromCodePoint(Number.parseInt(hexadecimal, 16)),
    )
    .replace(/&#(\d+);/g, (_match, decimal) => String.fromCodePoint(Number.parseInt(decimal, 10)));
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

  return jsonResponse({ deletionCode: `${id}.${deletionSecret}` }, 200, corsHeaders, {
    'Cache-Control': 'no-store',
  });
}

async function removeOwnRegistration(request, env, corsHeaders) {
  const contentLength = Number(request.headers.get('Content-Length') || 0);

  if (contentLength > MAXIMUM_BODY_BYTES) {
    return jsonResponse({ error: 'payload_too_large' }, 413, corsHeaders);
  }

  const payload = await request.json();
  const deletionCode = normalizeDeletionCode(payload?.deletionCode);
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

  await env.DB.prepare('DELETE FROM community_registrations WHERE id = ?').bind(id).run();

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
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(value)));

  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function areEqualSecrets(left, right) {
  const leftBytes = toBytes(left);
  const rightBytes = toBytes(right);
  const maximumLength = Math.max(leftBytes.length, rightBytes.length);
  let difference = leftBytes.length ^ rightBytes.length;

  for (let index = 0; index < maximumLength; index += 1) {
    difference |= (leftBytes[index] || 0) ^ (rightBytes[index] || 0);
  }

  return difference === 0;
}

function toBytes(value) {
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  }

  return new TextEncoder().encode(String(value));
}

function normalizeDeletionCode(value) {
  let candidate = String(value || '').trim();

  if (!candidate) return '';

  try {
    const url = new URL(candidate);
    const directCode = url.searchParams.get('code');
    const hashQuery = url.hash.includes('?') ? url.hash.slice(url.hash.indexOf('?') + 1) : '';
    candidate = directCode || new URLSearchParams(hashQuery).get('code') || candidate;
  } catch {
    const query = candidate.includes('?') ? candidate.slice(candidate.indexOf('?') + 1) : '';
    candidate = new URLSearchParams(query).get('code') || candidate;
  }

  return candidate.trim();
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
    // Caracteres de controle nunca fazem parte de nomes ou perfis públicos.
    // eslint-disable-next-line no-control-regex
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

  return areEqualSecrets(suppliedDigest, expectedDigest);
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

/* Funções puras exportadas somente para a auditoria automatizada. O handler
   padrão continua sendo a única entrada pública implantada pelo Worker. */
export { areEqualSecrets, createSocialProfileUrl, normalizeDeletionCode, readOpenGraphImage };
