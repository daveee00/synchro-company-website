// nav-visibility-complete.js
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("#prod-sections");
  const anchor = document.querySelector("#anchor");
  const footer = document.querySelector("footer"); // oppure: document.querySelector("#footer")

  if (!nav) return console.warn("[nav] #prod-sections non trovato");
  if (!anchor) return console.warn("[nav] #anchor non trovato");
  if (!footer) return console.warn("[nav] footer non trovato");

  nav.style.transition = "opacity 0.35s ease, transform 0.35s ease";
  nav.style.willChange = "opacity, transform";

  const HIDE_Y = 12;
  const GAP = 20;

  // Isteresi (anti “impazzimento”): più alto = più stabile
  const UNLOCK_GAP_EXTRA = 16; // unlock quando gap > GAP + questo
  const FOOTER_OUT_BUFFER = 12; // unlock quando footerTop > viewportBottom + buffer

  const getPx = (el, prop) => {
    const v = parseFloat(getComputedStyle(el)[prop]);
    return Number.isFinite(v) ? v : 0;
  };

  const docTop = (el) => el.getBoundingClientRect().top + window.scrollY;

  let isLocked = false;
  let isVisible = false;

  const clearLockInlineStyles = () => {
    nav.style.position = "";
    nav.style.top = "";
    nav.style.bottom = "";
    nav.style.left = "";
    nav.style.right = "";
  };

  const hideNav = () => {
    isVisible = false;
    isLocked = false;
    clearLockInlineStyles();

    nav.style.opacity = "0";
    nav.style.pointerEvents = "none";
    nav.style.transform = `translateX(-50%) translateY(${HIDE_Y}px)`;
  };

  const showNavNormal = () => {
    isVisible = true;

    nav.style.opacity = "1";
    nav.style.pointerEvents = "auto";

    // Se NON siamo lockati, lasciamo che il CSS del breakpoint comandi (fixed o altro)
    if (!isLocked) {
      clearLockInlineStyles();
      nav.style.transform = `translateX(-50%) translateY(0px)`;
    }
  };

  const lockAboveFooter = () => {
    // Ricalcola SEMPRE il top target (stabile anche con wrap/height variabile)
    const navRect = nav.getBoundingClientRect();
    const navMarginBottom = getPx(nav, "marginBottom");
    const footerMarginTop = getPx(footer, "marginTop");

    const footerTopWithMarginDoc = docTop(footer) - footerMarginTop;

    const op = nav.offsetParent || document.body;
    const opTopDoc = op.getBoundingClientRect().top + window.scrollY;

    const targetTopDoc =
      footerTopWithMarginDoc - GAP - navMarginBottom - navRect.height;

    const topRelativeToOffsetParent = targetTopDoc - opTopDoc;

    nav.style.position = "absolute";
    nav.style.top = `${topRelativeToOffsetParent}px`;
    nav.style.bottom = "auto";

    // In lock: niente translateY (evita loop)
    nav.style.transform = `translateX(-50%)`;

    isLocked = true;
  };

  const unlockToNormal = () => {
    if (!isLocked) return;
    isLocked = false;

    clearLockInlineStyles();
    // Torna al comportamento normale (transform gestito da showNavNormal)
    nav.style.transform = `translateX(-50%) translateY(0px)`;
  };

  // Stato iniziale
  hideNav();

  let ticking = false;

  const update = () => {
    const anchorRect = anchor.getBoundingClientRect();
    const threshold = window.innerHeight * 0.5;
    const shouldShow = anchorRect.top < threshold;

    if (!shouldShow) {
      hideNav();
      ticking = false;
      return;
    }

    // Nav visibile (base)
    showNavNormal();

    const footerMarginTop = getPx(footer, "marginTop");
    const footerTopWithMarginViewport =
      footer.getBoundingClientRect().top - footerMarginTop;

    // ✅ tua regola: sblocca quando il "margin-top del footer" è sotto il bottom della viewport
    // con un buffer per evitare flapping negli ultimi pixel
    const footerIsOutBelowViewport =
      footerTopWithMarginViewport > window.innerHeight + FOOTER_OUT_BUFFER;

    if (footerIsOutBelowViewport) {
      // Se il footer è fuori in basso, NON ha senso stare lockati
      unlockToNormal();
      ticking = false;
      return;
    }

    // Calcolo gap solo per decidere lock/unlock con isteresi
    const navRect = nav.getBoundingClientRect();
    const navMarginBottom = getPx(nav, "marginBottom");

    const gapNow =
      footerTopWithMarginViewport - (navRect.bottom + navMarginBottom);

    if (!isLocked) {
      // lock SOLO quando tocchi davvero la soglia
      if (gapNow <= GAP) lockAboveFooter();
    } else {
      // se lockato: aggiorna posizione (sempre)
      lockAboveFooter();

      // unlock SOLO quando ti stacchi abbastanza (isteresi)
      if (gapNow > GAP + UNLOCK_GAP_EXTRA) {
        unlockToNormal();
      }
    }

    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
});
