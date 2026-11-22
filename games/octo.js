'use strict';
// =========================================================
//  LUCKY OCTO — 海底カジノのポーカー・ローグライク
//  役をつくって チップ×倍率 で目標スコアをこえろ！
//  海のなかま（パッシブ効果）を集めて、8夜のテーブルを勝ちぬく。
// =========================================================
(() => {
  const { HANDS, HAND_LIST, STARS, evaluate, ENH, EDS, CHARMS, CH, FUDA, FU, BOSSES, BO, VOUCHERS, VO, DECKS, PACKS, chipsOf } = OCTO;
  const CW = 28, CHH = 40, KW = 30, KH = 40, HAND_Y = 218;
  const SUIT_COL = ['#2a2550', '#e0304a', '#238a52', '#ee7a1a'];
  const RK = r => r === 14 ? 'A' : r === 13 ? 'K' : r === 12 ? 'Q' : r === 11 ? 'J' : String(r);
  const RAR = [null, { jp: 'ふつう', col: '#5aa8f0' }, { jp: 'めずらしい', col: '#4fc489' }, { jp: 'レア', col: '#ff5a8a' }];
  const CHIPC = '#3b8fe8', MULTC = '#ec4a55', XMC = '#ff4ad0', MONEYC = '#ffc83d', FELT = '#0e5656', FELTD = '#093e3e';
  const SPR = {}; for (const k in OCTO_SPR) SPR[k] = pix(OCTO_SPR[k], OCTO_PAL);
  const SUITW = SUIT_SPR.map(s => pix(s, { '#': '#ffffff' }));
  const suitImg = (s, col) => tinted(SUITW[s], col || SUIT_COL[s]);
  const PACKKEYS = Object.keys(PACKS);
  const TNAME = ['小テーブル', '大テーブル', 'ぬし'];

  // ---------------- 音楽 ----------------
  const SONG_TABLE = {
    bpm: 104, swing: 0.18,
    tracks: [
      { wave: 'bell', vol: 0.07, gate: 0.7, pluck: true, notes: `
        E5 . . G5 . A5 . C6 . A5 . G5 . E5 . .  D5 . . E5 . G5 . A5 - - - . . . . .
        E5 . . G5 . A5 . C6 . D6 . C6 . A5 . .  G5 . . E5 . D5 . C5 - - - . . . . .` },
      { wave: 'epiano', vol: 0.045, gate: 0.5, pluck: true, notes: `
        . . A3+C4+E4 . . . A3+C4+E4 .  . . A3+C4+E4 . . . A3+C4+E4 .  . . D4+F4+A4 . . . D4+F4+A4 .  . . G3+B3+D4 . . . G3+B3+D4 .
        . . A3+C4+E4 . . . A3+C4+E4 .  . . F3+A3+C4 . . . F3+A3+C4 .  . . D4+F4+A4 . . . E4+G#4+B4 .  . . A3+C4+E4 . . . A3+C4+E4 .` },
      { wave: 'triangle', vol: 0.15, gate: 0.6, notes: `
        A2 . C3 . E3 . G3 . A2 . G2 . E2 . G2 .  D2 . F2 . A2 . C3 . G2 . B2 . D3 . B2 .
        A2 . C3 . E3 . G3 . F2 . A2 . C3 . A2 .  D2 . F2 . E2 . G#2 . A2 . E2 . A2 . . .` },
      { wave: 'drum', vol: 0.07, notes: `K . r . b . r K . . r . b . r r` },
    ],
  };
  const SONG_BOSS = {
    bpm: 124,
    tracks: [
      { wave: 'pulse25', vol: 0.06, gate: 0.6, notes: `
        D5 . D5 . F5 . E5 . D5 . C5 . A4 . . .  D5 . D5 . F5 . G5 . A5 . G5 . F5 . E5 .
        Bb5 . A5 . G5 . F5 . E5 . F5 . G5 . A5 .  D6 - - - C#6 - - - D6 - - - . . . .` },
      { wave: 'pulse12', vol: 0.03, gate: 0.4, notes: `D4+F4+A4 . . D4+F4+A4 . . D4+F4+A4 .` },
      { wave: 'triangle', vol: 0.18, gate: 0.6, notes: `
        D2 D2 D3 D2 D2 D3 D2 D3 C2 C2 C3 C2 C2 C3 C2 C3  Bb1 Bb1 Bb2 Bb1 Bb1 Bb2 Bb1 Bb2 A1 A1 A2 A1 C#2 E2 G2 A2` },
      { wave: 'drum', vol: 0.12, notes: `K . h K S . h . K . h K S . h S` },
    ],
  };
  const SONG_SHOP = {
    bpm: 116,
    tracks: [
      { wave: 'bell', vol: 0.08, gate: 0.6, pluck: true, notes: `
        C6 . G5 . E5 . G5 . A5 . . G5 . E5 . .  F5 . A5 . C6 . A5 . G5 - - - . . . .
        C6 . G5 . E5 . G5 . A5 . . G5 . E5 . .  D5 . E5 . F5 . D5 . C5 - - - . . . .` },
      { wave: 'epiano', vol: 0.04, gate: 0.4, pluck: true, notes: `. C4+E4+G4 . C4+E4+G4 . C4+E4+G4 . C4+E4+G4  . F4+A4+C5 . F4+A4+C5 . G4+B4+D5 . G4+B4+D5` },
      { wave: 'triangle', vol: 0.15, gate: 0.5, notes: `C3 . . C3 G2 . . G2 C3 . . C3 G2 . E2 .  F2 . . F2 A2 . . A2 G2 . . G2 D2 . G2 .` },
      { wave: 'drum', vol: 0.07, notes: `K . h . S . h h K . h K S . h .` },
    ],
  };

  // ---------------- 記録 ----------------
  const REC = Object.assign({ best: 0, bestHand: 0, wins: 0, runs: 0, endless: 0 }, Save.get('octo_rec', {}));
  const saveRec = () => Save.set('octo_rec', REC);

  // =========================================================
  //  ラン（1回の挑戦）のデータ
  // =========================================================
  const mkCard = (run, rank, suit, enh = null, ed = null) => ({ id: ++run.uid, rank, suit, enh, ed });
  function newRun(deckId) {
    const run = {
      v: 1, deck: deckId, night: 1, table: 0, endless: false, money: 4,
      hands: 4, disc: 3, hsize: 8, slots: 5, cslots: 2,
      cards: [], charms: [], cons: [], levels: {}, played: {}, vouchers: [],
      boss: null, lastBoss: null, voucherNow: null, tstate: ['', '', ''], uid: 0,
      stats: { best: 0, hands: 0, bossWins: 0 },
    };
    for (const k of HAND_LIST) { run.levels[k] = 1; run.played[k] = 0; }
    for (let s = 0; s < 4; s++) for (let r = 2; r <= 14; r++) run.cards.push(mkCard(run, r, s));
    if (deckId === 'red') run.disc++;
    if (deckId === 'blue') run.hands++;
    if (deckId === 'gold') run.money += 10;
    if (deckId === 'black') { run.slots++; run.hands--; }
    newNight(run);
    return run;
  }
  function newNight(run) {
    if (run.night % 8 === 0) run.boss = 'king';
    else { const pool = BOSSES.filter(b => b.id !== run.lastBoss); run.boss = pick(pool).id; }
    run.lastBoss = run.boss;
    const vp = VOUCHERS.filter(v => !run.vouchers.includes(v.id));
    run.voucherNow = vp.length ? pick(vp).id : null;
    run.tstate = ['', '', ''];
    run.table = 0;
  }
  const passive = (run, key) => run.charms.reduce((s, k) => s + ((CH[k.id].pass && CH[k.id].pass[key]) || 0), 0);
  const targetOf = (run, t) => Math.round(OCTO.baseTarget(run.night) * (t === 0 ? 1 : t === 1 ? 1.5 : (BO[run.boss].mul || 2)));
  const rewardOf = t => [3, 4, 5][t];
  const intCap = run => 5 + (run.vouchers.includes('bank') ? 5 : 0) + passive(run, 'intcap');
  const sellOf = inst => Math.max(1, Math.floor((CH[inst.id].cost + (inst.ed ? EDS[inst.ed].cost : 0)) / 2));
  function priceOf(run, it) {
    let p = it.kind === 'charm' ? CH[it.id].cost + (it.ed ? EDS[it.ed].cost : 0) : it.kind === 'voucher' ? 10 : it.kind === 'pack' ? PACKS[it.id].cost : 3;
    if (run.vouchers.includes('sale')) p = Math.max(1, Math.floor(p * 0.75));
    return p;
  }
  function rollCharm(run, exclude = []) {
    const net = run.vouchers.includes('net');
    const rar = wpick([[1, net ? 55 : 68], [2, net ? 33 : 26], [3, net ? 12 : 6]]);
    const owned = new Set([...run.charms.map(c => c.id), ...exclude]);
    let pool = CHARMS.filter(c => c.r === rar && !owned.has(c.id));
    if (!pool.length) pool = CHARMS.filter(c => !owned.has(c.id));
    if (!pool.length) pool = CHARMS;
    const r = Math.random();
    return { id: pick(pool).id, ed: r < 0.03 ? 'poly' : r < 0.07 ? 'holo' : r < 0.14 ? 'foil' : null, v: 0 };
  }
  const rollStar = (run, ex = []) => { let p = HAND_LIST.filter(h => (!HANDS[h].secret || run.played[h] > 0) && !ex.includes(h)); if (!p.length) p = ['high']; return pick(p); };
  function rollCard(run) {
    const c = mkCard(run, randi(2, 14), randi(0, 3));
    if (chance(0.45)) c.enh = pick(Object.keys(ENH));
    if (chance(0.12)) c.ed = pick(['foil', 'holo', 'poly']);
    return c;
  }
  function rollShopItem(run, existing) {
    const k = wpick([['charm', 64], ['fuda', 19], ['star', run.vouchers.includes('scope') ? 32 : 17]]);
    if (k === 'charm') { const c = rollCharm(run, existing.filter(e => e.kind === 'charm').map(e => e.id)); return { kind: 'charm', id: c.id, ed: c.ed }; }
    if (k === 'fuda') return { kind: 'fuda', id: pick(FUDA).id };
    return { kind: 'star', id: rollStar(run) };
  }
  function newShop(run) {
    const items = [];
    for (let i = 0; i < 2; i++) items.push(rollShopItem(run, items));
    return { items, packs: [{ kind: 'pack', id: pick(PACKKEYS) }, { kind: 'pack', id: pick(PACKKEYS) }], rerolls: 0 };
  }
  const rerollCost = (run, shop) => Math.max(0, 5 + shop.rerolls - (run.vouchers.includes('reroll') ? 2 : 0) - passive(run, 'reroll'));

  // =========================================================
  //  点数の計算（演出用のイベントの列を作る）
  // =========================================================
  function computeScore(run, round, played, held) {
    const four = passive(run, 'four') > 0;
    const ev = evaluate(played, four);
    const H = HANDS[ev.type], lv = run.levels[ev.type];
    let chips = H.c + H.lc * (lv - 1), mult = H.m + H.lm * (lv - 1);
    const boss = round.boss;
    if (boss && boss.id === 'half') { chips = Math.ceil(chips / 2); mult = Math.max(1, Math.ceil(mult / 2)); }
    const events = [];
    const tot = { chips, mult };
    if (boss && boss.id === 'once' && round.types.has(ev.type)) {
      events.push({ kind: 'zero' });
      return { type: ev.type, scoring: [], events, total: 0, base: { chips, mult }, broken: [] };
    }
    const X = { run, round, type: ev.type, has: ev.has, played, scoring: ev.scoring, held, rng: Math.random };
    const add = (src, e) => {
      if (!e) return;
      if (e.chips) { tot.chips += e.chips; events.push({ src, kind: 'chips', v: e.chips }); }
      if (e.mult) { tot.mult += e.mult; events.push({ src, kind: 'mult', v: e.mult }); }
      if (e.xmult && e.xmult !== 1) { tot.mult *= e.xmult; events.push({ src, kind: 'xmult', v: e.xmult }); }
      if (e.money) events.push({ src, kind: 'money', v: e.money });
    };
    // なかまの 効果（まねっこ と しびれ を考える）
    const active = run.charms.map((inst, i) => {
      if (round.numb === i) return null;
      let def = CH[inst.id], ui = inst;
      if (def.copy) { const r = run.charms[i + 1]; if (!r || CH[r.id].copy) return { inst, i, def: null }; def = CH[r.id]; ui = r; }
      return { inst, i, def, ui };
    }).filter(Boolean);
    const debuffed = c => boss && boss.debuff && boss.debuff(c);
    const isDown = c => round.down.has(c.id);
    // 1) 点になるカード
    ev.scoring.forEach((c, idx) => {
      if (debuffed(c)) { events.push({ src: { card: c }, kind: 'debuff' }); return; }
      let reps = 1;
      const trig = [];
      for (const a of active) if (a.def && a.def.retrig) { const n = a.def.retrig(c, idx, { ...X, inst: a.ui }); if (n) { reps += n; trig.push(a); } }
      for (let r = 0; r < reps; r++) {
        if (r > 0) events.push({ src: { charm: trig[Math.min(r - 1, trig.length - 1)].inst }, kind: 'again' });
        const s = { card: c };
        add(s, { chips: c.enh === 'stone' ? 50 : chipsOf(c) });
        if (c.enh === 'pearl') add(s, { chips: 30 });
        if (c.enh === 'coral') add(s, { mult: 4 });
        if (c.enh === 'glass') add(s, { xmult: 2 });
        if (c.enh === 'lucky') { if (Math.random() < 0.2) add(s, { mult: 20 }); if (Math.random() < 1 / 15) add(s, { money: 20 }); }
        if (c.ed === 'foil') add(s, { chips: 50 });
        if (c.ed === 'holo') add(s, { mult: 10 });
        if (c.ed === 'poly') add(s, { xmult: 1.5 });
        for (const a of active) if (a.def && a.def.card) add({ charm: a.inst }, a.def.card(c, { ...X, inst: a.ui }));
      }
    });
    // 2) 手札にのこったカード
    for (const c of held) {
      if (isDown(c) && false) continue;
      if (c.enh === 'steel' && !debuffed(c)) add({ held: c }, { xmult: 1.5 });
      for (const a of active) if (a.def && a.def.held && !debuffed(c)) add({ charm: a.inst }, a.def.held(c, { ...X, inst: a.ui }));
    }
    // 3) なかま
    for (const a of active) {
      const s = { charm: a.inst };
      if (a.inst.ed === 'foil') add(s, { chips: 50 });
      if (a.inst.ed === 'holo') add(s, { mult: 10 });
      if (a.def && a.def.hand) add(s, a.def.hand({ ...X, inst: a.ui }));
      if (a.inst.ed === 'poly') add(s, { xmult: 1.5 });
    }
    const broken = ev.scoring.filter(c => c.enh === 'glass' && !debuffed(c) && Math.random() < 0.25);
    return { type: ev.type, scoring: ev.scoring, events, total: Math.floor(tot.chips * tot.mult), base: { chips, mult }, broken };
  }

  // =========================================================
  //  絵：カード・なかま・おふだ・パック
  // =========================================================
  function drawBack(x, y, col = '#0e6a6a') {
    rrect(x, y, CW, CHH, INK, 2);
    rrect(x + 1, y + 1, CW - 2, CHH - 2, col, 1);
    rectLine(x + 3, y + 3, CW - 6, CHH - 6, MONEYC);
    for (let i = 0; i < 4; i++) rect(x + 5 + i * 5, y + 6, 2, 2, mix(col, WHITE, 0.25));
    for (let i = 0; i < 4; i++) rect(x + 5 + i * 5, y + CHH - 8, 2, 2, mix(col, WHITE, 0.25));
    img(SPR.octo, x + 6, y + 13);
  }
  function drawCard(c, x, y, o = {}) {
    x = Math.round(x); y = Math.round(y);
    if (o.shadow !== false) { ctx.globalAlpha = 0.3; rrect(x + 2, y + 3, CW, CHH, INK, 2); ctx.globalAlpha = 1; }
    if (o.down) { drawBack(x, y); if (o.focus) rectLine(x - 1, y - 1, CW + 2, CHH + 2, MONEYC); return; }
    const en = c.enh ? ENH[c.enh] : null;
    rrect(x, y, CW, CHH, INK, 2);
    rrect(x + 1, y + 1, CW - 2, CHH - 2, en ? en.bg : '#fbf6ea', 1);
    if (c.enh === 'stone') {
      for (let i = 0; i < 14; i++) rect(x + 3 + hash2(i, c.id) * 21, y + 3 + hash2(c.id, i) * 33, 2, 2, i % 2 ? '#8a849c' : '#c4bfd0');
      jtext('石', x + CW / 2, y + 12, '#4a4460', { align: 'center', size: 16 });
    } else {
      const col = SUIT_COL[c.suit];
      text(RK(c.rank), x + 3, y + 3, col);
      img(suitImg(c.suit), x + 3, y + 12);
      if (c.enh === 'wild') { for (let i = 0; i < 4; i++) img(suitImg(i, [RED, GOLD, LIME, SKY][i]), x + 15 + (i % 2) * 6, y + 21 + Math.floor(i / 2) * 7); }
      else img(suitImg(c.suit), x + CW - 17, y + CHH - 17, 2);
      if (c.rank >= 11 && c.rank <= 13) { rect(x + CW - 9, y + 3, 6, 2, MONEYC); rect(x + CW - 9, y + 1, 1, 2, MONEYC); rect(x + CW - 7, y + 1, 1, 2, MONEYC); rect(x + CW - 4, y + 1, 1, 2, MONEYC); }
    }
    // 強化のしるし
    if (c.enh === 'pearl') { circle(x + CW - 6, y + 7, 2, WHITE); rect(x + CW - 7, y + 6, 1, 1, '#c8e4ff'); }
    if (c.enh === 'coral') { rect(x + CW - 6, y + 4, 1, 6, '#ff5a6a'); rect(x + CW - 8, y + 5, 2, 1, '#ff5a6a'); rect(x + CW - 4, y + 6, 2, 1, '#ff5a6a'); }
    if (c.enh === 'glass') { ctx.globalAlpha = 0.6; line(x + 4, y + CHH - 6, x + 14, y + 6, WHITE); line(x + 8, y + CHH - 4, x + 18, y + 8, WHITE); ctx.globalAlpha = 1; }
    if (c.enh === 'gold') text('$', x + CW - 8, y + 3, '#b07a10');
    if (c.enh === 'lucky') { rect(x + CW - 7, y + 4, 2, 2, '#3faa4a'); rect(x + CW - 5, y + 6, 2, 2, '#3faa4a'); rect(x + CW - 9, y + 6, 2, 2, '#3faa4a'); rect(x + CW - 7, y + 8, 2, 2, '#3faa4a'); }
    if (c.enh === 'steel') { for (const [dx, dy] of [[3, CHH - 5], [CW - 5, CHH - 5], [CW - 5, 3]]) rect(x + dx, y + dy, 2, 2, '#8a8ea8'); }
    if (c.enh === 'wild') { const cs = [RED, ORANGE, GOLD, LIME, SKY, VIOLET]; for (let i = 0; i < CHH - 4; i++) { rect(x + 1, y + 2 + i, 1, 1, cs[i % 6]); rect(x + CW - 2, y + 2 + i, 1, 1, cs[(i + 3) % 6]); } }
    // エディション
    if (c.ed) drawEdition(c.ed, x, y, CW, CHH);
    if (o.debuff) { ctx.globalAlpha = 0.55; rrect(x + 1, y + 1, CW - 2, CHH - 2, '#3a3450', 1); ctx.globalAlpha = 1; line(x + 5, y + 8, x + CW - 6, y + CHH - 9, RED); line(x + CW - 6, y + 8, x + 5, y + CHH - 9, RED); }
    if (o.focus) { rectLine(x - 1, y - 1, CW + 2, CHH + 2, MONEYC); }
  }
  function drawEdition(ed, x, y, w, h) {
    const t = Engine.t;
    if (ed === 'foil') {
      ctx.globalAlpha = 0.45;
      const p = (t * 0.6) % (w + h + 20) - 10;
      for (let i = 0; i < h - 2; i++) { const xx = p - i * 0.6; if (xx > 1 && xx < w - 3) rect(x + xx, y + 1 + i, 3, 1, '#dff6ff'); }
      ctx.globalAlpha = 1;
      rectLine(x, y, w, h, '#9ad8ff');
    } else if (ed === 'holo') {
      ctx.globalAlpha = 0.18 + 0.08 * Math.sin(t * 0.08);
      rect(x + 1, y + 1, w - 2, h - 2, ['#ff6ad0', '#6ad8ff', '#ffe06a'][(t >> 4) % 3]);
      ctx.globalAlpha = 1;
      rectLine(x, y, w, h, '#ff8ae0');
    } else if (ed === 'poly') {
      const cs = [RED, ORANGE, GOLD, LIME, SKY, VIOLET];
      for (let i = 0; i < w; i++) { rect(x + i, y, 1, 1, cs[(i + (t >> 2)) % 6]); rect(x + i, y + h - 1, 1, 1, cs[(i + 3 + (t >> 2)) % 6]); }
      for (let i = 0; i < h; i++) { rect(x, y + i, 1, 1, cs[(i + (t >> 2)) % 6]); rect(x + w - 1, y + i, 1, 1, cs[(i + 2 + (t >> 2)) % 6]); }
    }
  }
  function drawCharm(inst, x, y, o = {}) {
    x = Math.round(x); y = Math.round(y);
    const d = CH[inst.id], rc = RAR[d.r].col;
    if (o.shadow !== false) { ctx.globalAlpha = 0.3; rrect(x + 2, y + 3, KW, KH, INK, 2); ctx.globalAlpha = 1; }
    rrect(x, y, KW, KH, INK, 2);
    rrect(x + 1, y + 1, KW - 2, KH - 2, rc, 1);
    vgrad(x + 3, y + 3, KW - 6, KH - 12, '#1a4a7a', '#0c2440');
    const bob = o.still ? 0 : Math.round(Math.sin(Engine.t * 0.06 + inst.id.length) * 1);
    img(SPR[inst.id], x + 7, y + 6 + bob);
    rect(x + 3, y + KH - 9, KW - 6, 6, mix(rc, INK, 0.5));
    if (d.val) tiny(d.val(inst), x + KW / 2, y + KH - 8, WHITE, { align: 'center' });
    else for (let i = 0; i < d.r; i++) rect(x + KW / 2 - d.r * 2 + i * 4 + 1, y + KH - 7, 2, 2, WHITE);
    if (inst.ed) drawEdition(inst.ed, x, y, KW, KH);
    if (o.numb) { ctx.globalAlpha = 0.6; rect(x + 1, y + 1, KW - 2, KH - 2, '#3a3450'); ctx.globalAlpha = 1; line(x + 4, y + 10, x + 26, y + 22, YEL); line(x + 26, y + 10, x + 4, y + 30, YEL); }
    if (o.focus) rectLine(x - 1, y - 1, KW + 2, KH + 2, MONEYC);
  }
  function drawCons(c, x, y, o = {}) {
    x = Math.round(x); y = Math.round(y);
    if (o.shadow !== false) { ctx.globalAlpha = 0.3; rrect(x + 2, y + 3, KW, KH, INK, 2); ctx.globalAlpha = 1; }
    if (c.kind === 'fuda') {
      rrect(x, y, KW, KH, INK, 1); rect(x + 1, y + 1, KW - 2, KH - 2, '#f8efd8');
      rectLine(x + 3, y + 3, KW - 6, KH - 6, '#d0303a');
      rect(x + 3, y + 3, KW - 6, 4, '#d0303a');
      jtext(FU[c.id].k, x + KW / 2, y + 12, '#a01a2a', { align: 'center', size: 16 });
      rect(x + KW / 2 - 1, y + KH - 8, 2, 4, '#d0303a');
    } else if (c.kind === 'star') {
      rrect(x, y, KW, KH, INK, 2); vgrad(x + 1, y + 1, KW - 2, KH - 2, '#2a2a6a', '#121238');
      for (let i = 0; i < 6; i++) rect(x + 3 + hash2(i, 3) * 24, y + 3 + hash2(5, i) * 30, 1, 1, WHITE);
      img(SPR.star, x + 7, y + 6);
      jtext(HANDS[c.id].s, x + KW / 2, y + KH - 12, YEL, { align: 'center' });
    }
    if (o.focus) rectLine(x - 1, y - 1, KW + 2, KH + 2, MONEYC);
  }
  function drawPack(id, x, y, o = {}) {
    x = Math.round(x); y = Math.round(y);
    const P_ = PACKS[id];
    ctx.globalAlpha = 0.3; rrect(x + 2, y + 3, KW, KH, INK, 2); ctx.globalAlpha = 1;
    rect(x, y + 2, KW, KH - 4, INK);
    for (let i = 0; i < KW; i += 3) { rect(x + i, y, 2, 3, INK); rect(x + i, y + KH - 3, 2, 3, INK); rect(x + i, y + 1, 2, 2, P_.col); rect(x + i, y + KH - 3, 2, 2, P_.col); }
    vgrad(x + 1, y + 3, KW - 2, KH - 6, mix(P_.col, WHITE, 0.3), mix(P_.col, INK, 0.25));
    ctx.globalAlpha = 0.35; rect(x + 4, y + 3, 3, KH - 6, WHITE); ctx.globalAlpha = 1;
    if (id === 'charm') img(SPR.kumanomi, x + 7, y + 10);
    else if (id === 'star') img(SPR.star, x + 7, y + 10);
    else if (id === 'fuda') { rect(x + 9, y + 9, 12, 20, '#f8efd8'); rectLine(x + 9, y + 9, 12, 20, '#d0303a'); jtext('札', x + 15, y + 13, '#a01a2a', { align: 'center' }); }
    else { rrect(x + 7, y + 9, 14, 20, INK, 1); rect(x + 8, y + 10, 12, 18, '#fbf6ea'); img(suitImg(1), x + 11, y + 15); }
    if (o.focus) rectLine(x - 1, y - 1, KW + 2, KH + 2, MONEYC);
  }
  function drawVoucher(id, x, y, o = {}) {
    x = Math.round(x); y = Math.round(y);
    ctx.globalAlpha = 0.3; rrect(x + 2, y + 3, KW, KH, INK, 2); ctx.globalAlpha = 1;
    rrect(x, y, KW, KH, INK, 2);
    rrect(x + 1, y + 1, KW - 2, KH - 2, '#ffd86a', 1);
    for (let i = 0; i < 6; i++) rect(x + 1, y + 4 + i * 6, 2, 3, INK), rect(x + KW - 3, y + 4 + i * 6, 2, 3, INK);
    rect(x + 5, y + 5, KW - 10, KH - 10, '#fff2c0');
    jtext(VO[id].k, x + KW / 2, y + 12, '#a06010', { align: 'center', size: 16 });
    if (o.focus) rectLine(x - 1, y - 1, KW + 2, KH + 2, WHITE);
  }
  function drawItem(it, x, y, o) {
    if (it.kind === 'charm') drawCharm({ id: it.id, ed: it.ed, v: 0 }, x, y, o);
    else if (it.kind === 'fuda' || it.kind === 'star') drawCons(it, x, y, o);
    else if (it.kind === 'pack') drawPack(it.id, x, y, o);
    else if (it.kind === 'voucher') drawVoucher(it.id, x, y, o);
    else if (it.kind === 'card') drawCard(it.card, x, y, o);
  }
  function itemInfo(run, it) {
    if (it.kind === 'charm') { const d = CH[it.id]; return { name: d.jp, tag: RAR[d.r].jp, tagc: RAR[d.r].col, desc: d.desc + (it.ed ? `\n${EDS[it.ed].jp}：${EDS[it.ed].desc}` : '') + (d.val && it.v !== undefined && it.own ? `\nいま ${d.val(it)}` : '') }; }
    if (it.kind === 'fuda') { const f = FU[it.id]; return { name: f.jp, tag: 'おふだ', tagc: '#ff8a5a', desc: f.desc }; }
    if (it.kind === 'star') { const h = HANDS[it.id]; return { name: STARS[it.id], tag: '星のカード', tagc: '#9a8af0', desc: `${h.jp} の レベルが上がる\nLv.${run.levels[it.id]} → ${run.levels[it.id] + 1}（チップ +${h.lc} 倍率 +${h.lm}）` }; }
    if (it.kind === 'voucher') { const v = VO[it.id]; return { name: v.jp, tag: 'チケット', tagc: MONEYC, desc: v.desc + '\n（ずっと 効果が つづく）' }; }
    if (it.kind === 'pack') { const p = PACKS[it.id]; return { name: p.jp, tag: 'パック', tagc: p.col, desc: p.desc }; }
    if (it.kind === 'card') return cardInfo(it.card);
    return { name: '', desc: '' };
  }
  function cardInfo(c) {
    const lines = [];
    if (c.enh) lines.push(`${ENH[c.enh].jp}：${ENH[c.enh].desc}`);
    if (c.ed) lines.push(`${EDS[c.ed].jp}：${EDS[c.ed].desc}`);
    const name = c.enh === 'stone' ? '石のカード' : `${['スペード', 'ハート', 'クラブ', 'ダイヤ'][c.suit]}の ${RK(c.rank)}`;
    return { name, tag: 'トランプ', tagc: '#9ad8ff', desc: (lines.join('\n') || 'ふつうの カード') + (c.enh !== 'stone' ? `\nチップ +${chipsOf(c)}` : '') };
  }

  // ---- 背景（海のなか）----
  const bubbles = Array.from({ length: 18 }, (_, i) => ({ x: hash2(i, 9) * W, y: hash2(9, i) * H, s: 0.2 + hash2(i, i) * 0.5, r: hash2(i, 2) < 0.3 ? 2 : 1 }));
  function drawSea(t, boss = false) {
    if (boss) vgrad(0, 0, W, H, '#3a1040', '#0e0614');
    else vgrad(0, 0, W, H, '#0e4a6a', '#07142a');
    ctx.globalAlpha = boss ? 0.05 : 0.07;
    for (let i = 0; i < 5; i++) {
      const x = ((i * 70 + t * 0.15) % 340) - 60;
      ctx.fillStyle = boss ? '#ff6a8a' : '#9af0ff'; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 22, 0); ctx.lineTo(x - 50, H); ctx.lineTo(x - 90, H); ctx.fill();
    }
    ctx.globalAlpha = 1;
    for (const b of bubbles) {
      const y = ((b.y - t * b.s) % (H + 10) + H + 10) % (H + 10) - 5, x = b.x + Math.sin(t * 0.03 + b.y) * 2;
      ctx.globalAlpha = 0.35; if (b.r > 1) ring(x, y, 2, '#bff4ff'); else rect(x, y, 1, 1, '#bff4ff'); ctx.globalAlpha = 1;
    }
  }
  function felt(x, y, w, h, boss) {
    rrect(x, y, w, h, '#2a1a10', 3);
    rrect(x + 1, y + 1, w - 2, h - 2, boss ? '#c08a2a' : '#d8a840', 3);
    rrect(x + 3, y + 3, w - 6, h - 6, boss ? '#4a1838' : FELT, 2);
    ctx.globalAlpha = 0.25; rect(x + 4, y + 4, w - 8, 1, WHITE); ctx.globalAlpha = 1;
  }
  function pill(x, y, w, label, val, col) {
    rrect(x, y, w, 13, INK, 2); rrect(x + 1, y + 1, w - 2, 11, mix(col, INK, 0.55), 1);
    jtext(label, x + 4, y + 2, LIGHT);
    text(String(val), x + w - 4, y + 3, col === MONEYC ? MONEYC : WHITE, { align: 'right' });
  }
  function bigBtn(x, y, w, h, key, label, sub, col, on = true) {
    const c = on ? col : '#4a4660';
    ctx.globalAlpha = 0.35; rrect(x + 2, y + 3, w, h, INK, 3); ctx.globalAlpha = 1;
    rrect(x, y, w, h, INK, 3); rrect(x + 1, y + 1, w - 2, h - 2, c, 2);
    rect(x + 3, y + 2, w - 6, 1, mix(c, WHITE, 0.4));
    btnIcon(key, x + 5, y + Math.floor(h / 2) - 6);
    jtext(label, x + 22, y + (sub !== '' ? 4 : Math.floor(h / 2) - 4), on ? WHITE : GRAY, { outline: on ? mix(c, INK, 0.6) : null });
    if (sub !== '') jtext(sub, x + 22, y + h - 14, on ? mix(c, WHITE, 0.7) : GRAY);
  }

  // =========================================================
  //  ランの画面（テーブル選択 → 勝負 → 精算 → お店 …）
  // =========================================================
  function OctoRun(run) {
    let mode = '', mt = 0, round = null, cur = 0, zone = 'hand', top = 0, menu = null, toast = null, overlay = null;
    let scoring = null, cash = null, shop = null, pack = null, packNext = null, over = null, tsel = 0;
    let dispScore = 0, chipsD = 0, multD = 0, handLabel = null, sortMode = 'rank', shopSel = [0, 0], sellArm = null;
    const sel = new Set(), anim = new Map(), jig = new Map(), flyOut = [];
    const BOSS = () => BO[run.boss];
    const t = () => Engine.t;
    const say = (s, col = WHITE) => { toast = { s, col, t: 90 }; };
    const jiggle = k => jig.set(k, 12);
    const jigOf = k => { const v = jig.get(k) || 0; return v ? Math.sin(v * 1.2) * v * 0.25 : 0; };
    function setMode(m) { mode = m; mt = 0; menu = null; }
    function music() {
      if (mode === 'shop') Audio_.play(SONG_SHOP);
      else if (run.table === 2 && (mode === 'round' || mode === 'scoring' || mode === 'select')) Audio_.play(SONG_BOSS);
      else Audio_.play(SONG_TABLE);
    }
    function saveRun() { Save.set('octo_run', run); }
    function toSelect() { tsel = run.table; setMode('select'); saveRun(); music(); }

    // ---- ラウンド ----
    const hsizeNow = () => Math.max(1, run.hsize + passive(run, 'hsize') - (round && round.boss && round.boss.id === 'small' ? 1 : 0));
    const rv = c => c.enh === 'stone' ? 0 : c.rank;
    function sortHand() { round.hand.sort(sortMode === 'rank' ? (a, b) => rv(b) - rv(a) || a.suit - b.suit : (a, b) => a.suit - b.suit || rv(b) - rv(a)); }
    function startRound() {
      const boss = run.table === 2 ? BOSS() : null;
      const fin = boss && boss.final;
      round = {
        boss, target: targetOf(run, run.table), score: 0,
        hands: Math.max(1, run.hands - (boss && (boss.id === 'hands' || fin) ? 1 : 0)),
        disc: boss && boss.id === 'nodisc' ? 0 : Math.max(0, run.disc + passive(run, 'disc') - (fin ? 1 : 0)),
        draw: shuffle(run.cards.slice()), hand: [], types: new Set(), down: new Set(), numb: -1, first: true,
      };
      dispScore = 0; sel.clear(); cur = 0; zone = 'hand'; handLabel = null;
      setMode('round'); music();
      dealTo();
      if (boss) { Audio_.sfx('bossin'); say(boss.desc, boss.col); }
    }
    function dealTo() {
      const n = hsizeNow() - round.hand.length;
      let k = 0;
      for (let i = 0; i < n && round.draw.length; i++) {
        const c = round.draw.pop();
        if (round.boss && round.boss.id === 'dark' && round.first && Math.random() < 0.5) round.down.add(c.id);
        round.hand.push(c);
        anim.set(c.id, { x: 212, y: 300, d: k++ * 3 });
      }
      round.first = false;
      sortHand();
      cur = clamp(cur, 0, Math.max(0, round.hand.length - 1));
    }
    function handPos(i, n) {
      const sp = Math.min(30, (W - 10 - CW) / Math.max(1, n - 1));
      return [Math.round((W - (sp * (n - 1) + CW)) / 2 + i * sp), HAND_Y];
    }
    const selected = () => round.hand.filter(c => sel.has(c.id));
    function previewHand() {
      const s = selected();
      if (!s.length) { handLabel = null; return; }
      const ev = evaluate(s, passive(run, 'four') > 0);
      const H = HANDS[ev.type], lv = run.levels[ev.type];
      let c = H.c + H.lc * (lv - 1), m = H.m + H.lm * (lv - 1);
      if (round.boss && round.boss.id === 'half') { c = Math.ceil(c / 2); m = Math.max(1, Math.ceil(m / 2)); }
      handLabel = { type: ev.type, lv }; chipsD = c; multD = m;
    }
    function doPlay() {
      const s = selected();
      if (!s.length) { Audio_.sfx('deny'); say('カードを えらんでね（A）'); return; }
      if (round.boss && round.boss.id === 'five' && s.length !== 5 && round.hand.length >= 5) { Audio_.sfx('deny'); FX.shake(2); say('ぬし：かならず 5まい 出す！', round.boss.col); return; }
      round.hands--;
      const played = s;
      round.hand = round.hand.filter(c => !sel.has(c.id));
      sel.clear();
      for (const c of played) round.down.delete(c.id);
      if (round.boss && round.boss.id === 'money') { run.money = Math.max(0, run.money - 1); say('がめついカニに $1 とられた', RED); }
      round.numb = round.boss && round.boss.id === 'numb' && run.charms.length ? randi(0, run.charms.length - 1) : -1;
      run.charms.forEach(inst => { const d = CH[inst.id]; if (d.play) d.play({ run, round, inst }); });
      const res = computeScore(run, round, played, round.hand);
      run.played[res.type]++; round.types.add(res.type); run.stats.hands++;
      const n = played.length;
      played.forEach((c, i) => { const a = anim.get(c.id) || { x: 100, y: HAND_Y }; a.d = i * 2; anim.set(c.id, a); });
      scoring = { res, played, i: 0, timer: 22 + n * 2, n, phase: 'events', chips: res.base.chips, mult: res.base.mult, money: 0, total: 0 };
      chipsD = res.base.chips; multD = res.base.mult; handLabel = { type: res.type, lv: run.levels[res.type] };
      Audio_.sfx('card');
      setMode('scoring');
    }
    function doDiscard() {
      const s = selected();
      if (!s.length) { Audio_.sfx('deny'); say('すてるカードを えらんでね（A）'); return; }
      if (round.disc <= 0) { Audio_.sfx('deny'); say(round.boss && round.boss.id === 'nodisc' ? 'ぬし：すてる ことが できない！' : 'もう すてられない'); return; }
      round.disc--;
      round.hand = round.hand.filter(c => !sel.has(c.id));
      s.forEach((c, i) => { const a = anim.get(c.id); flyOut.push({ c, x: a ? a.x : 100, y: a ? a.y : HAND_Y, vx: 4 + i * 0.5, vy: -2 - i * 0.3, t: 0, down: round.down.has(c.id) }); });
      sel.clear();
      run.charms.forEach(inst => { const d = CH[inst.id]; if (d.discard) d.discard(s, { run, round, inst }); });
      Audio_.sfx('shuffle');
      dealTo(); handLabel = null;
    }
    function scoringPos(i, n) { const sp = Math.min(32, 200 / Math.max(1, n - 1)); return [Math.round((W - (sp * (n - 1) + CW)) / 2 + i * sp), 165]; }
    function charmPos(i) {
      const n = Math.max(run.slots, run.charms.length), area = 168;
      const sp = Math.min(32, (area - KW) / Math.max(1, n - 1));
      return [5 + i * sp, 50];
    }
    function consPos(i) { const n = Math.max(run.cslots, run.cons.length); const sp = Math.min(33, 64 / Math.max(1, n - 1 || 1)); return [W - 5 - KW - (n - 1 - i) * sp, 50]; }
    function eventPos(src) {
      if (src.card) { const i = scoring.played.indexOf(src.card); if (i >= 0) { const [x, y] = scoringPos(i, scoring.n); return [x + CW / 2, y - 6]; } }
      if (src.held) { const i = round.hand.indexOf(src.held); if (i >= 0) { const a = anim.get(src.held.id); return [a.x + CW / 2, a.y - 6]; } }
      if (src.charm) { const i = run.charms.indexOf(src.charm); if (i >= 0) { const [x, y] = charmPos(i); return [x + KW / 2, y + KH + 4]; } }
      return [W / 2, 120];
    }
    function stepScoring() {
      const S = scoring;
      if (S.phase === 'events') {
        if (--S.timer > 0) return;
        const e = S.res.events[S.i];
        if (!e) { S.phase = 'total'; S.timer = 34; S.total = S.res.total; Audio_.sfx(S.total >= round.target - round.score ? 'fire' : 'pop'); if (S.total > 0) FX.shake(Math.min(4, 1 + Math.log10(S.total + 1) * 0.5)); return; }
        const [x, y] = eventPos(e.src || {});
        const pitch = Math.min(14, S.i * 0.6);
        if (e.kind === 'chips') { S.chips += e.v; chipsD = S.chips; FX.float(x, y, '+' + fmt(e.v), CHIPC, { outline: WHITE }); Audio_.sfx('chip', pitch); }
        else if (e.kind === 'mult') { S.mult += e.v; multD = S.mult; FX.float(x, y, '+' + fmt(e.v), MULTC, { outline: WHITE }); Audio_.sfx('mult', pitch); }
        else if (e.kind === 'xmult') { S.mult *= e.v; multD = S.mult; FX.float(x, y, '`' + e.v, XMC, { outline: WHITE }); Audio_.sfx('xmult', pitch); FX.shake(1.5); }
        else if (e.kind === 'money') { run.money += e.v; FX.float(x, y, '$' + e.v, MONEYC, { outline: INK }); Audio_.sfx('cash'); }
        else if (e.kind === 'again') { FX.float(x, y, 'もう1回！', ORANGE, { j: true }); Audio_.sfx('pick'); }
        else if (e.kind === 'debuff') { FX.float(x, y, 'ふうじ', GRAY, { j: true }); Audio_.sfx('deny'); }
        else if (e.kind === 'zero') { FX.float(W / 2, 130, 'もう出した役は 0点！', RED, { j: true, life: 70 }); Audio_.sfx('deny'); }
        if (e.src) { if (e.src.card) jiggle('c' + e.src.card.id); if (e.src.held) jiggle('c' + e.src.held.id); if (e.src.charm) jiggle('k' + run.charms.indexOf(e.src.charm)); }
        S.i++;
        S.timer = Math.max(5, 15 - Math.floor(S.i * 0.7));
        return;
      }
      if (S.phase === 'total') {
        if (--S.timer > 0) return;
        round.score += S.total;
        run.stats.best = Math.max(run.stats.best, S.total);
        if (S.total > REC.bestHand) { REC.bestHand = S.total; saveRec(); }
        S.phase = 'out'; S.timer = 16;
        S.played.forEach((c, i) => { const [x, y] = scoringPos(i, S.n); flyOut.push({ c, x, y, vx: 5 + i * 0.4, vy: -1.5, t: 0 }); });
        for (const c of S.res.broken) { const i = run.cards.indexOf(c); if (i >= 0) run.cards.splice(i, 1); const [x, y] = scoringPos(S.played.indexOf(c), S.n); P.burst(x + CW / 2, y + CHH / 2, 16, { speed: 2.5, col: ['#d8fbff', WHITE, '#9ae8ff'], life: 30 }); Audio_.sfx('glass'); FX.float(x + CW / 2, y - 4, 'われた！', SKY, { j: true }); }
        return;
      }
      if (S.phase === 'out') {
        if (--S.timer > 0) return;
        scoring = null; handLabel = null;
        if (round.score >= round.target) { setMode('win'); Audio_.sfx('win'); P.burst(W / 2, 30, 40, { speed: 3, col: [MONEYC, WHITE, ORANGE, PINK], life: 50, shape: 'star' }); return; }
        if (round.hands <= 0) { gameOver(); return; }
        dealTo(); setMode('round');
      }
    }
    function gameOver() {
      setMode('over'); Audio_.stop(); Audio_.sfx('over');
      REC.runs++; REC.best = Math.max(REC.best, run.night); if (run.endless) REC.endless = Math.max(REC.endless, run.night); saveRec();
      Save.del('octo_run');
      over = { sel: 0 };
    }
    // ---- 精算 ----
    function makeCash() {
      const lines = [];
      lines.push([`${TNAME[run.table]}に 勝った`, rewardOf(run.table)]);
      if (round.hands > 0) lines.push([`のこりの「出す」 ${round.hands}回`, round.hands]);
      const it = Math.min(Math.floor(run.money / 5), intCap(run));
      if (it > 0) lines.push([`利子（$5ごとに $1・上限 $${intCap(run)}）`, it]);
      const gold = round.hand.filter(c => c.enh === 'gold').length;
      if (gold) lines.push([`手札の 金貨カード ${gold}まい`, gold * 3]);
      run.charms.forEach(inst => { const d = CH[inst.id]; if (d.end) lines.push([d.jp, d.end({ run, inst })]); if (d.copy) { const i = run.charms.indexOf(inst), r = run.charms[i + 1]; if (r && CH[r.id].end) lines.push([d.jp + '（まね）', CH[r.id].end({ run, inst: r })]); } });
      cash = { lines, total: lines.reduce((s, l) => s + l[1], 0), shown: 0 };
    }
    function finishCash() {
      run.money += cash.total;
      run.tstate[run.table] = 'win';
      if (run.table === 2) { run.stats.bossWins++; run.charms.forEach(inst => { const d = CH[inst.id]; if (d.boss) d.boss({ run, inst }); }); }
      REC.best = Math.max(REC.best, run.night); saveRec();
      if (run.table === 2 && run.night === 8 && !run.endless) { setMode('victory'); Audio_.stop(); Audio_.sfx('fanfare'); over = { sel: 0 }; REC.wins++; saveRec(); return; }
      openShop();
    }
    function openShop() { shop = newShop(run); shopSel = [0, 0]; setMode('shop'); music(); }
    function leaveShop() {
      run.table++;
      if (run.table > 2) { run.night++; newNight(run); }
      toSelect();
    }
    // ---- パック ----
    function openPack(id, free = false, after = null) {
      let opts = [];
      if (id === 'charm') { const a = rollCharm(run); const b = rollCharm(run, [a.id]); opts = [{ kind: 'charm', id: a.id, ed: a.ed }, { kind: 'charm', id: b.id, ed: b.ed }]; }
      if (id === 'fuda') { const ids = shuffle(FUDA.map(f => f.id)).slice(0, 3); opts = ids.map(i => ({ kind: 'fuda', id: i })); }
      if (id === 'star') { const ex = []; for (let i = 0; i < 3; i++) { const s = rollStar(run, ex); ex.push(s); opts.push({ kind: 'star', id: s }); } }
      if (id === 'card') for (let i = 0; i < 3; i++) opts.push({ kind: 'card', card: rollCard(run) });
      pack = { id, opts, sel: 0, t: 0 };
      packNext = after;
      Audio_.sfx('magic');
    }
    function takePack() {
      const it = pack.opts[pack.sel];
      if (it.kind === 'charm') { if (run.charms.length >= run.slots) { Audio_.sfx('deny'); say('なかまが いっぱい！ うってから えらぼう'); return; } run.charms.push({ id: it.id, ed: it.ed, v: 0 }); jiggle('k' + (run.charms.length - 1)); }
      if (it.kind === 'fuda') { if (run.cons.length >= run.cslots) { Audio_.sfx('deny'); say('おふだが いっぱい！'); return; } run.cons.push({ kind: 'fuda', id: it.id }); }
      if (it.kind === 'star') levelUp(it.id);
      if (it.kind === 'card') { run.cards.push(it.card); say('デッキに 入れた！'); }
      Audio_.sfx('buy');
      closePack();
    }
    function closePack() { pack = null; const f = packNext; packNext = null; if (f) f(); }
    function levelUp(type) {
      run.levels[type]++;
      Audio_.sfx('levelup');
      say(`${HANDS[type].jp} が Lv.${run.levels[type]} に！`, YEL);
      P.burst(W / 2, 120, 24, { speed: 2.5, col: [YEL, WHITE, VIOLET], shape: 'star', life: 40 });
    }
    // ---- おふだを使う ----
    function useCons(i) {
      const c = run.cons[i];
      if (c.kind === 'star') { levelUp(c.id); run.cons.splice(i, 1); return true; }
      const f = FU[c.id];
      const inRound = mode === 'round' && round;
      const cards = inRound ? selected() : [];
      if (f.min > 0) {
        if (!inRound) { Audio_.sfx('deny'); say('テーブルで カードを えらんでから 使おう'); return false; }
        if (cards.length < f.min || cards.length > f.max) { Audio_.sfx('deny'); say(f.min === f.max ? `カードを ${f.min}まい えらんでね` : `カードを ${f.min}〜${f.max}まい えらんでね`); return false; }
      }
      switch (f.id) {
        case 'fire':
          for (const cd of cards) { const k = run.cards.indexOf(cd); if (k >= 0) run.cards.splice(k, 1); const a = anim.get(cd.id); if (a) P.burst(a.x + CW / 2, a.y + CHH / 2, 14, { col: [ORANGE, RED, YEL], speed: 2, life: 26 }); }
          round.hand = round.hand.filter(cd => !cards.includes(cd)); Audio_.sfx('fire'); break;
        case 'copy': { const ord = round.hand.filter(cd => cards.includes(cd)); const [l, r] = ord; Object.assign(l, { rank: r.rank, suit: r.suit, enh: r.enh, ed: r.ed }); break; }
        case 'up': for (const cd of cards) if (cd.enh !== 'stone') cd.rank = cd.rank === 14 ? 2 : cd.rank + 1; break;
        case 'tide': { const g = Math.min(run.money, 20); run.money += g; say(`$${g} もらった！`, MONEYC); Audio_.sfx('cash'); break; }
        case 'maneki': if (run.charms.length >= run.slots) { Audio_.sfx('deny'); say('なかまが いっぱい！'); return false; } run.charms.push(rollCharm(run)); jiggle('k' + (run.charms.length - 1)); say('なかまが きた！', LIME); break;
        case 'kira': { const c0 = run.charms.filter(k => !k.ed); if (!c0.length) { Audio_.sfx('deny'); say('キラキラに できる なかまが いない'); return false; } const k = pick(c0); k.ed = pick(['foil', 'foil', 'holo', 'holo', 'poly']); say(`${CH[k.id].jp} が ${EDS[k.ed].jp}に！`, YEL); break; }
        case 'takara': { const g = Math.min(40, run.charms.reduce((s, k) => s + sellOf(k), 0)); run.money += g; say(`$${g} もらった！`, MONEYC); Audio_.sfx('cash'); break; }
        default:
          if (f.enh) for (const cd of cards) cd.enh = f.enh;
          if (f.suit !== undefined) for (const cd of cards) if (cd.enh !== 'stone') cd.suit = f.suit;
      }
      for (const cd of cards) { jiggle('c' + cd.id); const a = anim.get(cd.id); if (a) P.burst(a.x + CW / 2, a.y + 10, 8, { col: [WHITE, LAV, YEL], speed: 1.5, life: 20, shape: 'star' }); }
      run.cons.splice(i, 1);
      Audio_.sfx('magic');
      if (inRound) { sel.clear(); if (f.id === 'fire') dealTo(); else sortHand(); previewHand(); }
      return true;
    }
    function sellCharm(i) { const k = run.charms[i]; run.money += sellOf(k); run.charms.splice(i, 1); Audio_.sfx('sell'); say(`${CH[k.id].jp} を $${sellOf(k)} で うった`, MONEYC); }
    function sellCons(i) { run.cons.splice(i, 1); run.money += 1; Audio_.sfx('sell'); }

    // ---- 上の段（なかま・おふだ）を えらぶ ----
    const topCount = () => run.charms.length + run.cons.length;
    function topItem(i) { return i < run.charms.length ? { t: 'charm', i } : { t: 'cons', i: i - run.charms.length }; }
    function updateTop(back) {
      const n = topCount();
      if (!n) { zone = back; return; }
      top = clamp(top, 0, n - 1);
      if (btnrep(BTN.LEFT)) { top = (top + n - 1) % n; Audio_.sfx('cursor'); }
      if (btnrep(BTN.RIGHT)) { top = (top + 1) % n; Audio_.sfx('cursor'); }
      const it = topItem(top);
      if (it.t === 'charm' && (btnp(BTN.L1) || btnp(BTN.R1))) {
        const d = btnp(BTN.L1) ? -1 : 1, j = it.i + d;
        if (j >= 0 && j < run.charms.length) { [run.charms[it.i], run.charms[j]] = [run.charms[j], run.charms[it.i]]; top += d; Audio_.sfx('pick'); }
      }
      if (btnp(BTN.A)) {
        Audio_.sfx('select');
        if (it.t === 'charm') menu = { items: [{ jp: `うる（$${sellOf(run.charms[it.i])}）`, act: () => { sellCharm(it.i); top = Math.max(0, top - 1); } }, { jp: 'やめる', act: () => {} }], sel: 0 };
        else menu = { items: [{ jp: 'つかう', act: () => { if (useCons(it.i)) { top = Math.max(0, top - 1); if (mode === 'round') zone = 'hand'; } } }, { jp: 'うる（$1）', act: () => { sellCons(it.i); top = Math.max(0, top - 1); } }, { jp: 'やめる', act: () => {} }], sel: 0 };
      }
      if (btnp(BTN.DOWN) || btnp(BTN.B)) { zone = back; Audio_.sfx('move'); }
    }
    function updateMenu() {
      if (btnrep(BTN.UP)) { menu.sel = (menu.sel + menu.items.length - 1) % menu.items.length; Audio_.sfx('move'); }
      if (btnrep(BTN.DOWN)) { menu.sel = (menu.sel + 1) % menu.items.length; Audio_.sfx('move'); }
      if (btnp(BTN.A)) { const it = menu.items[menu.sel]; menu = null; it.act(); }
      else if (btnp(BTN.B)) { menu = null; Audio_.sfx('back'); }
    }

    // ================= 更新 =================
    const MODES = {};
    MODES.select = {
      update() {
        const tb = run.table;
        if (btnp(BTN.A)) { Audio_.sfx('select'); startRound(); return; }
        if (btnp(BTN.Y) && tb < 2) {
          Audio_.sfx('select');
          run.tstate[tb] = 'skip';
          const tag = skipTag(tb);
          const next = () => { run.table++; toSelect(); };
          if (tag === 'money') { run.money += 8; say('$8 もらった！', MONEYC); Audio_.sfx('cash'); next(); }
          else openPack(tag, true, next);
        }
        if (btnp(BTN.UP) || btnp(BTN.DOWN)) { zone = zone === 'top' ? 'none' : 'top'; }
      },
    };
    function skipTag(tb) { const k = (run.night * 7 + tb * 3) % 4; return ['charm', 'money', 'star', 'fuda'][k]; }
    MODES.round = {
      update() {
        if (zone === 'top') { updateTop('hand'); return; }
        const n = round.hand.length;
        if (btnrep(BTN.LEFT, 14, 4) && n) { cur = (cur + n - 1) % n; Audio_.sfx('cursor'); }
        if (btnrep(BTN.RIGHT, 14, 4) && n) { cur = (cur + 1) % n; Audio_.sfx('cursor'); }
        if (btnp(BTN.A) && n) {
          const c = round.hand[cur];
          if (sel.has(c.id)) { sel.delete(c.id); Audio_.sfx('unpick'); }
          else if (sel.size >= 5) { Audio_.sfx('deny'); say('えらべるのは 5まいまで'); }
          else { sel.add(c.id); Audio_.sfx('pick'); }
          previewHand();
        }
        if (btnp(BTN.B) && sel.size) { sel.clear(); Audio_.sfx('back'); previewHand(); }
        if (btnp(BTN.X)) doPlay();
        else if (btnp(BTN.Y)) doDiscard();
        if (btnp(BTN.L1)) { sortMode = sortMode === 'rank' ? 'suit' : 'rank'; sortHand(); Audio_.sfx('shuffle'); say(sortMode === 'rank' ? '数字じゅんに ならべた' : 'マークじゅんに ならべた'); }
        if (btnp(BTN.R1)) { overlay = 'hands'; Audio_.sfx('select'); }
        if (btnp(BTN.SELECT)) { overlay = 'deck'; Audio_.sfx('select'); }
        if (btnp(BTN.UP) && topCount()) { zone = 'top'; Audio_.sfx('move'); }
      },
    };
    MODES.scoring = { update() { stepScoring(); } };
    MODES.win = { update() { if (mt > 50) { makeCash(); setMode('cash'); } } };
    MODES.cash = {
      update() {
        if (cash.shown < cash.lines.length && mt % 10 === 9) { cash.shown++; Audio_.sfx('cash'); }
        if ((btnp(BTN.A) || btnp(BTN.X)) && mt > 12) {
          if (cash.shown < cash.lines.length) { cash.shown = cash.lines.length; return; }
          Audio_.sfx('buy'); finishCash();
        }
      },
    };
    MODES.shop = {
      update() {
        if (zone === 'top') { updateTop('shop'); return; }
        const rows = [shop.items.length + (run.voucherNow ? 1 : 0) + shop.packs.length];
        const row0 = shopRow0();
        if (btnrep(BTN.LEFT)) { shopSel[0] = (shopSel[0] + row0.length - 1) % row0.length; Audio_.sfx('cursor'); sellArm = null; }
        if (btnrep(BTN.RIGHT)) { shopSel[0] = (shopSel[0] + 1) % row0.length; Audio_.sfx('cursor'); sellArm = null; }
        if (btnp(BTN.DOWN) && topCount()) { zone = 'top'; Audio_.sfx('move'); }
        if (btnp(BTN.A)) buy(row0[shopSel[0]]);
        if (btnp(BTN.Y)) {
          const c = rerollCost(run, shop);
          if (run.money < c) { Audio_.sfx('deny'); say('お金が たりない'); }
          else { run.money -= c; shop.rerolls++; const items = []; for (let i = 0; i < 2; i++) items.push(rollShopItem(run, items)); shop.items = items; Audio_.sfx('shuffle'); }
        }
        if (btnp(BTN.X)) { Audio_.sfx('select'); leaveShop(); }
        void rows;
      },
    };
    function shopRow0() {
      const r = [];
      shop.items.forEach((it, i) => r.push({ ...it, src: 'items', i }));
      if (run.voucherNow) r.push({ kind: 'voucher', id: run.voucherNow, src: 'voucher' });
      shop.packs.forEach((it, i) => r.push({ ...it, src: 'packs', i }));
      return r;
    }
    function buy(it) {
      if (!it || it.sold) { Audio_.sfx('deny'); return; }
      const p = priceOf(run, it);
      if (run.money < p) { Audio_.sfx('deny'); say('お金が たりない'); FX.shake(2); return; }
      if (it.kind === 'charm' && run.charms.length >= run.slots) { Audio_.sfx('deny'); say('なかまが いっぱい！ うってから かおう'); return; }
      if (it.kind === 'fuda' && run.cons.length >= run.cslots) { Audio_.sfx('deny'); say('おふだが いっぱい！'); return; }
      run.money -= p;
      Audio_.sfx('buy');
      if (it.kind === 'charm') { run.charms.push({ id: it.id, ed: it.ed, v: 0 }); jiggle('k' + (run.charms.length - 1)); }
      if (it.kind === 'fuda') run.cons.push({ kind: 'fuda', id: it.id });
      if (it.kind === 'star') levelUp(it.id);
      if (it.kind === 'voucher') { applyVoucher(it.id); run.voucherNow = null; }
      if (it.src === 'items') shop.items[it.i] = { ...shop.items[it.i], sold: true };
      if (it.src === 'packs') { shop.packs[it.i] = { ...shop.packs[it.i], sold: true }; openPack(it.id); }
      const r0 = shopRow0(); shopSel[0] = clamp(shopSel[0], 0, r0.length - 1);
    }
    function applyVoucher(id) {
      if (id === 'hands') run.hands++;
      if (id === 'disc') run.disc++;
      if (id === 'hsize') run.hsize++;
      if (id === 'slot') run.slots++;
      if (id === 'cslot') run.cslots++;
      run.vouchers.push(id);
      say(`${VO[id].jp}：${VO[id].desc}`, MONEYC);
    }
    MODES.over = {
      update() {
        if (mt < 40) return;
        if (btnrep(BTN.UP) || btnrep(BTN.DOWN)) { over.sel ^= 1; Audio_.sfx('move'); }
        if (btnp(BTN.A)) { Audio_.sfx('select'); if (over.sel === 0) Engine.go(() => DeckSelect()); else Engine.go(() => OctoTitle()); }
      },
    };
    MODES.victory = {
      update() {
        if (mt > 30 && mt < 200 && mt % 8 === 0) P.burst(rand(20, W - 20), rand(30, 140), 12, { speed: 2.4, col: [MONEYC, PINK, SKY, LIME, WHITE], life: 50, shape: 'star' });
        if (mt < 60) return;
        if (btnrep(BTN.UP) || btnrep(BTN.DOWN)) { over.sel ^= 1; Audio_.sfx('move'); }
        if (btnp(BTN.A)) {
          Audio_.sfx('select');
          if (over.sel === 0) { run.endless = true; openShop(); }
          else { Save.del('octo_run'); Engine.go(() => OctoTitle()); }
        }
      },
    };

    // ================= 描画 =================
    function drawHUD() {
      const boss = run.table === 2;
      // 左：テーブル
      rrect(3, 3, 112, 40, INK, 3); rrect(4, 4, 110, 38, boss ? '#4a1838' : '#123a5a', 2);
      const nl = run.endless ? `エンドレス 夜${run.night}` : `夜 ${run.night}/8`;
      jtext(nl, 9, 6, LIGHT);
      jtext(TNAME[run.table], 108, 6, boss ? BOSS().col : SKY, { align: 'right' });
      jtext('目標', 9, 24, GRAY);
      text(fmt(round ? round.target : targetOf(run, run.table)), 108, 26, MONEYC, { align: 'right' });
      // 右：スコア
      rrect(118, 3, 119, 40, INK, 3); rrect(119, 4, 117, 38, '#123a5a', 2);
      jtext('スコア', 124, 6, GRAY);
      const sc = Math.floor(dispScore);
      text(fmt(sc), 231, 8, WHITE, { align: 'right', scale: sc >= 1e6 ? 1 : 2 });
      if (round) {
        const k = clamp(dispScore / round.target, 0, 1);
        rect(124, 30, 107, 7, INK); rect(125, 31, 105 * k, 5, k >= 1 ? MONEYC : CHIPC);
        if (k >= 1) for (let i = 0; i < 3; i++) rect(125 + ((Engine.t * 2 + i * 35) % 105), 31, 2, 5, WHITE);
      }
    }
    function drawPills() {
      const y = 92;
      if (!round) return;
      pill(4, y, 56, '出す', round.hands, CHIPC);
      pill(63, y, 62, 'すてる', round.disc, MULTC);
      pill(128, y, 50, '', '$' + run.money, MONEYC);
      pill(181, y, 55, '山', round.draw.length + '/' + run.cards.length, GRAY);
    }
    function drawTop(active) {
      // なかま
      const n = Math.max(run.slots, run.charms.length);
      for (let i = 0; i < run.slots; i++) if (i >= run.charms.length) { const [x, y] = charmPos(i); ctx.globalAlpha = 0.35; rrect(x, y, KW, KH, '#0a2a40', 2); ctx.globalAlpha = 1; rectLine(x + 2, y + 2, KW - 4, KH - 4, '#2a5a7a'); }
      run.charms.forEach((k, i) => {
        const [x, y] = charmPos(i), on = active && zone === 'top' && top === i;
        drawCharm(k, x, y - (on ? 3 : 0) + jigOf('k' + i), { focus: on, numb: round && round.numb === i && mode === 'scoring' });
      });
      void n;
      for (let i = 0; i < run.cslots; i++) if (i >= run.cons.length) { const [x, y] = consPos(i); ctx.globalAlpha = 0.35; rrect(x, y, KW, KH, '#3a1a20', 2); ctx.globalAlpha = 1; rectLine(x + 2, y + 2, KW - 4, KH - 4, '#6a3a40'); }
      run.cons.forEach((c, i) => {
        const [x, y] = consPos(i), on = active && zone === 'top' && top === run.charms.length + i;
        drawCons(c, x, y - (on ? 3 : 0), { focus: on });
      });
    }
    function drawInfoPanel(info, x, y, w, h, extra = '') {
      rrect(x, y, w, h, INK, 3); rrect(x + 1, y + 1, w - 2, h - 2, '#16284a', 2);
      jtext(info.name, x + 7, y + 5, WHITE);
      if (info.tag) { const tw = jw(info.tag) + 8; rrect(x + w - tw - 6, y + 4, tw, 12, info.tagc || GRAY, 2); jtext(info.tag, x + w - tw - 2, y + 5, INK); }
      let yy = y + 20;
      for (const l of jwrap(info.desc, w - 14)) { jtext(l, x + 7, yy, LIGHT); yy += 12; if (yy > y + h - 12) break; }
      if (extra) jtext(extra, x + w - 7, y + h - 14, MONEYC, { align: 'right' });
    }
    function drawCenter() {
      const boss = run.table === 2;
      felt(3, 106, W - 6, 104, boss);
      // 役の名前とチップ×倍率
      if (handLabel) {
        const H = HANDS[handLabel.type];
        jtext(H.jp, W / 2 - 4, 112, WHITE, { align: 'center', size: 16, outline: INK });
        tiny('LV' + handLabel.lv, W / 2 + jw(H.jp, 16) / 2 + 2, 118, YEL);
      } else if (mode === 'round' && round.boss) {
        jtext(round.boss.jp, W / 2, 112, round.boss.col, { align: 'center', outline: INK });
        jtext(round.boss.desc, W / 2, 125, LIGHT, { align: 'center' });
      }
      const showBox = handLabel || mode === 'scoring';
      if (showBox && !(scoring && scoring.phase !== 'events')) {
        const bw = 84, by = 131;
        rrect(14, by, bw, 26, INK, 3); rrect(15, by + 1, bw - 2, 24, CHIPC, 2);
        text(fmt(chipsD), 14 + bw - 6, by + 6, WHITE, { align: 'right', scale: chipsD >= 1e5 ? 1 : 2, outline: mix(CHIPC, INK, 0.5) });
        text('`', W / 2 - 5, by + 6, WHITE, { scale: 2, outline: INK });
        rrect(W - 14 - bw, by, bw, 26, INK, 3); rrect(W - 13 - bw, by + 1, bw - 2, 24, MULTC, 2);
        const mtxt = multD >= 1e5 ? fmt(multD) : (Math.round(multD * 10) / 10).toString();
        text(mtxt, W - 14 - bw + 6, by + 6, WHITE, { scale: multD >= 1e4 ? 1 : 2, outline: mix(MULTC, INK, 0.5) });
        tiny('CHIPS', 18, by + 2, '#cfe4ff'); tiny('MULT', W - 14 - bw + 4, by + 2, '#ffd0d4');
      }
      if (scoring && scoring.phase !== 'events') {
        const k = scoring.phase === 'total' ? clamp((34 - scoring.timer) / 8, 0, 1) : 1;
        const big = fmt(scoring.total);
        text(big, W / 2, 132, MONEYC, { align: 'center', scale: big.length > 9 ? 2 : 3, outline: INK });
        if (k < 1) { ctx.globalAlpha = 1 - k; rect(0, 128, W, 26, WHITE); ctx.globalAlpha = 1; }
        if (scoring.total >= round.target) for (let i = 0; i < 3; i++) P.emit({ x: rand(40, 200), y: 152, vy: -rand(0.5, 1.5), vx: rand(-0.3, 0.3), life: 24, col: pick([ORANGE, YEL, RED]), size: 2, grav: -0.02, drag: 0.98 });
      }
      // 出したカード
      if (scoring) scoring.played.forEach((c, i) => {
        if (scoring.phase === 'out') return;
        const [tx, ty] = scoringPos(i, scoring.n);
        const a = anim.get(c.id);
        const sc = scoring.res.scoring.includes(c);
        drawCard(c, a ? a.x : tx, (a ? a.y : ty) - (sc && scoring.phase === 'events' ? 2 : 0) + jigOf('c' + c.id), { debuff: round.boss && round.boss.debuff && round.boss.debuff(c) && sc });
        if (!sc) { ctx.globalAlpha = 0.45; rect(a ? a.x : tx, a ? a.y : ty, CW, CHH, INK); ctx.globalAlpha = 1; }
      });
      // 手札のカードのせつめい（強化があるとき）
      if (mode === 'round' && zone === 'hand' && !handLabel && round.hand[cur] && !round.down.has(round.hand[cur].id) && (round.hand[cur].enh || round.hand[cur].ed)) {
        drawInfoPanel(cardInfo(round.hand[cur]), 10, 160, W - 20, 46);
      }
      if (mode === 'round' && zone === 'top' && topCount()) {
        const it = topItem(top);
        if (it.t === 'charm') { const k = run.charms[it.i]; drawInfoPanel(itemInfo(run, { kind: 'charm', id: k.id, ed: k.ed, v: k.v, own: true }), 6, 108, W - 12, 98, `うると $${sellOf(k)}`); }
        else drawInfoPanel(itemInfo(run, run.cons[it.i]), 6, 108, W - 12, 98, 'A: つかう / うる');
      }
    }
    function stepAnims() {
      if (!round) return;
      const n = round.hand.length;
      round.hand.forEach((c, i) => {
        const [hx, hy] = handPos(i, n);
        const on = zone === 'hand' && i === cur && mode === 'round';
        const ty = hy - (sel.has(c.id) ? 12 : 0) - (on ? 3 : 0);
        let a = anim.get(c.id); if (!a) { a = { x: hx, y: ty, d: 0 }; anim.set(c.id, a); }
        if (a.d > 0) { a.d--; if (a.d === 0) Audio_.sfx('deal'); }
        else { a.x = lerp(a.x, hx, 0.28); a.y = lerp(a.y, ty, 0.28); }
      });
      if (scoring && scoring.phase !== 'out') scoring.played.forEach((c, i) => {
        const [tx, ty] = scoringPos(i, scoring.n);
        const a = anim.get(c.id);
        if (a) { if (a.d > 0) a.d--; else { a.x = lerp(a.x, tx, 0.3); a.y = lerp(a.y, ty, 0.3); } }
      });
      for (const f of flyOut) { f.t++; f.x += f.vx; f.y += f.vy; f.vy += 0.25; }
      for (let i = flyOut.length - 1; i >= 0; i--) if (flyOut[i].t > 50) flyOut.splice(i, 1);
    }
    function drawHand() {
      const n = round.hand.length;
      round.hand.forEach((c, i) => {
        const a = anim.get(c.id);
        if (!a || a.d > 0) return;
        const on = zone === 'hand' && i === cur && mode === 'round';
        drawCard(c, a.x, a.y + jigOf('c' + c.id), { focus: on, down: round.down.has(c.id) });
      });
      void n;
    }
    function drawFly() {
      for (const f of flyOut) { if (f.down) drawBack(f.x, f.y); else drawCard(f.c, f.x, f.y, { shadow: false }); }
    }
    function drawButtons() {
      const can = mode === 'round' && zone === 'hand';
      const ns = sel.size;
      bigBtn(4, 278, 112, 38, 'Y', 'すてる', `のこり ${round.disc}回`, '#c0384a', can && round.disc > 0 && ns > 0);
      bigBtn(124, 278, 112, 38, 'X', '出す', `のこり ${round.hands}回`, '#2a7ad0', can && ns > 0);
      if (ns) { rrect(W / 2 - 12, 266, 24, 11, INK, 2); text(ns + '/5', W / 2, 268, ns === 5 ? MONEYC : WHITE, { align: 'center' }); }
    }
    function drawMenu() {
      if (!menu) return;
      const w = 110, h = 10 + menu.items.length * 16, x = W / 2 - w / 2, y = 150;
      panel(x, y, w, h);
      menu.items.forEach((it, i) => { const on = i === menu.sel; if (on) { rect(x + 5, y + 5 + i * 16, w - 10, 14, SLATE); text('@', x + 8, y + 9 + i * 16, MONEYC); } jtext(it.jp, x + 18, y + 7 + i * 16, on ? WHITE : LIGHT); });
    }
    function drawToast() {
      if (!toast) return;
      const lines = jwrap(toast.s, W - 40);
      const h = lines.length * 13 + 8, y = 176;
      ctx.globalAlpha = Math.min(1, toast.t / 10);
      rrect(14, y, W - 28, h, INK, 3); rrect(15, y + 1, W - 30, h - 2, '#22183a', 2);
      lines.forEach((l, i) => jtext(l, W / 2, y + 4 + i * 13, toast.col, { align: 'center' }));
      ctx.globalAlpha = 1;
    }
    function drawOverlay() {
      if (!overlay) return;
      ctx.globalAlpha = 0.88; rect(0, 0, W, H, '#0a0818'); ctx.globalAlpha = 1;
      if (overlay === 'hands') {
        jtext('役の いちらん', W / 2, 6, MONEYC, { align: 'center', size: 16 });
        const list = HAND_LIST.slice().reverse().filter(h => !HANDS[h].secret || run.played[h] > 0);
        list.forEach((h, i) => {
          const y = 28 + i * 21, H_ = HANDS[h], lv = run.levels[h];
          rrect(6, y, W - 12, 19, i % 2 ? '#1a2240' : '#202a4c', 2);
          tiny('LV' + lv, 10, y + 7, lv > 1 ? YEL : GRAY);
          jtext(H_.jp, 30, y + 4, WHITE);
          const c = H_.c + H_.lc * (lv - 1), m = H_.m + H_.lm * (lv - 1);
          rrect(146, y + 3, 40, 13, CHIPC, 2); text(c, 182, y + 6, WHITE, { align: 'right' });
          rrect(190, y + 3, 30, 13, MULTC, 2); text(m, 216, y + 6, WHITE, { align: 'right' });
          tiny('X' + run.played[h], W - 10, y + 7, GRAY, { align: 'right' });
        });
      } else if (overlay === 'deck') {
        jtext('デッキ', W / 2, 6, MONEYC, { align: 'center', size: 16 });
        const inDraw = round ? new Set(round.draw.map(c => c.id)) : null;
        const bySuit = [0, 1, 2, 3].map(s => run.cards.filter(c => c.enh !== 'stone' && c.suit === s).sort((a, b) => b.rank - a.rank));
        const stones = run.cards.filter(c => c.enh === 'stone');
        bySuit.forEach((list, s) => {
          const y = 30 + s * 52;
          img(suitImg(s), 4, y + 14);
          const sp = Math.min(16, (W - 14 - 26) / Math.max(1, list.length - 1));
          list.forEach((c, i) => {
            const x = 14 + i * sp;
            drawCard(c, x, y, { shadow: false });
            if (inDraw && !inDraw.has(c.id)) { ctx.globalAlpha = 0.55; rect(x, y, CW, CHH, INK); ctx.globalAlpha = 1; }
          });
        });
        stones.forEach((c, i) => drawCard(c, 14 + i * 12, 238, { shadow: false }));
        jtext(round ? `山札 ${round.draw.length}まい（暗いのは 使用中）` : `ぜんぶで ${run.cards.length}まい`, W / 2, 288, LIGHT, { align: 'center' });
      }
      jtext('なにか ボタンで とじる', W / 2, H - 14, GRAY, { align: 'center' });
    }

    function drawSelect() {
      drawSea(Engine.t, run.table === 2);
      rrect(3, 3, W - 6, 26, INK, 3); rrect(4, 4, W - 8, 24, '#123a5a', 2);
      jtext(run.endless ? `エンドレス  夜 ${run.night}` : `夜 ${run.night} / 8`, 10, 9, WHITE, { size: 16 });
      text('$' + run.money, W - 10, 11, MONEYC, { align: 'right', scale: 2 });
      for (let i = 0; i < 3; i++) {
        const y = 36 + i * 66, st = run.tstate[i], curT = i === run.table, boss = i === 2;
        const x = curT ? 4 : 10, w = W - x - (curT ? 4 : 10);
        ctx.globalAlpha = curT ? 1 : 0.55;
        rrect(x, y, w, 60, INK, 3);
        rrect(x + 1, y + 1, w - 2, 58, boss ? '#3a1434' : '#13304e', 2);
        if (curT) rectLine(x + 1, y + 1, w - 2, 58, (Engine.t >> 3) & 1 ? MONEYC : '#ffe8a0');
        // アイコン
        if (boss) { const B = BOSS(); circle(x + 26, y + 30, 19, mix(B.col, INK, 0.5)); circle(x + 26, y + 30, 17, mix(B.col, INK, 0.25)); img(SPR[B.spr], x + 10, y + 14, 2); if (B.final) { for (let k = 0; k < 3; k++) rect(x + 18 + k * 6, y + 6, 4, 5, MONEYC); rect(x + 17, y + 10, 18, 3, MONEYC); } }
        else { circle(x + 26, y + 30, 17, i === 0 ? '#2a7ad0' : '#d08a2a'); circle(x + 26, y + 30, 13, i === 0 ? '#4a9af0' : '#f0aa4a'); for (let k = 0; k < 8; k++) { const an = k / 8 * Math.PI * 2; rect(x + 26 + Math.cos(an) * 15 - 1, y + 30 + Math.sin(an) * 15 - 1, 3, 3, WHITE); } text(i === 0 ? 'S' : 'B', x + 24, y + 27, WHITE); }
        const name = boss ? BOSS().jp : TNAME[i];
        jtext(name, x + 52, y + 6, boss ? BOSS().col : WHITE, { size: boss && jw(name, 16) > 110 ? 10 : 16 });
        jtext('目標', x + 52, y + 28, GRAY); text(fmt(targetOf(run, i)), x + 80, y + 30, MONEYC);
        jtext('ほうしゅう', x + 140, y + 28, GRAY); text('$' + rewardOf(i), x + w - 8, y + 30, MONEYC, { align: 'right' });
        if (boss) jtext(BOSS().desc, x + 52, y + 44, LIGHT);
        else if (curT) jtext(`スキップすると ${['なかまパック', '$8', '星のパック', 'おふだパック'][['charm', 'money', 'star', 'fuda'].indexOf(skipTag(i))]}`, x + 52, y + 44, LIGHT);
        ctx.globalAlpha = 1;
        if (st) { rrect(x + w - 60, y + 4, 54, 14, st === 'win' ? '#2a8a4a' : '#6a6a8a', 2); jtext(st === 'win' ? '勝ち' : 'スキップ', x + w - 33, y + 5, WHITE, { align: 'center' }); }
      }
      // なかま（ちいさく）
      run.charms.forEach((k, i) => { img(SPR[k.id], 8 + i * 20, 238); });
      jtext(`なかま ${run.charms.length}/${run.slots}   デッキ ${run.cards.length}まい`, W - 8, 240, GRAY, { align: 'right' });
      bigBtn(4, 278, 112, 38, 'Y', 'スキップ', run.table < 2 ? 'ごほうびをもらう' : 'できない', '#6a5aa8', run.table < 2);
      bigBtn(124, 278, 112, 38, 'A', '勝負する', TNAME[run.table], '#2a9a6a', true);
    }
    function drawCash() {
      drawSea(Engine.t, run.table === 2);
      drawHUD();
      const h = 60 + cash.lines.length * 18;
      const y0 = 70;
      panel(12, y0, W - 24, h, '#16284a');
      jtext('せいさん', W / 2, y0 + 8, MONEYC, { align: 'center', size: 16 });
      cash.lines.slice(0, cash.shown).forEach(([l, v], i) => {
        const y = y0 + 32 + i * 18;
        jtext(l, 22, y, LIGHT);
        text('$' + v, W - 24, y + 1, MONEYC, { align: 'right' });
      });
      if (cash.shown >= cash.lines.length) {
        rect(22, y0 + h - 24, W - 46, 1, DIM);
        jtext('ごうけい', 22, y0 + h - 18, WHITE);
        text('$' + cash.total, W - 24, y0 + h - 19, MONEYC, { align: 'right', scale: 2 });
        if ((Engine.t >> 4) & 1) jtext('A: うけとる', W / 2, y0 + h + 10, WHITE, { align: 'center', outline: INK });
      }
    }
    function drawShop() {
      drawSea(Engine.t * 0.5, false);
      // 店主
      rrect(3, 3, W - 6, 40, INK, 3); rrect(4, 4, W - 8, 38, '#3a1a3a', 2);
      for (let i = 0; i < 10; i++) rect(4 + i * 23, 4, 12, 5, i % 2 ? '#ff6a8a' : '#ffe8f0');
      img(((Engine.t >> 4) & 1) ? SPR_TACO : SPR_TACO2, 10, 18);
      jtext('オクトの おみせ', 36, 12, PINK, { size: 16 });
      text('$' + run.money, W - 10, 18, MONEYC, { align: 'right', scale: 2 });
      // うりもの
      felt(3, 46, W - 6, 64, false);
      const row0 = shopRow0();
      row0.forEach((it, i) => {
        const x = 9 + i * 46, y = 52, on = zone !== 'top' && i === shopSel[0];
        if (it.sold) { ctx.globalAlpha = 0.3; rrect(x, y, KW, KH, INK, 2); ctx.globalAlpha = 1; jtext('うりきれ', x + KW / 2, y + 16, GRAY, { align: 'center' }); }
        else drawItem(it, x, y - (on ? 3 : 0), { focus: on });
        if (!it.sold) { const p = priceOf(run, it); rrect(x - 2, y + 43, KW + 4, 11, run.money >= p ? MONEYC : '#8a7a4a', 2); text('$' + p, x + KW / 2, y + 45, INK, { align: 'center' }); }
        if (it.src === 'voucher' || (i === shop.items.length && run.voucherNow)) {}
      });
      // じぶんの なかま
      const sy = 116;
      tiny(`なかま ${run.charms.length}/${run.slots}`.replace('なかま', 'CHARMS'), 6, sy, GRAY);
      run.charms.forEach((k, i) => { const x = 5 + i * Math.min(32, 168 / Math.max(1, run.charms.length)), on = zone === 'top' && top === i; drawCharm(k, x, sy + 8 - (on ? 3 : 0) + jigOf('k' + i), { focus: on }); });
      run.cons.forEach((c, i) => { const x = W - 5 - KW - (run.cons.length - 1 - i) * 33, on = zone === 'top' && top === run.charms.length + i; drawCons(c, x, sy + 8 - (on ? 3 : 0), { focus: on }); });
      // せつめい
      let info = null, extra = '';
      if (zone === 'top' && topCount()) {
        const it = topItem(top);
        if (it.t === 'charm') { const k = run.charms[it.i]; info = itemInfo(run, { kind: 'charm', id: k.id, ed: k.ed, v: k.v, own: true }); extra = `A: うる $${sellOf(k)}  L1/R1: ならべかえ`; }
        else { info = itemInfo(run, run.cons[it.i]); extra = 'A: つかう / うる'; }
      } else { const it = row0[shopSel[0]]; if (it && !it.sold) { info = itemInfo(run, it); extra = 'A: かう'; } }
      if (info) drawInfoPanel(info, 4, 170, W - 8, 92, extra);
      const rc = rerollCost(run, shop);
      bigBtn(4, 278, 112, 38, 'Y', 'リロール', '$' + rc, '#3a8a7a', run.money >= rc);
      bigBtn(124, 278, 112, 38, 'X', 'つぎへ', '', '#c0784a', true);
      if (!info) jtext('↓ で 自分の なかまを えらぶ', W / 2, 214, GRAY, { align: 'center' });
    }
    function drawPackOverlay() {
      if (!pack) return;
      ctx.globalAlpha = 0.85; rect(0, 0, W, H, '#0a0818'); ctx.globalAlpha = 1;
      const P_ = PACKS[pack.id];
      jtext(P_.jp, W / 2, 20, P_.col, { align: 'center', size: 16, outline: INK });
      jtext('1つ えらぶ', W / 2, 40, LIGHT, { align: 'center' });
      const n = pack.opts.length, sp = 64, x0 = Math.round(W / 2 - ((n - 1) * sp) / 2);
      pack.opts.forEach((it, i) => {
        const k = clamp((pack.t - i * 6) / 14, 0, 1);
        const x = x0 + i * sp - KW, y = 66 + (1 - easeBack(k)) * 60, on = i === pack.sel;
        ctx.save(); ctx.translate(x, y); ctx.scale(2, 2);
        drawItem(it, 0, on ? -2 : 0, { focus: on });
        ctx.restore();
      });
      const it = pack.opts[pack.sel];
      drawInfoPanel(itemInfo(run, it), 6, 166, W - 12, 92);
      bigBtn(4, 278, 112, 38, 'B', 'スキップ', '', '#6a5aa8', true);
      bigBtn(124, 278, 112, 38, 'A', 'えらぶ', '', '#2a9a6a', true);
    }
    function updatePack() {
      pack.t++;
      if (btnrep(BTN.LEFT)) { pack.sel = (pack.sel + pack.opts.length - 1) % pack.opts.length; Audio_.sfx('cursor'); }
      if (btnrep(BTN.RIGHT)) { pack.sel = (pack.sel + 1) % pack.opts.length; Audio_.sfx('cursor'); }
      if (btnp(BTN.A) && pack.t > 20) takePack();
      else if (btnp(BTN.B) && pack.t > 10) { Audio_.sfx('back'); closePack(); }
    }
    function drawOver(victory) {
      drawSea(Engine.t, !victory);
      const k = clamp(mt / 30, 0, 1);
      if (victory) {
        text('CLEAR!', W / 2, 20 + (1 - easeBack(k)) * -40, MONEYC, { align: 'center', scale: 4, outline: INK });
        jtext('深海の王を たおした！', W / 2, 62, WHITE, { align: 'center', size: 16, outline: INK });
        img(SPR.octo, W / 2 - 24, 86, 3);
      } else {
        text('GAME OVER', W / 2, 30, RED, { align: 'center', scale: 3, outline: INK });
        jtext('目標に とどかなかった…', W / 2, 62, LIGHT, { align: 'center' });
        img(SPR.octo, W / 2 - 16, 86, 2);
      }
      const y = 140;
      panel(16, y, W - 32, 84, '#16284a');
      const fav = HAND_LIST.reduce((a, h) => run.played[h] > run.played[a] ? h : a, 'high');
      [['とどいた 夜', run.endless ? `エンドレス ${run.night}` : `${run.night} / 8`], ['いちばん高い 1手', fmt(run.stats.best)], ['よく出した役', `${HANDS[fav].jp}（${run.played[fav]}回）`], ['ぬしに 勝った', run.stats.bossWins + '回']].forEach(([l, v], i) => {
        jtext(l, 26, y + 10 + i * 17, GRAY); jtext(v, W - 26, y + 10 + i * 17, WHITE, { align: 'right' });
      });
      if (mt > (victory ? 60 : 40)) {
        const items = victory ? ['エンドレスへ つづける', 'おわる'] : ['もういちど', 'タイトルへ'];
        items.forEach((s, i) => {
          const yy = 238 + i * 22, on = over.sel === i;
          rbox(50, yy, W - 100, 19, on ? MONEYC : NAVY, on ? INK : DIM, 2);
          jtext(s, W / 2, yy + 4, on ? INK : LIGHT, { align: 'center' });
        });
      }
    }

    toSelect();
    return {
      game: GAME,
      pauseItems() {
        return [
          { jp: 'つづける', act: () => Engine.resume() },
          { jp: 'やめて タイトルへ（夜のはじめから つづきOK）', act: () => Engine.go(() => OctoTitle()) },
          { jp: 'メニューへ', act: () => Engine.toMenu() },
        ];
      },
      canPause: () => mode !== 'scoring',
      update() {
        mt++;
        for (const [k, v] of jig) { if (v <= 1) jig.delete(k); else jig.set(k, v - 1); }
        if (round) dispScore = Math.abs(round.score - dispScore) < 1 ? round.score : lerp(dispScore, round.score, 0.12);
        stepAnims();
        if (toast && --toast.t <= 0) toast = null;
        if (pack) { updatePack(); return; }
        if (overlay) { if (anyNew()) { overlay = null; Audio_.sfx('back'); } return; }
        if (menu) { updateMenu(); return; }
        const m = MODES[mode]; if (m) m.update();
      },
      draw() {
        if (mode === 'select') drawSelect();
        else if (mode === 'cash') drawCash();
        else if (mode === 'shop') drawShop();
        else if (mode === 'over') drawOver(false);
        else if (mode === 'victory') drawOver(true);
        else {
          drawSea(Engine.t, run.table === 2);
          drawHUD();
          drawTop(mode === 'round');
          drawPills();
          drawCenter();
          drawHand();
          drawButtons();
          if (mode === 'win') {
            const k = clamp(mt / 16, 0, 1);
            ctx.globalAlpha = 0.6 * k; rect(0, 120, W, 60, INK); ctx.globalAlpha = 1;
            text('WIN!', W / 2, 134 + (1 - easeBack(k)) * 20, MONEYC, { align: 'center', scale: 4, outline: INK });
          }
        }
        drawFly();
        drawMenu();
        drawToast();
        drawPackOverlay();
        drawOverlay();
      },
      // テスト用
      _dbg: { run: () => run, round: () => round, mode: () => mode, sel, setMode },
    };
  }

  // =========================================================
  //  タイトル・デッキえらび・きろく・あそびかた
  // =========================================================
  function fanCards(cx, cy, t, s = 1) {
    const demo = [[14, 1], [13, 0], [12, 3], [11, 2], [10, 1]];
    demo.forEach(([r, su], i) => {
      const a = (i - 2) * 0.22 + Math.sin(t * 0.03) * 0.03;
      ctx.save(); ctx.translate(cx + Math.sin(a) * 60 * s, cy - Math.cos(a) * 60 * s + 60 * s); ctx.rotate(a); ctx.scale(s, s);
      drawCard({ id: 900 + i, rank: r, suit: su, enh: i === 2 ? 'gold' : null, ed: i === 0 ? 'foil' : null }, -CW / 2, -CHH / 2);
      ctx.restore();
    });
  }
  function OctoTitle() {
    let t = 0, sel = 0;
    const items = () => [
      Save.get('octo_run', null) ? { jp: 'つづきから', act: () => { const r = Save.get('octo_run', null); Engine.go(() => OctoRun(r)); } } : null,
      { jp: 'あたらしく はじめる', act: () => Engine.go(() => DeckSelect()) },
      { jp: 'きろく', act: () => Engine.go(() => Records()) },
      { jp: 'あそびかた', act: () => Engine.go(() => HowTo(HOWTO, () => OctoTitle(), { col: MONEYC, bg: t => drawSea(t), fill: '#16284a' })) },
      { jp: 'メニューへ', act: () => Engine.toMenu() },
    ].filter(Boolean);
    return {
      pausable: false, game: GAME,
      enter() { Audio_.play(SONG_TABLE); },
      update() {
        t++;
        const it = items();
        if (btnrep(BTN.UP)) { sel = (sel + it.length - 1) % it.length; Audio_.sfx('move'); }
        if (btnrep(BTN.DOWN)) { sel = (sel + 1) % it.length; Audio_.sfx('move'); }
        if (btnp(BTN.A) || btnp(BTN.START)) { Audio_.sfx('select'); it[sel].act(); }
        if (btnp(BTN.B)) { Audio_.sfx('back'); Engine.toMenu(); }
      },
      draw() {
        drawSea(t);
        fanCards(W / 2, 66, t, 1.3);
        img(SPR.octo, W / 2 - 24, 96 + Math.sin(t * 0.05) * 3, 3);
        text('LUCKY', W / 2, 10, PINK, { align: 'center', scale: 3, outline: INK });
        text('OCTO', W / 2, 150, MONEYC, { align: 'center', scale: 4, outline: INK });
        jtext('〜 海底カジノの ポーカー 〜', W / 2, 184, WHITE, { align: 'center', outline: INK });
        const it = items();
        vmenu(50, 200, W - 100, it, sel, t, { rowH: 17, fill: '#16284a' });
        if (REC.best) jtext(`さいこう 夜${REC.best}${REC.wins ? `  クリア ${REC.wins}回` : ''}`, W / 2, H - 12, GRAY, { align: 'center' });
      },
    };
  }
  let deckSel = 0;
  function DeckSelect() {
    let t = 0;
    return {
      pausable: false, game: GAME,
      update() {
        t++;
        if (btnrep(BTN.LEFT)) { deckSel = (deckSel + DECKS.length - 1) % DECKS.length; Audio_.sfx('move'); }
        if (btnrep(BTN.RIGHT)) { deckSel = (deckSel + 1) % DECKS.length; Audio_.sfx('move'); }
        if (btnp(BTN.A)) { Audio_.sfx('select'); const run = newRun(DECKS[deckSel].id); Engine.go(() => OctoRun(run)); }
        if (btnp(BTN.B)) { Audio_.sfx('back'); Engine.go(() => OctoTitle()); }
      },
      draw() {
        drawSea(t);
        jtext('デッキを えらぶ', W / 2, 14, WHITE, { align: 'center', size: 16, outline: INK });
        DECKS.forEach((d, i) => {
          const on = i === deckSel, x = 18 + i * 54, y = 60 - (on ? 10 : 0) + (on ? Math.sin(t * 0.08) * 2 : 0);
          ctx.save(); ctx.translate(x, y); ctx.scale(1.5, 1.5); drawBack(0, 0, d.col); if (on) rectLine(-1, -1, CW + 2, CHH + 2, WHITE); ctx.restore();
        });
        const d = DECKS[deckSel];
        panel(10, 140, W - 20, 80, '#16284a');
        jtext(d.jp, W / 2, 152, d.col === '#6a5a9a' ? LAV : d.col, { align: 'center', size: 16 });
        jtext(d.desc, W / 2, 178, WHITE, { align: 'center' });
        jtext('トランプ 52まい・手札 8まい', W / 2, 198, GRAY, { align: 'center' });
        jtext('← → : えらぶ   A : スタート   B : もどる', W / 2, 296, GRAY, { align: 'center' });
      },
    };
  }
  function Records() {
    let t = 0;
    return {
      pausable: false, game: GAME,
      update() { t++; if (anyp(BTN.A, BTN.B)) { Audio_.sfx('back'); Engine.go(() => OctoTitle()); } },
      draw() {
        drawSea(t);
        panel(16, 40, W - 32, 150, '#16284a');
        jtext('きろく', W / 2, 52, MONEYC, { align: 'center', size: 16 });
        [['いちばん遠くまで行った夜', REC.best ? `夜 ${REC.best}` : '-'], ['エンドレスの さいこう', REC.endless ? `夜 ${REC.endless}` : '-'], ['いちばん高い 1手', fmt(REC.bestHand)], ['クリアした 回数', REC.wins + '回'], ['あそんだ 回数', REC.runs + '回']].forEach(([l, v], i) => {
          jtext(l, 28, 82 + i * 20, GRAY); jtext(v, W - 28, 82 + i * 20, WHITE, { align: 'right' });
        });
        jtext('A / B: もどる', W / 2, 300, GRAY, { align: 'center' });
      },
    };
  }
  const HOWTO = [
    { t: 'ラッキーオクトって？', lines: ['海の底の カジノで ポーカーの 役をつくって、テーブルの 目標スコアを こえるゲーム。', '1夜に 3つのテーブル（小・大・ぬし）。8夜目の「深海の王」を たおせば クリア！', 'クリアのあとは エンドレスで どこまでも。'] },
    { t: 'スコアの きまりかた', lines: ['手札から 5まいまで えらんで「出す」。', '役の チップ ＋ 点になったカードの数字 ＝ チップ', 'チップ × 倍率 ＝ その手の スコア！', '「すてる」で いらないカードを 入れかえられる。'] },
    { t: '海のなかま', lines: ['お店で なかまを やとうと、いろいろな 効果で スコアが 大きくなる。', '倍率 ＋ より 倍率 × の ほうが 後半は 強い。並び順も だいじ（左から じゅんばん）。', 'おふだ は カードを 強くする。星のカード は 役の レベルを 上げる。'] },
    { t: 'お金と お店', lines: ['テーブルに 勝つと お金。のこった「出す」1回ごとに +$1。', '持っているお金 $5 ごとに 利子 $1（上限あり）。ためるのも 作戦！', 'テーブルを スキップすると ごほうびが もらえるが、お店にも よれない。'] },
    { t: 'ボタン', lines: ['← →：カード  A：えらぶ  B：ぜんぶはずす', 'X：出す  Y：すてる  ↑：なかま・おふだ', 'L1：ならべかえ  R1：役の いちらん', 'SELECT：デッキを見る  START：ポーズ'] },
  ];

  // ---- メニューのカートリッジ ----
  function preview(t, x, y, w, h) {
    vgrad(x, y, w, h, '#0e4a6a', '#07142a');
    for (let i = 0; i < 8; i++) { const yy = y + ((h + 10 - (t * 0.4 + i * 20) % (h + 10))); rect(x + 10 + i * 16, yy, 1, 1, '#bff4ff'); }
    fanCards(x + w / 2, y + 34, t, 0.9);
    img(SPR.octo, x + w / 2 - 16, y + h - 36 + Math.sin(t * 0.05) * 2, 2);
  }

  const GAME = {
    id: 'octo', title: 'LUCKY OCTO', jp: 'ラッキーオクト', genre: 'ローグライク',
    col: '#ff7aa8', cart: '#4a3a7a', labelBg: '#0e2a4a', bg0: '#0e5a7a', bg1: '#0a1024',
    desc: ['海底カジノで ポーカーの役を そろえろ！', '海のなかまを集めて チップ×倍率を ばくはつ', '8夜のテーブル ＋ エンドレス'],
    controls: [['十字', '← →：カード  ↑：なかま'], ['A', 'カードを えらぶ'], ['X', '役を 出す'], ['Y', 'カードを すてる'], ['B', 'えらんだのを はずす'], ['L1', 'ならべかえ'], ['R1', '役の いちらん'], ['SELECT', 'デッキを見る'], ['START', 'ポーズ']],
    best: () => REC.best ? `さいこう 夜${REC.best}` : '',
    preview,
    create: () => OctoTitle(),
  };
  GAMES.push(GAME);
  window.OCTO_GAME = { newRun, OctoRun, computeScore, REC };
})();
