'use strict';
// =========================================================
//  ノノグラム・アトリエ：パズルのしくみ（画面を使わない部分）
//   - 絵のデータ（文字で描くドット絵 / コードで描くドット絵）
//   - ヒント数字の計算・ロジックで解けるかの確認（ライン・ソルバー）
//   - 大きい絵を 10×10 のピースに分ける
// =========================================================
const NONO = { art: [], byId: {}, PIECE: 10 };
(() => {
  // ---- 標準の色 ----
  // 英字（A-Z a-z）＝ぬるマス。数字・記号＝ぬらないマス（色はつく）。'.' は背景。
  const STD = {
    K: '#1d1629', k: '#463a5c', E: '#8b87a6', e: '#5d5878', U: '#c9cfe0', W: '#ffffff', I: '#f4ecd6',
    R: '#e8384a', r: '#a1203a', P: '#ff8fae', p: '#d24f80', M: '#f070d8',
    O: '#f7842a', o: '#c0571e', Y: '#ffe156', y: '#f2a93b',
    N: '#b06a43', n: '#6e3b30', T: '#f9cfa0', t: '#e0a275',
    G: '#5cc24c', g: '#2f8445', L: '#b4e65a', D: '#1f5e3a',
    B: '#2f8fe6', b: '#1c4f96', S: '#82d8f7', C: '#37e0d0', c: '#1e9c9a',
    V: '#9a5ce0', v: '#5e3a9a', A: '#2a2347', Z: '#ffd9e4',
    0: '#1d1629', 1: '#ffffff', 2: '#c9cfe0', 3: '#82d8f7', 4: '#ffe156', 5: '#ff8fae',
    6: '#b4e65a', 7: '#2f8fe6', 8: '#f9cfa0', 9: '#6e3b30',
  };
  NONO.STD = STD;
  const TIER_BG = ['#fff6e4', '#fff6e4', '#eaf4ff', '#f2ecff', '#ffeef2'];
  const isInk = ch => (ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z');

  function add(tier, id, name, w, h, col, ink, opt) {
    if (NONO.byId[id]) console.warn('同じ id の絵があります:', id);
    const a = { tier, id, name, w, h, col, ink, bg: opt.bg, sub: opt.sub || '' };
    NONO.art.push(a); NONO.byId[id] = a;
    return a;
  }
  // 文字で描く
  NONO.char = (tier, id, name, rows, pal = {}, opt = {}) => {
    rows = rows.trim().split(/\s+/);
    const h = rows.length, w = Math.max(...rows.map(r => r.length));
    const bg = pal['.'] || opt.bg || TIER_BG[tier];
    const map = { ...STD, ...pal, '.': bg };
    const col = new Array(w * h), ink = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const ch = rows[y][x] || '.';
      col[y * w + x] = map[ch] || bg;
      ink[y * w + x] = isInk(ch) ? 1 : 0;
    }
    return add(tier, id, name, w, h, col, ink, { ...opt, bg });
  };

  // ---- コードで描く（風景など）----
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + 0.5) / 16);
  function painter(w, h, col, ink, seed) {
    const inb = (x, y) => x >= 0 && y >= 0 && x < w && y < h;
    const P = {
      w, h, rng: RNG(seed),
      bayer: (x, y) => BAYER[(y & 3) * 4 + (x & 3)],
      set(x, y, c, k) {
        x = Math.floor(x); y = Math.floor(y); if (!inb(x, y)) return;
        if (c) col[y * w + x] = c;
        if (k !== undefined && k !== null) ink[y * w + x] = k ? 1 : 0;
      },
      get: (x, y) => inb(x, y) ? col[y * w + x] : null,
      inkAt: (x, y) => inb(x, y) ? ink[y * w + x] : 0,
      fill(c, k = 0) { for (let i = 0; i < w * h; i++) { col[i] = c; ink[i] = k; } },
      rect(x, y, ww, hh, c, k) { for (let j = y; j < y + hh; j++) for (let i = x; i < x + ww; i++) P.set(i, j, c, k); },
      // 円（ピクセルの中心で判定）
      circle(cx, cy, r, c, k) { P.ellipse(cx, cy, r, r, c, k); },
      ellipse(cx, cy, rx, ry, c, k) {
        for (let y = Math.floor(cy - ry - 1); y <= cy + ry + 1; y++) for (let x = Math.floor(cx - rx - 1); x <= cx + rx + 1; x++) {
          const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry;
          if (dx * dx + dy * dy <= 1) P.set(x, y, c, k);
        }
      },
      // 多角形 [[x,y],...]
      poly(pts, c, k) {
        let y0 = Infinity, y1 = -Infinity;
        for (const [, y] of pts) { y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
        for (let y = Math.floor(y0); y <= y1; y++) {
          const yc = y + 0.5, xs = [];
          for (let i = 0; i < pts.length; i++) {
            const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % pts.length];
            if ((ay <= yc && by > yc) || (by <= yc && ay > yc)) xs.push(ax + (yc - ay) / (by - ay) * (bx - ax));
          }
          xs.sort((a, b) => a - b);
          for (let i = 0; i + 1 < xs.length; i += 2) for (let x = Math.ceil(xs[i] - 0.5); x <= Math.floor(xs[i + 1] - 0.5); x++) P.set(x, y, c, k);
        }
      },
      line(x0, y0, x1, y1, c, k) {
        x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
        const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
        let e = dx + dy;
        for (let n = 0; n < 500; n++) {
          P.set(x0, y0, c, k);
          if (x0 === x1 && y0 === y1) break;
          const e2 = 2 * e;
          if (e2 >= dy) { e += dy; x0 += sx; }
          if (e2 <= dx) { e += dx; y0 += sy; }
        }
      },
      // たてのグラデーション（ディザ）。cols を y0〜y1 に均等に並べる。mask(x,y) が false のマスはぬらない
      vgrad(y0, y1, cols, k = 0, mask = null, x0 = 0, x1 = w) {
        const n = cols.length - 1;
        for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
          if (mask && !mask(x, y)) continue;
          const f = clamp((y - y0) / Math.max(1, y1 - y0 - 1), 0, 1) * n;
          const i = Math.min(n - 1, Math.floor(f)), fr = f - i;
          P.set(x, y, fr > P.bayer(x, y) ? cols[i + 1] : cols[i], k);
        }
      },
      // 文字のドット絵をはる（'.' と ' ' はとうめい）
      stamp(rows, pal, x0, y0, flip = false) {
        if (typeof rows === 'string') rows = rows.trim().split(/\s+/);
        const map = { ...STD, ...pal };
        const ww = Math.max(...rows.map(r => r.length));
        rows.forEach((row, y) => {
          for (let i = 0; i < row.length; i++) {
            const ch = row[i]; if (ch === '.' || ch === ' ') continue;
            const x = flip ? ww - 1 - i : i;
            P.set(x0 + x, y0 + y, map[ch], isInk(ch));
          }
        });
      },
      each(fn) { for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const r = fn(x, y); if (r) P.set(x, y, r[0], r[1]); } },
      // 外側のりんかく線：ふちから見える「ぬらないマス」のうち、ぬるマスにとなりあうマスを線にする
      outline(c, k = 1, region = null) {
        const out = new Uint8Array(w * h), st = [];
        const push = i => { if (!out[i] && !ink[i]) { out[i] = 1; st.push(i); } };
        for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x); }
        for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1); }
        while (st.length) {
          const i = st.pop(), x = i % w, y = (i / w) | 0;
          if (x > 0) push(i - 1); if (x < w - 1) push(i + 1); if (y > 0) push(i - w); if (y < h - 1) push(i + w);
        }
        const mark = [];
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
          const i = y * w + x; if (!out[i]) continue;
          if (region && !region(x, y)) continue;
          if ((x > 0 && ink[i - 1]) || (x < w - 1 && ink[i + 1]) || (y > 0 && ink[i - w]) || (y < h - 1 && ink[i + w])) mark.push(i);
        }
        for (const i of mark) { col[i] = c; ink[i] = k ? 1 : 0; }
      },
      // 色 c のマスのうち (dx,dy) となりが「c 以外」なら c2 に（かげ・ハイライト）
      rim(c, c2, dx, dy, onlyInk = false) {
        const mark = [];
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
          const i = y * w + x; if (col[i] !== c) continue;
          const nx = x + dx, ny = y + dy;
          const nc = inb(nx, ny) ? col[ny * w + nx] : null;
          if (nc !== c && (!onlyInk || !inb(nx, ny) || !ink[ny * w + nx])) mark.push(i);
        }
        for (const i of mark) col[i] = c2;
      },
      // 色をおきかえ
      recolor(c, c2, k) { for (let i = 0; i < w * h; i++) if (col[i] === c) { col[i] = c2; if (k !== undefined) ink[i] = k ? 1 : 0; } },
    };
    return P;
  }
  NONO.painter = painter;
  NONO.paint = (tier, id, name, w, h, fn, opt = {}) => {
    const col = new Array(w * h).fill(opt.bg || TIER_BG[tier]), ink = new Uint8Array(w * h);
    fn(painter(w, h, col, ink, opt.seed || (id.length * 7919 + w)));
    return add(tier, id, name, w, h, col, ink, opt);
  };

  // =========================================================
  //  ヒント数字とライン・ソルバー
  // =========================================================
  function runs(arr) {
    const out = []; let r = 0;
    for (const v of arr) { if (v) r++; else if (r) { out.push(r); r = 0; } }
    if (r) out.push(r);
    return out;
  }
  NONO.runs = runs;
  NONO.clues = (ink, w, h) => {
    const rows = [], cols = [];
    for (let y = 0; y < h; y++) rows.push(runs(Array.from({ length: w }, (_, x) => ink[y * w + x])));
    for (let x = 0; x < w; x++) cols.push(runs(Array.from({ length: h }, (_, y) => ink[y * w + x])));
    return { rows, cols };
  };

  // 1列ぶんを解く。line: -1=不明 0=空 1=ぬり。むじゅんなら null
  function solveLine(clue, line) {
    const n = line.length, k = clue.length;
    const zp = new Int32Array(n + 1);
    for (let i = 0; i < n; i++) zp[i + 1] = zp[i] + (line[i] === 0 ? 1 : 0);
    const fits = (i, len) => i + len <= n && zp[i + len] - zp[i] === 0 && (i + len === n || line[i + len] !== 1);
    const memo = new Uint8Array((n + 2) * (k + 1));
    const f = (i, j) => {
      if (i >= n) return j === k;
      const key = i * (k + 1) + j;
      if (memo[key]) return memo[key] === 1;
      let r = false;
      if (line[i] !== 1 && f(i + 1, j)) r = true;
      else if (j < k && fits(i, clue[j]) && f(i + clue[j] + 1, j + 1)) r = true;
      memo[key] = r ? 1 : 2;
      return r;
    };
    if (!f(0, 0)) return null;
    const canF = new Uint8Array(n), canE = new Uint8Array(n), seen = new Uint8Array((n + 2) * (k + 1));
    const st = [0, 0];
    while (st.length) {
      const j = st.pop(), i = st.pop();
      if (i >= n) continue;
      const key = i * (k + 1) + j; if (seen[key]) continue; seen[key] = 1;
      if (line[i] !== 1 && f(i + 1, j)) { canE[i] = 1; st.push(i + 1, j); }
      if (j < k && fits(i, clue[j]) && f(i + clue[j] + 1, j + 1)) {
        for (let q = i; q < i + clue[j]; q++) canF[q] = 1;
        if (i + clue[j] < n) canE[i + clue[j]] = 1;
        st.push(i + clue[j] + 1, j + 1);
      }
    }
    const out = new Int8Array(n);
    for (let i = 0; i < n; i++) {
      if (canF[i] && canE[i]) out[i] = -1; else if (canF[i]) out[i] = 1; else if (canE[i]) out[i] = 0; else return null;
    }
    return out;
  }
  NONO.solveLine = solveLine;
  // ぜんぶ解く（ロジックだけで）。g は Int8Array（-1/0/1）。かわったら書きかえる。むじゅんなら false
  function solve(rows, cols, w, h, g) {
    const rd = new Uint8Array(h).fill(1), cd = new Uint8Array(w).fill(1);
    let any = true;
    while (any) {
      any = false;
      for (let y = 0; y < h; y++) {
        if (!rd[y]) continue; rd[y] = 0;
        const line = new Int8Array(w); for (let x = 0; x < w; x++) line[x] = g[y * w + x];
        const r = solveLine(rows[y], line); if (!r) return false;
        for (let x = 0; x < w; x++) if (r[x] !== line[x]) { g[y * w + x] = r[x]; cd[x] = 1; any = true; }
      }
      for (let x = 0; x < w; x++) {
        if (!cd[x]) continue; cd[x] = 0;
        const line = new Int8Array(h); for (let y = 0; y < h; y++) line[y] = g[y * w + x];
        const r = solveLine(cols[x], line); if (!r) return false;
        for (let y = 0; y < h; y++) if (r[y] !== line[y]) { g[y * w + x] = r[y]; rd[y] = 1; any = true; }
      }
    }
    return true;
  }
  NONO.solve = solve;
  const unknowns = g => { let n = 0; for (const v of g) if (v < 0) n++; return n; };

  // ロジックだけで解けないときに「はじめから見えているマス」をえらぶ（できるだけ少なく）
  NONO.makeGivens = (pz) => {
    const { w, h, ink, rows, cols } = pz;
    const g = new Int8Array(w * h).fill(-1);
    solve(rows, cols, w, h, g);
    const giv = [];
    let guard = 0;
    while (unknowns(g) > 0 && guard++ < 60) {
      let best = -1, bestN = Infinity;
      for (let i = 0; i < w * h; i++) {
        if (g[i] >= 0) continue;
        const t = g.slice(); t[i] = ink[i];
        solve(rows, cols, w, h, t);
        const u = unknowns(t) + (ink[i] ? 0 : 0.5); // ぬりマスを少しえらびやすく
        if (u < bestN) { bestN = u; best = i; }
      }
      giv.push(best); g[best] = ink[best];
      solve(rows, cols, w, h, g);
    }
    return giv;
  };

  // =========================================================
  //  ピース（1まいの絵 → 10×10 のピース）
  // =========================================================
  const _pieces = {};
  NONO.piecesOf = (a) => {
    if (_pieces[a.id]) return _pieces[a.id];
    const list = [];
    const single = a.tier === 1;
    const P = NONO.PIECE;
    const nx = single ? 1 : Math.ceil(a.w / P), ny = single ? 1 : Math.ceil(a.h / P);
    for (let py = 0; py < ny; py++) for (let px = 0; px < nx; px++) {
      const x0 = single ? 0 : px * P, y0 = single ? 0 : py * P;
      const w = single ? a.w : Math.min(P, a.w - x0), h = single ? a.h : Math.min(P, a.h - y0);
      const ink = new Uint8Array(w * h);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) ink[y * w + x] = a.ink[(y0 + y) * a.w + x0 + x];
      const { rows, cols } = NONO.clues(ink, w, h);
      let cnt = 0; for (const v of ink) cnt += v;
      list.push({
        id: single ? a.id : a.id + '@' + px + '_' + py, art: a, px, py, nx, ny, x0, y0, w, h, ink, rows, cols,
        empty: cnt === 0, no: py * nx + px + 1, _giv: null,
        get givens() { return this._giv || (this._giv = NONO.makeGivens(this)); },
      });
    }
    return (_pieces[a.id] = list);
  };
  NONO.ofTier = tier => NONO.art.filter(a => a.tier === tier);
})();
