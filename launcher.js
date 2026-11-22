'use strict';
// =========================================================
//  起動画面・メニュー（カートリッジをえらぶ）・せってい・そうさ説明・ボタンテスト
// =========================================================

const SONG_MENU = {
  bpm: 112,
  tracks: [
    { wave: 'bell', vol: 0.09, gate: 0.6, pluck: true, notes: `
      E5 . G5 . C6 . G5 . A5 . G5 . E5 . D5 .  C5 . E5 . G5 . A5 . G5 - - - . . . .
      F5 . A5 . C6 . A5 . G5 . E5 . C5 . E5 .  D5 . E5 . F5 . B4 . C5 - - - . . . .` },
    { wave: 'pulse12', vol: 0.035, gate: 0.4, notes: `
      C5+E5 . . C5+E5 . . C5+E5 .  C5+E5 . . C5+E5 . . C5+E5 .  A4+C5 . . A4+C5 . . A4+C5 .  G4+B4 . . G4+B4 . . G4+B4 .
      A4+C5 . . A4+C5 . . A4+C5 .  G4+C5 . . G4+C5 . . G4+C5 .  F4+A4 . . F4+A4 . . G4+B4 .  G4+C5 . . G4+C5 . . . .` },
    { wave: 'triangle', vol: 0.15, gate: 0.7, notes: `
      C3 . . C3 . . G2 .  C3 . . C3 . . G2 .  A2 . . A2 . . E2 .  G2 . . G2 . . D3 .
      F2 . . F2 . . C3 .  C3 . . C3 . . G2 .  F2 . . F2 . . G2 .  C3 . . G2 . C3 . .` },
    { wave: 'drum', vol: 0.11, notes: `K . h . S . h K . K h . S . h h` },
  ],
};

// ---- マスコットのタコ ----
const TACO_PAL = { K: '#2a1430', P: '#ff7a9c', p: '#e2507a', W: '#ffffff', r: '#ff4a6a', h: '#ffc0d0' };
const SPR_TACO = pix(`
....KKKKKKKK....
..KKPPPPPPhhKK..
.KPPPPPPPPPhhPK.
.KPPPPPPPPPPhPK.
KPPPPPPPPPPPPPPK
KPPWKPPPPPPWKPPK
KPPKKPPPPPPKKPPK
KPrrPPPKKPPPrrPK
.KPPPPPPPPPPPPK.
.KpPPPPPPPPPPpK.
KPPKpPPKKPPpKPPK
KPK.KPpKKpPK.KPK
.K..KPK..KPK..K.
.....K....K.....
`, TACO_PAL);
const SPR_TACO2 = pix(`
....KKKKKKKK....
..KKPPPPPPhhKK..
.KPPPPPPPPPhhPK.
.KPPPPPPPPPPhPK.
KPPPPPPPPPPPPPPK
KPPWKPPPPPPWKPPK
KPPKKPPPPPPKKPPK
KPrrPPPKKPPPrrPK
.KPPPPPPPPPPPPK.
.KpPPPPPPPPPPpK.
.KPPKpPKKPpKPPK.
KPK.KPpKKpPK.KPK
K...KPK..KPK...K
....K......K....
`, TACO_PAL);

// ---------------------------------------------------------
//  起動：文字がはねて NEW TACO のロゴに
// ---------------------------------------------------------
function drawLogo(cx, y, t, big = true) {
  const word = 'TACO', cols = [PINK, GOLD, LIME, SKY];
  const sc = big ? 5 : 3, step = 6 * sc;
  const x0 = cx - Math.floor((word.length * step - sc) / 2);
  for (let i = 0; i < word.length; i++) {
    const k = clamp((t - i * 6) / 22, 0, 1);
    const dy = k < 1 ? -(1 - easeBack(k)) * 60 : Math.sin((t + i * 8) * 0.06) * 1.5;
    if (k <= 0) continue;
    const x = x0 + i * step, yy = y + dy;
    text(word[i], x + 2, yy + 3, INK, { scale: sc });
    text(word[i], x, yy, cols[i], { scale: sc, outline: INK });
  }
  const nk = clamp((t - 26) / 14, 0, 1);
  if (nk > 0) {
    const w = textWidth('NEW', 2) + 10;
    const nx = cx - w / 2, ny = y - 22 + (1 - easeOut(nk)) * -10;
    rrect(nx, ny, w, 18, INK, 2); rrect(nx + 1, ny + 1, w - 2, 16, WHITE, 2);
    text('NEW', nx + 5, ny + 2, ROSE, { scale: 2 });
  }
}

