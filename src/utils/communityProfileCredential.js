/* ===========================================================
   CREDENCIAL LOCAL DO PERFIL COMUNITÁRIO

   O código longo continua sendo a credencial de recuperação.
   Neste navegador, ele pode ser reutilizado sem voltar a ser
   exibido ou digitado em cada voto e relato.
=========================================================== */

const COMMUNITY_PROFILE_CODE_STORAGE_KEY = '13calendar-community-profile-code';

export function extractCommunityProfileCode(value) {
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

export function readCommunityProfileCode() {
  try {
    return extractCommunityProfileCode(
      window.localStorage.getItem(COMMUNITY_PROFILE_CODE_STORAGE_KEY),
    );
  } catch {
    return '';
  }
}

export function saveCommunityProfileCode(value) {
  const code = extractCommunityProfileCode(value);

  if (!code) return;

  try {
    window.localStorage.setItem(COMMUNITY_PROFILE_CODE_STORAGE_KEY, code);
  } catch {
    /* Navegadores que bloqueiam armazenamento continuam aceitando
       a credencial manualmente, sem impedir o envio. */
  }
}

export function clearCommunityProfileCode(value = '') {
  try {
    const savedCode = readCommunityProfileCode();
    const suppliedCode = extractCommunityProfileCode(value);

    if (!suppliedCode || savedCode === suppliedCode) {
      window.localStorage.removeItem(COMMUNITY_PROFILE_CODE_STORAGE_KEY);
    }
  } catch {
    /* A exclusão remota já foi concluída; uma falha local não deve
       transformar o resultado em erro para a pessoa. */
  }
}
