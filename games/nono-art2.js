'use strict';
// =========================================================
//  ノノグラム・アトリエの絵 ★★ ふつう（20×20 = 4ピース）
// =========================================================
(() => {
  const D = NONO.paint, S = NONO.STD;
  const K = '#1d1629';

  D(2, 'cat', 'ひなたのねこ', 20, 20, P => {
    const O = '#f7a03a', o = '#d9762a', Wc = '#fff1de', pk = '#ff9fb0';
    P.fill('#dff1ff');
    P.rect(0, 18, 20, 2, '#c4e2f7');
    P.ellipse(17, 13, 1.8, 4.2, O, 1);
    P.ellipse(10, 15, 6.5, 4.6, O, 1);
    P.poly([[2.5, 7], [3.2, 0.5], [8.5, 3.5]], O, 1); P.poly([[17.5, 7], [16.8, 0.5], [11.5, 3.5]], O, 1);
    P.ellipse(10, 8.5, 7.6, 6, O, 1);
    P.poly([[4, 4.5], [4.2, 2], [6.8, 3.6]], pk, 1); P.poly([[16, 4.5], [15.8, 2], [13.2, 3.6]], pk, 1);
    P.ellipse(10, 15.5, 3.3, 3.6, Wc, 1);
    P.ellipse(7.3, 18.3, 1.7, 1.2, Wc, 1); P.ellipse(12.7, 18.3, 1.7, 1.2, Wc, 1);
    for (const x of [9, 10]) P.set(x, 3, o, 1); P.set(8, 4, o, 1); P.set(11, 4, o, 1);
    P.rect(5, 7, 2, 3, K, 0); P.rect(13, 7, 2, 3, K, 0); P.set(5, 7, '#ffffff', 0); P.set(13, 7, '#ffffff', 0);
    P.set(9, 10, pk, 1); P.set(10, 10, pk, 1);
    P.set(8, 11, K, 0); P.set(11, 11, K, 0); P.set(9, 12, K, 0); P.set(10, 12, K, 0);
    P.set(4, 10, pk, 1); P.set(15, 10, pk, 1);
    P.rim(O, o, 0, 1); P.rim(O, o, 1, 0, true);
    P.outline('#5a2e1e');
  });

  D(2, 'octo', 'タコのオクト', 20, 20, P => {
    const Pk = '#ff7a9c', pk = '#e2507a', hi = '#ffc0d0';
    P.vgrad(0, 20, ['#d6f3ff', '#a8e0f8', '#7cc8f0'], 0);
    for (const [x, y, r] of [[2, 3, 1.2], [17, 2, 1], [18.5, 7, 0.8], [1.5, 8, 0.7]]) P.circle(x, y, r, '#ffffff', 0);
    const bases = [3.2, 6.4, 9, 11, 13.6, 16.8];
    bases.forEach((bx, i) => {
      const dir = i < 3 ? -1 : 1, reach = (i === 2 || i === 3) ? 0.8 : i === 1 || i === 4 ? 2 : 2.8, c = i % 2 ? pk : Pk;
      for (let k = 0; k <= 20; k++) { const t = k / 20, x = bx + dir * t * t * reach, y = 11 + t * 7.4; P.rect(Math.round(x - 1), Math.round(y), 2, 1, c, 1); }
      P.set(Math.round(bx + dir * reach + dir * 1.2 - (dir < 0 ? 1 : 0)), 17, c, 1);
    });
    P.ellipse(10, 7.5, 7.5, 6.6, Pk, 1);
    P.ellipse(13.5, 3.6, 1.2, 0.9, hi, 1);
    P.ellipse(6.5, 7.5, 1.6, 2, '#ffffff', 0); P.ellipse(13.5, 7.5, 1.6, 2, '#ffffff', 0);
    P.rect(6, 7, 1, 2, K, 0); P.rect(13, 7, 1, 2, K, 0);
    P.set(9, 11, K, 0); P.set(10, 11, K, 0);
    P.set(4, 10, '#ff4a6a', 1); P.set(15, 10, '#ff4a6a', 1);
    P.outline('#7a1e44');
  });

  D(2, 'penguin', 'ペンギン', 20, 20, P => {
    const N = '#27315a', n = '#1a2140', Wc = '#ffffff', Or = '#f7942a';
    P.vgrad(0, 16, ['#bfe6ff', '#e6f6ff'], 0);
    P.rect(0, 16, 20, 4, '#f4fbff', 1); P.rect(0, 16, 20, 1, '#cfe9fa', 1);
    for (let x = 0; x < 20; x += 5) P.set(x + 2, 18, '#bfdcef', 0);
    P.ellipse(4.2, 11, 1.8, 4, n, 1); P.ellipse(15.8, 11, 1.8, 4, n, 1);
    P.ellipse(10, 10, 6, 7.5, N, 1);
    P.ellipse(10, 11.5, 4.4, 5.6, Wc, 1);
    P.ellipse(10, 5.5, 4.5, 3.6, N, 1);
    P.rect(7, 5, 2, 2, K, 0); P.rect(11, 5, 2, 2, K, 0); P.set(7, 5, '#ffffff', 0); P.set(11, 5, '#ffffff', 0);
    P.poly([[8.5, 7], [11.5, 7], [10, 9]], Or, 1);
    P.ellipse(7.5, 16.5, 2, 1, Or, 1); P.ellipse(12.5, 16.5, 2, 1, Or, 1);
    P.set(6, 8, '#ff9fb0', 1); P.set(13, 8, '#ff9fb0', 1);
    P.outline('#121633', 1, (x, y) => y < 16);
  });

  D(2, 'shortcake', 'いちごのケーキ', 20, 20, P => {
    const cr = '#fffdf6', sp = '#ffd98a', sd = '#f2b860', st = '#e8384a', lf = '#5cc24c';
    P.fill('#ffeaf1');
    for (let y = 0; y < 20; y += 4) for (let x = (y / 4) % 2 * 2; x < 20; x += 4) P.set(x, y, '#ffd6e4', 0);
    P.ellipse(10, 18, 9.5, 1.8, '#d9e4f2', 1);
    P.poly([[2, 9], [9, 5], [19, 7], [19, 16], [2, 17]], cr, 1);
    P.rect(2, 10, 17, 2, sp, 1); P.rect(2, 12, 17, 1, cr, 1); P.rect(2, 13, 17, 3, sp, 1);
    for (const x of [4, 8, 12, 16]) { P.set(x, 12, st, 1); P.set(x + 1, 12, st, 1); }
    P.rim(sp, sd, 0, 1);
    for (const x of [5, 10, 15]) { P.ellipse(x, 7.2, 1.6, 1.2, cr, 1); }
    P.ellipse(11, 3.6, 2.6, 2.4, st, 1); P.set(10, 3, '#ffd0d6', 0); P.set(12, 4, '#ffd0d6', 0);
    P.poly([[9, 1.4], [11, 2], [13, 1.4], [11, 0.4]], lf, 1);
    P.outline('#8a4a5c', 1, (x, y) => y < 17);
  });

  D(2, 'burger', 'ハンバーガー', 20, 20, P => {
    const bg = '#fff6e0', bun = '#f2a94a', bunD = '#c97a2a', ses = '#fff3d6', let_ = '#7ad14e', ch = '#ffd23d', pt = '#6e3b30', tm = '#e8384a';
    P.fill(bg);
    P.ellipse(10, 9.5, 9, 7, bun, 1); P.rect(0, 9, 20, 11, bg, 0);
    P.rim(bun, bunD, 0, 1);
    for (const [x, y] of [[6, 4], [10, 4], [14, 4], [8, 6], [12, 6], [4, 7], [16, 7]]) P.set(x, y, ses, 0);
    for (let x = 1; x < 19; x++) { P.set(x, 9 + (x % 3 === 0 ? 1 : 0), let_, 1); P.set(x, 10, let_, 1); }
    P.rect(1, 11, 18, 1, ch, 1);
    P.rect(1, 12, 18, 3, pt, 1); P.set(4, 12, ch, 1); P.set(13, 12, ch, 1); P.set(14, 12, ch, 1);
    P.rect(2, 15, 16, 1, tm, 1);
    P.rect(2, 16, 16, 2, bun, 1); P.rect(3, 18, 14, 1, bunD, 1);
    P.outline('#6e3b30', 1);
  });

  D(2, 'starrocket', 'ほしぞらロケット', 20, 20, P => {
    const R = '#e8384a', r = '#a1203a', Wc = '#eef2fa', g = '#c9cfe0';
    P.fill('#1f2350');
    for (const [x, y] of [[2, 2], [16, 1], [18, 9], [1, 12], [4, 17], [17, 15], [14, 5], [3, 7]]) P.set(x, y, '#ffe156', 1);
    P.circle(3.5, 4, 2.4, '#9a5ce0', 1); P.rect(1, 4, 6, 1, '#f070d8', 1);
    P.ellipse(10, 9, 3.6, 7, Wc, 1);
    P.poly([[6.6, 6], [10, 0.5], [13.4, 6]], R, 1);
    P.rim(Wc, g, 1, 0);
    P.circle(10, 8.5, 1.8, '#1c4f96', 0); P.set(9, 8, '#82d8f7', 0);
    P.poly([[6.5, 11], [4, 16], [7, 15]], R, 1); P.poly([[13.5, 11], [16, 16], [13, 15]], R, 1);
    P.rect(8, 15, 4, 1, r, 1);
    P.poly([[8, 16], [12, 16], [11, 19.5], [10, 18], [9, 19.5]], '#f7842a', 1);
    P.set(9, 16, '#ffe156', 1); P.set(10, 16, '#ffe156', 1); P.set(10, 17, '#ffe156', 1);
  });

  D(2, 'shroomhouse', 'きのこのおうち', 20, 20, P => {
    const R = '#e8384a', r = '#b02a3c', Iv = '#f6ecd2', Nn = '#8a5030', G = '#5cc24c', sky = ['#bfe8ff', '#e6f7ff'];
    P.vgrad(0, 17, sky, 0);
    P.ellipse(10, 8.6, 9.6, 7.4, R, 1);
    P.vgrad(0, 17, sky, 0, (x, y) => y >= 9);
    P.rect(1, 8, 18, 1, r, 1);
    for (const [x, y, rr] of [[5, 4, 1.3], [11, 2.8, 1.4], [15, 5.5, 1.2], [8.5, 6.5, 0.9]]) P.circle(x, y, rr, '#ffffff', 0);
    P.rect(5, 9, 10, 8, Iv, 1);
    P.rect(8, 11, 4, 6, Nn, 1); P.set(11, 14, '#ffe156', 1);
    P.circle(6.6, 11.6, 1, '#82d8f7', 0);
    P.circle(13.4, 11.6, 1, '#82d8f7', 0);
    P.rect(0, 17, 20, 3, G, 1);
    for (let x = 0; x < 20; x += 3) P.set(x, 16, G, 1);
    P.set(2, 18, '#ffe156', 0); P.set(16, 18, '#ff8fae', 0); P.set(18, 19, '#ffffff', 0);
    P.outline('#4a2a2a', 1, (x, y) => y < 16);
  });

  D(2, 'goldfish', 'きんぎょばち', 20, 20, P => {
    const glass = '#9fc9e8', water = '#cdeeff', Or = '#ff6a3d', o2 = '#ffb070', G = '#4aa85a';
    P.fill('#fff8ec');
    P.circle(10, 11, 8.6, glass, 1);
    P.circle(10, 11, 7.6, water, 0);
    P.rect(4, 2, 12, 2, '#fff8ec', 0); P.rect(5, 2, 10, 1, glass, 1); P.rect(5, 3, 10, 1, '#fff8ec', 0);
    P.rect(3, 3, 14, 2, '#fff8ec', 0); P.rect(4, 3, 12, 1, glass, 1);
    P.rect(4, 4, 12, 1, '#e6f6ff', 0);
    P.ellipse(9, 10, 3, 2, Or, 1); P.poly([[11.5, 10], [14.5, 7.5], [14, 12.5]], o2, 1);
    P.set(7, 9, K, 0); P.set(8, 12, o2, 1);
    P.ellipse(6, 15, 1.6, 1, Or, 1); P.poly([[7, 15], [8.6, 14], [8.6, 16]], o2, 1);
    for (const [x, y] of [[6, 6], [7, 4], [13, 14]]) P.set(x, y, '#ffffff', 0);
    P.rect(3, 17, 14, 2, '#c9a27a', 1); P.set(5, 17, '#e8d2b0', 1); P.set(12, 18, '#9c7a5a', 1);
    for (let y = 11; y < 17; y++) P.set(14 + (y % 2), y, G, 1);
    for (let y = 13; y < 17; y++) P.set(4 + (y % 2), y, G, 1);
  });

  D(2, 'lighthouse', 'うみべのとうだい', 20, 20, P => {
    const R = '#e8384a', Wc = '#fbfbff', sea = '#2f8fe6', seaD = '#1c4f96', rock = '#6d6b85';
    P.vgrad(0, 15, ['#ffb48a', '#ffd9a8', '#fff1d8'], 0);
    P.poly([[10, 3], [0, 0], [0, 4]], '#fff6c0', 0); P.poly([[10, 3], [20, 1], [20, 5]], '#fff6c0', 0);
    P.rect(0, 15, 20, 5, sea, 1);
    for (const [x, y] of [[1, 16], [5, 18], [16, 17], [12, 19], [18, 19]]) { P.set(x, y, '#9fd6ff', 0); P.set(x + 1, y, '#9fd6ff', 0); }
    P.rim(sea, seaD, 0, 1);
    P.poly([[2, 16], [5, 12.5], [14, 12.5], [17, 16]], rock, 1);
    for (let y = 5; y < 14; y++) {
      const half = 1.6 + (y - 5) * 0.22;
      for (let x = Math.round(10 - half); x < Math.round(10 + half); x++) P.set(x, y, Math.floor((y - 5) / 2) % 2 ? Wc : R, 1);
    }
    P.rect(8, 3, 4, 2, '#ffe156', 1); P.set(9, 3, '#ffffff', 1);
    P.rect(7, 2, 6, 1, K, 1); P.poly([[7.5, 2], [10, 0], [12.5, 2]], R, 1);
    P.rect(7, 5, 6, 1, K, 1);
    P.set(10, 9, '#1c4f96', 0);
    for (const [x, y] of [[3, 6], [4, 5], [5, 6], [15, 8], [16, 7], [17, 8]]) P.set(x, y, '#5d5878', 1);
  });

  D(2, 'fuji', 'ふじさん', 20, 20, P => {
    const mt = '#3f6fc2', mtD = '#2b4f96', snow = '#ffffff', sun = '#e8384a', cl = '#ffffff';
    P.vgrad(0, 20, ['#ffd7a8', '#ffeccf', '#dff1ff'], 0);
    P.circle(15.5, 4.5, 2.8, sun, 1);
    P.poly([[-1, 20], [8, 6], [12, 6], [21, 20]], mt, 1);
    P.poly([[8, 6], [12, 6], [14.5, 10], [13, 9.2], [12, 11], [10.5, 9.5], [9, 11], [7.5, 9.3], [5.8, 10]], snow, 1);
    P.rim(mt, mtD, 1, 0, true);
    for (const [x, y, r] of [[3, 4, 1.4], [5, 4.3, 1.8], [7, 4.5, 1.2]]) P.ellipse(x, y, r * 1.3, r, cl, 1);
    P.vgrad(15, 20, ['#ffe9f0', '#ffd0e0'], 1, (x, y) => (x + y * 2) % 7 < 4 || y > 17);
    for (const [x, y] of [[1, 15], [4, 16], [9, 15], [15, 16], [18, 15]]) P.circle(x, y + 0.5, 1.6, '#ffb0c8', 1);
    P.rect(0, 18, 20, 2, '#e07a9a', 1);
  });

  D(2, 'bear', 'くまのぬいぐるみ', 20, 20, P => {
    const Br = '#b0743f', br = '#8a5530', tn = '#f2cfa0', Rd = '#e8384a';
    P.fill('#ffeef2');
    for (let y = 1; y < 20; y += 3) for (let x = (y % 2) * 2; x < 20; x += 5) P.set(x, y, '#ffd8e2', 0);
    P.circle(4.5, 4, 2.6, Br, 1); P.circle(15.5, 4, 2.6, Br, 1);
    P.circle(4.5, 4, 1.3, tn, 1); P.circle(15.5, 4, 1.3, tn, 1);
    P.ellipse(10, 15.5, 5.6, 4.5, Br, 1);
    P.ellipse(4.6, 14, 1.8, 2.6, Br, 1); P.ellipse(15.4, 14, 1.8, 2.6, Br, 1);
    P.ellipse(6.5, 18.5, 2.2, 1.6, Br, 1); P.ellipse(13.5, 18.5, 2.2, 1.6, Br, 1);
    P.ellipse(6.5, 18.6, 1.1, 0.9, tn, 1); P.ellipse(13.5, 18.6, 1.1, 0.9, tn, 1);
    P.ellipse(10, 16, 3, 2.8, tn, 1);
    P.ellipse(10, 7.5, 6.4, 5.4, Br, 1);
    P.ellipse(10, 9.6, 2.8, 2, tn, 1);
    P.rect(9, 8, 2, 1, '#3a2020', 1);
    P.set(9, 10, '#3a2020', 0); P.set(10, 10, '#3a2020', 0);
    P.rect(6, 6, 2, 2, K, 0); P.rect(12, 6, 2, 2, K, 0); P.set(6, 6, '#ffffff', 0); P.set(12, 6, '#ffffff', 0);
    P.poly([[6.5, 11.5], [10, 13], [13.5, 11.5], [13.5, 14], [10, 12.8], [6.5, 14]], Rd, 1);
    P.rim(Br, br, 0, 1);
    P.outline('#4a2a1a');
  });

  D(2, 'ramen', 'ラーメン', 20, 20, P => {
    const bg = '#fff5e0', bowl = '#e8384a', bowlD = '#a1203a', soup = '#f2b860', nd = '#ffe58a', egg = '#ffffff', yolk = '#ffb020', nori = '#25343a', nar = '#ffffff';
    P.fill(bg);
    P.ellipse(10, 12.5, 9.5, 7, bowl, 1); P.rect(0, 0, 20, 12, bg, 0);
    P.ellipse(10, 11.4, 9.5, 3.2, soup, 1);
    for (let y = 1; y < 7; y++) { P.set(5 + (y % 2), y, '#e9dccb', 0); P.set(10 + ((y + 1) % 2), y, '#e9dccb', 0); P.set(14 + (y % 2), y, '#e9dccb', 0); }
    for (let x = 4; x < 16; x += 2) { P.set(x, 11, nd, 1); P.set(x + 1, 12, nd, 1); }
    P.rect(2, 8, 3, 4, nori, 1);
    P.circle(14, 10, 1.9, egg, 1); P.circle(14, 10.2, 0.9, yolk, 1);
    P.circle(8.5, 10, 1.6, nar, 1); P.set(8, 10, '#ff8fae', 1); P.set(9, 9, '#ff8fae', 1);
    P.rect(4, 14, 12, 1, '#ffffff', 0);
    for (let x = 5; x < 15; x += 3) P.set(x, 15, '#ffffff', 0);
    P.rim(bowl, bowlD, 0, 1);
    P.line(12, 9, 19, 2, '#b06a43', 1); P.line(13, 9, 19, 3, '#8a5030', 1);
    P.outline('#6e2030', 1, (x, y) => y > 9);
  });

  D(2, 'sunflower', 'ひまわり', 20, 20, P => {
    const Yp = '#ffd23d', yp = '#f2a93b', ctr = '#7a4a2a', ctr2 = '#5a3420', G = '#4aa85a', g = '#2f8445';
    P.vgrad(0, 20, ['#8fd3ff', '#cdeeff'], 0);
    P.rect(9, 12, 2, 8, G, 1);
    P.ellipse(6, 16, 3, 1.4, G, 1); P.ellipse(14, 14.5, 3, 1.4, g, 1);
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2, x = 10 + Math.cos(a) * 5, y = 7.5 + Math.sin(a) * 5;
      P.ellipse(x, y, 2.2, 2.2, i % 2 ? Yp : yp, 1);
    }
    P.circle(10, 7.5, 3.8, ctr, 1);
    for (const [x, y] of [[8, 6], [10, 5], [12, 6], [9, 8], [11, 8], [10, 10], [8, 9]]) P.set(x, y, ctr2, 1);
    P.set(9, 6, '#a06a3a', 0); P.set(11, 9, '#a06a3a', 0);
    P.outline('#5a3a10', 1, (x, y) => y < 13);
  });

  D(2, 'treasure', 'たからばこ', 20, 20, P => {
    const wd = '#a0603a', wdD = '#6e3b30', gd = '#ffd23d', gdD = '#e09a20', gem1 = '#37e0d0', gem2 = '#f070d8';
    P.fill('#2b2340');
    for (const [x, y] of [[2, 2], [17, 3], [1, 9], [18, 11], [5, 0], [14, 1]]) P.set(x, y, '#ffe9a0', 1);
    P.poly([[3, 9], [5, 3], [15, 3], [17, 9]], wdD, 1);
    P.rect(5, 4, 10, 1, '#4a2a20', 1);
    P.ellipse(10, 9, 6.5, 2.4, gd, 1);
    P.circle(7, 7.5, 1.2, gem1, 1); P.circle(12.5, 7.2, 1.2, gem2, 1);
    P.set(9, 8, '#fff6b0', 0); P.set(15, 8, '#fff6b0', 0);
    P.rect(2, 10, 16, 8, wd, 1);
    P.rect(2, 10, 16, 1, gd, 1); P.rect(2, 17, 16, 1, gdD, 1);
    P.rect(5, 10, 1, 8, gd, 1); P.rect(14, 10, 1, 8, gd, 1);
    P.rect(8, 11, 4, 4, gd, 1); P.rect(9, 12, 2, 2, '#2b2340', 0);
    for (let x = 3; x < 17; x += 4) P.set(x, 14, wdD, 1);
    P.rect(1, 18, 18, 1, '#1c1630', 0);
    for (const [x, y] of [[1, 6], [18, 6], [4, 1]]) { P.set(x, y, gd, 1); }
  });

  D(2, 'pumpkin', 'ハロウィンかぼちゃ', 20, 20, P => {
    const Or = '#f7842a', or = '#c0571e', glow = '#ffe156', G = '#5cc24c';
    P.vgrad(0, 20, ['#2a1f4a', '#4a2f6a', '#6a3a7a'], 0);
    P.circle(16, 3.5, 2.5, '#fff3c0', 1); P.circle(17, 3, 2, '#3a2a5a', 0);
    for (const [x, y] of [[3, 2], [5, 3], [4, 4]]) P.set(x, y, '#1d1629', 1);
    P.set(2, 3, '#1d1629', 1); P.set(6, 2, '#1d1629', 1);
    P.ellipse(6.5, 12, 4.5, 6, or, 1); P.ellipse(13.5, 12, 4.5, 6, or, 1);
    P.ellipse(10, 12, 5, 6.5, Or, 1);
    P.ellipse(5.5, 12, 3, 5.4, Or, 1); P.ellipse(14.5, 12, 3, 5.4, Or, 1);
    P.rect(9, 3, 2, 3, G, 1); P.set(11, 4, G, 1); P.set(12, 3, G, 1);
    P.poly([[5, 11], [7.5, 8], [8.5, 11]], glow, 0); P.poly([[15, 11], [12.5, 8], [11.5, 11]], glow, 0);
    P.poly([[9, 12.5], [10, 11], [11, 12.5]], glow, 0);
    P.poly([[5, 14], [15, 14], [13.5, 16.5], [6.5, 16.5]], glow, 0);
    P.set(8, 14, Or, 1); P.set(12, 14, Or, 1); P.set(10, 16, Or, 1);
    P.rect(0, 18, 20, 2, '#2a1f3a', 1);
  });
})();