function Boot() {
  let t = 0;
  return {
    pausable: false,
    update() {
      t++;
      if (t === 34) { Audio_.sfx('boot'); P.burst(W / 2, 128, 40, { speed: 3, col: [PINK, GOLD, LIME, SKY, WHITE], life: 50, grav: 0.04, shape: 'star' }); }
      if (t > 230 || (t > 14 && (Input.tapped || anyNew()))) Engine.go(() => Launcher());
    },
    draw() {
      vgrad(0, 0, W, H, '#2b1d4a', '#120f1c');
      // ほし
      for (let i = 0; i < 40; i++) { const x = hash2(i, 1) * W, y = hash2(i, 2) * H; if (((t >> 3) + i) % 7) rect(x, y, 1, 1, i % 3 ? GRAY : WHITE); }
      drawLogo(W / 2, 112, t);
      if (t > 40) {
        const k = clamp((t - 40) / 20, 0, 1);
        const ty = 170 + (1 - easeOut(k)) * 30;
        img(((t >> 4) & 1) ? SPR_TACO : SPR_TACO2, W / 2 - 16, ty, 2);
      }
      if (t > 70) {
        jtext('ゲームコレクション', W / 2, 214, WHITE, { align: 'center', outline: INK });
        tiny('FOR GAMESIR POCKET TACO', W / 2, 232, MUTE, { align: 'center' });
      }
      if (t > 110 && (t >> 4) & 1) tiny('PRESS ANY BUTTON', W / 2, 290, GRAY, { align: 'center' });
    },
  };
}

// ---------------------------------------------------------
//  メニュー：ゲームのカートリッジをえらぶ
// ---------------------------------------------------------
let launcherSel = Save.get('lastGame', 0);
function drawCart(g, cx, y, t, scale = 1, active = true) {
  const w = Math.round(150 * scale), h = Math.round(164 * scale);
  const x = Math.round(cx - w / 2);
  const body = g.cart || '#d8d4e6', dark = mix(body, INK, 0.35), lite = mix(body, WHITE, 0.45);
  // かげ
  ctx.globalAlpha = 0.35; rrect(x + 4, y + 6, w, h, INK, 3); ctx.globalAlpha = 1;
  // 本体
  rrect(x, y, w, h, INK, 3);
  rrect(x + 1, y + 1, w - 2, h - 2, body, 3);
  rect(x + 3, y + 2, w - 6, 1, lite);
  // 上のみぞ
  for (let i = 0; i < 5; i++) rect(x + 10, y + 7 + i * 3, w - 20, 1, dark);
  // ラベル
  const lx = x + 8, ly = y + 24, lw = w - 16, lh = h - 36;
  rect(lx - 1, ly - 1, lw + 2, lh + 2, dark);
  rect(lx, ly, lw, lh, g.labelBg || WHITE);
  if (scale === 1 && active && g.preview) {
    ctx.save(); ctx.beginPath(); ctx.rect(lx, ly, lw, lh - 22); ctx.clip();
    g.preview(t, lx, ly, lw, lh - 22);
    ctx.restore();
  } else if (scale === 1 && g.preview) {
    ctx.save(); ctx.beginPath(); ctx.rect(lx, ly, lw, lh - 22); ctx.clip();
    g.preview(0, lx, ly, lw, lh - 22);
    ctx.restore();
  }
  if (scale === 1) {
    rect(lx, ly + lh - 22, lw, 22, g.col || GOLD);
    rect(lx, ly + lh - 22, lw, 1, INK);
    text(g.title, cx, ly + lh - 18, INK, { align: 'center' });
    jtext(g.jp, cx, ly + lh - 10, INK, { align: 'center' });
  } else {
    rect(lx, ly + lh - 10, lw, 10, g.col || GOLD);
  }
  // 下のでっぱり
  rect(x + 20, y + h - 4, w - 40, 2, dark);
}

