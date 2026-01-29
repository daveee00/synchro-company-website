// nav-visibility-complete.js
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("#prod-sections");
  const anchor = document.querySelector("#anchor");

  if (!nav) {
    console.warn("[nav] #prod-sections non trovato");
    return;
  }
  if (!anchor) {
    console.warn("[nav] #anchor non trovato");
    return;
  }

  // Transizione gestita qui (così non dipende dal CSS)
  nav.style.transition = "opacity 0.35s ease, transform 0.35s ease";
  nav.style.willChange = "opacity, transform";

  const hideNav = () => {
    nav.style.opacity = "0";
    nav.style.pointerEvents = "none";
    nav.style.transform = "translateX(-50%) translateY(12px)";
  };

  const showNav = () => {
    nav.style.opacity = "1";
    nav.style.pointerEvents = "auto";
    nav.style.transform = "translateX(-50%) translateY(0)";
  };

  // Stato iniziale: nascosta
  hideNav();

  let ticking = false;

  const update = () => {
    const rect = anchor.getBoundingClientRect();
    const threshold = window.innerHeight * 0.5;

    // Regola richiesta:
    // - se TOP di #anchor è sopra il 50% viewport → mostra nav
    // - se TOP di #anchor è sotto il 50% viewport → nascondi nav
    const shouldShow = rect.top < threshold;

    if (shouldShow) showNav();
    else hideNav();

    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  update(); // utile se ricarichi già scrollato
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
});
