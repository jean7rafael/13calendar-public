import { defineBoot } from '#q-app/wrappers';

/* ===========================================================
   COLETA PRIVADA E OPCIONAL DA CLOUDFLARE

   O token público do site só é inserido quando configurado na
   compilação. Credenciais da API nunca chegam ao navegador.
=========================================================== */

export default defineBoot(() => {
  const token = String(import.meta.env.VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN || '').trim();

  if (!token || document.querySelector('script[data-cf-beacon]')) {
    return;
  }

  const script = document.createElement('script');
  script.type = 'module';
  script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  script.dataset.cfBeacon = JSON.stringify({ token });
  document.body.append(script);
});