function Launcher() {
  let t = 0, slide = 0, row = 0, sub = 0;
  const subs = [['せってい', () => Settings()], ['そうさ', () => ControlsScreen()], ['ボタンテスト', () => ControllerTest()]];
  return {
    pausable: false,
    enter() { Audio_.play(SONG_MENU); },
    update() {
      t++;
      const n = GAMES.length;
      if (launcherSel >= n) launcherSel = 0;
      slide *= 0.8; if (Math.abs(slide) < 0.01) slide = 0;
      if (row === 0) {
        if (btnrep(BTN.LEFT, 16, 8) || btnp(BTN.L1)) { launcherSel = (launcherSel + n - 1) % n; slide = -1; Audio_.sfx('whoosh'); }
        if (btnrep(BTN.RIGHT, 16, 8) || btnp(BTN.R1)) { launcherSel = (launcherSel + 1) % n; slide = 1; Audio_.sfx('whoosh'); }
        if (btnp(BTN.DOWN)) { row = 1; Audio_.sfx('move'); }
        if (btnp(BTN.A) || btnp(BTN.START)) {
          Audio_.sfx('select'); Save.set('lastGame', launcherSel);
          const g = GAMES[launcherSel]; Engine.go(() => g.create());
        }
      } else {
        if (btnp(BTN.UP) || btnp(BTN.B)) { row = 0; Audio_.sfx('back'); }
        if (btnp(BTN.LEFT)) { sub = (sub + subs.length - 1) % subs.length; Audio_.sfx('move'); }
        if (btnp(BTN.RIGHT)) { sub = (sub + 1) % subs.length; Audio_.sfx('move'); }
        if (btnp(BTN.A) || btnp(BTN.START)) { Audio_.sfx('select'); Engine.go(subs[sub][1]); }
      }
    },
    draw() {
      const g = GAMES[launcherSel] || GAMES[0];
      // 背景：ななめのしま
      vgrad(0, 0, W, H, g.bg0 || '#3a2a66', g.bg1 || '#160f26');
      ctx.globalAlpha = 0.07;
      for (let i = -20; i < 30; i++) { const x = i * 24 + ((t * 0.3) % 24); ctx.fillStyle = WHITE; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 12, 0); ctx.lineTo(x + 12 - H, H); ctx.lineTo(x - H, H); ctx.fill(); }
      ctx.globalAlpha = 1;
      // ヘッダー
      rect(0, 0, W, 26, INK); rect(0, 26, W, 1, SLATE);
      img(((t >> 4) & 1) ? SPR_TACO : SPR_TACO2, 6, 5);
      text('NEW', 26, 5, ROSE); text('TACO', 26, 14, WHITE);
      const d = new Date(), hh = String(d.getHours()).padStart(2, '0'), mm = String(d.getMinutes()).padStart(2, '0');
      text(hh + ((t >> 5) & 1 ? ':' : ' ') + mm, W - 8, 10, LIGHT, { align: 'right' });
      // ページの点
      for (let i = 0; i < GAMES.length; i++) { const on = i === launcherSel; rect(W / 2 - GAMES.length * 5 + i * 10, 34, on ? 6 : 4, on ? 6 : 4, on ? GOLD : DIM); }
      // となりのカート（小さく）
      const n = GAMES.length;
      if (n > 1) {
        drawCart(GAMES[(launcherSel + n - 1) % n], -18 + slide * 30, 74, t, 0.55, false);
        drawCart(GAMES[(launcherSel + 1) % n], W + 18 + slide * 30, 74, t, 0.55, false);
      }
      // まん中のカート
      const bob = Math.sin(t * 0.05) * 1.5;
      drawCart(g, W / 2 + slide * 60, 44 + bob, t, 1, true);
      if (row === 0) { const b = (t >> 4) & 1; text('<', 6 - b, 118, WHITE, { outline: INK }); text('>', W - 11 + b, 118, WHITE, { outline: INK }); }
      // せつめい
      const py = 214;
      panel(4, py, W - 8, 66);
      const gw = jw(g.genre) + 8;
      rrect(10, py + 6, gw, 13, g.col || GOLD, 2); jtext(g.genre, 14, py + 8, INK);
      const best = g.best ? g.best() : '';
      if (best) jtext(best, W - 12, py + 8, GOLD, { align: 'right' });
      g.desc.slice(0, 3).forEach((l, i) => jtext(l, 10, py + 23 + i * 13, i === 0 ? WHITE : LIGHT));
      // 下のボタン
      subs.forEach(([s], i) => {
        const bw = 74, x = 5 + i * (bw + 3), y = 286, on = row === 1 && sub === i;
        rbox(x, y, bw, 18, on ? GOLD : NAVY, on ? INK : DIM, 2);
        jtext(s, x + bw / 2, y + 4, on ? INK : GRAY, { align: 'center' });
      });
      const locked = !Audio_.ctx || Audio_.ctx.state !== 'running';
      if (locked && (t >> 5) & 1) jtext('画面をタップすると音が出ます', W / 2, 308, WHITE, { align: 'center', outline: INK });
      else if (!locked && row === 0 && (t >> 4) & 1) jtext('A: あそぶ', W / 2, 308, GOLD, { align: 'center', outline: INK });
    },
  };
}

