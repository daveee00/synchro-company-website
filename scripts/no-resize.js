/**
 * anti-zoom-global.js
 *
 * Obiettivi:
 * 1) Disabilitare zoom da doppio tap (mobile) e doppio click (desktop) SU QUALSIASI ELEMENTO.
 * 2) Su iOS Safari evitare che il focus sugli input zoomi/“resizi” la pagina;
 *    se succede, ripristinare esattamente lo stato iniziale (meta viewport + scala + scroll).
 *
 * Consigliato: caricalo su tutte le pagine, preferibilmente a fine <body>.
 */
(function () {
  "use strict";

  // ---------- Utils ----------
  function isIOS() {
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );
  }

  function ensureViewportMeta() {
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "viewport");
      // base “safe”
      meta.setAttribute("content", "width=device-width, initial-scale=1");
      document.head.appendChild(meta);
    }
    return meta;
  }

  function injectBaseCSS() {
    // 1) iOS: impedisce smart-zoom sugli input (>=16px)
    // 2) touch-action: "manipulation" aiuta a ridurre double-tap zoom (dove supportato)
    const style = document.createElement("style");
    style.setAttribute("data-anti-zoom", "true");
    style.textContent = `
      html { -webkit-text-size-adjust: 100%; }
      input, textarea, select { font-size: 16px !important; }
      * { touch-action: manipulation; }
    `;
    document.head.appendChild(style);
  }

  // ---------- 1) Blocca doppio click (desktop) ----------
  document.addEventListener(
    "dblclick",
    function (e) {
      // L'utente vuole: nessuno zoom da doppio click su qualsiasi elemento.
      e.preventDefault();
    },
    { passive: false },
  );

  // ---------- 2) Blocca doppio tap (mobile) ----------
  // Implementazione “generale”: blocca la 2a pressione ravvicinata.
  // Lo facciamo su touchend per colpire il meccanismo del double-tap zoom.
  let lastTouchEnd = 0;

  document.addEventListener(
    "touchend",
    function (e) {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        // Previene double-tap zoom su qualunque elemento.
        e.preventDefault();
      }
      lastTouchEnd = now;
    },
    { passive: false },
  );

  // ---------- 3) iOS: ripristino viewport/zoom dopo input focus ----------
  injectBaseCSS();

  const meta = ensureViewportMeta();
  const initialViewportContent =
    meta.getAttribute("content") || "width=device-width, initial-scale=1";

  // Stato iniziale “come al primo caricamento”
  const initialState = {
    viewportContent: initialViewportContent,
    scrollX: window.scrollX,
    scrollY: window.scrollY,
  };

  function setViewportContent(content) {
    meta.setAttribute("content", content);
  }

  // Forza scala 1 (temporaneamente) per evitare che iOS rimanga “appeso” dopo focus/blur
  function forceScaleOne() {
    // Nota: non mettiamo user-scalable=no permanente; lo usiamo solo per “resettare” la situazione.
    setViewportContent(
      "width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1",
    );
  }

  function restoreInitialViewport() {
    setViewportContent(initialState.viewportContent);
  }

  function hardRestoreToInitialView() {
    // 1) forza scala a 1
    forceScaleOne();

    // 2) micro “tick” di scroll per far ricalcolare a Safari layout/scale
    requestAnimationFrame(() => {
      const x = initialState.scrollX;
      const y = initialState.scrollY;

      // Manteniamo la posizione iniziale esatta.
      window.scrollTo(x, y + 1);
      window.scrollTo(x, y);

      // 3) ripristina esattamente il meta viewport iniziale
      setTimeout(() => {
        restoreInitialViewport();

        // 4) e riblocca di nuovo la posizione iniziale (in caso iOS la sposti)
        requestAnimationFrame(() => {
          window.scrollTo(initialState.scrollX, initialState.scrollY);
        });
      }, 80);
    });
  }

  function currentScale() {
    const vv = window.visualViewport;
    if (vv && typeof vv.scale === "number") return vv.scale;
    return 1;
  }

  // Quando un input prende focus, iOS può zoomare se vuole: noi lo “teniamo a bada”
  function onFocusIn() {
    if (!isIOS()) return;

    // Se vuoi “zero variazioni” anche mentre la tastiera sale:
    // applichiamo temporaneamente min/max scale=1.
    // (Questo evita spesso lo zoom mentre stai digitando)
    forceScaleOne();

    // Mantieni la posizione di scroll iniziale (per non percepire resize)
    requestAnimationFrame(() => {
      window.scrollTo(initialState.scrollX, initialState.scrollY);
    });
  }

  // Al blur, riportiamo tutto *esattamente* come all’inizio
  function onFocusOut() {
    if (!isIOS()) return;

    // Aspetta la chiusura della tastiera (iOS è asincrono)
    setTimeout(() => {
      // Se siamo zoomati (o anche solo “sporchi”), hard restore.
      // Molti casi: scale rimane > 1 dopo input.
      const s = currentScale();
      if (s > 1.01) {
        hardRestoreToInitialView();
      } else {
        // Anche se scale sembra 1, ripristiniamo meta + scroll iniziale.
        // (Questo evita casi “apparentemente 1” ma layout alterato)
        restoreInitialViewport();
        requestAnimationFrame(() => {
          window.scrollTo(initialState.scrollX, initialState.scrollY);
        });
      }
    }, 150);
  }

  // Applica SOLO ai form controls
  document.addEventListener(
    "focusin",
    function (e) {
      const t = e.target;
      if (t && t.matches && t.matches("input, textarea, select")) onFocusIn();
    },
    { passive: true },
  );

  document.addEventListener(
    "focusout",
    function (e) {
      const t = e.target;
      if (t && t.matches && t.matches("input, textarea, select")) onFocusOut();
    },
    { passive: true },
  );

  // Se ruoti lo schermo, iOS può cambiare scala/layout → ripristina
  window.addEventListener(
    "orientationchange",
    function () {
      if (!isIOS()) return;
      setTimeout(hardRestoreToInitialView, 250);
    },
    { passive: true },
  );
})();
