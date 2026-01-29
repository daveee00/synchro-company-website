/* location.js */
(() => {
  // =========================================================
  // CONFIG
  // =========================================================
  const GEO_MAX_DISTANCE_KM = 20; // when user allows geolocation
  const SEARCH_MAX_DISTANCE_KM = 30; // city/zip/address search radius
  const RESULTS_LIMIT = 200;

  // Geocoding (Nominatim OSM)
  const COUNTRY_CODES = ""; // "" = worldwide
  const NOMINATIM_LIMIT = 8;

  // =========================================================
  // DATA
  // =========================================================
  const POLL_STATIONS = [
    {
      id: "mi-bovisa-1",
      locationInfo: "Milano Bovisa - Politecnico",
      indirizzo: "Via Raffaele Lambruschini 4, 20156 Milano MI",
      lat: 45.50688,
      lng: 9.15739,
      zip: "20156",
      country: "IT",
    },
    {
      id: "mi-centro-1",
      locationInfo: "Milano Centro - Duomo",
      indirizzo: "Piazza del Duomo, 20122 Milano MI",
      lat: 45.46412,
      lng: 9.19193,
      zip: "20122",
      country: "IT",
    },
    {
      id: "roma-centro-1",
      locationInfo: "Roma Centro - Campidoglio",
      indirizzo: "Piazza del Campidoglio, 00186 Roma RM",
      lat: 41.89287,
      lng: 12.4823,
      zip: "00186",
      country: "IT",
    },
    {
      id: "ottawa-centre-1",
      locationInfo: "Ottawa Centre - City Hall",
      indirizzo: "110 Laurier Ave W, Ottawa, ON K1P 1J1, Canada",
      lat: 45.42153,
      lng: -75.69719,
      zip: "K1P",
      country: "CA",
    },

    // =======================
    // ITALY
    // =======================
    {
      id: "venezia-centro-1",
      locationInfo: "Venezia Centre - San Marco",
      indirizzo: "Piazza San Marco, 30124 Venezia VE",
      lat: 45.43416,
      lng: 12.33874,
      zip: "30124",
      country: "IT",
    },
    {
      id: "firenze-centro-1",
      locationInfo: "Firenze Centre - Palazzo Vecchio",
      indirizzo: "Piazza della Signoria, 50122 Firenze FI",
      lat: 43.76956,
      lng: 11.25581,
      zip: "50122",
      country: "IT",
    },
    {
      id: "napoli-centro-1",
      locationInfo: "Napoli Centre - Municipio",
      indirizzo: "Piazza Municipio, 80133 Napoli NA",
      lat: 40.83892,
      lng: 14.25254,
      zip: "80133",
      country: "IT",
    },
    {
      id: "torino-centro-1",
      locationInfo: "Torino Centre - Palazzo Civico",
      indirizzo: "Piazza Palazzo di Città, 10122 Torino TO",
      lat: 45.07327,
      lng: 7.68686,
      zip: "10122",
      country: "IT",
    },
    {
      id: "bologna-centro-1",
      locationInfo: "Bologna Centre - Palazzo d'Accursio",
      indirizzo: "Piazza Maggiore, 40124 Bologna BO",
      lat: 44.49381,
      lng: 11.34305,
      zip: "40124",
      country: "IT",
    },

    // =======================
    // EUROPE (CAPITALS)
    // =======================
    {
      id: "paris-centre-1",
      locationInfo: "Paris Centre - Hôtel de Ville",
      indirizzo: "Place de l'Hôtel de Ville, 75004 Paris, France",
      lat: 48.85661,
      lng: 2.35222,
      zip: "75004",
      country: "FR",
    },
    {
      id: "london-centre-1",
      locationInfo: "London Centre - City Hall",
      indirizzo: "The Queen's Walk, London SE1 2AA, UK",
      lat: 51.50477,
      lng: -0.07863,
      zip: "SE1",
      country: "GB",
    },
    {
      id: "berlin-centre-1",
      locationInfo: "Berlin Centre - Rathaus",
      indirizzo: "Rathausstraße 15, 10178 Berlin, Germany",
      lat: 52.51862,
      lng: 13.40805,
      zip: "10178",
      country: "DE",
    },
    {
      id: "madrid-centre-1",
      locationInfo: "Madrid Centre - Ayuntamiento",
      indirizzo: "Plaza de Cibeles, 28014 Madrid, Spain",
      lat: 40.4192,
      lng: -3.69224,
      zip: "28014",
      country: "ES",
    },
    {
      id: "vienna-centre-1",
      locationInfo: "Vienna Centre - Rathaus",
      indirizzo: "Friedrich-Schmidt-Platz 1, 1010 Wien, Austria",
      lat: 48.21003,
      lng: 16.35712,
      zip: "1010",
      country: "AT",
    },

    // =======================
    // AMERICA
    // =======================
    {
      id: "washington-centre-1",
      locationInfo: "Washington DC - City Hall",
      indirizzo: "1350 Pennsylvania Ave NW, Washington, DC 20004, USA",
      lat: 38.89511,
      lng: -77.03637,
      zip: "20004",
      country: "US",
    },
    {
      id: "mexico-city-centre-1",
      locationInfo: "Mexico City - Zócalo",
      indirizzo: "Plaza de la Constitución, Centro, CDMX, Mexico",
      lat: 19.43261,
      lng: -99.13321,
      zip: "06000",
      country: "MX",
    },

    // =======================
    // ASIA
    // =======================
    {
      id: "tokyo-centre-1",
      locationInfo: "Tokyo Centre - Chiyoda",
      indirizzo: "1 Chiyoda, Tokyo 100-8111, Japan",
      lat: 35.68518,
      lng: 139.7528,
      zip: "100-8111",
      country: "JP",
    },
    {
      id: "seoul-centre-1",
      locationInfo: "Seoul Centre - City Hall",
      indirizzo: "110 Sejong-daero, Jung-gu, Seoul, South Korea",
      lat: 37.5663,
      lng: 126.97794,
      zip: "04524",
      country: "KR",
    },
    {
      id: "beijing-centre-1",
      locationInfo: "Beijing Centre - Tiananmen",
      indirizzo: "Tiananmen Square, Beijing, China",
      lat: 39.9042,
      lng: 116.4074,
      zip: "100006",
      country: "CN",
    },

    // =======================
    // AFRICA
    // =======================
    {
      id: "cairo-centre-1",
      locationInfo: "Cairo Centre - Tahrir Square",
      indirizzo: "Tahrir Square, Cairo, Egypt",
      lat: 30.04442,
      lng: 31.23571,
      zip: "11511",
      country: "EG",
    },

    // =======================
    // OCEANIA
    // =======================
    {
      id: "canberra-centre-1",
      locationInfo: "Canberra Centre - Parliament",
      indirizzo: "Parliament Dr, Canberra ACT 2600, Australia",
      lat: -35.30806,
      lng: 149.12444,
      zip: "2600",
      country: "AU",
    },
  ];

  // =========================================================
  // DOM (ADAPTED TO YOUR HTML)
  // =========================================================
  const input =
    document.querySelector('input[type="search"]') ||
    document.querySelector("input[placeholder*='Location']") ||
    document.querySelector("input");

  const resultsWrap = document.getElementById("results");

  if (!input || !resultsWrap) {
    console.warn("[location] DOM not found: search input or #results.");
    return;
  }

  // If your HTML contains a demo result line, wipe it immediately
  resultsWrap.innerHTML = "";

  // =========================================================
  // STATE
  // =========================================================
  let userCenter = null; // {lat, lng} only after geolocation is allowed
  let userGeoDenied = false;

  // =========================================================
  // UTILS
  // =========================================================
  const escapeHtml = (s) =>
    String(s).replace(/[&<>"']/g, (c) => {
      const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      };
      return map[c] || c;
    });

  function haversineKm(aLat, aLng, bLat, bLng) {
    const R = 6371;
    const toRad = (v) => (v * Math.PI) / 180;

    const dLat = toRad(bLat - aLat);
    const dLng = toRad(bLng - aLng);
    const lat1 = toRad(aLat);
    const lat2 = toRad(bLat);

    const sinDLat = Math.sin(dLat / 2);
    const sinDLng = Math.sin(dLng / 2);

    const h =
      sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;

    return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
  }

  function mapsSearchUrl(address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address,
    )}`;
  }

  function clearResults() {
    resultsWrap.innerHTML = "";
  }

  function renderEmpty(top, bottom) {
    // Keep the same visual language as your result rows, but non-clickable
    resultsWrap.innerHTML = `
      <div class="result-line" style="cursor: default;">
        <div class="wrap-line">
          <div class="subtitle">${escapeHtml(top)}</div>
          <div class="body-text">${escapeHtml(bottom)}</div>
        </div>
      </div>
    `;
  }

  function renderResults(items, showKm) {
    clearResults();

    if (!items.length) {
      renderEmpty("No results", "No stations found.");
      return;
    }

    const frag = document.createDocumentFragment();

    items.slice(0, RESULTS_LIMIT).forEach(({ station, kmShown }) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "result-line";

      const kmText =
        showKm && Number.isFinite(kmShown) ? ` • ${kmShown.toFixed(1)} km` : "";

      btn.innerHTML = `
        <div class="wrap-line">
          <div class="subtitle">${escapeHtml(station.locationInfo)}</div>
          <div class="body-text">${escapeHtml(station.indirizzo)}${escapeHtml(
            kmText,
          )}</div>
        </div>
      `;

      btn.addEventListener("click", () => {
        window.open(
          mapsSearchUrl(station.indirizzo),
          "_blank",
          "noopener,noreferrer",
        );
      });

      frag.appendChild(btn);
    });

    resultsWrap.appendChild(frag);
  }

  // =========================================================
  // FILTERS
  // =========================================================
  function filterStationsWithinKm(
    filterLat,
    filterLng,
    maxKm,
    distanceLat = null,
    distanceLng = null,
  ) {
    return POLL_STATIONS.map((station) => {
      if (typeof station.lat !== "number" || typeof station.lng !== "number")
        return null;

      const kmFilter = haversineKm(
        filterLat,
        filterLng,
        station.lat,
        station.lng,
      );
      if (!Number.isFinite(kmFilter) || kmFilter > maxKm) return null;

      const kmShown =
        typeof distanceLat === "number" && typeof distanceLng === "number"
          ? haversineKm(distanceLat, distanceLng, station.lat, station.lng)
          : NaN;

      return { station, kmFilter, kmShown };
    })
      .filter(Boolean)
      .sort((a, b) => a.kmFilter - b.kmFilter);
  }

  function filterStationsByCountry(countryIso2) {
    const iso = String(countryIso2 || "").toUpperCase();
    return POLL_STATIONS.filter(
      (s) => String(s.country || "").toUpperCase() === iso,
    ).map((station) => ({ station, kmShown: NaN }));
  }

  // =========================================================
  // SUGGESTIONS (created/removed to avoid weird transparencies)
  // =========================================================
  let suggestHost = null; // wrapper that will be appended/removed
  const parent = input.closest(".block") || input.parentElement;

  // Ensure the parent can position the dropdown
  if (parent && getComputedStyle(parent).position === "static") {
    parent.style.position = "relative";
  }

  function removeSuggestionsFromDom() {
    if (suggestHost && suggestHost.parentNode) {
      suggestHost.parentNode.removeChild(suggestHost);
    }
    suggestHost = null;
  }

  function showSuggestions(items, onPick) {
    removeSuggestionsFromDom();
    if (!items.length || !parent) return;

    suggestHost = document.createElement("div");
    suggestHost.id = "location-suggestions-host";
    // Only minimal positioning here; rows are styled via your existing CSS (.result-line)
    suggestHost.style.position = "absolute";
    suggestHost.style.left = "0";
    suggestHost.style.right = "0";
    suggestHost.style.top = "calc(100% + 8px)";
    suggestHost.style.zIndex = "9999";

    const list = document.createElement("div");
    list.id = "location-suggestions-list";
    // Keep it simple; the buttons will use .result-line styling
    list.style.display = "flex";
    list.style.flexDirection = "column";
    list.style.gap = "0.5rem";

    items.forEach((it) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "result-line";

      row.innerHTML = `
        <div class="wrap-line">
          <div class="body-text">${escapeHtml(it.display)}</div>
        </div>
      `;

      row.addEventListener("click", () => {
        onPick(it);
      });

      list.appendChild(row);
    });

    suggestHost.appendChild(list);
    parent.appendChild(suggestHost);
  }

  document.addEventListener("click", (e) => {
    if (!parent) return;
    if (!parent.contains(e.target)) removeSuggestionsFromDom();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      removeSuggestionsFromDom();
    }
  });

  // =========================================================
  // GEOCODING (Nominatim)
  // =========================================================
  const geocodeCache = new Map();

  function isCountryResult(address, rawType) {
    // Strong signals
    if (String(rawType || "").toLowerCase() === "country") return true;
    if (!address || typeof address !== "object") return false;

    // If it has any "local" fields, treat it as a city/area, not a country
    const localKeys = [
      "city",
      "town",
      "village",
      "municipality",
      "hamlet",
      "county",
      "state",
      "state_district",
      "postcode",
      "road",
      "house_number",
      "suburb",
      "neighbourhood",
    ];

    const hasLocal = localKeys.some((k) => address[k]);
    const hasCountry = !!address.country && !!address.country_code;

    return hasCountry && !hasLocal;
  }

  async function geocode(query) {
    const q = String(query || "").trim();
    if (!q) return [];

    const cacheKey = `${COUNTRY_CODES}|${q.toLowerCase()}`;
    if (geocodeCache.has(cacheKey)) return geocodeCache.get(cacheKey);

    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("format", "json");
    url.searchParams.set("q", q);
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("limit", String(NOMINATIM_LIMIT));
    if (COUNTRY_CODES) url.searchParams.set("countrycodes", COUNTRY_CODES);

    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return [];
    const data = await res.json();

    const items = (Array.isArray(data) ? data : []).map((d) => {
      const lat = Number(d.lat);
      const lng = Number(d.lon);
      const addr = d.address || {};
      const cc = (addr.country_code || "").toUpperCase();

      return {
        display: d.display_name || "",
        lat,
        lng,
        country_code: cc,
        isCountry: isCountryResult(addr, d.type),
      };
    });

    geocodeCache.set(cacheKey, items);
    return items;
  }

  // =========================================================
  // SEARCH
  // =========================================================
  function performSearchFromGeocodeItem(item) {
    if (!item || !Number.isFinite(item.lat) || !Number.isFinite(item.lng)) {
      renderEmpty("No results", "Invalid location.");
      return;
    }

    // If it's a COUNTRY search -> show all stations in that country
    if (item.isCountry && item.country_code) {
      const byCountry = filterStationsByCountry(item.country_code);
      if (byCountry.length) {
        renderResults(byCountry, false);
        return;
      }
      renderEmpty("No results", "No stations found in this country.");
      return;
    }

    // Otherwise: city/zip/address -> 30km around the searched point
    const list = filterStationsWithinKm(
      item.lat,
      item.lng,
      SEARCH_MAX_DISTANCE_KM,
      null,
      null,
    );

    if (!list.length) {
      renderEmpty(
        "No results",
        `No stations within ${SEARCH_MAX_DISTANCE_KM} km from this location.`,
      );
      return;
    }

    // For manual searches: keep it like your current UX (no km shown)
    renderResults(list, false);
  }

  let debounceTimer = null;

  async function handleInputSearch(onlySuggest = false) {
    const q = input.value.trim();
    if (!q) {
      removeSuggestionsFromDom();
      clearResults();
      return;
    }

    const suggestions = await geocode(q);

    showSuggestions(suggestions, (picked) => {
      input.value = picked.display;
      removeSuggestionsFromDom();
      performSearchFromGeocodeItem(picked);
    });

    if (onlySuggest) return;

    // On Enter: use first suggestion (if any)
    removeSuggestionsFromDom();
    if (!suggestions[0]) {
      renderEmpty(
        "No results",
        "I couldn't find this location / ZIP code / country.",
      );
      return;
    }

    performSearchFromGeocodeItem(suggestions[0]);
  }

  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => handleInputSearch(true), 300);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInputSearch(false);
    }
  });

  // =========================================================
  // GEOLOCATION (ASK IMMEDIATELY)
  // =========================================================
  function getCurrentPosition(opts = {}) {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, opts);
    });
  }

  async function tryGeolocationOnLoad() {
    removeSuggestionsFromDom();

    try {
      const pos = await getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      });

      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      userCenter = { lat, lng };
      userGeoDenied = false;

      const list = filterStationsWithinKm(
        lat,
        lng,
        GEO_MAX_DISTANCE_KM,
        lat,
        lng,
      );

      if (!list.length) {
        renderEmpty(
          "No results",
          `No stations within ${GEO_MAX_DISTANCE_KM} km from your current location.`,
        );
        return;
      }

      // Geolocation mode: show distance
      renderResults(list, true);

      // Optional: set a friendly value (still editable)
      input.value = "Current location";
    } catch (err) {
      // Permission denied -> keep normal search behavior
      if (err && err.code === 1) {
        userGeoDenied = true;
        userCenter = null;
        // Do not block anything; just stay in standard search mode
        renderEmpty(
          "Search by location",
          "Type a city, ZIP code, address, or country to find a station.",
        );
        return;
      }

      // Other errors -> still keep standard search mode
      userGeoDenied = false;
      userCenter = null;
      renderEmpty(
        "Geolocation unavailable",
        "Couldn't get your position. You can still search by city, ZIP code, address, or country.",
      );
    }
  }

  // =========================================================
  // INIT
  // =========================================================
  clearResults();
  tryGeolocationOnLoad();
})();
