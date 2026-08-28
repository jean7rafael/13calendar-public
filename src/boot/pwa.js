import { defineBoot } from '#q-app/wrappers';

/* ===========================================================
   INSTALAÇÃO E ATUALIZAÇÃO OFFLINE

   O service worker guarda somente a interface e páginas já
   abertas. APIs da comunidade e notícias continuam online.
=========================================================== */

export default defineBoot(async () => {
  if (!process.env.PROD || !('serviceWorker' in navigator)) return;
  if (window.location.pathname.replace(/\/+$/, '').endsWith('/widget')) return;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    window.__calendarInstallPrompt = event;
    window.dispatchEvent(new CustomEvent('calendar-install-available'));
  });

  window.addEventListener('appinstalled', () => {
    window.__calendarInstallPrompt = null;
    window.dispatchEvent(new CustomEvent('calendar-app-installed'));
  });

  try {
    const registration = await navigator.serviceWorker.register(
      new URL('sw.js', `${window.location.origin}${process.env.VUE_ROUTER_BASE}`).toString(),
      { scope: process.env.VUE_ROUTER_BASE },
    );

    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
          window.dispatchEvent(new CustomEvent('calendar-update-available'));
        }
      });
    });
  } catch {
    // O aplicativo online continua funcionando se o modo offline for bloqueado.
  }
});
