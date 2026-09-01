import { boot } from 'quasar/wrappers';

/* ===========================================================
   MEDIÇÃO UNIVERSAL DOS RÓTULOS DE BOTÕES

   O maior rótulo traduzido define uma largura única por grupo.
   A medição ocorre antes da pintura e novamente após troca de
   idioma ou carregamento de fonte, sem depender de hover.
=========================================================== */

const ACTION_WIDTH_SAFETY_PX = 8;

function getIntrinsicContentWidth(content) {
  const visibleChildren = Array.from(content.children).filter(
    (child) => window.getComputedStyle(child).display !== 'none',
  );
  const gap = Number.parseFloat(window.getComputedStyle(content).columnGap) || 0;
  const childrenWidth = visibleChildren.reduce(
    (total, child) => total + Math.max(child.scrollWidth, child.getBoundingClientRect().width),
    0,
  );

  /* O contêiner flexível pode ocupar toda a largura já atribuída ao botão.
     Somar essa largura criaria uma realimentação crescente; quando existem
     filhos, somente suas medidas intrínsecas entram no cálculo. */
  return visibleChildren.length
    ? childrenWidth + gap * Math.max(visibleChildren.length - 1, 0)
    : content.scrollWidth;
}

function measureGroup(group) {
  const buttons = Array.from(group.querySelectorAll(':scope > .app-action'));
  if (!buttons.length) return;

  const requiredWidth = buttons.reduce((largestWidth, button) => {
    const content = button.querySelector('.q-btn__content');
    if (!content) return largestWidth;

    const styles = window.getComputedStyle(button);
    const chromeWidth =
      Number.parseFloat(styles.paddingInlineStart) +
      Number.parseFloat(styles.paddingInlineEnd) +
      Number.parseFloat(styles.borderInlineStartWidth) +
      Number.parseFloat(styles.borderInlineEndWidth);

    /* Medir texto e ícone separadamente evita que um conteúdo já comprimido
       esconda a largura real. A folga absorve arredondamento subpixel e troca
       de fonte sem deixar o ícone encostar na última letra. */
    const intrinsicContentWidth = getIntrinsicContentWidth(content);
    return Math.max(
      largestWidth,
      Math.ceil(intrinsicContentWidth + chromeWidth + ACTION_WIDTH_SAFETY_PX),
    );
  }, 0);

  if (requiredWidth > 0) {
    group.style.setProperty('--app-action-content-width', `${requiredWidth}px`);
  }
}

function measureAllGroups() {
  document.querySelectorAll('.app-action-group').forEach(measureGroup);
}

export default boot(() => {
  let scheduledFrame = 0;
  const scheduleMeasurement = () => {
    window.cancelAnimationFrame(scheduledFrame);
    scheduledFrame = window.requestAnimationFrame(measureAllGroups);
  };

  /* Vue pode trocar textos ou inserir diálogos depois da montagem. Observar
     somente conteúdo, e não atributos, evita que a variável medida realimente
     o próprio observador. */
  const contentObserver = new MutationObserver((mutations) => {
    const actionContentChanged = mutations.some((mutation) => {
      const targetElement =
        mutation.target.nodeType === Node.ELEMENT_NODE
          ? mutation.target
          : mutation.target.parentElement;
      if (targetElement?.closest('.app-action-group')) return true;

      return Array.from(mutation.addedNodes).some((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return false;
        return node.matches('.app-action-group') || node.querySelector('.app-action-group');
      });
    });

    if (actionContentChanged) scheduleMeasurement();
  });
  contentObserver.observe(document.documentElement, {
    childList: true,
    characterData: true,
    subtree: true,
  });

  scheduleMeasurement();
  document.fonts?.ready.then(scheduleMeasurement);
});
