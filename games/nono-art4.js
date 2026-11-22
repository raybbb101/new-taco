'use strict';
// =========================================================
//  ノノグラム・アトリエの絵 ★★★★ マスター（40×40 = 16ピース）
// =========================================================
(() => {
  const D = NONO.paint;
  const K = '#1d1629';
  const pine = (P, cx, base, hgt, col, snow = null) => {
    for (let y = 0; y < hgt; y++) {
      const half = 0.4 + y * 0.38 - ((y % 4 === 3) ? 0.7 : 0);
      for (let x = Math.round(cx - half); x <= Math.round(cx + half); x++) P.set(x, base - hgt + y, col, 1);
      if (snow && y % 4 === 1) { P.set(Math.round(cx - half), base - hgt + y, snow, 1); P.set(Math.round(cx + half), base - hgt + y, snow, 1); }
    }
  };

  D(4, 'moonlake', 'つきよの みずうみ', 40, 40, P => {
    P.vgrad(0, 26, ['#0b1030', '#16194a', '#262a66', '#3c3478', '#5a4488', '#7a5498'], 0);
    for (const [x, y, w] of [[1, 6, 9], [3, 5, 5], [10, 12, 8], [12, 11, 4], [0, 15, 6], [20, 3, 6]]) P.rect(x, y, w, 1, '#4a4290', 1);
    for (let i = 0; i < 30; i++) { const x = (i * 17 + 3) % 40, y = (i * 11 + 1) % 20; if (P.inkAt(x, y)) continue; P.set(x, y, i % 4 ? '#d8d8ff' : '#ffffff', 1); }
    for (const [x, y] of [[6, 2], [17, 8]]) { P.set(x - 1, y, '#ffffff', 1); P.set(x + 1, y, '#ffffff', 1); P.set(x, y - 1, '#ffffff', 1); P.set(x, y + 1, '#ffffff', 1); P.set(x, y, '#ffffff', 1); }
    P.line(24, 13, 33, 16, '#cfd8ff', 1);
    P.circle(30, 8, 6.4, '#4c4a92', 0); P.circle(30, 8, 5.4, '#6a64a8', 0);
    P.circle(30, 8, 4.4, '#fff4c8', 1);
    P.circle(28.6, 7, 1, '#e8dca8', 0); P.circle(31.6, 9.6, 0.8, '#e8dca8', 0); P.set(31, 6, '#e8dca8', 0);
    P.poly([[0, 24], [6, 15], [10, 19], [16, 12], [22, 19], [26, 16], [32, 21], [36, 17], [40, 21], [40, 28], [0, 28]], '#3a3a7a', 0);
    P.poly([[14.5, 13.5], [16, 12], [17.6, 13.6], [16, 15], [15, 14.6]], '#e0e0ff', 1);
    P.poly([[5, 16.5], [6, 15], [7.2, 16.4], [6, 17.2]], '#e0e0ff', 1);
    P.poly([[0, 26], [8, 21], [15, 24], [24, 22], [32, 25], [40, 23], [40, 30], [0, 30]], '#232458', 0);
    [[2, 28, 9], [5, 28, 7], [9, 29, 8], [13, 29, 5], [17, 29, 6], [20, 29, 4], [23, 29, 6], [27, 28, 6], [31, 29, 9], [35, 28, 7], [38, 29, 8]].forEach(([x, b, h]) => pine(P, x, b, h, '#101634'));
    P.rect(0, 29, 40, 1, '#101634', 1);
    P.vgrad(30, 40, ['#1c2a60', '#14204c', '#0c1436'], 1);
    for (let y = 31; y < 40; y += 2) { const half = 2.2 + (y - 31) * 0.25, off = (y * 3) % 2; P.rect(Math.round(30 - half + off), y, Math.round(half * 2) - 1, 1, y < 35 ? '#fff4c8' : '#d8c890', 0); }
    for (const [x, y, w] of [[2, 32, 5], [10, 35, 4], [16, 33, 3], [4, 38, 3], [36, 36, 3], [21, 39, 4]]) P.rect(x, y, w, 1, '#3a4a8a', 0);
    P.poly([[10, 34], [18, 34], [16.5, 36], [11.5, 36]], '#5a3a2a', 1);
    P.rect(14, 30, 1, 4, '#5a3a2a', 1); P.rect(15, 31, 2, 2, '#ffd23d', 1);
    P.set(16, 37, '#ffd23d', 0); P.set(15, 38, '#c8a040', 0);
  });

  D(4, 'sunset', 'ゆうやけの うみ', 40, 40, P => {
    P.vgrad(0, 25, ['#2a2068', '#5a2a80', '#a03a88', '#e05a78', '#ff8a5a', '#ffb860', '#ffe08a'], 0);
    const cloud = (x, y, w, c1, c2) => { P.rect(x, y, w, 2, c1, 1); P.rect(x + 2, y - 1, w - 5, 1, c1, 1); P.rect(x + 1, y + 2, w - 3, 1, c2, 1); };
    cloud(2, 4, 14, '#6a3a8a', '#ff9a8a'); cloud(22, 7, 15, '#8a3a8a', '#ffb08a'); cloud(8, 12, 10, '#b04a80', '#ffc08a'); cloud(26, 15, 11, '#d0607a', '#ffd89a');
    P.rect(0, 9, 5, 1, '#6a3a8a', 1); P.rect(34, 2, 6, 1, '#4a2a7a', 1);
    P.circle(20, 25, 6.6, '#ffefa0', 1);
    P.vgrad(25, 40, ['#5a2a6a', '#3a1a5a', '#22104a'], 1);
    for (let y = 26; y < 40; y += 2) { const half = Math.max(1.2, 6.5 - (y - 26) * 0.4); P.rect(Math.round(20 - half), y, Math.round(half * 2), 1, y < 31 ? '#ffe08a' : '#ff9a5a', 0); }
    for (const [x, y, w] of [[2, 27, 6], [30, 28, 5], [5, 31, 4], [33, 33, 4], [1, 36, 5], [28, 38, 6], [12, 34, 2]]) P.rect(x, y, w, 1, '#8a4a7a', 0);
    const sil = '#1a0e2a';
    P.poly([[26, 26], [30, 23], [36, 22.5], [40, 23], [40, 27], [26, 27]], sil, 1);
    for (const [bx, top, lean] of [[32, 13, -1], [36, 15, 1]]) {
      for (let y = top; y < 24; y++) P.set(bx + Math.round((24 - y) * 0.12 * lean), y, sil, 1);
      const tx = bx + Math.round((24 - top) * 0.12 * lean);
      for (const [dx, dy] of [[-4, 2], [-3, 1], [-2, 0], [-1, 0], [1, 0], [2, 0], [3, 1], [4, 2], [-2, 1], [2, 1], [0, -1], [-1, -1], [1, -1]]) P.set(tx + dx, top + dy, sil, 1);
    }
    P.rect(7, 13, 1, 13, sil, 1);
    P.poly([[8, 14], [13, 24], [8, 24]], sil, 1); P.poly([[6, 16], [3, 24], [6, 24]], sil, 1);
    P.poly([[2, 25], [14, 25], [12, 27], [4, 27]], sil, 1);
    for (const [x, y] of [[15, 6], [19, 9], [30, 4], [10, 18]]) { P.set(x, y, sil, 1); P.set(x + 1, y + 1, sil, 1); P.set(x + 2, y, sil, 1); P.set(x - 1, y - 1, sil, 1); P.set(x + 3, y - 1, sil, 1); }
  });

  D(4, 'pagoda', 'ふじと五重塔', 40, 40, P => {
    P.vgrad(0, 30, ['#9fd0ff', '#c8e6ff', '#eaf6ff'], 0);
    P.poly([[0, 30], [12, 12], [19, 9], [24, 12], [38, 30]], '#5a7ac8', 1);
    P.poly([[12, 12], [19, 9], [24, 12], [26, 16], [23.5, 15], [21.5, 17], [19.5, 15], [17, 17.5], [15, 15.2], [12.5, 17], [10.5, 15.2]], '#ffffff', 1);
    P.rim('#5a7ac8', '#4a62a8', 1, 0, true);
    for (const [x, y, w] of [[0, 25, 14], [16, 26, 22], [4, 27, 10]]) { P.rect(x, y, w, 2, '#ffffff', 0); P.rect(x + 2, y - 1, w - 4, 1, '#ffffff', 0); }
    P.poly([[0, 31], [10, 28], [22, 30], [40, 28], [40, 40], [0, 40]], '#3f7a4a', 0);
    for (const [x, y, w] of [[16, 35, 6], [22, 38, 8], [3, 33, 3]]) P.rect(x, y, w, 1, '#2f5a3a', 1);
    for (const [x, y] of [[8, 31], [14, 33], [20, 32], [4, 35], [17, 37]]) { P.rect(x, y, 3, 2, '#f4ecd6', 1); P.rect(x, y - 1, 3, 1, '#5a3a3a', 1); P.set(x + 1, y + 1, '#ffd23d', 0); }
    const roof = '#3a2a32', wall = '#e0482a', gold = '#ffd23d';
    P.rect(31, 2, 1, 6, gold, 1); for (const y of [3, 5]) P.rect(30, y, 3, 1, gold, 1);
    const tiers = [[8, 5], [13, 6], [18, 7], [23, 8], [28, 9]];
    tiers.forEach(([y, half], i) => {
      P.poly([[31.5 - half - 2.5, y + 1], [31.5 + half + 2.5, y + 1], [31.5 + half, y - 1], [31.5 - half, y - 1]], roof, 1);
      P.set(Math.round(31.5 - half - 3), y, roof, 1); P.set(Math.round(31.5 + half + 2), y, roof, 1);
      P.rect(Math.round(31.5 - half + 1.5), y + 2, Math.round(half * 2 - 3), 3, wall, 1);
      P.set(31, y + 3, '#ffe9a0', 0); P.set(Math.round(31.5 - half + 2.5), y + 3, '#7a2a1a', 1);
    });
    P.rect(26, 33, 12, 2, '#9a8a80', 1);
    const sak = ['#ffd0e0', '#ffb0cc', '#f08ab0'];
    for (const [x, y, r] of [[2, 30, 5], [7, 34, 4.5], [0, 37, 4], [13, 38, 4], [38, 37, 4.5], [35, 40, 4]]) {
      P.circle(x, y, r, sak[1], 1); P.circle(x - 1, y - 1, r * 0.6, sak[0], 1);
    }
    P.rim(sak[1], sak[2], 0, 1, true);
    for (const [x, y] of [[5, 22], [9, 20], [3, 18], [12, 24], [27, 36], [24, 33], [20, 38], [2, 14]]) P.set(x, y, sak[2], 1);
    for (const [x, y] of [[3, 31], [7, 33], [1, 38], [36, 37]]) P.set(x, y, '#ffffff', 0);
  });

  D(4, 'deepsea', 'うみのそこ', 40, 40, P => {
    P.vgrad(0, 40, ['#5ae0e8', '#2aa8d8', '#1a6ab8', '#16408a', '#122a64'], 0);
    for (let i = 0; i < 4; i++) for (let y = 0; y < 24; y++) { const x = 4 + i * 10 + y * 0.45; P.set(x, y, '#8af0f8', 0); P.set(x + 1, y, '#7ae8f4', 0); }
    const wh = '#3a6aa8', whD = '#2a4a88', belly = '#d8ecff';
    P.ellipse(18, 11, 13, 5.5, wh, 1);
    P.poly([[30, 9], [37, 4], [36, 9], [39, 13], [31, 13]], wh, 1);
    P.ellipse(16, 14, 9, 2.6, belly, 1);
    for (let x = 9; x < 24; x += 2) P.set(x, 14, '#a8c8e8', 1);
    P.poly([[14, 15], [19, 15], [15, 20]], whD, 1);
    P.set(9, 10, K, 0); P.set(8, 10, '#ffffff', 0);
    P.rim(wh, whD, 0, -1, true);
    for (const [x, y] of [[33, 20], [35, 22], [31, 23], [36, 25], [33, 26]]) { P.rect(x, y, 2, 1, '#ffd23d', 1); P.set(x + 2, y, '#ffb020', 1); P.set(x - 1, y, '#ffd23d', 1); }
    const jelly = (cx, cy) => { P.ellipse(cx, cy, 2.6, 2, '#ff9fd0', 1); P.rect(cx - 2, cy, 5, 1, '#ff9fd0', 1); for (const dx of [-2, 0, 2]) for (let y = 1; y < 5; y++) P.set(cx + dx + (y % 2), cy + y, '#f070b0', 1); P.set(cx - 1, cy - 1, '#ffffff', 0); };
    jelly(5, 21); jelly(10, 25);
    for (const [x, y] of [[26, 4], [27, 2], [5, 4], [24, 21], [22, 26], [20, 18]]) P.circle(x, y, 0.8, '#d8faff', 0);
    P.vgrad(35, 40, ['#e8c890', '#c8a070'], 1);
    for (const [x, y] of [[4, 38], [17, 39], [30, 38], [36, 37]]) P.set(x, y, '#fff0d0', 0);
    const coral = (bx, by, h, c) => { P.rect(bx, by - h, 2, h, c, 1); P.rect(bx - 2, by - h + 2, 2, 1, c, 1); P.rect(bx - 2, by - h, 1, 3, c, 1); P.rect(bx + 2, by - h + 3, 2, 1, c, 1); P.rect(bx + 3, by - h + 1, 1, 3, c, 1); };
    coral(4, 36, 7, '#ff6a6a'); coral(13, 36, 6, '#ff9a4a'); coral(26, 36, 8, '#f070b0'); coral(35, 36, 6, '#9a5ce0');
    for (const bx of [8, 19, 22, 31, 38]) for (let y = 26; y < 36; y++) P.set(bx + (Math.floor(y / 2) % 2), y, '#3fb86a', 1);
    P.ellipse(17, 34.5, 3, 1.6, '#c86a3a', 1); P.rect(15, 33, 4, 1, '#ffd23d', 1); P.set(17, 34, '#ffd23d', 0);
    P.poly([[29, 37], [30, 35], [31, 37], [33, 37.5], [31, 38.5], [31.5, 40], [30, 39], [28.5, 40], [29, 38.5], [27, 37.5]], '#ff8a4a', 1);
  });

  D(4, 'aurora', 'オーロラの よる', 40, 40, P => {
    P.vgrad(0, 30, ['#060a24', '#0c1438', '#14204c', '#1c2c5a'], 0);
    for (let i = 0; i < 24; i++) { const x = (i * 23 + 7) % 40, y = (i * 13 + 2) % 26; P.set(x, y, '#ffffff', 1); }
    const auro = ['#5affb0', '#3ae0c0', '#2ab8d8', '#a070e8', '#f070c8'];
    for (let x = 0; x < 40; x++) {
      const c = 7 + Math.sin(x * 0.22) * 3 + Math.sin(x * 0.07 + 1) * 2;
      const hgt = 5 + Math.round(Math.sin(x * 0.5) * 1.5 + 1.5);
      for (let k = 0; k < hgt; k++) { const y = Math.round(c - hgt / 2 + k); P.set(x, y, auro[Math.min(4, Math.floor(k / hgt * 3 + (x % 3 === 0 ? 1 : 0)))], 1); }
      if (x % 4 === 1) P.set(x, Math.round(c + hgt / 2), '#3ae0c0', 1);
      if (x % 5 === 2) P.set(x, Math.round(c - hgt / 2) - 1, '#a070e8', 0);
    }
    P.poly([[0, 26], [7, 16], [12, 20], [19, 13], [26, 21], [31, 17], [40, 25], [40, 32], [0, 32]], '#d8e4f8', 0);
    for (const [px, py] of [[19, 13], [7, 16], [31, 17]]) for (let k = 0; k < 4; k++) P.rect(px - k, py + k, k * 2 + 1, 1, '#ffffff', 1);
    P.rim('#d8e4f8', '#9ab0d8', 1, 0, true);
    for (const [x, y] of [[19, 13], [7, 16], [31, 17]]) { P.set(x, y, '#ffffff', 1); P.set(x - 1, y + 1, '#ffffff', 1); P.set(x + 1, y + 1, '#ffffff', 1); }
    for (const [x, y, w] of [[15, 22, 3], [24, 24, 2], [4, 24, 3], [33, 23, 3]]) P.rect(x, y, w, 1, '#8aa0c8', 0);
    [[2, 33, 9], [6, 34, 8], [10, 33, 6], [14, 33, 5], [25, 33, 5], [29, 33, 7], [33, 34, 9], [37, 33, 8]].forEach(([x, b, h]) => pine(P, x, b, h, '#0f2a2a', '#e8f0ff'));
    P.rect(17, 28, 6, 5, '#6a3a2a', 1); P.poly([[16, 28.5], [20, 25], [24, 28.5]], '#e8f0ff', 1); P.set(18, 30, '#ffd23d', 0); P.set(19, 30, '#ffd23d', 0); P.rect(21, 30, 1, 3, '#3a2010', 1);
    P.rect(0, 33, 40, 1, '#5a7ab0', 1);
    P.vgrad(34, 40, ['#8ab0d8', '#6a90c0'], 1);
    for (let x = 0; x < 40; x += 3) { P.set(x, 35 + (x % 2), '#5affb0', 0); P.set(x + 1, 37 + (x % 3 === 0 ? 1 : 0), '#a070e8', 0); }
  });

  D(4, 'festival', 'なつまつりの夜', 40, 40, P => {
    P.vgrad(0, 30, ['#0e0a2a', '#1a1240', '#2a1a52', '#3a2060'], 0);
    const burst = (cx, cy, r, c1, c2) => {
      for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2 + 0.2; for (let d = 2; d <= r; d++) { P.set(cx + Math.cos(a) * d, cy + Math.sin(a) * d, d > r * 0.6 ? c2 : c1, 1); } }
      P.set(cx, cy, '#ffffff', 1);
    };
    burst(10, 8, 7, '#ffe156', '#ff7a4a'); burst(29, 6, 6, '#9affd0', '#3ae0c0'); burst(21, 15, 5, '#ff9fd0', '#f070b0');
    for (const [x, y] of [[36, 14], [2, 17], [33, 1], [17, 2]]) P.set(x, y, '#d8d0ff', 1);
    for (let x = 0; x < 40; x++) P.set(x, Math.round(20 + Math.cos((x - 20) / 20 * Math.PI) * -2), '#1a1020', 1);
    for (let i = 0; i < 7; i++) {
      const x = 2 + i * 6, y = Math.round(21 + Math.cos((x - 20) / 20 * Math.PI) * -2);
      P.rect(x, y + 1, 3, 4, i % 2 ? '#e8384a' : '#ff8a3a', 1); P.rect(x, y + 1, 3, 1, K, 1); P.rect(x, y + 4, 3, 1, K, 1);
      P.set(x + 1, y + 2, '#fff2a0', 0); P.set(x + 1, y + 3, '#ffe156', 0);
    }
    const stall = (x0, w, c1) => {
      for (let i = 0; i < w; i++) P.rect(x0 + i, 27, 1, 3, Math.floor(i / 2) % 2 ? '#ffffff' : c1, 1);
      for (let i = 0; i < w; i += 2) P.set(x0 + i, 30, c1, 1);
      P.rect(x0, 31, w, 6, '#ffd890', 0);
      P.rect(x0 + 1, 33, 2, 2, '#ff6a3d', 0); P.rect(x0 + w - 4, 32, 2, 3, '#3a8ae8', 0);
      P.rect(x0, 31, 1, 9, '#6e3b30', 1); P.rect(x0 + w - 1, 31, 1, 9, '#6e3b30', 1);
      P.rect(x0, 36, w, 4, '#a0603a', 1); P.rect(x0 + 2, 37, w - 4, 1, '#7a4428', 0);
    };
    stall(1, 16, '#e8384a'); stall(23, 16, '#3a6ae8');
    P.rect(17, 30, 6, 10, '#3a2a4a', 1);
    for (const [x, y] of [[18, 32], [21, 34], [19, 37]]) P.set(x, y, '#ffd23d', 0);
    P.rect(19, 25, 2, 5, '#2a1a30', 1); P.circle(20, 24, 1.6, '#2a1a30', 1);
  });

  D(4, 'space', 'ほしの こうかい', 40, 40, P => {
    P.vgrad(0, 40, ['#05051a', '#100a2a', '#1e0e3a', '#140a30', '#070718'], 0);
    for (let y = 0; y < 40; y++) for (let x = 0; x < 40; x++) { const d = Math.abs(y - 26 + x * 0.55 - 11); if (d < 2.6) P.set(x, y, d < 1.2 ? '#4a2470' : '#341a5a', 1); }
    for (let i = 0; i < 34; i++) { const x = (i * 29 + 11) % 40, y = (i * 17 + 5) % 40; P.set(x, y, i % 5 ? '#d8d8ff' : '#ffe9a0', 1); }
    P.circle(14, 19, 8.4, '#f2a93b', 1);
    for (let y = 11; y < 28; y++) for (let x = 5; x < 24; x++) { const dx = x + 0.5 - 14, dy = y + 0.5 - 19; if (dx * dx + dy * dy <= 70) { const band = Math.floor((y - 11 + Math.round(dx * 0.15)) / 3) % 3; P.set(x, y, ['#ffd27a', '#f2a93b', '#d0782a'][band], 1); } }
    for (let x = 0; x < 30; x++) { const y = Math.round(19 + (x - 14) * 0.28); const dx = x - 14; if (Math.abs(dx) > 7 || (dx > -7 && dx < 7 && y > 19)) { P.set(x, y, '#e2d2f8', 1); P.set(x, y + 1, '#a888d8', 1); } }
    P.circle(31, 7, 3, '#c9cfe0', 1); P.circle(30, 6, 0.9, '#9a98ad', 0); P.set(32, 8, '#9a98ad', 0);
    P.line(23, 2, 33, 14, '#a8f0ff', 0);
    P.circle(22, 2, 1.6, '#ffffff', 1);
    P.line(21, 1, 14, 0, '#7ad8ff', 1); P.line(21, 3, 15, 4, '#5ab8f0', 1);
    P.circle(35, 36, 9, '#2f8fe6', 1);
    for (const [x, y, r] of [[31, 31, 2.6], [36, 33, 2], [29, 36, 2.4], [38, 29, 1.6]]) P.circle(x, y, r, '#4ab85a', 1);
    P.circle(32, 30, 1, '#ffffff', 0); P.rect(28, 33, 3, 1, '#ffffff', 0);
    P.ellipse(31, 22, 1.4, 3, '#eef2fa', 1); P.set(31, 21, '#3a8ae8', 0); P.poly([[29.5, 24], [32.5, 24], [31, 26.5]], '#ff8a3a', 1); P.set(31, 19, '#e8384a', 1);
  });

  D(4, 'octokingdom', 'タコの王国', 40, 40, P => {
    P.vgrad(0, 40, ['#6ae8f0', '#3ac0e0', '#2a8ad0', '#1e5ab0', '#1a3a8a'], 0);
    for (let i = 0; i < 3; i++) for (let y = 0; y < 22; y++) { const x = 6 + i * 13 + y * 0.4; P.set(x, y, '#9af4f8', 0); }
    const wall = '#ff9ab8', wallD = '#e06a98', gold = '#ffd23d', goldD = '#e0a020';
    const tower = (cx, top, w) => {
      P.rect(cx - w / 2, top, w, 30 - top, wall, 1);
      P.ellipse(cx, top, w / 2 + 0.6, 3, gold, 1); P.rect(cx, top - 5, 1, 3, gold, 1); P.set(cx, top - 6, '#ffffff', 1);
      for (let y = top + 3; y < 28; y += 5) { P.rect(cx - 1, y, 2, 2, '#1a3a8a', 0); }
    };
    tower(6, 10, 6); tower(34, 10, 6); tower(14, 6, 6); tower(26, 6, 6);
    P.rect(9, 14, 22, 16, wall, 1);
    for (let x = 9; x < 31; x += 3) P.rect(x, 13, 2, 1, wall, 1);
    P.ellipse(20, 8, 5, 4, gold, 1); P.rect(20, 1, 1, 4, gold, 1); P.set(19, 2, gold, 1); P.set(21, 2, gold, 1);
    P.rim(wall, wallD, 1, 0, true); P.rim(gold, goldD, 0, 1, true);
    P.ellipse(20, 26, 3.4, 5, '#1a2a6a', 0);
    for (const [x, y] of [[13, 17], [26, 17], [20, 15]]) P.circle(x + 0.5, y, 1.2, '#ffe9a0', 0);
    const ok = '#ff6a8a', okD = '#d04a70';
    const bases = [11, 14.5, 18, 22, 25.5, 29];
    bases.forEach((bx, i) => {
      const dir = i < 3 ? -1 : 1, reach = (i === 2 || i === 3) ? 1 : i === 1 || i === 4 ? 3 : 5, c = i % 2 ? okD : ok;
      for (let k = 0; k <= 24; k++) { const t = k / 24, x = bx + dir * t * t * reach, y = 29 + t * 8; P.rect(Math.round(x - 1), Math.round(y), 2, 1, c, 1); }
    });
    P.ellipse(20, 26, 8, 6.4, ok, 1);
    P.ellipse(23.5, 22.5, 1.6, 1, '#ffc0d0', 1);
    P.circle(17, 26, 1.7, '#ffffff', 0); P.circle(23, 26, 1.7, '#ffffff', 0);
    P.rect(17, 26, 1, 2, K, 0); P.rect(23, 26, 1, 2, K, 0);
    P.set(19, 30, K, 0); P.set(20, 30, K, 0); P.set(14, 29, '#ff3a5a', 1); P.set(26, 29, '#ff3a5a', 1);
    P.poly([[14, 21], [15, 16], [17.5, 19], [20, 15], [22.5, 19], [25, 16], [26, 21]], gold, 1);
    P.set(20, 18, '#e8384a', 0); P.set(16, 19, '#37e0d0', 0); P.set(24, 19, '#37e0d0', 0);
    P.vgrad(37, 40, ['#f2d8a0', '#d8b880'], 1);
    for (const bx of [2, 4, 36, 38]) for (let y = 24; y < 37; y++) P.set(bx + (Math.floor(y / 2) % 2), y, '#3fb86a', 1);
    for (const [x, y] of [[8, 38], [31, 39], [16, 39]]) P.set(x, y, '#fff6e0', 0);
    P.poly([[33, 38], [34, 36.5], [35, 38], [36.5, 38.3], [35, 39], [35.5, 40], [34, 39.4], [32.5, 40], [33, 39], [31.5, 38.3]], '#ffb020', 1);
    for (const [x, y] of [[3, 4], [37, 3], [10, 2], [33, 20], [6, 22]]) P.circle(x, y, 0.8, '#e0fcff', 0);
    for (const [x, y, c] of [[2, 16, '#ffd23d'], [37, 18, '#ff8a4a']]) { P.ellipse(x, y, 1.6, 1, c, 1); P.set(x + 2, y, c, 1); }
  });
})();