// ---------------------------------------------------------
//  せってい
// ---------------------------------------------------------
function Settings() {
  let sel = 0, t = 0;
  const rows = ['view', 'sound', 'music', 'controls', 'test', 'back'];
  return {
    pausable: false,
    update() {
      t++;
      if (btnrep(BTN.UP)) { sel = (sel + rows.length - 1) % rows.length; Audio_.sfx('move'); }
      if (btnrep(BTN.DOWN)) { sel = (sel + 1) % rows.length; Audio_.sfx('move'); }
      const r = rows[sel];
      const lr = btnrep(BTN.RIGHT, 14, 3) ? 1 : btnrep(BTN.LEFT, 14, 3) ? -1 : 0;
      if (r === 'view' && lr) { setVisible(visible + lr * 0.01); Audio_.sfx('move'); }
      if (r === 'view' && btnp(BTN.A)) { setVisible(0.64); Audio_.sfx('select'); }
      if (r === 'sound' && (lr || btnp(BTN.A))) { Audio_.setSound(!Audio_.sound); Audio_.sfx('select'); }
      if (r === 'music' && (lr || btnp(BTN.A))) { Audio_.setMusic(!Audio_.musicOn); Audio_.sfx('select'); }
      if (r === 'controls' && btnp(BTN.A)) { Audio_.sfx('select'); Engine.go(() => ControlsScreen(() => Settings())); }
      if (r === 'test' && btnp(BTN.A)) { Audio_.sfx('select'); Engine.go(() => ControllerTest(() => Settings())); }
      if (btnp(BTN.B) || (r === 'back' && btnp(BTN.A))) { Audio_.sfx('back'); Engine.toMenu(); }
    },
    draw() {
      vgrad(0, 0, W, H, '#2a2048', '#120f1c');
      rect(0, 0, W, 24, INK);
      text('SETTINGS', W / 2, 9, WHITE, { align: 'center' });
      const items = [
        ['見える範囲', Math.round(visible * 100) + '%', '左右で調整 / A で 64% にもどす'],
        ['効果音', Audio_.sound ? 'ON' : 'OFF', ''],
        ['音楽', Audio_.musicOn ? 'ON' : 'OFF', ''],
        ['ボタンのそうさ説明', '', 'ゲームごとのボタンの使い方'],
        ['ボタンテスト', '', 'コントローラーの確認'],
        ['メニューにもどる', '', ''],
      ];
      items.forEach(([l, v, h], i) => {
        const y = 32 + i * 34, on = i === sel;
        rbox(6, y, W - 12, 30, on ? GOLD : NAVY, on ? INK : DIM, 2);
        jtext(l, 14, y + 4, on ? INK : WHITE);
        if (v) text(on && i === 0 ? '< ' + v + ' >' : v, W - 14, y + 6, on ? INK : GOLD, { align: 'right' });
        if (h) jtext(h, 14, y + 16, on ? SLATE : MUTE);
      });
      // 見える範囲の目安
      if (sel === 0) { const k = (t >> 3) & 1; rect(0, H - 2, W, 2, k ? GOLD : ORANGE); jtext('いちばん下のオレンジの線が見えればOK', W / 2, 244, WHITE, { align: 'center', outline: INK }); }
      jtext('B: もどる', W / 2, 300, GRAY, { align: 'center', outline: INK });
    },
  };
}

