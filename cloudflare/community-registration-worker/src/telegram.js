/* ===========================================================
   AVISOS PRIVADOS DE MODERAÇÃO PELO TELEGRAM

   O Telegram recebe apenas um aviso genérico e o link da
   moderação. Nome, perfil social, país e demais dados do
   cadastro nunca saem do D1 por este canal.
=========================================================== */

const TELEGRAM_CHAT_SETTING = 'telegram_admin_chat_id';
const TELEGRAM_API_TIMEOUT_MS = 10_000;

export async function readTelegramNotificationStatus(env) {
  const chatId = await readConnectedChatId(env);
  const botIdentity = env.TELEGRAM_BOT_TOKEN
    ? await callTelegramApi(env.TELEGRAM_BOT_TOKEN, 'getMe', {}).catch(() => null)
    : null;
  const pendingUpdates = env.TELEGRAM_BOT_TOKEN
    ? await callTelegramApi(env.TELEGRAM_BOT_TOKEN, 'getUpdates', {
        allowed_updates: ['message'],
        limit: 100,
        timeout: 0,
      }).catch(() => [])
    : [];
  const privateStartMessages = pendingUpdates.filter((update) =>
    isPrivateStartMessage(update?.message),
  );

  return {
    configured: Boolean(env.TELEGRAM_BOT_TOKEN),
    connected: Boolean(chatId),
    username: normalizeTelegramUsername(env.TELEGRAM_ADMIN_USERNAME),
    botUsername: normalizeTelegramUsername(botIdentity?.username) || null,
    pendingUpdates: pendingUpdates.length,
    privateStartMessages: privateStartMessages.length,
  };
}

/* ===========================================================
   CONEXÃO CONTROLADA PELA MODERAÇÃO

   Depois que o administrador envia /start ao bot, esta rotina
   procura somente a conversa privada do usuário configurado.
=========================================================== */

export async function connectTelegramNotifications(env) {
  const expectedUsername = normalizeTelegramUsername(env.TELEGRAM_ADMIN_USERNAME);

  if (!env.TELEGRAM_BOT_TOKEN || !expectedUsername) {
    throw new TelegramNotificationError('telegram_not_configured');
  }

  const updates = await callTelegramApi(env.TELEGRAM_BOT_TOKEN, 'getUpdates', {
    allowed_updates: ['message'],
    limit: 100,
    timeout: 0,
  });
  const privateStartUpdates = [...updates]
    .reverse()
    .filter((update) => isPrivateStartMessage(update?.message));
  const privateStartChats = new Map();

  for (const update of privateStartUpdates) {
    const chatId = update?.message?.chat?.id;

    if (chatId != null && !privateStartChats.has(String(chatId))) {
      privateStartChats.set(String(chatId), update);
    }
  }

  const matchingUpdate =
    privateStartUpdates.find((update) => {
      const message = update.message;
      const username = normalizeTelegramUsername(
        message?.from?.username || message?.chat?.username,
      );

      return username === expectedUsername;
    }) ||
    /*
     * O Telegram pode omitir o username quando a conta não possui um
     * identificador público. Num bot recém-criado, uma única conversa
     * privada iniciada com /start é uma associação inequívoca; mais de
     * uma conversa mantém a conexão bloqueada por segurança.
     */
    (privateStartChats.size === 1 ? [...privateStartChats.values()][0] : null);
  const chatId = matchingUpdate?.message?.chat?.id;

  if (!chatId) {
    throw new TelegramNotificationError('telegram_chat_not_found');
  }

  await env.DB.prepare(
    `INSERT INTO community_notification_settings (
       setting_key, setting_value, updated_at
     ) VALUES (?, ?, ?)
     ON CONFLICT(setting_key) DO UPDATE SET
       setting_value = excluded.setting_value,
       updated_at = excluded.updated_at`,
  )
    .bind(TELEGRAM_CHAT_SETTING, String(chatId), new Date().toISOString())
    .run();

  await sendTelegramMessage(
    env,
    String(chatId),
    '✅ Avisos de moderação conectados. Você receberá uma mensagem quando houver um novo cadastro pendente.',
  );

  return {
    configured: true,
    connected: true,
    username: expectedUsername,
  };
}

/* ===========================================================
   AVISO ASSÍNCRONO DE NOVA PENDÊNCIA
=========================================================== */

export async function notifyPendingRegistration(env) {
  if (!env.TELEGRAM_BOT_TOKEN) return { sent: false, reason: 'not_configured' };

  const chatId = await readConnectedChatId(env);

  if (!chatId) return { sent: false, reason: 'not_connected' };

  const moderationUrl = String(env.MODERATION_URL || '').trim();
  const message = moderationUrl
    ? `🗓️ Novo cadastro aguardando aprovação.\n\nAbra a moderação:\n${moderationUrl}`
    : '🗓️ Novo cadastro aguardando aprovação.';

  await sendTelegramMessage(env, chatId, message);

  return { sent: true };
}

async function readConnectedChatId(env) {
  const row = await env.DB.prepare(
    `SELECT setting_value AS settingValue
       FROM community_notification_settings
      WHERE setting_key = ?
      LIMIT 1`,
  )
    .bind(TELEGRAM_CHAT_SETTING)
    .first();

  return String(row?.settingValue || '').trim();
}

async function sendTelegramMessage(env, chatId, text) {
  await callTelegramApi(env.TELEGRAM_BOT_TOKEN, 'sendMessage', {
    chat_id: chatId,
    text,
    link_preview_options: { is_disabled: true },
  });
}

async function callTelegramApi(token, method, payload) {
  let response;

  try {
    response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TELEGRAM_API_TIMEOUT_MS),
    });
  } catch {
    throw new TelegramNotificationError('telegram_unavailable');
  }

  let result;

  try {
    result = await response.json();
  } catch {
    throw new TelegramNotificationError('telegram_invalid_response');
  }

  if (!response.ok || result?.ok !== true) {
    throw new TelegramNotificationError('telegram_request_failed');
  }

  return result.result;
}

function normalizeTelegramUsername(value) {
  return String(value || '')
    .trim()
    .replace(/^@/, '')
    .toLowerCase();
}

function isPrivateStartMessage(message) {
  const text = String(message?.text || '').trim();

  return message?.chat?.type === 'private' && /^\/start(?:@\w+)?(?:\s|$)/i.test(text);
}

export class TelegramNotificationError extends Error {
  constructor(code) {
    super(code);
    this.name = 'TelegramNotificationError';
    this.code = code;
  }
}
