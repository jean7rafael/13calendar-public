/* ===========================================================
   ENDEREÇOS PÚBLICOS DA COMUNIDADE

   Todas as telas derivam a mesma origem do endpoint de
   cadastro. Nenhum segredo é incluído no aplicativo.
=========================================================== */

const registrationEndpoint = String(
  import.meta.env.VITE_COMMUNITY_REGISTRATION_URL || '',
).trim();

export const communityApiBase = registrationEndpoint.replace(/\/registrations\/?$/, '');

export function getCommunityApiUrl(path) {
  if (!communityApiBase) {
    return '';
  }

  return `${communityApiBase}/${String(path || '').replace(/^\/+/, '')}`;
}