// ---------------------------------------------------------
//  そうさの説明（ゲームごと）
// ---------------------------------------------------------
function ControlsScreen(back = () => Launcher()) {
  let gi = clamp(launcherSel, 0, GAMES.length - 1), t = 0;
  return {
    pausable: false,
    update() {
      t++;
      if (btnp(BTN.LEFT) || btnp(BTN.L1)) { gi = (gi + GAMES.length - 1) % GAMES.length; Audio_.sfx('move'); }
      if (btnp(BTN.RIGHT) || btnp(BTN.R1)) { gi = (gi + 1) % GAMES.length; Audio_.sfx('move'); }
      if (btnp(BTN.B) || btnp(BTN.A)) { Audio_.sfx('back'); Engine.go(back); }
    },
    draw() {
      const g = GAMES[gi];
      vgrad(0, 0, W, H, g.bg0 || '#2a2048', g.bg1 || '#120f1c');
      drawControls(g);
      const b = (t >> 4) & 1;
      if (GAMES.length > 1) { text('<', 4 - b, 6, WHITE, { outline: INK }); text('>', W - 9 + b, 6, WHITE, { outline: INK }); }
      jtext('左右: ゲーム切りかえ   B: もどる', W / 2, 304, GRAY, { align: 'center', outline: INK });
    },
  };
}

// ---------------------------------------------------------
//  ボタンテスト
// ---------------------------------------------------------
function ControllerTest(back = () => Launcher()) {
  let last = '-', exitHold = 0;
  return {
    pausable: false,
    update() {
      for (const b of Input.down) if (!Input.prev.has(b)) last = (BTN_NAME[b] || '?') + ' #' + b;
      exitHold = btn(BTN.START) && btn(BTN.SELECT) ? exitHold + 1 : 0;
      if (exitHold > 30) Engine.go(back);
    },
    draw() {
      vgrad(0, 0, W, H, '#2a2048', '#120f1c');
      const d = b => btn(b);
      rect(0, 0, W, 20, INK);
      text('BUTTON TEST', W / 2, 7, WHITE, { align: 'center' });
      const key = (x, y, w, h, on, label) => {
        rbox(x, y, w, h, on ? GOLD : SLATE, INK, 2);
        tiny(label, x + w / 2, y + Math.floor(h / 2) - 2, on ? INK : LIGHT, { align: 'center' });
      };
      key(8, 30, 50, 14, d(BTN.L1), 'L1');
      key(62, 32, 36, 12, d(BTN.L2), 'L2');
      key(142, 32, 36, 12, d(BTN.R2), 'R2');
      key(182, 30, 50, 14, d(BTN.R1), 'R1');
      const dx = 58, dy = 100;
      rect(dx - 9, dy - 28, 19, 57, INK); rect(dx - 28, dy - 9, 57, 19, INK);
      const arm = (x, y, on) => rect(x, y, 17, 17, on ? GOLD : SLATE);
      arm(dx - 8, dy - 27, d(BTN.UP)); arm(dx - 8, dy + 11, d(BTN.DOWN));
      arm(dx - 27, dy - 8, d(BTN.LEFT)); arm(dx + 11, dy - 8, d(BTN.RIGHT));
      rect(dx - 8, dy - 8, 17, 17, SLATE);
      const fx = 182, fy = 100;
      const rb = (x, y, label, on, col) => { circle(x, y, 10, INK); circle(x, y, 8, on ? col : SLATE); text(label, x - 2, y - 3, on ? INK : WHITE); };
      rb(fx, fy - 21, 'X', d(BTN.X), SKY); rb(fx - 21, fy, 'Y', d(BTN.Y), LIME);
      rb(fx + 21, fy, 'A', d(BTN.A), RED); rb(fx, fy + 21, 'B', d(BTN.B), GOLD);
      key(96, 64, 20, 11, false, 'M'); key(124, 64, 20, 11, d(BTN.HOME), 'H');
      key(88, 134, 30, 11, d(BTN.SELECT), 'SEL'); key(122, 134, 30, 11, d(BTN.START), 'STA');
      panel(0, 160, W, 160);
      text('LAST ' + last, 12, 172, WHITE);
      text('RAW ' + (Input.raw.join(' ') || '-'), 12, 186, GRAY);
      text(Input.padId ? 'PAD OK' : 'PRESS A BUTTON', 12, 200, Input.padId ? LIME : GRAY);
      if (Input.padId) tiny(Input.padId.slice(0, 56), 12, 214, GRAY);
      jtext('Mボタンはゲームで使えません', 12, 230, GRAY);
      jtext('SELECT+START 長おしでもどる', 12, 248, WHITE);
      if (exitHold) rect(12, 270, exitHold / 30 * 216, 3, GOLD);
    },
  };
}

