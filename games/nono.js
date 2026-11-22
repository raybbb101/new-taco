'use strict';
// =========================================================
//  NONO ATELIER — ノノグラム・アトリエ
//  数字をヒントにマスをぬって、ドット絵を完成させるパズル。
//  ★ かんたん：1まい絵 / ★★〜★★★★：ピースを集めて大きな絵に
// =========================================================
(() => {
  const ACC = '#ff7a59', INKC = '#2d2848', PAPERC = '#fffaf0', LINE = '#e2d6c0', LINE5 = '#a39780',
    XCOL = '#b8a8a0', BADC = '#e8384a', FADE = '#cbbfae', HLC = '#ffd35a';
  const TIERS = [null,
    { jp: 'かんたん', sub: '1まいの絵（5×5・10×10）', col: '#4fc489', stars: 1 },
    { jp: 'ふつう', sub: '4ピースで1まいの絵（2×2）', col: '#4aa8f0', stars: 2 },
    { jp: 'むずかしい', sub: '9ピースで1まいの絵（3×3）', col: '#a070f0', stars: 3 },
    { jp: 'マスター', sub: '16ピースで1まいの絵（4×4）', col: '#ff6a8a', stars: 4 },
  ];
  const UNLOCK = [0, 0, 5, 2, 2]; // 1つ前の難しさで、いくつ絵を完成させると開くか
  const FREE = /[?&]unlock\b/.test(location.search);

  // ---------------- 音楽 ----------------
  const SONG_NONO = {
    bpm: 84,
    tracks: [
      { wave: 'bell', vol: 0.075, gate: 0.7, pluck: true, notes: `
        F5 . A5 . C6 . A5 . G5 . E5 . C5 - . .  F5 . A5 . C6 . E6 . D6 - C6 - A5 - . .
        Bb5 . A5 . G5 . F5 . E5 . G5 . C6 - . .  A5 . G5 . F5 . E5 . F5 - - - . . . .` },
      { wave: 'epiano', vol: 0.045, gate: 0.95, pluck: true, notes: `
        F4+A4+E5 - - - - - - - E4+G4+D5 - - - - - - -  D4+F4+C5 - - - - - - - C4+E4+G4 - - - - - - -
        Bb3+D4+A4 - - - - - - - C4+E4+Bb4 - - - - - - -  A3+C4+G4 - - - - - - - F3+A3+C4 - - - - - - -` },
      { wave: 'triangle', vol: 0.12, gate: 0.8, notes: `
        F2 - - - . . C3 . E2 - - - . . B2 .  D2 - - - . . A2 . C2 - - - . . G2 .
        Bb1 - - - . . F2 . C2 - - - . . G2 .  A1 - - - . . E2 . F2 - - - . . . .` },
      { wave: 'drum', vol: 0.05, notes: `K . . . b . . . K . K . b . . h` },
    ],
  };

  // ---------------- 記録 ----------------
  const S = {
    done: Save.get('nono_done', {}), prog: Save.get('nono_prog', {}), seen: Save.get('nono_seen', {}),
    opt: Object.assign({ assist: true, autoX: true, fast: false }, Save.get('nono_opt', {})),
    last: Save.get('nono_last', null),
    save() { Save.set('nono_done', this.done); Save.set('nono_prog', this.prog); Save.set('nono_seen', this.seen); Save.set('nono_last', this.last); },
    saveOpt() { Save.set('nono_opt', this.opt); },
  };
  const pieceDone = pz => pz.empty || !!S.done[pz.id];
  const artPieces = a => NONO.piecesOf(a);
  const artCount = a => { const ps = artPieces(a).filter(p => !p.empty); return [ps.filter(p => S.done[p.id]).length, ps.length]; };
  const artDone = a => { const [d, n] = artCount(a); return d === n; };
  const tierDone = t => NONO.ofTier(t).filter(artDone).length;
  const tierOpen = t => FREE || t === 1 || tierDone(t - 1) >= UNLOCK[t];
  const allPuzzles = () => NONO.art.reduce((s, a) => s + artCount(a)[1], 0);
  const allDone = () => NONO.art.reduce((s, a) => s + artCount(a)[0], 0);
  const mmss = sec => Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');

  // 絵のキャンバス
  const _cv = {};
  function artCanvas(a) {
    if (_cv[a.id]) return _cv[a.id];
    const c = document.createElement('canvas'); c.width = a.w; c.height = a.h;
    const g = c.getContext('2d'), id = g.createImageData(a.w, a.h);
    a.col.forEach((hx, i) => { const n = parseInt(hx.slice(1), 16); id.data[i * 4] = n >> 16; id.data[i * 4 + 1] = (n >> 8) & 255; id.data[i * 4 + 2] = n & 255; id.data[i * 4 + 3] = 255; });
    g.putImageData(id, 0, 0);
    return (_cv[a.id] = c);
  }
  // 絵を描く（完成したピースだけ色つき）
  function drawArt(a, x, y, s, opt = {}) {
    const cv = artCanvas(a), P = NONO.PIECE;
    if (a.tier === 1) {
      if (opt.all || S.done[a.id]) ctx.drawImage(cv, x, y, a.w * s, a.h * s);
      else rect(x, y, a.w * s, a.h * s, '#efe4cf');
      return;
    }
    for (const pz of artPieces(a)) {
      const dx = x + pz.x0 * s + (opt.gap ? pz.px * opt.gap : 0), dy = y + pz.y0 * s + (opt.gap ? pz.py * opt.gap : 0);
      if (opt.all || pieceDone(pz)) ctx.drawImage(cv, pz.x0, pz.y0, pz.w, pz.h, dx, dy, pz.w * s, pz.h * s);
      else rect(dx, dy, pz.w * s, pz.h * s, (pz.px + pz.py) % 2 ? '#efe4cf' : '#e8dcc4');
    }
  }
  // 背景（アトリエの紙）
  function bgAtelier(t, tint = '#ffd9b0') {
    vgrad(0, 0, W, H, mix('#fff3e2', tint, 0.35), mix('#f6e2cc', tint, 0.5));
    ctx.globalAlpha = 0.18;
    const o = (t * 0.25) % 32;
    for (let y = -32; y < H; y += 32) for (let x = -32; x < W; x += 32) {
      const cx = x + o, cy = y + o;
      if (((x + y) / 32) % 2 === 0) rect(cx, cy, 16, 16, WHITE);
    }
    ctx.globalAlpha = 1;
  }
  function header(title, sub, col) {
    rect(0, 0, W, 26, INKC); rect(0, 26, W, 2, col);
    jtext(title, 10, 7, WHITE);
    if (sub) jtext(sub, W - 8, 7, col, { align: 'right' });
  }

  // =========================================================
  //  タイトル
  // =========================================================
  let titleArt = 'cat';
  function NonoTitle() {
    let t = 0, sel = 0;
    const items = () => [
      S.last && S.prog[S.last] && findPiece(S.last) ? { jp: 'つづきから', act: () => { const pz = findPiece(S.last); Engine.go(() => Play(pz)); } } : null,
      { jp: 'パズルをえらぶ', act: () => Engine.go(() => TierSelect()) },
      { jp: 'ギャラリー', act: () => Engine.go(() => Gallery()) },
      { jp: 'せってい', act: () => Engine.go(() => NonoOptions()) },
      { jp: 'あそびかた', act: () => Engine.go(() => HowTo(HOWTO, () => NonoTitle(), { col: ACC, bg: t => bgAtelier(t), fill: INKC })) },
      { jp: 'メニューへ', act: () => Engine.toMenu() },
    ].filter(Boolean);
    const done = NONO.art.filter(artDone);
    const show = NONO.byId[done.length ? done[(Math.random() * done.length) | 0].id : titleArt];
    return {
      pausable: false, game: GAME,
      enter() { Audio_.play(SONG_NONO); },
      update() {
        t++;
        const it = items();
        if (btnrep(BTN.UP)) { sel = (sel + it.length - 1) % it.length; Audio_.sfx('move'); }
        if (btnrep(BTN.DOWN)) { sel = (sel + 1) % it.length; Audio_.sfx('move'); }
        if (btnp(BTN.A) || btnp(BTN.START)) { Audio_.sfx('select'); it[sel].act(); }
        if (btnp(BTN.B)) { Audio_.sfx('back'); Engine.toMenu(); }
      },
      draw() {
        bgAtelier(t);
        // イーゼルと絵
        const s = Math.floor(96 / Math.max(show.w, show.h)), aw = show.w * s, ah = show.h * s;
        const ex = W / 2 - aw / 2, ey = 58;
        rect(W / 2 - 2, ey + ah, 4, 40, '#a0603a'); line(W / 2 - 30, ey + ah + 40, W / 2 - 8, ey + ah, '#8a5030'); line(W / 2 + 30, ey + ah + 40, W / 2 + 8, ey + ah, '#8a5030');
        rect(ex - 8, ey + ah + 2, aw + 16, 4, '#8a5030');
        ctx.globalAlpha = 0.25; rect(ex - 2, ey + 4, aw + 8, ah + 4, INK); ctx.globalAlpha = 1;
        rect(ex - 4, ey - 4, aw + 8, ah + 8, '#f8f0e0'); rectLine(ex - 4, ey - 4, aw + 8, ah + 8, '#a0603a');
        const per = show.w * show.h, k = (t * 2) % (per + 160);
        const cv = artCanvas(show);
        for (let i = 0; i < per; i++) {
          const x = i % show.w, y = (i / show.w) | 0, ord = (x + y * show.w);
          if (ord < k - 40) ctx.drawImage(cv, x, y, 1, 1, ex + x * s, ey + y * s, s, s);
          else if (ord < k && show.ink[i]) rect(ex + x * s, ey + y * s, s, s, INKC);
          else rect(ex + x * s, ey + y * s, s, s, (x + y) % 2 ? '#fffaf0' : '#f6eedd');
        }
        // タイトル
        const ty = 12;
        text('NONO', 64, ty + 1, INK, { scale: 3 });
        text('NONO', 63, ty, ACC, { scale: 3, outline: INK });
        text('ATELIER', 137, ty + 13, INKC);
        jtext('ノノグラム・アトリエ', W / 2, 38, INKC, { align: 'center' });
        const it = items();
        const mh = it.length * 17 + 10, my = H - mh - 22;
        vmenu(48, my, W - 96, it, sel, t, { rowH: 17, fill: INKC, edge: PAPERC, hi: '#4a4070' });
        jtext(`クリア ${allDone()} / ${allPuzzles()}`, W / 2, H - 16, INKC, { align: 'center' });
      },
    };
  }
  function findPiece(id) {
    const [aid] = id.split('@'); const a = NONO.byId[aid]; if (!a) return null;
    return artPieces(a).find(p => p.id === id) || null;
  }

  const HOWTO = [
    { t: 'ノノグラムってなに？', lines: ['たてと よこの 数字をヒントに、マスを ぬっていくパズルです。', 'ぜんぶ 正しく ぬれると、ドット絵が あらわれて 色がつきます！', '#数字の よみかた', '「3 1」なら、その列に「3つ続けてぬる」と「1つぬる」が この順にある、という意味。あいだには 1マス以上の すきまがあります。'] },
    { t: 'とくコツ', lines: ['「10」や 大きい数字の列から 考えると かんたん。', 'ぜったいに ぬらないマスには ×をつけておくと まちがえにくいよ。', 'こまったら X ボタンで ヒント。1列ぶんを 教えてくれます。'] },
    { t: 'ピースで 大きな絵', lines: ['★★ ふつう から上は、1まいの大きな絵が いくつかの ピースに分かれています。', 'ピースは どれから といてもOK。ぜんぶ とくと 大きな絵が かんせい！', '#つぎの難しさ', 'かんたんで 5まい、ふつう・むずかしいで 2まいずつ 絵を完成させると、つぎの難しさが ひらきます。'] },
    { t: 'ボタン', lines: ['十字：カーソル  A：ぬる  B：×', 'Y：ひとつ もどす  X：ヒント', 'SELECT（おしたまま）：絵の全体を見る', 'START：ポーズ', 'A・B は おしたまま 動かすと、まとめて ぬれます。'] },
  ];

  // =========================================================
  //  難しさをえらぶ
  // =========================================================
  let tierSel = 1;
  function TierSelect() {
    let t = 0;
    return {
      pausable: false, game: GAME,
      enter() { Audio_.play(SONG_NONO); },
      update() {
        t++;
        if (btnrep(BTN.UP)) { tierSel = tierSel > 1 ? tierSel - 1 : 4; Audio_.sfx('move'); }
        if (btnrep(BTN.DOWN)) { tierSel = tierSel < 4 ? tierSel + 1 : 1; Audio_.sfx('move'); }
        if (btnp(BTN.A)) {
          if (!tierOpen(tierSel)) { Audio_.sfx('deny'); FX.shake(2); return; }
          Audio_.sfx('select'); Engine.go(() => PicSelect(tierSel));
        }
        if (btnp(BTN.B)) { Audio_.sfx('back'); Engine.go(() => NonoTitle()); }
      },
      draw() {
        bgAtelier(t, TIERS[tierSel].col);
        header('むずかしさを えらぶ', '', ACC);
        for (let i = 1; i <= 4; i++) {
          const T = TIERS[i], y = 34 + (i - 1) * 68, on = i === tierSel, open = tierOpen(i);
          const x = on ? 6 : 12;
          ctx.globalAlpha = 0.25; rrect(x + 3, y + 4, W - 18, 62, INK, 3); ctx.globalAlpha = 1;
          rbox(x, y, W - 18, 62, open ? PAPERC : '#e4dccd', on ? INKC : '#b8ab96', 3);
          rect(x + 1, y + 3, 5, 56, open ? T.col : '#b8ab96');
          jtext('★'.repeat(T.stars), x + 12, y + 5, open ? T.col : '#a89c88');
          jtext(T.jp, x + 14 + T.stars * 9, y + 1, open ? INKC : '#968a76', { size: 16 });
          jtext(T.sub, x + 12, y + 24, open ? '#6a6080' : '#a89c88');
          const arts = NONO.ofTier(i), d = arts.filter(artDone).length;
          const sx = x + W - 66;
          if (open) {
            bar(x + 12, y + 43, 92, 7, d, arts.length, T.col, '#efe6d6', INKC);
            jtext(`${d}/${arts.length}まい`, x + 110, y + 40, INKC);
            const sample = arts.find(artDone) || arts[0];
            const s = Math.max(1, Math.floor(40 / sample.w));
            rect(sx, y + 8, 46, 46, '#efe4cf'); rectLine(sx, y + 8, 46, 46, INKC);
            drawArt(sample, sx + Math.floor((46 - sample.w * s) / 2), y + 8 + Math.floor((46 - sample.h * s) / 2), s);
            if (!artDone(sample) && sample.tier === 1) text('?', sx + 18, y + 25, '#c8b898', { scale: 2 });
          } else {
            jtext(`${TIERS[i - 1].jp}で ${UNLOCK[i]}まい完成で ひらく`, x + 12, y + 42, '#8a7e6a');
            drawLock(sx + 14, y + 18);
          }
          if (on) text('@', x - 2 + ((t >> 4) & 1), y + 26, ACC, { outline: INK });
        }
        jtext('A: えらぶ   B: もどる', W / 2, H - 14, INKC, { align: 'center' });
      },
    };
  }
  function drawLock(x, y) {
    rect(x + 4, y, 10, 2, '#8a7e6a'); rect(x + 3, y + 1, 2, 8, '#8a7e6a'); rect(x + 13, y + 1, 2, 8, '#8a7e6a');
    rbox(x, y + 8, 18, 14, '#c8b080', '#6a5e4a', 2); rect(x + 8, y + 12, 2, 5, '#6a5e4a');
  }

  // =========================================================
  //  絵をえらぶ
  // =========================================================
  const picSel = [0, 0, 0, 0, 0];
  function PicSelect(tier, justDone = null) {
    const arts = NONO.ofTier(tier), T = TIERS[tier];
    const COLS = 4, CW = 56, CH = 62, OX = Math.floor((W - COLS * CW) / 2), OY = 34, VIEW = 216;
    let t = 0, scroll = -1;
    const rowOf = i => Math.floor(i / COLS);
    const wantScroll = () => clamp(rowOf(picSel[tier]) * CH - VIEW / 2 + CH / 2, 0, Math.max(0, Math.ceil(arts.length / COLS) * CH - VIEW));
    return {
      pausable: false, game: GAME,
      enter() { Audio_.play(SONG_NONO); scroll = wantScroll(); },
      update() {
        t++;
        let s = picSel[tier];
        const d = dirRep(12, 5);
        if (d) {
          const n = arts.length;
          if (d[0]) s = (s + d[0] + n) % n;
          if (d[1]) { const ns = s + d[1] * COLS; if (ns >= 0 && ns < n) s = ns; else if (d[1] > 0 && rowOf(s) < rowOf(n - 1)) s = n - 1; }
          if (s !== picSel[tier]) { picSel[tier] = s; Audio_.sfx('cursor'); }
        }
        scroll = lerp(scroll, wantScroll(), 0.25);
        if (btnp(BTN.A)) {
          const a = arts[picSel[tier]];
          Audio_.sfx('select');
          if (tier === 1) Engine.go(() => Play(artPieces(a)[0]));
          else Engine.go(() => PieceSelect(a));
        }
        if (btnp(BTN.Y)) { const a = arts[picSel[tier]]; if (artDone(a)) { Audio_.sfx('select'); Engine.go(() => ViewArt(a, () => PicSelect(tier))); } }
        if (btnp(BTN.B)) { Audio_.sfx('back'); Engine.go(() => TierSelect()); }
      },
      draw() {
        bgAtelier(t, T.col);
        ctx.save(); ctx.beginPath(); ctx.rect(0, OY - 4, W, VIEW + 6); ctx.clip();
        arts.forEach((a, i) => {
          const cx = OX + (i % COLS) * CW, cy = OY + rowOf(i) * CH - Math.round(scroll);
          if (cy < OY - CH || cy > OY + VIEW) return;
          const on = i === picSel[tier], done = artDone(a), [dn, tn] = artCount(a);
          const bx = cx + 3, by = cy + 2, bw = CW - 6, bh = 50;
          rbox(bx, by, bw, bh, done ? '#ffffff' : PAPERC, on ? ACC : '#c8b898', 2);
          if (on) rectLine(bx - 1, by - 1, bw + 2, bh + 2, ACC);
          const s = Math.max(1, Math.floor(40 / a.w)), aw = a.w * s, ah = a.h * s;
          const ax = bx + Math.floor((bw - aw) / 2), ay = by + Math.floor((bh - ah) / 2);
          if (tier === 1 && !done) {
            rect(ax, ay, aw, ah, '#efe4cf');
            text('?', bx + bw / 2 - 5, by + 18, '#c8b898', { scale: 2 });
            tiny(a.w + 'X' + a.h, bx + bw / 2, by + bh - 9, '#a89c88', { align: 'center' });
            if (S.prog[a.id]) rect(bx + bw - 6, by + 3, 3, 3, ACC);
          } else drawArt(a, ax, ay, s);
          if (justDone === a.id && t < 30) { ctx.globalAlpha = 1 - t / 30; rect(bx, by, bw, bh, WHITE); ctx.globalAlpha = 1; }
          const label = done ? '' : tier === 1 ? '' : `${dn}/${tn}`;
          tiny(String(i + 1).padStart(2, '0'), bx + 2, by + bh + 2, '#8a7e6a');
          if (done) text('*', bx + bw - 6, by + bh + 1, T.col);
          else if (label) tiny(label, bx + bw - 1, by + bh + 2, INKC, { align: 'right' });
        });
        ctx.restore();
        header(`${'★'.repeat(T.stars)} ${T.jp}`, `${arts.filter(artDone).length} / ${arts.length}`, T.col);
        // した：じょうほう
        const a = arts[picSel[tier]], done = artDone(a), [dn, tn] = artCount(a);
        const py = 256;
        rbox(4, py, W - 8, 60, INKC, PAPERC, 3);
        jtext(done ? a.name : '？？？', 12, py + 6, done ? WHITE : GRAY, { size: 10 });
        jtext(`${a.w}×${a.h}${tier > 1 ? ` ・ ${tn}ピース` : ''}`, W - 12, py + 6, T.col, { align: 'right' });
        const best = artPieces(a).filter(p => S.done[p.id]).reduce((s, p) => s + S.done[p.id].t, 0);
        if (done) jtext(`クリア！  タイム ${mmss(best)}`, 12, py + 22, LIGHT);
        else if (dn) jtext(`とちゅう ${dn}/${tn}ピース`, 12, py + 22, LIGHT);
        else jtext(S.prog[artPieces(a)[0].id] ? 'とちゅう' : 'まだ といていない', 12, py + 22, MUTE);
        jtext(done ? 'A: あそぶ  Y: 絵を見る  B: もどる' : 'A: あそぶ  B: もどる', 12, py + 40, GRAY);
      },
    };
  }

  // =========================================================
  //  ピースをえらぶ（大きな絵）
  // =========================================================
  function PieceSelect(a, sel = null, justDone = null) {
    const ps = artPieces(a), nx = ps[0].nx, ny = ps[0].ny, T = TIERS[a.tier];
    const s = Math.floor(Math.min(204 / a.w, 196 / a.h)), GAP = 3;
    const tw = a.w * s + (nx - 1) * GAP, th = a.h * s + (ny - 1) * GAP;
    const ox = Math.floor((W - tw) / 2), oy = 38 + Math.floor((196 - th) / 2);
    if (sel === null) { sel = ps.findIndex(p => !pieceDone(p)); if (sel < 0) sel = 0; }
    let t = 0, goReveal = artDone(a) && !S.seen[a.id] ? 40 : 0;
    return {
      pausable: false, game: GAME,
      enter() { Audio_.play(SONG_NONO); if (justDone) Audio_.sfx('pop'); },
      update() {
        t++;
        if (goReveal) { if (--goReveal === 0) Engine.go(() => ViewArt(a, () => PicSelect(a.tier, a.id), true)); return; }
        const d = dirRep(12, 5);
        if (d) {
          const x = (sel % nx + d[0] + nx) % nx, y = (Math.floor(sel / nx) + d[1] + ny) % ny;
          sel = y * nx + x; Audio_.sfx('cursor');
        }
        if (btnp(BTN.A)) {
          const pz = ps[sel];
          if (pz.empty) { Audio_.sfx('deny'); FX.float(W / 2, 236, 'このピースは なにもないよ', MUTE, { j: true }); return; }
          Audio_.sfx('select'); Engine.go(() => Play(pz));
        }
        if (btnp(BTN.Y) && artDone(a)) { Audio_.sfx('select'); Engine.go(() => ViewArt(a, () => PieceSelect(a, sel))); }
        if (btnp(BTN.B)) { Audio_.sfx('back'); Engine.go(() => PicSelect(a.tier)); }
      },
      draw() {
        bgAtelier(t, T.col);
        const [dn, tn] = artCount(a);
        header(artDone(a) ? a.name : '？？？', `${dn} / ${tn}`, T.col);
        ctx.globalAlpha = 0.25; rect(ox - 2, oy + 2, tw + 8, th + 6, INK); ctx.globalAlpha = 1;
        rect(ox - 4, oy - 4, tw + 8, th + 8, INKC);
        ps.forEach((pz, i) => {
          const x = ox + pz.px * (10 * s + GAP), y = oy + pz.py * (10 * s + GAP), pw = pz.w * s, ph = pz.h * s;
          const done = pieceDone(pz);
          let flip = 1;
          if (justDone === pz.id) flip = clamp((t - 6) / 14, 0, 1);
          if (done && flip >= 1) ctx.drawImage(artCanvas(a), pz.x0, pz.y0, pz.w, pz.h, x, y, pw, ph);
          else if (done) {
            const k = Math.abs(1 - flip * 2), hh = Math.max(1, Math.round(ph * k));
            if (flip < 0.5) rect(x, y + (ph - hh) / 2, pw, hh, PAPERC);
            else ctx.drawImage(artCanvas(a), pz.x0, pz.y0, pz.w, pz.h, x, y + (ph - hh) / 2, pw, hh);
          } else {
            rect(x, y, pw, ph, PAPERC);
            for (let k = 1; k < 10; k++) { frect(x + k * s, y, 0.5, ph, '#efe4d0'); frect(x, y + k * s, pw, 0.5, '#efe4d0'); }
            const pg = S.prog[pz.id];
            if (pg) for (let k = 0; k < pg.g.length; k++) if (pg.g[k] === '1') rect(x + (k % pz.w) * s, y + Math.floor(k / pz.w) * s, s, s, '#c8bce0');
            text(String(pz.no), x + pw / 2, y + ph / 2 - 3, '#c8b898', { align: 'center', scale: s >= 8 ? 2 : 1 });
          }
          if (justDone === pz.id && t > 18 && t < 40) { ctx.globalAlpha = (40 - t) / 22; rect(x, y, pw, ph, WHITE); ctx.globalAlpha = 1; }
          if (i === sel) {
            const pulse = (t >> 3) & 1;
            rectLine(x - 2, y - 2, pw + 4, ph + 4, pulse ? ACC : '#ffffff');
            rectLine(x - 1, y - 1, pw + 2, ph + 2, INKC);
          }
        });
        if (justDone && t === 22) { const pz = ps.find(p => p.id === justDone); if (pz) P.burst(ox + pz.px * (10 * s + GAP) + pz.w * s / 2, oy + pz.py * (10 * s + GAP) + pz.h * s / 2, 24, { speed: 2.5, col: [ACC, GOLD, WHITE, T.col], shape: 'star', life: 36 }); }
        const pz = ps[sel], py = 250;
        rbox(4, py, W - 8, 66, INKC, PAPERC, 3);
        jtext(`ピース ${pz.no}`, 12, py + 6, WHITE);
        tiny(`${pz.w}X${pz.h}`, W - 12, py + 9, T.col, { align: 'right' });
        const dd = S.done[pz.id];
        if (pz.empty) jtext('なにもない ピース（クリアずみ）', 12, py + 22, MUTE);
        else if (dd) jtext(`クリア  ${mmss(dd.t)}${dd.p ? '  パーフェクト！' : ''}`, 12, py + 22, dd.p ? GOLD : LIGHT);
        else if (S.prog[pz.id]) jtext('とちゅう', 12, py + 22, LIGHT);
        else jtext('まだ', 12, py + 22, MUTE);
        jtext(artDone(a) ? 'A: あそぶ  Y: 絵を見る  B: もどる' : 'A: あそぶ  B: もどる', 12, py + 42, GRAY);
      },
    };
  }

  // =========================================================
  //  絵を見る / 完成！
  // =========================================================
  function ViewArt(a, back, reveal = false) {
    let t = 0;
    const s = Math.max(1, Math.floor(Math.min(216 / a.w, 196 / a.h)));
    const aw = a.w * s, ah = a.h * s, ax = Math.floor((W - aw) / 2), ay = 46 + Math.floor((196 - ah) / 2);
    const total = artPieces(a).filter(p => S.done[p.id]).reduce((n, p) => n + S.done[p.id].t, 0);
    const perfect = artPieces(a).every(p => p.empty || (S.done[p.id] && S.done[p.id].p));
    const T = TIERS[a.tier];
    return {
      pausable: false, game: GAME,
      enter() {
        if (reveal) { S.seen[a.id] = true; S.save(); Audio_.stop(); }
      },
      update() {
        t++;
        if (reveal && t === 34) { Audio_.sfx('fanfare'); }
        if (reveal && t > 34 && t < 160 && t % 6 === 0) P.burst(rand(20, W - 20), rand(40, 120), 10, { speed: 2, col: [ACC, GOLD, PINK, SKY, LIME, WHITE], grav: 0.06, life: 50, shape: t % 12 ? 'sq' : 'star', size: 2 });
        if (t > (reveal ? 70 : 10) && (btnp(BTN.A) || btnp(BTN.B))) { Audio_.sfx('back'); if (reveal) Audio_.play(SONG_NONO); Engine.go(back); }
      },
      draw() {
        const k = reveal ? clamp((t - 4) / 30, 0, 1) : 1;
        vgrad(0, 0, W, H, mix('#2a2048', T.col, 0.25), '#140f22');
        // ひかり
        ctx.globalAlpha = 0.12 * k;
        for (let i = 0; i < 12; i++) { const an = i / 12 * Math.PI * 2 + t * 0.004; ctx.fillStyle = '#fff6d0'; ctx.beginPath(); ctx.moveTo(W / 2, ay + ah / 2); ctx.lineTo(W / 2 + Math.cos(an) * 300, ay + ah / 2 + Math.sin(an) * 300); ctx.lineTo(W / 2 + Math.cos(an + 0.18) * 300, ay + ah / 2 + Math.sin(an + 0.18) * 300); ctx.fill(); }
        ctx.globalAlpha = 1;
        const gap = reveal ? Math.round((1 - easeOut(k)) * 4) : 0;
        const gw = a.tier > 1 ? (artPieces(a)[0].nx - 1) * gap : 0;
        rect(ax - 6 - gw / 2, ay - 6 - gw / 2, aw + 12 + gw, ah + 12 + gw, '#f8f0e0'); rectLine(ax - 6 - gw / 2, ay - 6 - gw / 2, aw + 12 + gw, ah + 12 + gw, '#c8a070');
        drawArt(a, ax - gw / 2, ay - gw / 2, s, { all: true, gap });
        if (reveal && t >= 30 && t < 40) { ctx.globalAlpha = (40 - t) / 10; rect(0, 0, W, H, WHITE); ctx.globalAlpha = 1; }
        if (!reveal || t > 40) {
          const k2 = reveal ? clamp((t - 40) / 16, 0, 1) : 1;
          const ty = 8 - (1 - easeBack(k2)) * 30;
          if (reveal) text('COMPLETE!', W / 2, ty, GOLD, { align: 'center', scale: 2, outline: INK });
          jtext(`「${a.name}」`, W / 2, reveal ? ty + 20 : 14, WHITE, { align: 'center', outline: INK, size: 16 });
          const iy = ay + ah + 12;
          jtext(`${'★'.repeat(T.stars)} ${T.jp}   ${a.w}×${a.h}   タイム ${mmss(total)}`, W / 2, iy, LIGHT, { align: 'center' });
          if (perfect) jtext('ノーミス・ノーヒント パーフェクト！', W / 2, iy + 14, GOLD, { align: 'center' });
          if ((t >> 4) & 1 && t > (reveal ? 70 : 10)) jtext('A: もどる', W / 2, H - 14, GRAY, { align: 'center' });
        }
      },
    };
  }

  // =========================================================
  //  プレイ画面
  // =========================================================
  function Play(pz) {
    const w = pz.w, h = pz.h, N = w * h, sol = pz.ink, a = pz.art, T = TIERS[a.tier];
    const g = new Int8Array(N), giv = new Uint8Array(N), bad = new Uint8Array(N), pop = new Float32Array(N), hintFx = new Float32Array(N);
    let cx = 0, cy = 0, time = 0, miss = 0, hints = 0, state = 'play', ct = 0, peek = 0, autoQ = [];
    const undo = [];
    let stroke = null, flashLine = null;
    for (const i of pz.givens) { giv[i] = 1; g[i] = sol[i] ? 1 : 2; }
    const saved = S.prog[pz.id];
    if (saved && saved.g.length === N) {
      for (let i = 0; i < N; i++) if (!giv[i]) { g[i] = +saved.g[i] === 3 ? 2 : +saved.g[i]; if (+saved.g[i] === 3) bad[i] = 1; }
      time = saved.t || 0; miss = saved.m || 0; hints = saved.h || 0; cx = saved.cx || 0; cy = saved.cy || 0;
    }
    S.last = pz.id; Save.set('nono_last', S.last);
    const rowOK = new Uint8Array(h), colOK = new Uint8Array(w);

    // ---- レイアウト ----
    const numW = n => String(n).length * 6 - 1;
    const rowW = pz.rows.map(c => (c.length ? c : [0]).reduce((s, n) => s + numW(n) + 4, -4));
    const colN = pz.cols.map(c => Math.max(1, c.length));
    const BOT = 44;
    let rcw = Math.max(32, Math.max(...rowW) + 9), cch = Math.max(32, Math.max(...colN) * 9 + 6);
    const cs = clamp(Math.floor(Math.min((W - 8 - rcw) / w, (H - BOT - 8 - cch) / h)), 8, 26);
    const bw = rcw + cs * w, bh = cch + cs * h;
    const bx = Math.floor((W - bw) / 2), by = Math.max(4, Math.floor((H - BOT - bh) / 2));
    const gx = bx + rcw, gy = by + cch;

    const lineCells = (isRow, k) => { const out = []; if (isRow) for (let x = 0; x < w; x++) out.push(k * w + x); else for (let y = 0; y < h; y++) out.push(y * w + k); return out; };
    const sameRuns = (cells, clue) => { const r = NONO.runs(cells.map(i => g[i] === 1)); return r.length === clue.length && r.every((v, j) => v === clue[j]); };
    function check(fx = true) {
      let all = true;
      for (let y = 0; y < h; y++) {
        const ok = sameRuns(lineCells(true, y), pz.rows[y]) ? 1 : 0;
        if (ok && !rowOK[y] && fx) lineDone(true, y);
        rowOK[y] = ok; if (!ok) all = false;
      }
      for (let x = 0; x < w; x++) {
        const ok = sameRuns(lineCells(false, x), pz.cols[x]) ? 1 : 0;
        if (ok && !colOK[x] && fx) lineDone(false, x);
        colOK[x] = ok; if (!ok) all = false;
      }
      return all;
    }
    function lineDone(isRow, k) {
      if (state !== 'play') return;
      Audio_.sfx('line');
      const cells = lineCells(isRow, k);
      // 正しくそろった列には ×を自動で（アシストON のとき）
      if (S.opt.assist && S.opt.autoX && cells.every(i => (g[i] === 1) === !!sol[i] || g[i] === 2)) {
        const cur = isRow ? cx : cy;
        cells.forEach((i, j) => { if (g[i] === 0) autoQ.push([i, Math.abs(j - cur) * 2]); });
      }
      if (isRow) P.burst(bx + rcw - 8, gy + k * cs + cs / 2, 6, { speed: 1.2, col: [GOLD, ACC], life: 18, grav: 0 });
      else P.burst(gx + k * cs + cs / 2, by + cch - 8, 6, { speed: 1.2, col: [GOLD, ACC], life: 18, grav: 0 });
    }
    check(false);

    function save() {
      if (state !== 'play') return;
      let s = ''; for (let i = 0; i < N; i++) s += bad[i] ? '3' : g[i];
      S.prog[pz.id] = { g: s, t: time, m: miss, h: hints, cx, cy }; S.save();
    }
    function setCell(i, v, st) { if (st) st.list.push([i, g[i], v]); g[i] = v; pop[i] = 1; }
    function apply(i) {
      if (!stroke || stroke.dead || giv[i] || bad[i]) return;
      const cur = g[i]; let nv = cur;
      const m = stroke.mode;
      if (m === 'fill' && cur === 0) nv = 1;
      else if (m === 'erase' && cur === 1) nv = 0;
      else if (m === 'mark' && cur === 0) nv = 2;
      else if (m === 'unmark' && cur === 2) nv = 0;
      if (nv === cur) return;
      if (nv === 1 && S.opt.assist && !sol[i]) {
        g[i] = 2; bad[i] = 1; pop[i] = 1; miss++; stroke.dead = true;
        Audio_.sfx('mistake'); FX.shake(3);
        FX.float(gx + (i % w) * cs + cs / 2, gy + Math.floor(i / w) * cs - 4, 'ミス！', BADC, { j: true, life: 40 });
        check(); save(); return;
      }
      setCell(i, nv, stroke);
      Audio_.sfx(nv === 1 ? 'fill' : nv === 2 ? 'mark' : 'erase');
      if (check()) startClear();
    }
    function startStroke(b) {
      const i = cy * w + cx;
      const mode = b === 'A' ? (g[i] === 1 ? 'erase' : 'fill') : (g[i] === 2 ? 'unmark' : 'mark');
      stroke = { btn: b === 'A' ? BTN.A : BTN.B, mode, list: [] };
      apply(i);
    }
    function endStroke() {
      if (stroke && stroke.list.length) { undo.push(stroke.list); if (undo.length > 300) undo.shift(); }
      stroke = null; save();
    }
    function doUndo() {
      const list = undo.pop();
      if (!list) { Audio_.sfx('deny'); return; }
      for (let k = list.length - 1; k >= 0; k--) { const [i, prev] = list[k]; g[i] = prev; pop[i] = 1; }
      Audio_.sfx('undo'); check(false); save();
    }
    function useHint() {
      if (state !== 'play') return;
      // 1) まちがいを消す
      const wrong = [];
      for (let i = 0; i < N; i++) if (!giv[i] && !bad[i] && ((g[i] === 1 && !sol[i]) || (g[i] === 2 && sol[i]))) wrong.push(i);
      if (wrong.length) {
        wrong.sort((p, q) => (Math.abs(p % w - cx) + Math.abs((p / w | 0) - cy)) - (Math.abs(q % w - cx) + Math.abs((q / w | 0) - cy)));
        const i = wrong[0]; g[i] = 0; hintFx[i] = 1; hints++;
        cx = i % w; cy = i / w | 0;
        Audio_.sfx('hint'); FX.float(gx + cx * cs + cs / 2, gy + cy * cs - 4, 'まちがい', BADC, { j: true, life: 50 });
        check(false); save(); return;
      }
      // 2) ロジックでわかる1列を教える
      const kn = new Int8Array(N); for (let i = 0; i < N; i++) kn[i] = g[i] === 1 ? 1 : g[i] === 2 ? 0 : -1;
      const cands = [];
      for (const isRow of [true, false]) for (let k = 0; k < (isRow ? h : w); k++) {
        const cells = lineCells(isRow, k);
        const r = NONO.solveLine(isRow ? pz.rows[k] : pz.cols[k], Int8Array.from(cells.map(i => kn[i])));
        if (!r) continue;
        const ch = cells.filter((i, j) => kn[i] < 0 && r[j] >= 0).map(i => [i, r[cells.indexOf(i)]]);
        if (ch.length) cands.push({ isRow, k, ch, d: Math.abs(k - (isRow ? cy : cx)) });
      }
      let ch;
      if (cands.length) { cands.sort((p, q) => p.d - q.d || q.ch.length - p.ch.length); ch = cands[0]; flashLine = { isRow: ch.isRow, k: ch.k, t: 50 }; ch = ch.ch; }
      else { const left = []; for (let i = 0; i < N; i++) if (g[i] !== (sol[i] ? 1 : 2) && g[i] !== (sol[i] ? 1 : 0)) left.push(i); if (!left.length) return; const i = pick(left); ch = [[i, sol[i]]]; }
      for (const [i, v] of ch) { g[i] = v ? 1 : 2; hintFx[i] = 1 + (Math.abs(i % w - cx) + Math.abs((i / w | 0) - cy)) * 0.08; }
      hints++; Audio_.sfx('hint');
      if (check()) startClear(); else save();
    }
    function startClear() {
      state = 'clear'; ct = 0; stroke = null; autoQ = [];
      const sec = Math.floor(time / 60), perfect = miss === 0 && hints === 0;
      const prev = S.done[pz.id];
      S.done[pz.id] = { t: prev ? Math.min(prev.t, sec) : sec, p: !!((prev && prev.p) || perfect) };
      delete S.prog[pz.id]; if (S.last === pz.id) S.last = null;
      S.save();
      Audio_.sfx('clear');
    }
    const result = () => S.done[pz.id];
    function leave() {
      if (a.tier === 1) Engine.go(() => PicSelect(1, a.id));
      else Engine.go(() => PieceSelect(a, artPieces(a).indexOf(pz), pz.id));
    }

    return {
      game: GAME, askQuit: false,
      pauseItems() {
        return [
          { jp: 'つづける', act: () => Engine.resume() },
          { jp: 'さいしょから', ask: true, act: () => { delete S.prog[pz.id]; S.save(); Engine.go(() => Play(pz)); } },
          { jp: 'ほかのパズルをえらぶ', act: () => { save(); a.tier === 1 ? Engine.go(() => PicSelect(1)) : Engine.go(() => PieceSelect(a, artPieces(a).indexOf(pz))); } },
          { jp: 'メニューへ', act: () => { save(); Engine.toMenu(); } },
        ];
      },
      canPause: () => state === 'play',
      onHide() { save(); },
      enter() { Audio_.play(SONG_NONO); },
      update() {
        for (let i = 0; i < N; i++) { if (pop[i] > 0) pop[i] = Math.max(0, pop[i] - 0.12); if (hintFx[i] > 0) hintFx[i] = Math.max(0, hintFx[i] - 0.025); }
        if (flashLine && --flashLine.t <= 0) flashLine = null;
        // 自動の ×
        if (autoQ.length) {
          autoQ = autoQ.filter(q => { if (q[1]-- > 0) return true; if (g[q[0]] === 0 && state === 'play') { g[q[0]] = 2; pop[q[0]] = 1; if (stroke) stroke.list.push([q[0], 0, 2]); else if (undo.length) undo[undo.length - 1].push([q[0], 0, 2]); } return false; });
          if (!autoQ.length) save();
        }
        if (state === 'clear') {
          ct++;
          if (ct < 70 && ct % 3 === 0) Audio_.sfx('flip');
          if (ct === 64) { P.burst(W / 2, 140, 40, { speed: 3, col: [ACC, GOLD, PINK, SKY, LIME, WHITE], grav: 0.08, life: 50, size: 2 }); Audio_.sfx('win'); }
          if (ct > 80 && (btnp(BTN.A) || btnp(BTN.B) || btnp(BTN.START))) { Audio_.sfx('select'); leave(); }
          return;
        }
        time++;
        peek = btn(BTN.SELECT) ? Math.min(1, peek + 0.2) : Math.max(0, peek - 0.2);
        const d = S.opt.fast ? dirRep(8, 3) : dirRep(11, 4);
        if (d) {
          cx = (cx + d[0] + w) % w; cy = (cy + d[1] + h) % h;
          Audio_.sfx('cursor');
          if (stroke) apply(cy * w + cx);
        }
        if (btnp(BTN.A) && !stroke) startStroke('A');
        if (btnp(BTN.B) && !stroke) startStroke('B');
        if (stroke && !btn(stroke.btn)) endStroke();
        if (!stroke && btnrep(BTN.Y, 18, 5)) doUndo();
        if (!stroke && btnp(BTN.X)) useHint();
      },
      draw() {
        bgAtelier(Engine.t * 0.5, T.col);
        const clearK = state === 'clear' ? clamp((ct - 30) / 30, 0, 1) : 0;
        // 盤のかげと紙
        ctx.globalAlpha = 0.22; rect(bx + 3, by + 4, bw + 2, bh + 2, INK); ctx.globalAlpha = 1;
        rect(bx - 1, by - 1, bw + 2, bh + 2, INKC);
        rect(bx, by, bw, bh, PAPERC);
        // ヒント数字の帯
        for (let y = 0; y < h; y++) if (y % 2) rect(bx, gy + y * cs, rcw, cs, '#f6ecd8');
        for (let x = 0; x < w; x++) if (x % 2) rect(gx + x * cs, by, cs, cch, '#f6ecd8');
        if (state === 'play') {
          ctx.globalAlpha = 0.45; rect(bx, gy + cy * cs, rcw, cs, HLC); rect(gx + cx * cs, by, cs, cch, HLC); ctx.globalAlpha = 1;
        }
        if (flashLine && (flashLine.t >> 2) & 1) { ctx.globalAlpha = 0.5; if (flashLine.isRow) rect(bx, gy + flashLine.k * cs, bw, cs, '#7ad8ff'); else rect(gx + flashLine.k * cs, by, cs, bh, '#7ad8ff'); ctx.globalAlpha = 1; }
        // 数字
        for (let y = 0; y < h; y++) {
          const clue = pz.rows[y].length ? pz.rows[y] : [0];
          let x = gx - 5;
          const col = rowOK[y] ? FADE : (state === 'play' && y === cy ? '#1a1430' : INKC);
          for (let j = clue.length - 1; j >= 0; j--) { const s = String(clue[j]); x -= numW(clue[j]); text(s, x, gy + y * cs + Math.floor((cs - 7) / 2), col); x -= 4; }
        }
        for (let x = 0; x < w; x++) {
          const clue = pz.cols[x].length ? pz.cols[x] : [0];
          let y = gy - 4;
          const col = colOK[x] ? FADE : (state === 'play' && x === cx ? '#1a1430' : INKC);
          for (let j = clue.length - 1; j >= 0; j--) { y -= 7; text(String(clue[j]), gx + x * cs + cs / 2, y, col, { align: 'center' }); y -= 2; }
        }
        // マス
        const cv = artCanvas(a);
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
          const i = y * w + x, X = gx + x * cs, Y = gy + y * cs;
          if (state === 'clear') {
            const f = clamp((ct - (x + y) * 1.6) / 10, 0, 1);
            if (f >= 0.5) {
              const k = (f - 0.5) * 2, hh = Math.max(0.5, cs * k);
              ctx.drawImage(cv, pz.x0 + x, pz.y0 + y, 1, 1, X, Y + (cs - hh) / 2, cs, hh);
              continue;
            }
            const k = 1 - f * 2, hh = Math.max(0.5, cs * k);
            if (g[i] === 1) frect(X, Y + (cs - hh) / 2, cs, hh, INKC);
            continue;
          }
          if (state === 'play' && (x === cx || y === cy)) frect(X, Y, cs, cs, '#fff1c4');
          const pk = pop[i] > 0 ? easeOut(1 - pop[i]) : 1;
          if (g[i] === 1) {
            const m = (cs - 1) * (0.55 + 0.45 * pk), o = (cs - m) / 2;
            frect(X + o, Y + o, m, m, giv[i] ? '#4a4468' : INKC);
            frect(X + o, Y + o, m, 0.5, '#4a4470');
            if (giv[i]) frect(X + cs / 2 - 1, Y + cs / 2 - 1, 2, 2, '#8a84a8');
          } else if (g[i] === 2) {
            const c = bad[i] ? BADC : giv[i] ? '#d0c4b8' : XCOL, p = Math.max(2, Math.floor(cs * 0.28)) - (pk < 1 ? Math.round((1 - pk) * 2) : 0);
            line(X + p, Y + p, X + cs - 1 - p, Y + cs - 1 - p, c); line(X + cs - 1 - p, Y + p, X + p, Y + cs - 1 - p, c);
          }
          if (hintFx[i] > 0 && hintFx[i] <= 1) { ctx.globalAlpha = hintFx[i] * 0.8; frect(X, Y, cs, cs, '#7ad8ff'); ctx.globalAlpha = 1; }
        }
        // 線
        const lineA = state === 'clear' ? 1 - clamp((ct - 20) / 30, 0, 1) : 1;
        if (lineA > 0) {
          ctx.globalAlpha = lineA;
          for (let x = 0; x <= w; x++) { const m5 = x % 5 === 0 || x === w; frect(gx + x * cs - (m5 ? 0.5 : 0.25), gy, m5 ? 1 : 0.5, h * cs, m5 ? LINE5 : LINE); }
          for (let y = 0; y <= h; y++) { const m5 = y % 5 === 0 || y === h; frect(gx, gy + y * cs - (m5 ? 0.5 : 0.25), w * cs, m5 ? 1 : 0.5, m5 ? LINE5 : LINE); }
          ctx.globalAlpha = 1;
        }
        frect(bx, gy - 0.5, bw, 1, LINE5); frect(gx - 0.5, by, 1, bh, LINE5);
        // カーソル
        if (state === 'play') {
          const X = gx + cx * cs, Y = gy + cy * cs, p = (Engine.t >> 3) & 1;
          const c = stroke ? (stroke.mode === 'fill' || stroke.mode === 'erase' ? ACC : '#5a9ae8') : ACC;
          rectLine(X - 1, Y - 1, cs + 2, cs + 2, INKC);
          rectLine(X - 2, Y - 2, cs + 4, cs + 4, p ? c : '#ffffff');
        }
        // 左上：ミニ表示
        const m = Math.max(1, Math.floor(Math.min((rcw - 8) / w, (cch - 8) / h)));
        const mx = bx + Math.floor((rcw - w * m) / 2), my = by + Math.floor((cch - h * m) / 2);
        rect(mx - 1, my - 1, w * m + 2, h * m + 2, '#d8ccb6');
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
          const i = y * w + x;
          if (state === 'clear' && clearK > 0) ctx.drawImage(cv, pz.x0 + x, pz.y0 + y, 1, 1, mx + x * m, my + y * m, m, m);
          else rect(mx + x * m, my + y * m, m, m, g[i] === 1 ? INKC : PAPERC);
        }
        // した：じょうほう
        drawBottom();
        if (peek > 0) drawPeek();
        if (state === 'clear' && ct > 60) drawClear();
      },
    };

    function drawBottom() {
      const y0 = H - BOT + 2;
      rbox(4, y0, W - 8, BOT - 6, INKC, '#fffaf0', 3);
      let x = 10;
      if (a.tier > 1) {
        const ps = artPieces(a), ts = 9, nx = ps[0].nx, ny = ps[0].ny, mh = ny * ts + (ny - 1);
        const my = y0 + Math.floor((BOT - 6 - mh) / 2);
        for (const q of ps) {
          const tx = x + q.px * (ts + 1), ty = my + q.py * (ts + 1);
          if (q === pz) rect(tx, ty, ts, ts, (Engine.t >> 3) & 1 ? ACC : GOLD);
          else if (pieceDone(q)) ctx.drawImage(artCanvas(a), q.x0, q.y0, q.w, q.h, tx, ty, ts, ts);
          else rect(tx, ty, ts, ts, '#4a4468');
        }
        x += nx * (ts + 1) + 6;
      }
      jtext('★'.repeat(T.stars), x, y0 + 4, T.col);
      jtext(a.tier === 1 ? `No.${NONO.ofTier(1).indexOf(a) + 1}` : `ピース ${pz.no}`, x, y0 + 18, LIGHT);
      const sec = Math.floor(time / 60);
      text(mmss(sec), W - 12, y0 + 7, WHITE, { align: 'right' });
      let info = [];
      if (S.opt.assist) info.push(`ミス ${miss}`);
      info.push(`ヒント ${hints}`);
      jtext(info.join('  '), W - 12, y0 + 19, miss ? PINK : GRAY, { align: 'right' });
    }
    function drawPeek() {
      ctx.globalAlpha = 0.85 * peek; rect(0, 0, W, H, '#140f22'); ctx.globalAlpha = 1;
      if (peek < 1) return;
      const s = Math.max(1, Math.floor(Math.min(200 / a.w, 200 / a.h)));
      const ax = Math.floor((W - a.w * s) / 2), ay = Math.floor((H - a.h * s) / 2) - 10;
      rect(ax - 3, ay - 3, a.w * s + 6, a.h * s + 6, '#f8f0e0');
      if (a.tier === 1) {
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) rect(ax + x * s, ay + y * s, s, s, g[y * w + x] === 1 ? INKC : PAPERC);
      } else {
        drawArt(a, ax, ay, s);
        const px = ax + pz.x0 * s, py = ay + pz.y0 * s;
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) rect(px + x * s, py + y * s, s, s, g[y * w + x] === 1 ? INKC : PAPERC);
        rectLine(px - 1, py - 1, pz.w * s + 2, pz.h * s + 2, (Engine.t >> 3) & 1 ? ACC : GOLD);
      }
      jtext('SELECT をはなすと もどります', W / 2, ay + a.h * s + 10, GRAY, { align: 'center' });
    }
    function drawClear() {
      const k = clamp((ct - 60) / 18, 0, 1);
      const y = H - 78 + (1 - easeBack(k)) * 90;
      ctx.globalAlpha = 0.25; rrect(16, y + 4, W - 28, 74, INK, 3); ctx.globalAlpha = 1;
      rbox(12, y, W - 24, 74, INKC, GOLD, 3);
      const word = 'COMPLETE!';
      for (let i = 0; i < word.length; i++) {
        const bounce = Math.max(0, Math.sin((ct - 60 - i * 3) * 0.2)) * (ct < 110 ? 4 : 0);
        text(word[i], W / 2 - (word.length * 12) / 2 + i * 12, y + 8 - bounce, [ACC, GOLD, LIME, SKY, PINK][i % 5], { scale: 2, outline: INK });
      }
      const r = result();
      const name = a.tier === 1 ? `「${a.name}」` : `ピース ${pz.no}  （${artCount(a)[0]}/${artCount(a)[1]}）`;
      jtext(name, W / 2, y + 30, WHITE, { align: 'center' });
      const perfect = miss === 0 && hints === 0;
      jtext(`タイム ${mmss(Math.floor(time / 60))}${r && r.t < Math.floor(time / 60) ? `（ベスト ${mmss(r.t)}）` : ''}`, W / 2, y + 44, LIGHT, { align: 'center' });
      if (perfect) jtext('パーフェクト！', 24, y + 57, GOLD);
      if (ct > 80 && (ct >> 4) & 1) jtext('A: つぎへ', W - 24, y + 57, GRAY, { align: 'right' });
    }
  }

  // =========================================================
  //  ギャラリー
  // =========================================================
  function Gallery() {
    let t = 0, tier = 1, sel = 0;
    return {
      pausable: false, game: GAME,
      update() {
        t++;
        const arts = NONO.ofTier(tier);
        if (btnp(BTN.L1) || btnp(BTN.R1)) { tier = (tier + (btnp(BTN.R1) ? 0 : 2)) % 4 + 1; sel = 0; Audio_.sfx('move'); }
        const d = dirRep(12, 5);
        if (d) { sel = clamp(sel + d[0] + d[1] * 5, 0, arts.length - 1); Audio_.sfx('cursor'); }
        if (btnp(BTN.A)) { const a = arts[sel]; if (artDone(a)) { Audio_.sfx('select'); const tt = tier, ss = sel; Engine.go(() => ViewArt(a, () => { const g = Gallery(); g._set(tt, ss); return g; })); } else Audio_.sfx('deny'); }
        if (btnp(BTN.B)) { Audio_.sfx('back'); Engine.go(() => NonoTitle()); }
      },
      _set(tt, ss) { tier = tt; sel = ss; },
      draw() {
        const T = TIERS[tier], arts = NONO.ofTier(tier);
        vgrad(0, 0, W, H, '#3a2a4a', '#1a1424');
        header('ギャラリー', `${T.jp} ${arts.filter(artDone).length}/${arts.length}`, T.col);
        tiny('L1 / R1', W / 2, 30, GRAY, { align: 'center' });
        const CW = 44, CH = 44, cols = 5, ox = Math.floor((W - cols * CW) / 2);
        const top = Math.max(0, Math.floor(sel / cols) - 3);
        arts.forEach((a, i) => {
          const r = Math.floor(i / cols) - top; if (r < 0 || r > 4) return;
          const x = ox + (i % cols) * CW, y = 40 + r * CH, on = i === sel;
          rect(x + 2, y + 2, CW - 4, CH - 4, on ? GOLD : '#2a2238');
          rect(x + 4, y + 4, CW - 8, CH - 8, '#f8f0e0');
          const s = Math.max(1, Math.floor(36 / a.w));
          if (artDone(a)) drawArt(a, x + Math.floor((CW - a.w * s) / 2), y + Math.floor((CH - a.h * s) / 2), s, { all: true });
          else text('?', x + CW / 2 - 2, y + CH / 2 - 3, '#c8b898');
        });
        const a = arts[sel];
        rbox(4, H - 50, W - 8, 46, INKC, '#fffaf0', 3);
        jtext(artDone(a) ? a.name : '？？？', 12, H - 44, artDone(a) ? WHITE : MUTE);
        jtext(artDone(a) ? 'A: 大きく見る   B: もどる' : 'まだ完成していません   B: もどる', 12, H - 26, GRAY);
      },
    };
  }

  // =========================================================
  //  せってい（ノノグラム）
  // =========================================================
  function NonoOptions() {
    let t = 0, sel = 0, confirm = false;
    const rows = ['assist', 'autoX', 'fast', 'reset', 'back'];
    return {
      pausable: false, game: GAME,
      update() {
        t++;
        if (confirm) {
          if (btnp(BTN.A)) { S.done = {}; S.prog = {}; S.seen = {}; S.last = null; S.save(); confirm = false; Audio_.sfx('boom'); }
          if (btnp(BTN.B)) { confirm = false; Audio_.sfx('back'); }
          return;
        }
        if (btnrep(BTN.UP)) { sel = (sel + rows.length - 1) % rows.length; Audio_.sfx('move'); }
        if (btnrep(BTN.DOWN)) { sel = (sel + 1) % rows.length; Audio_.sfx('move'); }
        const r = rows[sel], tog = btnp(BTN.A) || btnp(BTN.LEFT) || btnp(BTN.RIGHT);
        if (tog && r in S.opt) { S.opt[r] = !S.opt[r]; S.saveOpt(); Audio_.sfx('select'); }
        if (btnp(BTN.A) && r === 'reset') { confirm = true; Audio_.sfx('select'); }
        if (btnp(BTN.B) || (btnp(BTN.A) && r === 'back')) { Audio_.sfx('back'); Engine.go(() => NonoTitle()); }
      },
      draw() {
        bgAtelier(t);
        header('せってい', 'ノノグラム', ACC);
        const items = [
          ['まちがいを 知らせる', S.opt.assist, 'まちがったマスを ぬると すぐ教えてくれる'],
          ['そろった列に 自動で×', S.opt.autoX, '「知らせる」が ON のときだけ'],
          ['カーソルを はやく', S.opt.fast, 'おしっぱなしの 移動が はやくなる'],
          ['きろくを ぜんぶ消す', null, 'クリアした記録が なくなります'],
          ['もどる', null, ''],
        ];
        items.forEach(([l, v, hh], i) => {
          const y = 36 + i * 44, on = i === sel;
          rbox(8, y, W - 16, 38, on ? GOLD : PAPERC, on ? INKC : '#c8b898', 3);
          jtext(l, 16, y + 5, INKC);
          if (v !== null) text(v ? 'ON' : 'OFF', W - 16, y + 7, v ? '#2f8a50' : '#a05050', { align: 'right' });
          if (hh) jtext(hh, 16, y + 21, on ? '#5a4a3a' : '#9a8e7a');
        });
        if (confirm) {
          ctx.globalAlpha = 0.7; rect(0, 0, W, H, INK); ctx.globalAlpha = 1;
          panel(20, 110, W - 40, 80, DRED);
          jtext('ほんとうに 消しますか？', W / 2, 124, WHITE, { align: 'center' });
          jtext('A: 消す    B: やめる', W / 2, 156, PINK, { align: 'center' });
        }
      },
    };
  }

  // =========================================================
  //  メニューのカートリッジ表示
  // =========================================================
  function preview(t, x, y, w, h) {
    vgrad(x, y, w, h, '#fff3e2', '#f6dcc0');
    const a = NONO.byId['cat'], s = 4, aw = a.w * s;
    const ax = x + Math.floor((w - aw) / 2) + 8, ay = y + Math.floor((h - aw) / 2) + 4;
    rect(ax - 2, ay - 2, aw + 4, aw + 4, INKC);
    const per = a.w * a.h, k = t === 0 ? per + 999 : (t * 3) % (per + 200);
    const cv = artCanvas(a);
    for (let i = 0; i < per; i++) {
      const px = i % a.w, py = (i / a.w) | 0;
      if (i < k - 60) ctx.drawImage(cv, px, py, 1, 1, ax + px * s, ay + py * s, s, s);
      else if (i < k && a.ink[i]) rect(ax + px * s, ay + py * s, s, s, INKC);
      else rect(ax + px * s, ay + py * s, s, s, (px + py) % 2 ? PAPERC : '#f6eedd');
    }
    // 数字っぽい飾り
    for (let i = 0; i < 6; i++) { tiny(String((i * 3) % 7 + 1), ax - 8, ay + 2 + i * 13, INKC); tiny(String((i * 5) % 6 + 1), ax + 2 + i * 13, ay - 8, INKC); }
  }

  const GAME = {
    id: 'nono', title: 'NONO ATELIER', jp: 'ノノグラム・アトリエ', genre: 'パズル',
    col: '#ffb35a', cart: '#f2ece0', labelBg: '#fff6e4', bg0: '#6a3a5a', bg1: '#1e1428',
    desc: ['数字をヒントに マスをぬって ドット絵を完成！', '4つの難しさ・73まいの絵・317問', 'ピースを集めると 大きな絵が できあがる'],
    controls: [['十字', 'カーソルを動かす'], ['A', 'ぬる（おしたまま連続）'], ['B', '× をつける（連続）'], ['Y', 'ひとつ もどす'], ['X', 'ヒント（1列教える）'], ['SELECT', '絵の全体を見る'], ['START', 'ポーズ']],
    best: () => `クリア ${allDone()}/${allPuzzles()}`,
    preview,
    create: () => NonoTitle(),
  };
  GAMES.push(GAME);
  window.NONO_GAME = { S, Play, PieceSelect, PicSelect, ViewArt, findPiece, artPieces };
})();
