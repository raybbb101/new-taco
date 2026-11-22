'use strict';
// =========================================================
//  NEW TACO — 共通エンジン（2D）
//  画面は 240x320 ドット（論理）。じっさいは 2倍（480x640）で描き、
//  文字や細い線は 2倍の細かさで描く。最後に「シャープ拡大」で画面いっぱいに。
// =========================================================

const W = 240, H = 320;   // レイアウト用の大きさ（論理ドット）
const RS = 2;             // じっさいの描画は 2倍

// ---- 便利関数 ----
const rand = (a, b) => a + Math.random() * (b - a);
const randi = (a, b) => Math.floor(rand(a, b + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const chance = p => Math.random() < p;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const sign = v => v > 0 ? 1 : v < 0 ? -1 : 0;
const ease = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const easeOut = t => 1 - (1 - t) * (1 - t);
const easeOut3 = t => 1 - Math.pow(1 - t, 3);
const easeBack = t => { const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
function shuffle(a, r = Math.random) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function wpick(list, r = Math.random) {
  let sum = 0; for (const [, w] of list) sum += w;
  let x = r() * sum;
  for (const [v, w] of list) { x -= w; if (x < 0) return v; }
  return list[list.length - 1][0];
}
// 種つき乱数
function RNG(seed) {
  let s = (seed >>> 0) || 1;
  const f = () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  f.int = (a, b) => a + Math.floor(f() * (b - a + 1));
  f.pick = arr => arr[Math.floor(f() * arr.length)];
  f.range = (a, b) => a + f() * (b - a);
  return f;
}
function hash2(x, y) {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
const fmt = n => { n = Math.floor(n); return n >= 1e12 ? n.toExponential(2).replace('+', '') : n.toLocaleString('en-US'); };

// ---- 保存 ----
const Save = {
  get(k, def) { try { const v = localStorage.getItem('ntc_' + k); return v === null ? def : JSON.parse(v); } catch (e) { return def; } },
  set(k, v) { try { localStorage.setItem('ntc_' + k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem('ntc_' + k); } catch (e) {} },
};

// =========================================================
//  色（あざやかめ。ゲームボーイよりは新しく、今どきよりは少しレトロ）
// =========================================================
const INK = '#16121f', NAVY = '#231d38', SLATE = '#383155', DIM = '#57507a', MUTE = '#7c769e',
  GRAY = '#a6a1be', LIGHT = '#d4d1e4', WHITE = '#f8f6ef',
  BROWN = '#a8673f', TAN = '#efc897', CREAM = '#fbf0d9', PAPER = '#fffaf0',
  DRED = '#b0283f', RED = '#ec4a55', PINK = '#ff8fa3', ROSE = '#e0507e',
  ORANGE = '#f7862a', GOLD = '#ffc83d', YEL = '#fff27a',
  DGREEN = '#2c7a45', GREEN = '#4fb85a', LIME = '#a5dc52', MINT = '#8ff0c4',
  DBLUE = '#1c4f84', BLUE = '#3b8fe8', SKY = '#7fd2f7', ICE = '#c8f2ff', TEAL = '#2fb8a8',
  PURPLE = '#7442b8', VIOLET = '#ab66e8', LAV = '#d9a8f0';

function hexRGB(hex) { const n = parseInt(hex.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function rgbHex(r, g, b) { return '#' + ((1 << 24) | (clamp(Math.round(r), 0, 255) << 16) | (clamp(Math.round(g), 0, 255) << 8) | clamp(Math.round(b), 0, 255)).toString(16).slice(1); }
function mix(a, b, t) { const A = hexRGB(a), B = hexRGB(b); return rgbHex(lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t)); }
function alpha(hex, a) { const [r, g, b] = hexRGB(hex); return `rgba(${r},${g},${b},${a})`; }

// =========================================================
//  描画キャンバス（480x640。座標は論理ドット）
// =========================================================
const ui = document.createElement('canvas'); ui.width = W * RS; ui.height = H * RS;
const ctx = ui.getContext('2d');
ctx.imageSmoothingEnabled = false;
function uiBegin() { ctx.setTransform(RS, 0, 0, RS, 0, 0); ctx.imageSmoothingEnabled = false; ctx.globalAlpha = 1; }

function rect(x, y, w, h, col) { ctx.fillStyle = col; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
// 丸めない四角（0.5 で 1 物理ドット）
function frect(x, y, w, h, col) { ctx.fillStyle = col; ctx.fillRect(x, y, w, h); }
function rectLine(x, y, w, h, col) { rect(x, y, w, 1, col); rect(x, y + h - 1, w, 1, col); rect(x, y, 1, h, col); rect(x + w - 1, y, 1, h, col); }
function hairLine(x, y, w, h, col) { frect(x, y, w, 0.5, col); frect(x, y + h - 0.5, w, 0.5, col); frect(x, y, 0.5, h, col); frect(x + w - 0.5, y, 0.5, h, col); }
// 角を落とした四角（r=1〜3）
function rrect(x, y, w, h, col, r = 2) {
  x = Math.round(x); y = Math.round(y); w = Math.round(w); h = Math.round(h);
  ctx.fillStyle = col;
  if (r <= 0 || w < 2 * r + 1 || h < 2 * r + 1) { ctx.fillRect(x, y, w, h); return; }
  if (r === 1) { ctx.fillRect(x + 1, y, w - 2, h); ctx.fillRect(x, y + 1, w, h - 2); return; }
  if (r === 2) { ctx.fillRect(x + 2, y, w - 4, h); ctx.fillRect(x + 1, y + 1, w - 2, h - 2); ctx.fillRect(x, y + 2, w, h - 4); return; }
  ctx.fillRect(x + 3, y, w - 6, h); ctx.fillRect(x + 1, y + 1, w - 2, h - 2); ctx.fillRect(x, y + 3, w, h - 6);
}
// ふちつきの丸四角
function rbox(x, y, w, h, fill, edge = INK, r = 2) { rrect(x, y, w, h, edge, r); rrect(x + 1, y + 1, w - 2, h - 2, fill, Math.max(0, r - 1)); }
function dither(x, y, w, h, col, phase = 0) {
  ctx.fillStyle = col; x = Math.round(x); y = Math.round(y);
  for (let j = 0; j < h; j++) for (let i = (j + phase + x + y) & 1; i < w; i += 2) ctx.fillRect(x + i, y + j, 1, 1);
}
function circle(cx, cy, r, col) {
  ctx.fillStyle = col;
  for (let y = -r; y <= r; y++) {
    const w = Math.floor(Math.sqrt(r * r - y * y + r * 0.8));
    ctx.fillRect(Math.round(cx - w), Math.round(cy + y), w * 2 + 1, 1);
  }
}
function ring(cx, cy, r, col) {
  for (let a = 0; a < 64; a++) { const t = a / 64 * Math.PI * 2; rect(cx + Math.cos(t) * r, cy + Math.sin(t) * r, 1, 1, col); }
}
function line(x0, y0, x1, y1, col) {
  x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let e = dx + dy; ctx.fillStyle = col;
  for (let k = 0; k < 800; k++) {
    ctx.fillRect(x0, y0, 1, 1);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * e;
    if (e2 >= dy) { e += dy; x0 += sx; }
    if (e2 <= dx) { e += dx; y0 += sy; }
  }
}
// たてのグラデーション（なめらか）
function vgrad(x, y, w, h, c0, c1) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, c0); g.addColorStop(1, c1);
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
}
// ドット絵（文字列 → キャンバス）
function pix(rows, map) {
  if (typeof rows === 'string') rows = rows.trim().split(/\s+/);
  const h = rows.length, w = Math.max(...rows.map(r => r.length));
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d');
  rows.forEach((row, y) => { for (let x = 0; x < row.length; x++) { const col = map[row[x]]; if (col) { g.fillStyle = col; g.fillRect(x, y, 1, 1); } } });
  return c;
}
function img(im, x, y, s = 1) { ctx.drawImage(im, Math.round(x), Math.round(y), im.width * s, im.height * s); }
// 色をかえたシルエット
const _tintCache = new Map();
function tinted(im, col) {
  let m = _tintCache.get(im); if (!m) { m = new Map(); _tintCache.set(im, m); }
  let c = m.get(col); if (c) return c;
  c = document.createElement('canvas'); c.width = im.width; c.height = im.height;
  const g = c.getContext('2d'); g.drawImage(im, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = col; g.fillRect(0, 0, c.width, c.height);
  m.set(col, c); return c;
}
function outlined(im, x, y, s, col) { const t = tinted(im, col); for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) img(t, x + dx, y + dy, s); img(im, x, y, s); }

// ウィンドウ（こん色＋白いふち）
function panel(x, y, w, h, fill = NAVY, edge = WHITE, inner = SLATE) {
  x = Math.round(x); y = Math.round(y);
  rect(x + 1, y, w - 2, h, INK); rect(x, y + 1, w, h - 2, INK);
  rect(x + 2, y + 1, w - 4, h - 2, edge); rect(x + 1, y + 2, w - 2, h - 4, edge);
  rect(x + 2, y + 2, w - 4, h - 4, fill);
  if (inner) rect(x + 3, y + h - 3, w - 6, 1, inner);
}
function box(x, y, w, h, fill = WHITE, edge = INK) {
  rect(x + 1, y, w - 2, h, edge); rect(x, y + 1, w, h - 2, edge);
  rect(x + 1, y + 1, w - 2, h - 2, fill);
}
function bar(x, y, w, h, v, max, fg = RED, bg = INK, edge = INK, hi = null) {
  rect(x, y, w, h, edge);
  rect(x + 1, y + 1, w - 2, h - 2, bg);
  const f = Math.round((w - 2) * clamp(v / max, 0, 1));
  if (f > 0) { rect(x + 1, y + 1, f, h - 2, fg); if (hi && h > 3) rect(x + 1, y + 1, f, 1, hi); }
}

// =========================================================
//  ドットフォント 5x7（英数字）と 3x5（小さい文字）
// =========================================================
const FONT5 = {
  A: [14,17,17,31,17,17,17], B: [30,17,17,30,17,17,30], C: [14,17,16,16,16,17,14], D: [30,17,17,17,17,17,30],
  E: [31,16,16,30,16,16,31], F: [31,16,16,30,16,16,16], G: [14,17,16,23,17,17,15], H: [17,17,17,31,17,17,17],
  I: [14,4,4,4,4,4,14], J: [7,2,2,2,2,18,12], K: [17,18,20,24,20,18,17], L: [16,16,16,16,16,16,31],
  M: [17,27,21,21,17,17,17], N: [17,17,25,21,19,17,17], O: [14,17,17,17,17,17,14], P: [30,17,17,30,16,16,16],
  Q: [14,17,17,17,21,18,13], R: [30,17,17,30,20,18,17], S: [15,16,16,14,1,1,30], T: [31,4,4,4,4,4,4],
  U: [17,17,17,17,17,17,14], V: [17,17,17,17,17,10,4], W: [17,17,17,21,21,21,10], X: [17,17,10,4,10,17,17],
  Y: [17,17,17,10,4,4,4], Z: [31,1,2,4,8,16,31],
  0: [14,17,19,21,25,17,14], 1: [4,12,4,4,4,4,14], 2: [14,17,1,2,4,8,31], 3: [31,2,4,2,1,17,14],
  4: [2,6,10,18,31,2,2], 5: [31,16,30,1,1,17,14], 6: [6,8,16,30,17,17,14], 7: [31,1,2,4,8,8,8],
  8: [14,17,17,14,17,17,14], 9: [14,17,17,15,1,2,12],
  ' ': [0,0,0,0,0,0,0], '.': [0,0,0,0,0,12,12], ',': [0,0,0,0,12,4,8], '!': [4,4,4,4,0,0,4],
  '?': [14,17,1,2,4,0,4], ':': [0,12,12,0,12,12,0], '-': [0,0,0,31,0,0,0], '+': [0,4,4,31,4,4,0],
  '/': [0,1,2,4,8,16,0], "'": [12,4,8,0,0,0,0], '(': [2,4,8,8,8,4,2], ')': [8,4,2,2,2,4,8],
  '%': [24,25,2,4,8,19,3], '#': [10,10,31,10,31,10,10], '*': [0,4,21,14,21,4,0], '<': [2,4,8,16,8,4,2],
  '>': [8,4,2,1,2,4,8], '=': [0,0,31,0,31,0,0], '_': [0,0,0,0,0,0,31], '"': [10,10,0,0,0,0,0],
  '@': [8,12,14,15,14,12,8],   // ▶
  '~': [0,10,31,31,14,4,0],    // ♥
  '^': [4,14,21,4,4,4,0],      // ↑
  '|': [0,4,4,4,21,14,4],      // ↓
  '$': [4,15,20,14,5,30,4],    // $
  '&': [0,4,14,31,14,4,0],     // ◆
  '[': [4,14,31,0,0,0,0],      // ▲(小)
  ']': [0,0,0,0,31,14,4],      // ▼(小)
  '`': [0,17,10,4,10,17,0],    // ×
  '{': [4,14,31,31,4,14,0],    // ♠
  '}': [14,14,31,31,4,14,0],   // ♣
};
const FONT3 = {
  0: [7,5,5,5,7], 1: [2,6,2,2,7], 2: [7,1,7,4,7], 3: [7,1,3,1,7], 4: [5,5,7,1,1],
  5: [7,4,7,1,7], 6: [7,4,7,5,7], 7: [7,1,1,2,2], 8: [7,5,7,5,7], 9: [7,5,7,1,7],
  A: [2,5,7,5,5], B: [6,5,6,5,6], C: [3,4,4,4,3], D: [6,5,5,5,6], E: [7,4,6,4,7], F: [7,4,6,4,4],
  G: [3,4,5,5,3], H: [5,5,7,5,5], I: [7,2,2,2,7], J: [1,1,1,5,2], K: [5,5,6,5,5], L: [4,4,4,4,7],
  M: [5,7,7,5,5], N: [6,5,5,5,5], O: [2,5,5,5,2], P: [6,5,6,4,4], Q: [2,5,5,6,3], R: [6,5,6,5,5],
  S: [3,4,2,1,6], T: [7,2,2,2,2], U: [5,5,5,5,7], V: [5,5,5,5,2], W: [5,5,7,7,5], X: [5,5,2,5,5],
  Y: [5,5,2,2,2], Z: [7,1,2,4,7],
  ' ': [0,0,0,0,0], '/': [1,1,2,4,4], ':': [0,2,0,2,0], '-': [0,0,7,0,0], '+': [0,2,7,2,0],
  '.': [0,0,0,0,2], '%': [5,1,2,4,5], '~': [5,7,7,2,0], '$': [3,6,2,3,6], 'x': [0,5,2,5,0],
  '!': [2,2,2,0,2], '?': [6,1,2,0,2], '(': [1,2,2,2,1], ')': [4,2,2,2,4], '>': [4,2,1,2,4],
  '<': [1,2,4,2,1], '*': [0,5,2,5,0], '#': [5,7,5,7,5], '=': [0,7,0,7,0], '@': [4,6,7,6,4],
  '^': [2,7,2,2,0], '|': [0,2,2,7,2], '&': [2,7,7,7,2], "'": [2,2,0,0,0], '`': [0,5,2,5,0],
};
const _atlas = {};
function atlasOf(font, w, h, col) {
  const key = (font === FONT3 ? '3' : '5') + col;
  if (_atlas[key]) return _atlas[key];
  const keys = Object.keys(font);
  const c = document.createElement('canvas'); c.width = keys.length * (w + 1); c.height = h;
  const g = c.getContext('2d'); g.fillStyle = col;
  const idx = {};
  keys.forEach((k, i) => {
    idx[k] = i;
    font[k].forEach((row, y) => { for (let x = 0; x < w; x++) if (row & (1 << (w - 1 - x))) g.fillRect(i * (w + 1) + x, y, 1, 1); });
  });
  return (_atlas[key] = { c, idx, w, h });
}
function textWidth(s, scale = 1) { return String(s).length * 6 * scale - scale; }
function tinyWidth(s) { return String(s).length * 4 - 1; }
function _glyphs(a, s, x, y, sc) {
  for (const ch of s) {
    const i = a.idx[ch] ?? a.idx['?'];
    ctx.drawImage(a.c, i * (a.w + 1), 0, a.w, a.h, x, y, a.w * sc, a.h * sc);
    x += (a.w + 1) * sc;
  }
}
const _OL8 = [[-1,0],[1,0],[0,-1],[0,1],[1,1],[-1,1],[1,-1],[-1,-1]];
const _OL4 = [[-1,0],[1,0],[0,-1],[0,1]];
// opt: {align:'center'|'right', shadow:色, outline:色, scale:n, fine:true(半ドット単位)}
function text(s, x, y, col = WHITE, opt = {}) {
  s = String(s).toUpperCase();
  const sc = opt.scale || 1, w = textWidth(s, sc);
  if (opt.align === 'center') x -= Math.floor(w / 2); else if (opt.align === 'right') x -= w;
  x = Math.round(x); y = Math.round(y);
  if (opt.outline) for (const [dx, dy] of _OL8) _glyphs(atlasOf(FONT5, 5, 7, opt.outline), s, x + dx, y + dy, sc);
  if (opt.shadow) _glyphs(atlasOf(FONT5, 5, 7, opt.shadow), s, x + sc, y + sc, sc);
  _glyphs(atlasOf(FONT5, 5, 7, col), s, x, y, sc);
  return w;
}
// こまかい数字（物理ドット 2倍 → 論理 1倍のちょうど半分の大きさ）
function textFine(s, x, y, col = WHITE, opt = {}) {
  s = String(s).toUpperCase();
  const w = (s.length * 6 - 1) / 2;
  if (opt.align === 'center') x -= w / 2; else if (opt.align === 'right') x -= w;
  x = Math.round(x * 2) / 2; y = Math.round(y * 2) / 2;
  if (opt.outline) for (const [dx, dy] of _OL8) _glyphs(atlasOf(FONT5, 5, 7, opt.outline), s, x + dx / 2, y + dy / 2, 0.5);
  _glyphs(atlasOf(FONT5, 5, 7, col), s, x, y, 0.5);
  return w;
}
function tiny(s, x, y, col = WHITE, opt = {}) {
  s = String(s).toUpperCase();
  const w = tinyWidth(s);
  if (opt.align === 'center') x -= Math.floor(w / 2); else if (opt.align === 'right') x -= w;
  x = Math.round(x); y = Math.round(y);
  if (opt.outline) for (const [dx, dy] of _OL8) _glyphs(atlasOf(FONT3, 3, 5, opt.outline), s, x + dx, y + dy, 1);
  _glyphs(atlasOf(FONT3, 3, 5, col), s, x, y, 1);
  return w;
}

// ---- 日本語：ドット絵フォント（DotGothic16）を 1ドット単位で描く ----
const _jcache = new Map();
const JFONT = '"DotGothic16","Hiragino Sans","Hiragino Kaku Gothic ProN","Noto Sans JP","Noto Sans CJK JP",sans-serif';
function jimg(s, col, px) {
  const key = s + '|' + col + '|' + px;
  let c = _jcache.get(key);
  if (c) return c;
  c = document.createElement('canvas');
  const g = c.getContext('2d', { willReadFrequently: true });
  const font = `${px}px ${JFONT}`;
  g.font = font;
  c.width = Math.max(1, Math.ceil(g.measureText(s).width) + 2); c.height = px + 4;
  g.font = font; g.textBaseline = 'middle'; g.fillStyle = '#000'; g.fillText(s, 1, Math.round(c.height / 2));
  const id = g.getImageData(0, 0, c.width, c.height);
  const n = parseInt(col.slice(1), 16), r = n >> 16, gg = (n >> 8) & 255, b = n & 255;
  for (let i = 0; i < id.data.length; i += 4) {
    const on = id.data[i + 3] > 100;
    id.data[i] = r; id.data[i + 1] = gg; id.data[i + 2] = b; id.data[i + 3] = on ? 255 : 0;
  }
  g.putImageData(id, 0, 0);
  if (_jcache.size > 2000) _jcache.clear();
  _jcache.set(key, c);
  return c;
}
const _jpx = size => size >= 15 ? 32 : 16;
function jw(s, size = 10) { return jimg(String(s), INK, _jpx(size)).width / RS; }
// opt: {align, size, shadow, outline, thick}
function jtext(s, x, y, col = WHITE, opt = {}) {
  s = String(s);
  if (!s) return 0;
  const px = _jpx(opt.size || 10);
  const im = jimg(s, col, px);
  const m = ctx.getTransform();
  let rx = Math.round(x * RS + m.e);
  if (opt.align === 'center') rx -= Math.floor(im.width / 2); else if (opt.align === 'right') rx -= im.width;
  const ry = Math.round(y * RS + m.f) + (px > 16 ? -2 : 0);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (opt.outline) {
    const o = jimg(s, opt.outline, px);
    for (const [dx, dy] of _OL8) ctx.drawImage(o, rx + dx, ry + dy);
    if (opt.thick) for (const [dx, dy] of _OL8) ctx.drawImage(o, rx + dx * 2, ry + dy * 2);
  }
  if (opt.shadow) ctx.drawImage(jimg(s, opt.shadow, px), rx + 2, ry + 2);
  ctx.drawImage(im, rx, ry);
  ctx.restore();
  return im.width / RS;
}
// 折り返し（\n でも改行）
function jwrap(s, maxW, size = 10) {
  const out = [];
  for (const para of String(s).split('\n')) {
    let cur = '';
    for (const ch of para) {
      if (cur && jw(cur + ch, size) > maxW) {
        if ('、。！？」）ー…ょゃゅっぁぃぅぇぉャュョッァィゥェォ'.includes(ch)) { cur += ch; out.push(cur); cur = ''; continue; }
        out.push(cur); cur = ch;
      } else cur += ch;
    }
    out.push(cur);
  }
  return out;
}

// =========================================================
//  入力（Pocket Taco 実機：0=A 1=B 2=X 3=Y）
// =========================================================
const BTN = {
  A: 0, B: 1, X: 2, Y: 3, L1: 4, R1: 5, L2: 6, R2: 7, SELECT: 8, START: 9,
  L3: 10, R3: 11, UP: 12, DOWN: 13, LEFT: 14, RIGHT: 15, HOME: 16,
};
const BTN_NAME = Object.fromEntries(Object.entries(BTN).map(([k, v]) => [v, k]));
const KEYMAP = {
  ArrowUp: BTN.UP, ArrowDown: BTN.DOWN, ArrowLeft: BTN.LEFT, ArrowRight: BTN.RIGHT,
  KeyX: BTN.A, KeyZ: BTN.B, KeyS: BTN.X, KeyA: BTN.Y,
  KeyQ: BTN.L1, KeyW: BTN.L2, KeyE: BTN.R2, KeyR: BTN.R1,
  ShiftLeft: BTN.SELECT, ShiftRight: BTN.SELECT, Enter: BTN.START, Space: BTN.START,
};
const Input = {
  down: new Set(), prev: new Set(), hold: {}, raw: [], padId: '', keys: new Set(), latched: new Set(), tapped: false,
  poll() {
    const now = new Set([...this.keys, ...this.latched]);
    this.latched.clear();
    this.raw = [];
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const p of pads) {
      if (!p) continue;
      this.padId = p.id;
      p.buttons.forEach((b, i) => { if (b.pressed || b.value > 0.5) { now.add(i); this.raw.push(i); } });
      const [ax = 0, ay = 0] = p.axes;
      if (ax < -0.5) now.add(BTN.LEFT); if (ax > 0.5) now.add(BTN.RIGHT);
      if (ay < -0.5) now.add(BTN.UP); if (ay > 0.5) now.add(BTN.DOWN);
    }
    this.prev = this.down; this.down = now;
    for (const b of now) this.hold[b] = (this.hold[b] || 0) + 1;
    for (const b in this.hold) if (!now.has(+b)) this.hold[b] = 0;
    if (now.size && Audio_.ctx) Audio_.resume();
  },
  endFrame() { this.tapped = false; },
};
const btn = b => Input.down.has(b);
const btnp = b => Input.down.has(b) && !Input.prev.has(b);
const btnr = b => !Input.down.has(b) && Input.prev.has(b);
const btnrep = (b, delay = 14, rate = 5) => { const h = Input.hold[b] || 0; return h === 1 || (h > delay && (h - delay) % rate === 0); };
const anyp = (...bs) => bs.some(btnp);
function dirRep(delay = 12, rate = 5) {
  if (btnrep(BTN.UP, delay, rate)) return [0, -1];
  if (btnrep(BTN.DOWN, delay, rate)) return [0, 1];
  if (btnrep(BTN.LEFT, delay, rate)) return [-1, 0];
  if (btnrep(BTN.RIGHT, delay, rate)) return [1, 0];
  return null;
}
function anyNew() { for (const b of Input.down) if (!Input.prev.has(b)) return true; return false; }

addEventListener('keydown', e => { if (e.code in KEYMAP) { Input.keys.add(KEYMAP[e.code]); Input.latched.add(KEYMAP[e.code]); e.preventDefault(); } Audio_.unlock(); });
addEventListener('keyup', e => { if (e.code in KEYMAP) Input.keys.delete(KEYMAP[e.code]); });
addEventListener('pointerdown', () => { Input.tapped = true; Audio_.unlock(); });
addEventListener('touchstart', () => Audio_.unlock(), { passive: true });
addEventListener('blur', () => Input.keys.clear());

// =========================================================
//  サウンド（パルス波・三角波・サイン波・ノイズのチップチューン）
// =========================================================
const Audio_ = {
  ctx: null, master: null, sfxGain: null, musGain: null, waves: {},
  sound: Save.get('sound', true), musicOn: Save.get('music', true),
  song: null, step: 0, nextTime: 0, timer: null, noiseBuf: null,
  unlock() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.master = this.ctx.createGain(); this.master.gain.value = 0.5; this.master.connect(this.ctx.destination);
        this.sfxGain = this.ctx.createGain(); this.sfxGain.gain.value = this.sound ? 0.5 : 0; this.sfxGain.connect(this.master);
        this.musGain = this.ctx.createGain(); this.musGain.gain.value = this.musicOn ? 0.3 : 0; this.musGain.connect(this.master);
        // うすいエコー
        const dl = this.ctx.createDelay(0.5); dl.delayTime.value = 0.23;
        const fb = this.ctx.createGain(); fb.gain.value = 0.25;
        const wet = this.ctx.createGain(); wet.gain.value = 0.2;
        this.musGain.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(wet); wet.connect(this.master);
        const len = this.ctx.sampleRate;
        this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const d = this.noiseBuf.getChannelData(0);
        let v = 0; for (let i = 0; i < len; i++) { if (i % 3 === 0) v = Math.random() * 2 - 1; d[i] = v; }
        for (const [name, duty] of [['pulse12', 0.125], ['pulse25', 0.25]]) {
          const n = 48, re = new Float32Array(n), im = new Float32Array(n);
          for (let k = 1; k < n; k++) re[k] = 2 * Math.sin(Math.PI * k * duty) / (Math.PI * k);
          this.waves[name] = this.ctx.createPeriodicWave(re, im);
        }
        // オルゴールっぽい音（倍音すこし）
        { const re = new Float32Array([0, 1, 0.12, 0.3, 0.05, 0.08]), im = new Float32Array(6); this.waves.bell = this.ctx.createPeriodicWave(re, im); }
        // エレピっぽい音
        { const re = new Float32Array([0, 1, 0.5, 0.18, 0.1, 0.04, 0.02]), im = new Float32Array(7); this.waves.epiano = this.ctx.createPeriodicWave(re, im); }
        this.timer = setInterval(() => this.schedule(), 25);
      } catch (e) { return; }
    }
    this.resume();
  },
  resume() { if (this.ctx && this.ctx.state !== 'running') this.ctx.resume(); },
  setSound(on) { this.sound = on; Save.set('sound', on); if (this.sfxGain) this.sfxGain.gain.value = on ? 0.5 : 0; },
  setMusic(on) { this.musicOn = on; Save.set('music', on); if (this.musGain) this.musGain.gain.value = on ? 0.3 : 0; },
  duck(on) { if (this.musGain) this.musGain.gain.value = this.musicOn ? (on ? 0.1 : 0.3) : 0; },

  tone(freq, dur, { type = 'pulse25', vol = 0.3, slide = 0, delay = 0, out = null, attack = 0.004, vib = 0, pluck = false } = {}) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + delay;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    if (this.waves[type]) o.setPeriodicWave(this.waves[type]); else o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, slide), t + dur);
    if (vib && dur > 0.2) {
      const lfo = this.ctx.createOscillator(), lg = this.ctx.createGain();
      lfo.frequency.value = 5.5; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(freq * vib, t + dur * 0.6);
      lfo.connect(lg); lg.connect(o.frequency); lfo.start(t); lfo.stop(t + dur + 0.02);
    }
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + attack);
    if (!pluck) g.gain.setValueAtTime(vol, t + Math.max(attack, dur * 0.5));
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(out || this.sfxGain); o.start(t); o.stop(t + dur + 0.02);
  },
  noise(dur, { vol = 0.3, freq = 3000, delay = 0, out = null, slide = 0, type = 'lowpass', q = 1 } = {}) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + delay;
    const s = this.ctx.createBufferSource(); s.buffer = this.noiseBuf;
    const f = this.ctx.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(freq, t); f.Q.value = q;
    if (slide) f.frequency.exponentialRampToValueAtTime(slide, t + dur);
    const g = this.ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    s.connect(f); f.connect(g); g.connect(out || this.sfxGain); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02);
  },
  // pitch: 半音ずらし（連続得点で音が上がる など）
  sfx(name, pitch = 0) {
    if (!this.ctx || !this.sound) return;
    const k = Math.pow(2, pitch / 12);
    const T = (f, d, o) => this.tone(f * k, d, o), N = (d, o) => this.noise(d, o);
    switch (name) {
      case 'move': T(1046, 0.03, { vol: 0.08, type: 'pulse12' }); break;
      case 'cursor': T(1568, 0.025, { vol: 0.05, type: 'triangle' }); break;
      case 'select': T(1046, 0.05, { vol: 0.13 }); T(1568, 0.08, { vol: 0.11, delay: 0.05 }); break;
      case 'back': T(784, 0.05, { vol: 0.12 }); T(523, 0.07, { vol: 0.1, delay: 0.05 }); break;
      case 'deny': T(160, 0.12, { vol: 0.18, type: 'square' }); break;
      case 'pause': T(1318, 0.05, { vol: 0.12 }); T(988, 0.07, { vol: 0.12, delay: 0.06 }); break;
      case 'text': T(1400 + Math.random() * 200, 0.02, { vol: 0.05, type: 'pulse12' }); break;
      case 'whoosh': N(0.22, { vol: 0.1, freq: 800, slide: 4000, type: 'bandpass' }); break;
      case 'boot': T(523, 0.08, { vol: 0.13, type: 'pulse12' }); T(784, 0.08, { vol: 0.13, delay: 0.08, type: 'pulse12' }); T(1046, 0.08, { vol: 0.13, delay: 0.16, type: 'pulse12' }); T(1568, 0.6, { vol: 0.12, delay: 0.24, type: 'bell', vib: 0.01 }); break;
      case 'pop': T(600, 0.06, { vol: 0.14, slide: 1400, type: 'sine' }); break;
      case 'land': N(0.05, { vol: 0.12, freq: 1200 }); T(220, 0.05, { vol: 0.1, type: 'triangle' }); break;
      // ノノグラム
      case 'fill': T(330, 0.05, { vol: 0.12, type: 'triangle' }); N(0.03, { vol: 0.06, freq: 2500 }); break;
      case 'mark': T(880, 0.03, { vol: 0.05, type: 'pulse12' }); break;
      case 'erase': T(500, 0.04, { vol: 0.06, slide: 300, type: 'triangle' }); break;
      case 'mistake': T(180, 0.18, { vol: 0.18, slide: 120, type: 'square' }); N(0.12, { vol: 0.12, freq: 1200 }); break;
      case 'line': [1046, 1318].forEach((f, i) => T(f, 0.09, { vol: 0.07, delay: i * 0.04, type: 'bell', pluck: true })); break;
      case 'hint': [784, 988, 1318].forEach((f, i) => T(f, 0.12, { vol: 0.08, delay: i * 0.05, type: 'bell', pluck: true })); break;
      case 'undo': T(700, 0.05, { vol: 0.07, slide: 450, type: 'triangle' }); break;
      case 'flip': T(1200 + Math.random() * 600, 0.04, { vol: 0.035, type: 'bell', pluck: true }); break;
      case 'clear': [523, 659, 784, 1046, 1318, 1568].forEach((f, i) => T(f, 0.3, { vol: 0.1, delay: i * 0.07, type: 'bell', pluck: true })); break;
      case 'fanfare': [[523, 0], [659, 0.12], [784, 0.24], [1046, 0.36], [784, 0.54], [1046, 0.66], [1318, 0.84]].forEach(([f, d]) => { T(f, 0.3, { vol: 0.1, delay: d, type: 'pulse25' }); T(f / 2, 0.3, { vol: 0.08, delay: d, type: 'triangle' }); }); T(1568, 1.0, { vol: 0.08, delay: 1.0, type: 'bell', vib: 0.012 }); break;
      case 'unlock': [392, 523, 659, 784, 1046].forEach((f, i) => T(f, 0.1, { vol: 0.11, delay: i * 0.05 })); break;
      // カード
      case 'card': N(0.05, { vol: 0.12, freq: 4500, slide: 1500, type: 'bandpass' }); break;
      case 'deal': N(0.04, { vol: 0.08, freq: 5000, slide: 2000, type: 'bandpass' }); T(1800, 0.02, { vol: 0.03, type: 'triangle' }); break;
      case 'pick': T(880, 0.04, { vol: 0.09, type: 'triangle' }); T(1320, 0.05, { vol: 0.06, delay: 0.03, type: 'triangle' }); break;
      case 'unpick': T(660, 0.05, { vol: 0.07, type: 'triangle' }); break;
      case 'chip': T(1046, 0.07, { vol: 0.1, type: 'bell', pluck: true }); T(2093, 0.05, { vol: 0.04, delay: 0.01, type: 'sine' }); break;
      case 'mult': T(523, 0.09, { vol: 0.12, type: 'pulse25' }); T(784, 0.07, { vol: 0.07, delay: 0.03, type: 'pulse12' }); break;
      case 'xmult': T(392, 0.18, { vol: 0.14, slide: 1200, type: 'square' }); N(0.15, { vol: 0.1, freq: 3000, type: 'highpass' }); break;
      case 'cash': T(1976, 0.05, { vol: 0.1 }); T(2637, 0.12, { vol: 0.1, delay: 0.05 }); break;
      case 'buy': [1318, 1568, 2093].forEach((f, i) => T(f, 0.07, { vol: 0.09, delay: i * 0.04, type: 'bell', pluck: true })); break;
      case 'sell': [1568, 1318, 1046].forEach((f, i) => T(f, 0.06, { vol: 0.08, delay: i * 0.04, type: 'bell', pluck: true })); break;
      case 'shuffle': for (let i = 0; i < 6; i++) N(0.04, { vol: 0.06, freq: 4000 + i * 300, type: 'bandpass', delay: i * 0.035 }); break;
      case 'glass': [3136, 2637, 3520, 2349].forEach((f, i) => T(f, 0.1, { vol: 0.06, delay: i * 0.03, type: 'triangle' })); N(0.25, { vol: 0.14, freq: 7000, type: 'highpass' }); break;
      case 'boom': N(0.5, { vol: 0.35, freq: 1500, slide: 60 }); T(110, 0.4, { vol: 0.22, slide: 30, type: 'square' }); break;
      case 'fire': N(0.4, { vol: 0.22, freq: 1200, slide: 300, type: 'bandpass' }); break;
      case 'win': [523, 523, 523, 659, 784, 1046].forEach((f, i) => T(f, 0.18, { vol: 0.13, delay: [0, .12, .24, .36, .54, .72][i] })); break;
      case 'over': [392, 370, 349, 330, 262].forEach((f, i) => T(f, 0.28, { vol: 0.14, delay: i * 0.24, type: 'triangle' })); break;
      case 'levelup': [523, 659, 784, 659, 784, 1046].forEach((f, i) => T(f, 0.1, { vol: 0.12, delay: i * 0.07 })); break;
      case 'magic': T(300, 0.3, { vol: 0.12, slide: 1600, type: 'triangle' }); N(0.3, { vol: 0.07, freq: 6000, type: 'highpass' }); break;
      case 'bossin': [196, 185, 175, 165, 156].forEach((f, i) => T(f, 0.25, { vol: 0.17, delay: i * 0.16, type: 'square' })); break;
      case 'tick': T(2400, 0.015, { vol: 0.04, type: 'square' }); break;
    }
  },

  // ---- 音楽：16分音符ごとのトラッカー ----
  play(song) {
    if (this.song === song) return;
    this.song = song; this.step = 0;
    if (song && !song._parsed) {
      song._parsed = song.tracks.map(t => ({ ...t, notes: t.notes.trim().split(/\s+/) }));
      song._len = Math.max(...song._parsed.map(t => t.notes.length));
    }
    if (this.ctx) { this.nextTime = this.ctx.currentTime + 0.08; }
  },
  stop() { this.song = null; },
  schedule() {
    if (!this.ctx || !this.song || this.ctx.state !== 'running') return;
    const s = this.song, stepDur = 60 / s.bpm / 4;
    if (this.nextTime < this.ctx.currentTime - 0.2) this.nextTime = this.ctx.currentTime + 0.05;
    while (this.nextTime < this.ctx.currentTime + 0.12) {
      for (const t of s._parsed) {
        const tok = t.notes[this.step % t.notes.length];
        if (!tok || tok === '.' || tok === '-') continue;
        let len = 1; const ns = t.notes;
        while (ns[(this.step + len) % ns.length] === '-' && len < 32) len++;
        const dur = stepDur * len * (t.gate || 0.9);
        const swing = s.swing && (this.step & 1) ? s.swing * stepDur : 0;
        const delay = this.nextTime - this.ctx.currentTime + swing;
        if (t.wave === 'drum') {
          const M = this.musGain, v = t.vol;
          if (tok === 'K') this.tone(140, 0.12, { vol: v, slide: 45, type: 'sine', delay, out: M });
          else if (tok === 'S') this.noise(0.12, { vol: v * 0.8, freq: 2500, delay, out: M, type: 'bandpass' });
          else if (tok === 'h') this.noise(0.03, { vol: v * 0.4, freq: 8000, delay, out: M, type: 'highpass' });
          else if (tok === 'o') this.noise(0.12, { vol: v * 0.4, freq: 7000, delay, out: M, type: 'highpass' });
          else if (tok === 'b') this.noise(0.09, { vol: v * 0.35, freq: 5000, delay, out: M, type: 'bandpass', q: 0.7 });
          else if (tok === 'r') this.noise(0.16, { vol: v * 0.25, freq: 3500, delay, out: M, type: 'bandpass', q: 0.5 });
          else if (tok === 'c') { this.noise(0.05, { vol: v * 0.7, freq: 1400, delay, out: M, type: 'bandpass', q: 2 }); this.noise(0.09, { vol: v * 0.6, freq: 1300, delay: delay + 0.012, out: M, type: 'bandpass', q: 2 }); }
          else if (tok === 't') this.tone(220, 0.18, { vol: v, slide: 90, type: 'sine', delay, out: M });
          else if (tok === 'w') { this.noise(0.04, { vol: v * 0.9, freq: 1800, delay, out: M, type: 'bandpass', q: 9 }); this.tone(900, 0.04, { vol: v * 0.4, type: 'sine', delay, out: M }); }
        } else {
          // 和音（C4+E4+G4）
          for (const n of tok.split('+')) this.tone(noteFreq(n), Math.max(0.04, dur), { type: t.wave, vol: t.vol, delay, out: this.musGain, attack: t.attack || 0.006, vib: t.vib || 0, pluck: !!t.pluck });
        }
      }
      this.nextTime += stepDur;
      this.step = (this.step + 1) % s._len;
    }
  },
};
const NOTE_IDX = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
function noteFreq(tok) {
  const m = /^([A-G])([#b]?)(\d)$/.exec(tok);
  if (!m) return 440;
  const n = NOTE_IDX[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + (+m[3] + 1) * 12;
  return 440 * Math.pow(2, (n - 69) / 12);
}

// =========================================================
//  浮かぶ文字・画面ゆれ・パーティクル（2D）
// =========================================================
const FX = {
  texts: [], shakeAmt: 0,
  clear() { this.texts.length = 0; this.shakeAmt = 0; },
  // opt: {life, vy, j:日本語, outline, scale, fine}
  float(x, y, s, col = WHITE, opt = {}) { this.texts.push({ x, y, s: String(s), col, life: opt.life || 44, max: opt.life || 44, vy: opt.vy ?? -0.6, j: !!opt.j, ol: opt.outline ?? INK, scale: opt.scale || 1, pop: opt.pop ?? true }); },
  shake(a) { this.shakeAmt = Math.max(this.shakeAmt, a); },
  update() {
    for (const t of this.texts) { t.y += t.vy; t.vy *= 0.9; t.life--; }
    this.texts = this.texts.filter(t => t.life > 0);
    this.shakeAmt *= 0.85; if (this.shakeAmt < 0.05) this.shakeAmt = 0;
  },
  draw() {
    for (const t of this.texts) {
      if (t.life < 8 && t.life % 2) continue;
      const age = t.max - t.life;
      const sc = t.pop && age < 6 && t.scale === 1 && !t.j ? 2 : t.scale;
      if (t.j) jtext(t.s, t.x, t.y, t.col, { align: 'center', outline: t.ol, size: t.scale > 1 ? 16 : 10 });
      else text(t.s, t.x, t.y - (sc > 1 ? 3 : 0), t.col, { align: 'center', outline: t.ol, scale: sc });
    }
  },
};
const P = {
  list: [],
  clear() { this.list.length = 0; },
  // p: {x,y,vx,vy,life,col,size,grav,drag,shape:'sq'|'star'|'spark'}
  emit(p) { if (this.list.length < 900) this.list.push({ vx: 0, vy: 0, life: 30, size: 1, grav: 0, drag: 0.96, shape: 'sq', ...p, max: p.life || 30 }); },
  burst(x, y, n, o = {}) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, s = (o.speed || 2) * (0.3 + Math.random() * 0.7);
      this.emit({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - (o.up || 0), life: (o.life || 30) * (0.6 + Math.random() * 0.6), col: Array.isArray(o.col) ? pick(o.col) : o.col || WHITE, size: o.size || 1, grav: o.grav ?? 0.05, drag: o.drag ?? 0.94, shape: o.shape || 'sq' });
    }
  },
  update() {
    for (const p of this.list) { p.x += p.vx; p.y += p.vy; p.vy += p.grav; p.vx *= p.drag; p.vy *= p.drag; p.life--; }
    this.list = this.list.filter(p => p.life > 0);
  },
  draw() {
    for (const p of this.list) {
      const k = p.life / p.max;
      const s = p.size * (k < 0.3 ? 0.5 + k : 1);
      if (p.shape === 'star') {
        const r = Math.max(1, Math.round(s * 2));
        rect(p.x - r, p.y, r * 2 + 1, 1, p.col); rect(p.x, p.y - r, 1, r * 2 + 1, p.col);
        if (r > 1) rect(p.x - 1, p.y - 1, 3, 3, p.col);
      } else if (p.shape === 'spark') {
        frect(p.x, p.y, 0.5 + s * 0.5, 0.5 + s * 0.5, p.col);
      } else rect(p.x - s / 2, p.y - s / 2, Math.max(1, s), Math.max(1, s), p.col);
    }
  },
};

// =========================================================
//  表示（シャープ拡大：整数倍で拡大してから、なめらかに縮める）
// =========================================================
const screenCv = document.getElementById('screen');
const screenCtx = screenCv.getContext('2d', { alpha: false });
const _up = document.createElement('canvas'), _upx = _up.getContext('2d');
let _upK = 1, _scale = 1;
function resizeScreen() {
  const dpr = window.devicePixelRatio || 1;
  const area = document.getElementById('screen-area');
  const r = area.getBoundingClientRect();
  let s = Math.min((r.width - 2) * dpr / ui.width, (r.height - 2) * dpr / ui.height);
  s = Math.max(0.3, s);
  if (s >= 1 && s - Math.floor(s) < 0.06) s = Math.floor(s);
  _scale = s;
  screenCv.width = Math.round(ui.width * s); screenCv.height = Math.round(ui.height * s);
  screenCv.style.width = (screenCv.width / dpr) + 'px';
  screenCv.style.height = (screenCv.height / dpr) + 'px';
  _upK = Math.max(1, Math.ceil(s - 0.001));
  if (_upK !== s) { _up.width = ui.width * _upK; _up.height = ui.height * _upK; }
}
addEventListener('resize', resizeScreen);
function present(shake) {
  const c = screenCtx, w = screenCv.width, h = screenCv.height;
  let sx = 0, sy = 0;
  if (shake > 0) { sx = Math.round(rand(-shake, shake)) * RS * _scale; sy = Math.round(rand(-shake, shake)) * RS * _scale; c.fillStyle = '#000'; c.fillRect(0, 0, w, h); }
  if (_upK === _scale) {
    c.imageSmoothingEnabled = false;
    c.drawImage(ui, sx, sy, w, h);
  } else {
    _upx.imageSmoothingEnabled = false;
    _upx.drawImage(ui, 0, 0, _up.width, _up.height);
    c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high';
    c.drawImage(_up, sx, sy, w, h);
  }
}

let visible = 0.64, pcMode = false;
{ const v = parseFloat(Save.get('visible', 0.64)); if (v) visible = v; }
function setVisible(v) {
  visible = clamp(Math.round(v * 100) / 100, 0.3, 1);
  document.documentElement.style.setProperty('--visible', pcMode ? 1 : visible);
  Save.set('visible', visible);
  resizeScreen();
}

// =========================================================
//  シーン管理・ポーズ・メインループ
// =========================================================
const Engine = {
  scene: null, factory: null, t: 0, paused: false, pauseSel: 0, pauseItems: null, confirm: -1, confirmSel: 1,
  trans: 0, transNext: null, flashT: 0, flashCol: WHITE, fade: 0, showHelp: null,
  go(factory, instant = false) {
    if (instant) { this._enter(factory); return; }
    if (this.trans) return;
    this.trans = 1; this.transNext = factory;
  },
  _enter(factory) {
    if (this.scene && this.scene.exit) this.scene.exit();
    this.factory = factory; this.scene = factory(); this.paused = false; this.showHelp = null;
    FX.clear(); P.clear(); Audio_.duck(false);
    if (this.scene.enter) this.scene.enter();
  },
  restart() { this.go(this.factory); },
  toMenu() { this.go(() => Launcher()); },
  flash(n = 3, col = WHITE) { this.flashT = n; this.flashCol = col; },
  pause() {
    const s = this.scene;
    if (!s || this.paused || this.trans || s.pausable === false) return;
    this.paused = true; this.pauseSel = 0; this.confirm = -1; this.showHelp = null;
    const items = s.pauseItems ? s.pauseItems() : [
      { jp: 'つづける', act: () => this.resume() },
      { jp: 'さいしょから', act: () => this.restart(), ask: s.askQuit },
      { jp: 'メニューへ', act: () => this.toMenu(), ask: s.askQuit },
    ];
    // そうさ説明（ゲームが controls を持っていれば）
    const g = s.game || null;
    if (g && g.controls && !items.some(i => i.help)) items.splice(1, 0, { jp: 'そうさの説明', help: true, act: () => { this.paused = true; this.showHelp = g; } });
    this.pauseItems = items;
    Audio_.sfx('pause'); Audio_.duck(true);
  },
  resume() { this.paused = false; Audio_.duck(false); },
  update() {
    Input.poll();
    this.t++;
    if (this.trans) {
      this.trans++;
      const t = this.trans;
      if (t === 13) this._enter(this.transNext);
      this.fade = t <= 12 ? t / 12 : Math.max(0, 1 - (t - 13) / 12);
      if (t >= 25) { this.trans = 0; this.fade = 0; }
      Input.endFrame();
      return;
    }
    const s = this.scene;
    if (this.paused) { this.updatePause(); Input.endFrame(); return; }
    if (s.pausable !== false && btnp(BTN.START) && !(s.canPause && !s.canPause())) { this.pause(); Input.endFrame(); return; }
    s.update();
    FX.update();
    P.update();
    if (this.flashT > 0) this.flashT--;
    Input.endFrame();
  },
  updatePause() {
    if (this.showHelp) { if (anyp(BTN.A, BTN.B, BTN.START)) { this.showHelp = null; Audio_.sfx('back'); } return; }
    const items = this.pauseItems, n = items.length;
    if (this.confirm >= 0) {
      if (btnp(BTN.LEFT) || btnp(BTN.RIGHT) || btnp(BTN.UP) || btnp(BTN.DOWN)) { this.confirmSel ^= 1; Audio_.sfx('move'); }
      if (btnp(BTN.B)) { this.confirm = -1; Audio_.sfx('back'); return; }
      if (btnp(BTN.A)) {
        if (this.confirmSel === 0) { Audio_.sfx('select'); const it = items[this.confirm]; this.confirm = -1; this.paused = false; Audio_.duck(false); it.act(); }
        else { this.confirm = -1; Audio_.sfx('back'); }
      }
      return;
    }
    if (btnrep(BTN.UP)) { this.pauseSel = (this.pauseSel + n - 1) % n; Audio_.sfx('move'); }
    if (btnrep(BTN.DOWN)) { this.pauseSel = (this.pauseSel + 1) % n; Audio_.sfx('move'); }
    if (btnp(BTN.START) || btnp(BTN.B)) { this.resume(); Audio_.sfx('back'); return; }
    if (btnp(BTN.A)) {
      const it = items[this.pauseSel];
      if (it.ask) { this.confirm = this.pauseSel; this.confirmSel = 1; Audio_.sfx('select'); return; }
      Audio_.sfx('select');
      if (!it.help) { this.paused = false; Audio_.duck(false); }
      it.act();
    }
  },
  draw() {
    uiBegin();
    this.scene.draw();
    if (!this.scene.noFX) { P.draw(); FX.draw(); }
    if (this.paused) { if (this.showHelp) drawControls(this.showHelp, true); else this.drawPause(); }
    if (this.flashT > 0) { ctx.globalAlpha = 0.7; rect(0, 0, W, H, this.flashCol); ctx.globalAlpha = 1; }
    if (this.fade > 0) { ctx.globalAlpha = this.fade; rect(0, 0, W, H, '#0c0a14'); ctx.globalAlpha = 1; }
    present(this.paused ? 0 : FX.shakeAmt);
  },
  drawPause() {
    ctx.globalAlpha = 0.72; rect(0, 0, W, H, '#0c0a14'); ctx.globalAlpha = 1;
    const items = this.pauseItems, n = items.length;
    const h = 40 + n * 18, y0 = Math.round((H - h) / 2);
    panel(36, y0, W - 72, h);
    text('PAUSE', W / 2, y0 + 10, GOLD, { align: 'center' });
    items.forEach((it, i) => {
      const y = y0 + 28 + i * 18, on = i === this.pauseSel;
      if (on) { rect(44, y - 2, W - 88, 15, SLATE); text('@', 48 + ((this.t >> 4) & 1), y + 2, GOLD); }
      jtext(it.jp, 60, y, on ? WHITE : GRAY);
    });
    if (this.confirm >= 0) {
      panel(54, y0 + h - 6, W - 108, 40, DRED);
      jtext('ほんとうに？', W / 2, y0 + h + 2, WHITE, { align: 'center' });
      ['はい', 'いいえ'].forEach((s, i) => {
        const x = 84 + i * 50, on = i === this.confirmSel;
        if (on) text('@', x - 10, y0 + h + 19, GOLD);
        jtext(s, x, y0 + h + 17, on ? WHITE : PINK);
      });
    }
  },
};
document.addEventListener('visibilitychange', () => {
  if (document.hidden && Engine.scene && !window.NO_AUTOPAUSE) {
    if (Engine.scene.onHide) Engine.scene.onHide();
    Engine.pause();
  }
});

// ---- ボタンのアイコン（そうさ説明で使う）----
const BTN_COL = { A: RED, B: GOLD, X: SKY, Y: LIME };
function btnIcon(name, x, y) {
  if (name in BTN_COL) { circle(x + 6, y + 6, 6, INK); circle(x + 6, y + 6, 5, BTN_COL[name]); text(name, x + 4, y + 3, INK); return 13; }
  if (name === '十字') {
    rect(x + 4, y, 5, 13, INK); rect(x, y + 4, 13, 5, INK);
    rect(x + 5, y + 1, 3, 11, LIGHT); rect(x + 1, y + 5, 11, 3, LIGHT); return 13;
  }
  const w = tinyWidth(name) + 6;
  rbox(x, y + 1, w, 11, LIGHT, INK, 2); tiny(name, x + 3, y + 4, INK);
  return w;
}
// そうさ説明の画面（game.controls = [[ボタン, せつめい], ...]）
function drawControls(g, overlay = false) {
  if (overlay) { ctx.globalAlpha = 0.8; rect(0, 0, W, H, '#0c0a14'); ctx.globalAlpha = 1; }
  const list = g.controls;
  const h = 44 + list.length * 18;
  const y0 = Math.max(6, Math.round((H - h) / 2));
  panel(8, y0, W - 16, h);
  rect(14, y0 + 7, W - 28, 15, g.col || GOLD);
  jtext(g.jp + ' のそうさ', W / 2, y0 + 9, INK, { align: 'center' });
  list.forEach(([b, d], i) => {
    const y = y0 + 30 + i * 18;
    let x = 18;
    for (const name of b.split('+')) x += btnIcon(name, x, y) + 2;
    jtext(d, 84, y + 1, WHITE);
  });
  if (overlay) jtext('A / B: とじる', W / 2, y0 + h - 14, GRAY, { align: 'center' });
}

let _acc = 0, _last = 0;
const STEP = 1000 / 60;
function frame(ts) {
  if (!_last) _last = ts;
  _acc += Math.min(100, ts - _last); _last = ts;
  let n = 0;
  while (_acc >= STEP && n < 4) { Engine.update(); _acc -= STEP; n++; }
  if (n === 4) _acc = 0;
  if (n > 0) Engine.draw();
  requestAnimationFrame(frame);
}

// ゲームを登録する場所
const GAMES = [];