// ---------------------------------------------------------
//  あそびかた（ページをめくる）。pages: [{t, lines}]
// ---------------------------------------------------------
function HowTo(pages, back, opt = {}) {
  let p = 0, t = 0;
  return {
    pausable: false,
    update() {
      t++;
      if (btnp(BTN.RIGHT) && p < pages.length - 1) { p++; Audio_.sfx('move'); }
      if (btnp(BTN.LEFT) && p > 0) { p--; Audio_.sfx('move'); }
      if (btnp(BTN.A) && p < pages.length - 1) { p++; Audio_.sfx('move'); return; }
      if (btnp(BTN.B) || btnp(BTN.A)) { Audio_.sfx('back'); Engine.go(back); }
    },
    draw() {
      if (opt.bg) opt.bg(t); else vgrad(0, 0, W, H, '#2a2048', '#120f1c');
      panel(6, 6, W - 12, H - 12, opt.fill || NAVY);
      const pg = pages[p];
      rrect(12, 12, W - 24, 18, opt.col || GOLD, 2);
      jtext(pg.t, W / 2, 16, INK, { align: 'center' });
      let y = 38;
      if (pg.art) { pg.art(t, y); y += pg.artH || 0; }
      for (const l of pg.lines) {
        if (l.startsWith('#')) { jtext(l.slice(1), 14, y, opt.col || GOLD); y += 15; continue; }
        for (const w of jwrap(l, W - 30)) { jtext(w, 15, y, WHITE); y += 13; }
        y += 3;
      }
      tiny((p + 1) + '/' + pages.length, W / 2, 300, GRAY, { align: 'center' });
      if (p > 0) text('<', 14, 298, GRAY);
      if (p < pages.length - 1 && (t >> 4) & 1) text('>', W - 19, 298, GOLD);
    },
  };
}

// ---------------------------------------------------------
//  たてにならぶメニュー
// ---------------------------------------------------------
function vmenu(x, y, w, items, sel, t, opt = {}) {
  const rowH = opt.rowH || 18;
  const h = 10 + items.length * rowH;
  panel(x, y, w, h, opt.fill || NAVY, opt.edge || WHITE);
  items.forEach((it, i) => {
    const yy = y + 6 + i * rowH, on = i === sel;
    const dis = it.disabled;
    if (on) { rect(x + 5, yy, w - 10, rowH - 3, opt.hi || SLATE); text('@', x + 8 + ((t >> 4) & 1), yy + 4, GOLD); }
    jtext(it.jp, x + 20, yy + 2, dis ? MUTE : on ? WHITE : LIGHT);
    if (it.right) jtext(it.right, x + w - 10, yy + 2, dis ? MUTE : GOLD, { align: 'right' });
  });
  return h;
}
