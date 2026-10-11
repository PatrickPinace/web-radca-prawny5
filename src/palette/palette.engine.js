// SILNIK PANELU PALET — ogólny, bez wiedzy o konkretnej stronie. Całość konfiguruje palette.config.js.
// Ładowany inline w <head> (razem z konfiguracją), żeby wybrana paleta była stosowana przed pierwszym rysowaniem.
(function () {
  var CFG = window.PALETTE_CONFIG;
  if (!CFG) return;
  var ROLES = CFG.roles, PRESETS = CFG.presets;
  var KEY = CFG.storageKey + '-palette', SAVED_KEY = CFG.storageKey + '-palettes';

  // ---- kolor ----
  function rgb(h) { h = h.replace('#', ''); return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); }); }
  function hex(c) { return '#' + c.map(function (v) { return ('0' + Math.round(v).toString(16)).slice(-2); }).join(''); }
  function mix(a, b, t) { var x = rgb(a), y = rgb(b); return hex(x.map(function (v, i) { return v * t + y[i] * (1 - t); })); } // t = udział a
  function lum(h) {
    return rgb(h).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); })
      .reduce(function (s, v, i) { return s + v * [0.2126, 0.7152, 0.0722][i]; }, 0);
  }
  function contrast(a, b) { var l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); }
  // Przyjmuje #abc, abc, #aabbcc, aabbcc (wielkość liter bez znaczenia); zwraca #aabbcc albo null.
  function norm(v) {
    if (v == null) return null;
    v = String(v).trim().toLowerCase().replace(/^#/, '');
    if (/^[0-9a-f]{3}$/.test(v)) v = v.replace(/./g, function (c) { return c + c; });
    return /^[0-9a-f]{6}$/.test(v) ? '#' + v : null;
  }

  // ---- role i odcienie pochodne ----
  function normColors(arr) { return ROLES.map(function (r, i) { return norm(arr && arr[i]); }); }
  function resolve(colors) {
    var val = {};
    ROLES.forEach(function (r, i) {
      val[r.id] = colors[i] || (r.auto && val[r.auto]) || r.def;
    });
    CFG.derived.forEach(function (d) {
      var a = val[d.mix[0]], b = val[d.mix[1]], t = d.mix[2], c = mix(a, b, t);
      if (d.min) {
        var against = val[d.min.against];
        while (t < 0.95 && contrast(c, against) < d.min.ratio) { t += 0.02; c = mix(a, b, t); }
      }
      val[d.var] = c;
    });
    return val;
  }
  function toCode(colors) { return ROLES.map(function (r, i) { return colors[i] || '-'; }).join(' '); }
  // „#fff #141414 - -”, „fff,141414,b4410b” itp.; '-' i 'auto' = pole automatyczne. Błąd → null.
  function parseCode(str) {
    var tokens = String(str || '').split(/[\s,;]+/).filter(Boolean), out = [];
    for (var i = 0; i < tokens.length && i < ROLES.length; i++) {
      if (tokens[i] === '-' || tokens[i].toLowerCase() === 'auto') { out.push(null); continue; }
      var c = norm(tokens[i]); if (!c) return null; out.push(c);
    }
    while (out.length < ROLES.length) out.push(null);
    for (var j = 0; j < ROLES.length; j++) if (ROLES[j].auto === null && !out[j]) return null;
    return out;
  }

  // ---- stosowanie ----
  var root = document.documentElement, state = null; // state: null (domyślna) | { id } | { c: [...] }
  function setMeta(color) { var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', color); }
  function varNames() { return ROLES.map(function (r) { return r.var; }).concat(CFG.derived.map(function (d) { return d.var; })); }
  function clear() {
    varNames().forEach(function (v) { root.style.removeProperty(v); });
    setMeta(resolve(normColors(PRESETS[0].c))[CFG.themeColorRole]);
  }
  function apply(colors) {
    var val = resolve(colors);
    ROLES.forEach(function (r, i) { if (colors[i] || r.auto === null) root.style.setProperty(r.var, val[r.id]); else root.style.removeProperty(r.var); });
    CFG.derived.forEach(function (d) { root.style.setProperty(d.var, val[d.var]); });
    setMeta(val[CFG.themeColorRole]);
  }
  function presetById(id) { for (var i = 0; i < PRESETS.length; i++) if (PRESETS[i].id === id) return PRESETS[i]; return null; }
  function toState(s) { // { id } | { c } -> { id, name, c } | null
    if (!s) return null;
    if (s.id) { var p = presetById(s.id); return p ? { id: p.id, name: p.name, c: normColors(p.c) } : null; }
    var c = s.c ? normColors(s.c) : normColors([s.bg, s.ink]); // dawny format zapisu: { bg, ink }
    return parseCode(toCode(c)) ? { id: null, name: 'Własna', c: c } : null;
  }
  function set(s, persist) {
    var p = toState(s);
    var isDefault = !p || (p.id === PRESETS[0].id) || toCode(p.c) === toCode(normColors(PRESETS[0].c));
    if (isDefault) { state = null; clear(); }
    else { state = p.id ? { id: p.id } : { c: p.c }; apply(p.c); }
    if (persist !== false) { try { if (state) localStorage.setItem(KEY, JSON.stringify(state)); else localStorage.removeItem(KEY); } catch (e) {} }
  }
  function setCode(str) { var c = parseCode(str); if (!c) return false; set({ c: c }); return true; }
  function current() {
    var p = toState(state) || { id: PRESETS[0].id, name: PRESETS[0].name, c: normColors(PRESETS[0].c) };
    p.resolved = resolve(p.c);
    return p;
  }
  function checks(colors) {
    var val = resolve(colors);
    return CFG.checks.map(function (k) {
      var ratio = contrast(val[k.a], val[k.b]);
      return { label: k.label, ratio: ratio, min: k.min, ok: ratio >= k.min };
    });
  }
  function shareUrl() {
    var u = new URL(location.href);
    ['paleta', 'kolory'].forEach(function (k) { u.searchParams.delete(k); });
    if (state && state.id) u.searchParams.set('paleta', state.id);
    else if (state) u.searchParams.set('kolory', state.c.map(function (c) { return c ? c.slice(1) : '-'; }).join(','));
    return u.toString();
  }

  // ---- zapisane palety (localStorage: [{ name, c }]) ----
  function savedList() {
    try {
      var l = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
      if (!Array.isArray(l)) return [];
      return l.map(function (x) {
        var c = x && (x.c ? normColors(x.c) : normColors([x.bg, x.ink]));
        return c && parseCode(toCode(c)) ? { name: String(x.name || 'Własna'), c: c } : null;
      }).filter(Boolean);
    } catch (e) { return []; }
  }
  function savedWrite(l) { try { localStorage.setItem(SAVED_KEY, JSON.stringify(l)); } catch (e) {} }
  function savedAdd(colors) {
    var l = savedList(), code = toCode(colors);
    for (var i = 0; i < l.length; i++) if (toCode(l[i].c) === code) return l;
    var n = 1;
    l.forEach(function (x) { var m = /^Własna (\d+)$/.exec(x.name); if (m) n = Math.max(n, +m[1] + 1); });
    l.push({ name: 'Własna ' + n, c: colors });
    savedWrite(l);
    return l;
  }
  function savedRemove(i) { var l = savedList(); l.splice(i, 1); savedWrite(l); return l; }

  // ---- start: parametr w adresie (do udostępniania) ma pierwszeństwo przed zapisanym wyborem ----
  var q = new URLSearchParams(location.search), initial = null;
  if (q.get('paleta')) initial = { id: q.get('paleta') };
  else if (q.get('kolory') && parseCode(q.get('kolory'))) initial = { c: parseCode(q.get('kolory')) };
  else { try { initial = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {} }
  if (initial) set(initial, false);

  window.paletteTool = {
    config: CFG, roles: ROLES, presets: PRESETS,
    set: set, setCode: setCode, current: current, checks: checks, toCode: toCode, parseCode: parseCode, norm: norm,
    shareUrl: shareUrl, resolve: resolve, contrast: contrast,
    saved: { list: savedList, add: savedAdd, remove: savedRemove },
  };
})();
