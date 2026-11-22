'use strict';
// =========================================================
//  ノノグラム・アトリエの絵 ★★★ むずかしい（30×30 = 9ピース）
// =========================================================
(() => {
  const D = NONO.paint;
  const K = '#1d1629';

  D(3, 'torii', 'ゆうひと鳥居', 30, 30, P => {
    P.vgrad(0, 20, ['#3a2a6a', '#7a3a8a', '#c85a8a', '#ff8a6a', '#ffc070', '#ffe0a0'], 0);
    for (const [x, y, w] of [[2, 5, 8], [18, 3, 9], [6, 9, 6], [21, 11, 7]]) P.rect(x, y, w, 1, '#ffb0a0', 0);
    P.circle(15, 19, 5.6, '#fff2b8', 1);
    P.vgrad(20, 30, ['#4a2a6a', '#2a1a4a', '#1a1030'], 1);
    for (let y = 21; y < 30; y += 2) {
      const half = Math.max(1, 5.5 - (y - 21) * 0.55);
      P.rect(Math.round(15 - half), y, Math.round(half * 2), 1, y < 25 ? '#ffe0a0' : '#ff9a6a', 0);
    }
    for (const [x, y, w] of [[1, 22, 3], [23, 23, 4], [3, 26, 4], [24, 27, 3], [12, 28, 2], [0, 29, 2], [27, 21, 2]]) P.rect(x, y, w, 1, '#8a5aa0', 0);
    const R = '#e8402a', r = '#a02a1a';
    P.poly([[3, 5], [27, 5], [26, 7], [4, 7]], K, 1);
    P.set(2, 4, K, 1); P.set(27, 4, K, 1);
    P.rect(5, 7, 20, 2, R, 1);
    P.rect(6, 11, 18, 2, R, 1);
    P.rect(14, 8, 2, 3, R, 1);
    P.rect(8, 9, 2, 18, R, 1); P.rect(20, 9, 2, 18, R, 1);
    P.rect(9, 9, 1, 18, r, 1); P.rect(21, 9, 1, 18, r, 1);
    P.rect(7, 25, 4, 2, K, 1); P.rect(19, 25, 4, 2, K, 1);
    for (const [x, y] of [[4, 13], [6, 15], [23, 15], [25, 14]]) { P.set(x, y, K, 1); P.set(x + 1, y + 1, K, 1); P.set(x + 2, y, K, 1); }
  });

  D(3, 'sakura', 'おかのうえの さくら', 30, 30, P => {
    const pk = ['#ffd0e0', '#ffb0cc', '#ff8fb4', '#f070a0'];
    P.vgrad(0, 30, ['#9fd8ff', '#cdeeff', '#f2fbff'], 0);
    P.ellipse(15, 33, 22, 9, '#6cc35a', 1);
    P.ellipse(15, 33.5, 22, 8.5, '#5cb84c', 1);
    for (const [x, y] of [[4, 27], [8, 28], [22, 27], [26, 28], [12, 29], [18, 29]]) P.set(x, y, '#ffffff', 0);
    for (const [x, y] of [[6, 28], [24, 29], [15, 28]]) P.set(x, y, '#ffe156', 0);
    const tr = '#6e3b30', trD = '#4a2820';
    P.poly([[13, 27], [17, 27], [16.5, 18], [15, 14], [14, 18]], tr, 1);
    P.line(15, 18, 8, 11, tr, 1); P.line(15, 17, 9, 11, tr, 1);
    P.line(16, 17, 23, 10, tr, 1); P.line(16, 16, 22, 10, tr, 1);
    P.line(15, 15, 15, 7, tr, 1);
    const blobs = [[15, 8, 6], [8, 10, 5], [22, 10, 5], [11, 5, 4], [19, 5, 4], [5, 13, 3.6], [25, 13, 3.6], [15, 13, 4]];
    blobs.forEach(([x, y, r], i) => P.circle(x, y, r, pk[1], 1));
    blobs.forEach(([x, y, r]) => { P.circle(x - r * 0.25, y - r * 0.3, r * 0.6, pk[0], 1); });
    blobs.forEach(([x, y, r]) => { for (let k = 0; k < 6; k++) { const a = k * 1.1 + x, d = r * 0.7; P.set(x + Math.cos(a) * d, y + Math.sin(a) * d + 1, pk[2], 1); } });
    for (const [x, y] of [[10, 9], [17, 6], [21, 12], [7, 13], [14, 11], [24, 10]]) P.set(x, y, '#cdeeff', 0);
    P.rim(pk[1], pk[3], 0, 1, true);
    for (const [x, y] of [[2, 4], [27, 3], [26, 19], [3, 20], [8, 22], [22, 23], [1, 15], [28, 16]]) P.set(x, y, pk[2], 1);
    P.rect(14, 18, 1, 9, trD, 1);
  });

  D(3, 'owl', 'つきよの ふくろう', 30, 30, P => {
    const sky = ['#121a3a', '#1c2a5a', '#2a3a72'];
    P.vgrad(0, 30, sky, 1);
    for (const [x, y] of [[2, 3], [6, 1], [27, 2], [25, 7], [3, 10], [28, 12], [1, 18], [27, 21], [9, 4]]) P.set(x, y, '#fff6c0', 0);
    P.circle(15, 13, 11.5, '#fff1b8', 0);
    P.circle(15, 13, 10.5, '#ffe89a', 0);
    for (const [x, y, r] of [[9, 7, 1.4], [20, 18, 1.8], [11, 19, 1]]) P.circle(x, y, r, '#f2d27a', 0);
    const br = '#8a5a3a', brD = '#5a3820', fc = '#e8c89a', fc2 = '#c8a070';
    P.poly([[0, 24], [30, 21], [30, 24], [0, 27]], '#4a2a18', 1);
    for (const [x, y] of [[4, 23], [24, 21], [27, 21]]) { P.ellipse(x, y - 1, 1.6, 1, '#4aa85a', 1); }
    P.ellipse(15, 16, 6.4, 7.5, br, 1);
    P.poly([[9, 9], [10, 4.5], [13, 8]], br, 1); P.poly([[21, 9], [20, 4.5], [17, 8]], br, 1);
    P.ellipse(15, 11.5, 6.4, 4.4, br, 1);
    P.ellipse(12.2, 11.6, 2.8, 2.8, fc, 1); P.ellipse(17.8, 11.6, 2.8, 2.8, fc, 1);
    P.circle(12.2, 11.6, 1.8, '#ffb020', 0); P.circle(17.8, 11.6, 1.8, '#ffb020', 0);
    P.rect(12, 11, 1, 2, K, 0); P.rect(17, 11, 1, 2, K, 0);
    P.poly([[14, 13.5], [16, 13.5], [15, 15.5]], '#f7a03a', 1);
    P.ellipse(15, 19, 3.6, 3.8, fc, 1);
    for (const [x, y] of [[14, 18], [16, 18], [13, 20], [15, 20], [17, 20], [14, 22], [16, 22]]) P.set(x, y, fc2, 0);
    P.ellipse(9.5, 17, 2, 5, brD, 1); P.ellipse(20.5, 17, 2, 5, brD, 1);
    for (const x of [12, 14, 16, 18]) P.rect(x, 23, 1, 1, '#f7a03a', 1);
    for (const [x, y] of [[2, 28], [7, 29], [12, 28], [18, 29], [23, 27], [27, 28], [5, 27]]) P.set(x, y, '#fff6c0', 0);
    for (const [x, y] of [[8, 25], [9, 25], [22, 23], [23, 23], [26, 22]]) P.set(x, y, '#2a3a72', 1);
  });

  D(3, 'pirate', 'かいぞくせん', 30, 30, P => {
    P.vgrad(0, 19, ['#7ac6f2', '#a8dcf8', '#dff3ff'], 0);
    for (const [x, y, w] of [[2, 4, 7], [3, 3, 4], [20, 7, 8], [22, 6, 4]]) P.rect(x, y, w, 1, '#ffffff', 0);
    const hull = '#8a4a2a', hullD = '#5a2a18', sail = '#fbf2dc', sailD = '#e2d2b0';
    P.rect(14, 2, 1, 18, '#4a2a18', 1); P.rect(7, 6, 1, 14, '#4a2a18', 1); P.rect(21, 7, 1, 13, '#4a2a18', 1);
    P.poly([[15, 3], [24, 5], [23.5, 13], [15, 14]], sail, 1);
    P.poly([[8, 7], [13.5, 8], [13, 15], [8, 15]], sail, 1);
    P.poly([[22, 8], [27, 10], [26.5, 16], [22, 16]], sail, 1);
    P.rim(sail, sailD, 0, 1);
    P.circle(19.5, 8, 1.8, K, 0); P.set(18, 10, K, 0); P.set(21, 10, K, 0); P.set(19, 10, '#fbf2dc', 1); P.set(20, 10, '#fbf2dc', 1);
    P.rect(12, 1, 4, 2, K, 1); P.set(13, 1, '#ffffff', 1);
    P.poly([[3, 18], [27, 18], [24, 24], [6, 24]], hull, 1);
    P.rect(3, 17, 24, 1, hullD, 1);
    for (const x of [8, 12, 16, 20]) P.set(x, 20, '#ffe156', 0);
    P.rect(5, 22, 20, 1, hullD, 1);
    P.rect(25, 15, 3, 3, hull, 1);
    P.vgrad(23, 30, ['#2f8fe6', '#1c5fb0', '#163c80'], 1);
    for (let i = 0; i < 9; i++) { const x = (i * 7 + 3) % 30, y = 24 + (i * 5) % 6; P.set(x, y, '#d0f0ff', 0); P.set(x + 1, y, '#d0f0ff', 0); P.set(x + 2, y - 1, '#d0f0ff', 0); }
    for (const [x, y] of [[3, 10], [26, 2]]) { P.set(x, y, K, 1); P.set(x + 1, y + 1, K, 1); P.set(x + 2, y, K, 1); }
  });

  D(3, 'balloon', 'ききゅうの たび', 30, 30, P => {
    P.vgrad(0, 30, ['#ffc8a0', '#ffe4c4', '#dff1ff', '#b8e2ff'], 0);
    for (const [x, y, w] of [[1, 3, 6], [22, 2, 7], [17, 14, 8], [0, 16, 5]]) { P.rect(x, y, w, 1, '#ffffff', 0); P.rect(x + 1, y - 1, w - 2, 1, '#ffffff', 0); }
    const stripes = ['#e8384a', '#ffe156', '#e8384a', '#ffe156', '#e8384a', '#ffe156', '#e8384a'];
    for (let y = 2; y < 18; y++) for (let x = 2; x < 22; x++) {
      const dx = (x + 0.5 - 12) / 8.6, dy = (y + 0.5 - 10) / (y < 10 ? 8 : 9);
      if (dx * dx + dy * dy <= 1 - Math.max(0, (y - 13) * 0.08)) {
        const band = Math.floor((dx / Math.sqrt(Math.max(0.05, 1 - dy * dy)) + 1) * 3.5);
        P.set(x, y, stripes[clamp(band, 0, 6)], 1);
      }
    }
    P.line(9, 17, 10, 21, '#6e3b30', 1); P.line(15, 17, 14, 21, '#6e3b30', 1);
    P.rect(10, 21, 5, 3, '#a0603a', 1); P.rect(10, 21, 5, 1, '#6e3b30', 1);
    P.ellipse(24, 8, 3, 3.5, '#37e0d0', 1); P.rect(23, 8, 1, 3, '#1e9c9a', 1); P.rect(25, 8, 1, 3, '#1e9c9a', 1);
    P.line(23, 11, 23.5, 13, '#6e3b30', 1); P.line(25, 11, 24.5, 13, '#6e3b30', 1); P.rect(23, 13, 2, 1, '#a0603a', 1);
    P.ellipse(4, 21, 2, 2.4, '#9a5ce0', 1); P.set(4, 23, '#6e3b30', 1); P.set(4, 24, '#a0603a', 1);
    P.ellipse(8, 33, 14, 7, '#6cc35a', 1); P.ellipse(25, 32, 11, 6, '#4aa85a', 1);
    for (const [x, y] of [[20, 27], [24, 28]]) { P.rect(x, y, 3, 2, '#fbf2dc', 1); P.set(x + 1, y - 1, '#e8384a', 1); P.set(x, y - 1, '#e8384a', 1); P.set(x + 2, y - 1, '#e8384a', 1); P.set(x + 1, y + 1, '#ffe156', 0); }
    P.outline('#5a2a30', 1, (x, y) => y < 24);
  });

  D(3, 'astronaut', 'うちゅうさんぽ', 30, 30, P => {
    P.vgrad(0, 30, ['#0e0b24', '#1c1446', '#2a1a5a'], 0);
    for (const [x, y] of [[2, 2], [9, 1], [27, 4], [25, 1], [1, 14], [4, 25], [12, 28], [28, 15], [18, 3]]) P.set(x, y, '#ffffff', 1);
    for (const [x, y] of [[6, 6], [23, 10]]) { P.set(x, y, '#ffe156', 1); P.set(x - 1, y, '#ffe156', 1); P.set(x + 1, y, '#ffe156', 1); P.set(x, y - 1, '#ffe156', 1); P.set(x, y + 1, '#ffe156', 1); }
    P.circle(23, 23, 6, '#f2a93b', 1);
    P.vgrad(17, 30, ['#ffd26a', '#f2a93b', '#c0571e'], 1, (x, y) => { const dx = x + 0.5 - 23, dy = y + 0.5 - 23; return dx * dx + dy * dy <= 36; });
    for (let x = 14; x < 30; x++) { const y = Math.round(23 + (x - 23) * 0.3); if (Math.abs(x - 23) > 4) { P.set(x, y, '#e2d2f8', 1); } else P.set(x, y + 1, '#c0a8e8', 1); }
    const sw = '#f4f6fb', sd = '#c4cadb', or = '#f7842a';
    P.line(16, 17, 27, 2, '#8b87a6', 1);
    P.ellipse(12, 17, 5, 6, sw, 1);
    P.rect(17, 13, 3, 6, sd, 1);
    P.ellipse(6, 14, 2, 3, sw, 1); P.ellipse(5.5, 10.5, 1.6, 1.6, sw, 1);
    P.ellipse(17.5, 19, 1.8, 2.6, sw, 1);
    P.ellipse(9.5, 24, 2, 3.4, sw, 1); P.ellipse(14.5, 24, 2, 3.4, sw, 1);
    P.rect(8, 26, 4, 2, sd, 1); P.rect(13, 26, 4, 2, sd, 1);
    P.circle(12, 9, 5.2, sw, 1);
    P.ellipse(12, 9.4, 3.6, 2.8, '#2a4a8a', 0);
    P.set(10, 8, '#9fd8ff', 0); P.set(11, 8, '#9fd8ff', 0); P.set(10, 9, '#9fd8ff', 0);
    P.rect(10, 16, 4, 3, or, 1); P.set(11, 17, '#ffe156', 0); P.set(12, 17, '#37e0d0', 0);
    P.rim(sw, sd, 1, 0, true);
  });

  D(3, 'soda', 'クリームソーダ', 30, 30, P => {
    P.fill('#ffe8d6');
    for (let x = 0; x < 30; x += 4) P.rect(x, 0, 2, 22, '#ffd8c0', 0);
    P.rect(4, 0, 1, 4, '#5a3a3a', 1); P.poly([[1, 4], [8, 4], [7, 6], [2, 6]], '#2fa880', 1); P.rect(3, 6, 3, 1, '#ffe156', 1); P.set(4, 7, '#fff6b0', 0);
    P.rect(22, 6, 7, 1, '#a0603a', 1); P.rect(23, 3, 2, 3, '#e8d0a0', 1); P.rect(26, 2, 2, 4, '#f070a0', 1); P.set(27, 3, '#ffffff', 0);
    P.rect(0, 22, 30, 8, '#a0603a', 1); P.rect(0, 22, 30, 1, '#c88050', 1);
    for (const [x, y, w] of [[1, 24, 3], [7, 25, 4], [21, 24, 5], [3, 27, 5], [12, 28, 4], [22, 27, 3], [26, 29, 3], [16, 26, 2]]) P.rect(x, y, w, 1, '#7a4428', 0);
    const gl = '#c8e8f0', gr = '#54d66a', grD = '#2fa850';
    P.poly([[8, 9], [22, 9], [20, 23], [10, 23]], gl, 1);
    P.poly([[9, 10], [21, 10], [19.2, 22], [10.8, 22]], gr, 1);
    P.rim(gr, grD, 1, 0);
    for (const [x, y] of [[12, 19], [17, 15], [14, 13], [16, 20], [12, 16], [18, 12]]) P.set(x, y, '#d8ffe0', 0);
    P.rect(11, 23, 8, 1, gl, 1); P.rect(13, 24, 4, 1, gl, 1); P.rect(11, 25, 8, 1, gl, 1);
    P.ellipse(15, 9, 5.6, 3.6, '#fffaf0', 1);
    P.ellipse(13, 8, 2, 1.4, '#ffffff', 1);
    P.circle(18, 5, 1.8, '#e8384a', 1); P.set(17, 4, '#ffb0b8', 0);
    P.line(18, 3, 20, 0, '#4aa85a', 1);
    for (let i = 0; i < 9; i++) P.set(9 + i, 8 - i, i % 2 ? '#ffffff' : '#e8384a', 1);
    for (let i = 0; i < 9; i++) P.set(10 + i, 8 - i, i % 2 ? '#e8384a' : '#ffffff', 1);
    P.outline('#6a3a3a', 1, (x, y) => y < 22 && y > 6);
  });

  D(3, 'snowcabin', 'ゆきの山小屋', 30, 30, P => {
    P.vgrad(0, 22, ['#1a1a4a', '#3a2a6a', '#6a4a8a'], 0);
    P.circle(24, 5, 2.6, '#fff6d0', 1);
    P.poly([[0, 16], [5, 9], [9, 13], [14, 8], [19, 12], [23, 9], [30, 15], [30, 22], [0, 22]], '#4a3a7a', 1);
    P.poly([[3.5, 10.5], [5, 9], [6.5, 10.5], [5, 11]], '#d8d0f0', 1); P.poly([[12.5, 9.5], [14, 8], [15.5, 9.5], [14, 10]], '#d8d0f0', 1);
    for (let i = 0; i < 22; i++) { const x = (i * 13 + 5) % 30, y = (i * 7 + 2) % 20; P.set(x, y, '#ffffff', 1); }
    const pine = '#1f5e3a', snow = '#f6faff', snowD = '#c8d8f0';
    const tree = (cx, base, hgt) => {
      for (let y = 0; y < hgt; y++) { const half = 0.5 + y * 0.42 - ((y % 4 === 3) ? 0.8 : 0); for (let x = Math.round(cx - half); x <= Math.round(cx + half); x++) P.set(x, base - hgt + y, pine, 1); if (y % 4 === 0) P.set(Math.round(cx + half), base - hgt + y, snow, 1), P.set(Math.round(cx - half), base - hgt + y, snow, 1); }
      P.rect(cx, base, 1, 2, '#4a2820', 1);
    };
    tree(3, 21, 12); tree(26.5, 21, 11); tree(7, 22, 8);
    P.rect(10, 14, 12, 8, '#8a4a2a', 1);
    for (let y = 15; y < 22; y += 2) P.rect(10, y, 12, 1, '#6e3b30', 1);
    P.poly([[8, 15], [16, 7], [24, 15]], snow, 1);
    P.poly([[9.5, 15], [16, 9], [22.5, 15]], '#c86a3a', 1);
    P.poly([[10, 13], [16, 8], [22, 13], [21, 14], [16, 10], [11, 14]], snow, 1);
    P.rect(19, 7, 2, 4, '#6e3b30', 1);
    for (const [x, y] of [[20, 5], [21, 4], [20, 3], [21, 1]]) P.set(x, y, '#9a98ad', 0);
    P.rect(12, 16, 3, 3, '#ffd23d', 0); P.set(13, 16, '#fff6b0', 0);
    P.rect(17, 16, 3, 6, '#4a2820', 1); P.set(19, 19, '#ffd23d', 1);
    P.vgrad(22, 30, [snow, snowD], 1);
    for (let y = 22; y < 30; y++) { P.set(18 + Math.round((y - 22) * 0.4), y, '#9fb8e0', 0); }
    for (const [x, y] of [[13, 23], [14, 25], [12, 27], [6, 26], [25, 24]]) P.set(x, y, '#ffe9a0', 0);
    for (const [x, y, w] of [[1, 24, 4], [22, 26, 5], [4, 28, 6], [24, 29, 4], [8, 23, 2]]) P.rect(x, y, w, 1, '#b0c4e8', 0);
  });

  D(3, 'frog', 'あめの日の かえる', 30, 30, P => {
    const sky = ['#8a9ab8', '#a8b8d0', '#c8d6e8'];
    P.vgrad(0, 22, sky, 0);
    for (let i = 0; i < 40; i++) { const x = (i * 11 + 3) % 30, y = (i * 17 + 1) % 22; P.set(x, y, '#e0e8f4', 0); P.set(x - 1, y + 1, '#e0e8f4', 0); }
    P.ellipse(5, 1, 7, 3, '#6a7890', 1); P.ellipse(24, 0.5, 8, 3, '#6a7890', 1); P.ellipse(14, 0, 5, 2, '#7a88a0', 1);
    const lf = '#3fa04a', lfL = '#6cc35a', fr = '#7ad14e', frD = '#4aa85a';
    P.ellipse(15, 8, 11, 6.5, lf, 1);
    P.vgrad(0, 22, sky, 0, (x, y) => y >= 8 && y < 15);
    for (let i = 0; i < 40; i++) { const x = (i * 11 + 3) % 30, y = (i * 17 + 1) % 22; if (y >= 8 && y < 15) { P.set(x, y, '#e0e8f4', 0); P.set(x - 1, y + 1, '#e0e8f4', 0); } }
    for (let k = 0; k < 5; k++) P.line(15, 3, 5 + k * 5, 8, lfL, 1);
    P.rect(15, 8, 1, 10, '#2f7a37', 1);
    const ajisai = (cx, cy, c1, c2) => {
      P.ellipse(cx, cy + 3, 4, 2.4, '#3f8a4a', 1);
      P.circle(cx, cy, 3.6, c1, 1);
      for (const [dx, dy] of [[-2, -1], [1, -2], [2, 1], [-1, 2], [0, 0]]) P.set(cx + dx, cy + dy, c2, 1);
      for (const [dx, dy] of [[-1, -1], [1, 1], [2, -1]]) P.set(cx + dx, cy + dy, '#ffffff', 0);
    };
    ajisai(4, 16, '#8a7ae8', '#b8a8ff'); ajisai(26, 15, '#5aa0f0', '#a8d0ff'); ajisai(2, 21, '#e87ac0', '#ffb0e0'); ajisai(28, 20.5, '#8a7ae8', '#c8b8ff');
    P.vgrad(22, 30, ['#4a8ac8', '#2f6aa8'], 1);
    for (const [x, y, w] of [[3, 24, 4], [20, 26, 5], [10, 28, 3], [25, 29, 3], [1, 27, 2]]) P.rect(x, y, w, 1, '#9fd0f8', 0);
    P.ellipse(15, 23, 9, 2.4, '#4aa85a', 1); P.set(20, 22, '#9fd0f8', 0); P.set(21, 22, '#9fd0f8', 0);
    P.ellipse(15, 18.5, 5, 3.8, fr, 1);
    P.circle(12, 14.6, 1.9, fr, 1); P.circle(18, 14.6, 1.9, fr, 1);
    P.circle(12, 14.6, 1, '#ffffff', 0); P.circle(18, 14.6, 1, '#ffffff', 0);
    P.set(12, 15, K, 0); P.set(18, 15, K, 0);
    P.line(13, 19, 17, 19, frD, 1); P.set(12, 18, frD, 1); P.set(18, 18, frD, 1);
    P.set(11, 19, '#ff9fb0', 1); P.set(19, 19, '#ff9fb0', 1);
    P.ellipse(10.5, 21.5, 2, 1, frD, 1); P.ellipse(19.5, 21.5, 2, 1, frD, 1);
    P.rect(16, 16, 1, 3, frD, 1);
  });

  D(3, 'dragon', 'ちびドラゴン', 30, 30, P => {
    P.vgrad(0, 30, ['#ffd0e8', '#ffe8d8', '#fff6e0'], 0);
    for (const [x, y, w] of [[2, 4, 6], [22, 2, 6], [24, 20, 5]]) { P.rect(x, y, w, 2, '#ffffff', 0); P.rect(x + 1, y - 1, w - 2, 1, '#ffffff', 0); }
    const G = '#5cc24c', g = '#3f9a3a', bel = '#ffe28a', wing = '#9a5ce0', wingD = '#6e3aa8';
    P.poly([[16, 15], [27, 8], [26, 13], [28, 15], [24, 17], [25, 20], [18, 19]], wing, 1);
    P.line(17, 16, 26, 10, wingD, 1); P.line(18, 18, 26, 15, wingD, 1);
    P.ellipse(23.5, 26, 4, 1.6, G, 1); P.ellipse(26.5, 24.5, 1.2, 1.6, G, 1); P.poly([[26, 22], [29, 21], [27.5, 24]], '#ff8a4a', 1);
    P.ellipse(15, 21, 7, 6.5, G, 1);
    P.ellipse(13.5, 22, 3.8, 4.6, bel, 1);
    for (const y of [19, 21, 23, 25]) P.rect(11, y, 6, 1, '#f2c260', 1);
    P.ellipse(13, 10, 7.2, 6, G, 1);
    P.ellipse(8, 12.5, 3.8, 2.8, G, 1);
    P.set(6, 12, g, 0); P.set(8, 12, g, 0);
    P.poly([[13, 5], [12, 1], [15, 4.5]], '#fff0c0', 1); P.poly([[17.5, 6], [19, 2], [19.2, 7]], '#fff0c0', 1);
    P.circle(14, 9, 1.8, '#ffffff', 0); P.rect(14, 9, 1, 2, K, 0);
    P.set(11, 11, '#ff9fb0', 1);
    P.poly([[2, 14], [5, 12.5], [5, 15.5]], '#ff9a3a', 1); P.set(1, 14, '#ffe156', 1); P.set(0, 13, '#ffe156', 0);
    for (const [x, y] of [[19, 8], [20, 11], [21, 15], [21, 19]]) P.poly([[x, y], [x + 2.5, y + 1], [x, y + 2]], '#ff8a4a', 1);
    P.ellipse(10, 27, 2.4, 1.6, G, 1); P.ellipse(18, 27, 2.4, 1.6, G, 1);
    P.ellipse(9, 20, 1.4, 2, G, 1);
    P.rim(G, g, 0, 1, true);
    P.outline('#2a4a2a');
  });
})();
