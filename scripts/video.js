(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const video = document.querySelector("section.video .bg-video");
    if (!video) return;

    // Flag: poster consentito solo finché non parte la prima riproduzione
    let posterAllowed = true;

    // -----------------------------
    // CSS
    // -----------------------------
    const style = document.createElement("style");
    style.textContent = `
      .video-preview-wrap {
        position: relative;
        width: 100%;
        height: 100%;
      }

      .video-preview-overlay {
        position: absolute;
        inset: 0;
        z-index: 3;
        display: none; /* gestito via JS */
        align-items: center;
        justify-content: center;
        cursor: pointer;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
        overflow: hidden;
      }

      /* poster (visibile SOLO al primo load) */
      .video-preview-poster {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        display: block;
        transform: translateZ(0);
      }

      /* velo (usabile sia con poster che senza) */
      .video-preview-dim {
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.18);
      }

      .video-preview-play {
        position: relative;
        z-index: 4;
        width: 72px;
        height: 72px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.65);
        background: rgba(0,0,0,0.35);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        transition: transform 180ms ease, background 180ms ease, border-color 180ms ease;
      }

      .video-preview-overlay:hover .video-preview-play {
        transform: scale(1.05);
        background: rgba(0,0,0,0.45);
        border-color: rgba(255,255,255,0.85);
      }

      .video-preview-play::before {
        content: "";
        width: 0;
        height: 0;
        border-left: 18px solid rgba(255,255,255,0.9);
        border-top: 12px solid transparent;
        border-bottom: 12px solid transparent;
        margin-left: 4px;
      }

      .video-preview-overlay:focus-visible .video-preview-play {
        outline: 2px solid rgba(255,255,255,0.9);
        outline-offset: 3px;
      }

      @media (prefers-reduced-motion: reduce) {
        .video-preview-play { transition: none; }
        .video-preview-overlay:hover .video-preview-play { transform: none; }
      }
    `;
    document.head.appendChild(style);

    // -----------------------------
    // DOM
    // -----------------------------
    const wrap = document.createElement("div");
    wrap.className = "video-preview-wrap";

    const parent = video.parentElement;
    parent.insertBefore(wrap, video);
    wrap.appendChild(video);

    const overlay = document.createElement("div");
    overlay.className = "video-preview-overlay";
    overlay.setAttribute("role", "button");
    overlay.setAttribute("tabindex", "0");
    overlay.setAttribute("aria-label", "Play video");

    const posterImg = document.createElement("img");
    posterImg.className = "video-preview-poster";
    posterImg.alt = "";
    posterImg.setAttribute("aria-hidden", "true");

    const dim = document.createElement("div");
    dim.className = "video-preview-dim";
    dim.setAttribute("aria-hidden", "true");

    const playBtn = document.createElement("div");
    playBtn.className = "video-preview-play";
    playBtn.setAttribute("aria-hidden", "true");

    overlay.appendChild(posterImg);
    overlay.appendChild(dim);
    overlay.appendChild(playBtn);
    wrap.appendChild(overlay);

    // poster iniziale (solo al load)
    const setPosterFromAttr = () => {
      const p = video.getAttribute("poster") || "";
      if (p) {
        posterImg.src = p;
        posterImg.style.display = "block";
      } else {
        posterImg.removeAttribute("src");
        posterImg.style.display = "none";
      }
    };
    setPosterFromAttr();

    // -----------------------------
    // Helpers
    // -----------------------------
    const isFullscreen = () =>
      document.fullscreenElement === video ||
      document.fullscreenElement === wrap ||
      document.webkitFullscreenElement === video ||
      document.webkitFullscreenElement === wrap;

    const showControls = () => {
      if (!video.hasAttribute("controls")) video.setAttribute("controls", "");
    };

    const hideControls = () => {
      if (video.hasAttribute("controls")) video.removeAttribute("controls");
    };

    const showOverlay = () => (overlay.style.display = "flex");
    const hideOverlay = () => (overlay.style.display = "none");

    const applyPosterVisibility = () => {
      // Poster SOLO finché posterAllowed è true (prima riproduzione)
      if (posterAllowed) {
        setPosterFromAttr();
      } else {
        posterImg.style.display = "none"; // mai più poster
      }
    };

    const syncUI = () => {
      const fs = isFullscreen();
      const pausedOrEnded = video.paused || video.ended;

      // Overlay quando NON fullscreen e video fermo
      if (!fs && pausedOrEnded) {
        applyPosterVisibility();
        showOverlay();
      } else {
        hideOverlay();
      }

      // Controls: fullscreen ON, inline OFF
      if (fs) showControls();
      else hideControls();
    };

    // -----------------------------
    // Azioni
    // -----------------------------
    const safePlay = async () => {
      try {
        await video.play();
      } catch (err) {
        console.warn("Play failed:", err);
      }
    };

    const safePause = () => {
      try {
        video.pause();
      } catch (err) {
        console.warn("Pause failed:", err);
      }
    };

    const togglePlayPauseInline = () => {
      if (video.paused || video.ended) safePlay();
      else safePause();
    };

    const requestFs = async () => {
      try {
        if (video.requestFullscreen) await video.requestFullscreen();
        else if (wrap.requestFullscreen) await wrap.requestFullscreen();
        else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
        else if (wrap.webkitRequestFullscreen) wrap.webkitRequestFullscreen();
      } catch (err) {
        console.warn("Fullscreen failed:", err);
      }
    };

    // -----------------------------
    // Eventi
    // -----------------------------
    // Overlay click/keyboard -> play
    overlay.addEventListener("click", (e) => {
      e.preventDefault();
      safePlay();
    });
    overlay.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        safePlay();
      }
    });

    // Click sul video inline -> toggle play/pause
    video.addEventListener("click", (e) => {
      if (!isFullscreen()) {
        e.preventDefault();
        togglePlayPauseInline();
      }
    });

    // Double click -> fullscreen
    video.addEventListener("dblclick", (e) => {
      e.preventDefault();
      requestFs();
    });

    // IMPORTANT: dopo il primo "play" disabilitiamo per sempre il poster
    video.addEventListener("play", () => {
      if (posterAllowed) {
        posterAllowed = false;
        posterImg.style.display = "none"; // immediato: mai più poster
      }
      syncUI();
    });

    video.addEventListener("pause", syncUI);
    video.addEventListener("ended", syncUI);

    document.addEventListener("fullscreenchange", syncUI);
    document.addEventListener("webkitfullscreenchange", syncUI);

    // Stato iniziale: overlay con poster (solo a pagina appena caricata)
    hideControls();
    syncUI();
  });
})();
