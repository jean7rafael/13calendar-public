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
    const serviceWorkerUrl = new URL(
      'sw.js',
      `${window.location.origin}${process.env.VUE_ROUTER_BASE}`,
    );
    serviceWorkerUrl.searchParams.set('release', process.env.APP_RELEASE_ID || 'local');

    /* A revisão na URL e updateViaCache garantem que uma nova publicação seja
       comparada com a instalada, mesmo quando o aplicativo ficou muito tempo
       aberto ou foi iniciado pelo ícone salvo no sistema. */
    const registration = await navigator.serviceWorker.register(serviceWorkerUrl.toString(), {
      scope: process.env.VUE_ROUTER_BASE,
      updateViaCache: 'none',
    });

    function watchInstallingWorker(worker) {
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
          window.dispatchEvent(new CustomEvent('calendar-update-available'));
        }
      });
    }

    registration.addEventListener('updatefound', () => {
      watchInstallingWorker(registration.installing);
    });

    /* O evento pode ocorrer durante o próprio register, antes de o listener
       acima ser anexado. Nesse caso, acompanha o worker já em instalação. */
    watchInstallingWorker(registration.installing);
    await registration.update();
  } catch {
    // O aplicativo online continua funcionando se o modo offline for bloqueado.
  }
});
