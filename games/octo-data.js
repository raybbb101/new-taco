'use strict';
// =========================================================
//  LUCKY OCTO — データ（役・なかま・おふだ・ぬし・チケット・デッキ）
// =========================================================
const OCTO = (() => {
  const notStone = c => c.enh !== 'stone';
  const isFace = c => notStone(c) && c.rank >= 11 && c.rank <= 13;
  const suitIs = (c, s) => notStone(c) && (c.suit === s || c.enh === 'wild');
  const chipsOf = c => c.enh === 'stone' ? 0 : c.rank === 14 ? 11 : c.rank >= 11 ? 10 : c.rank;

  // ---- 役 ----
  const HANDS = {
    high: { jp: 'ハイカード', s: 'ハイ', c: 5, m: 1, lc: 10, lm: 1 },
    pair: { jp: 'ワンペア', s: 'ペア', c: 10, m: 2, lc: 15, lm: 1 },
    two: { jp: 'ツーペア', s: '2ペア', c: 20, m: 2, lc: 20, lm: 1 },
    three: { jp: 'スリーカード', s: '3カード', c: 30, m: 3, lc: 20, lm: 2 },
    straight: { jp: 'ストレート', s: 'ストレ', c: 30, m: 4, lc: 30, lm: 3 },
    flush: { jp: 'フラッシュ', s: 'フラ', c: 35, m: 4, lc: 15, lm: 2 },
    full: { jp: 'フルハウス', s: 'フル', c: 40, m: 4, lc: 25, lm: 2 },
    four: { jp: 'フォーカード', s: '4カード', c: 60, m: 7, lc: 30, lm: 3 },
    sflush: { jp: 'ストレートフラッシュ', s: 'Sフラ', c: 100, m: 8, lc: 40, lm: 4 },
    five: { jp: 'ファイブカード', s: '5カード', c: 120, m: 12, lc: 35, lm: 3, secret: true },
    fhouse: { jp: 'フラッシュハウス', s: 'Fハウス', c: 140, m: 14, lc: 40, lm: 4, secret: true },
    ffive: { jp: 'フラッシュファイブ', s: 'F5', c: 160, m: 16, lc: 50, lm: 3, secret: true },
  };
  const HAND_LIST = ['ffive', 'fhouse', 'five', 'sflush', 'four', 'full', 'flush', 'straight', 'three', 'two', 'pair', 'high'];
  // 星のカード（役のレベルを上げる）
  const STARS = {
    high: 'ひとつ星', pair: 'ふたご星', two: 'よつ星', three: 'みつ星', straight: 'ながれ星', flush: 'ほうき星',
    full: 'すばる', four: 'よつば星', sflush: 'あまのがわ', five: 'いつつ星', fhouse: 'ぎんが', ffive: 'ちょうしんせい',
  };

  // ---- 役のはんてい ----
  function evaluate(cards, four = false) {
    const real = cards.filter(notStone), stones = cards.filter(c => !notStone(c));
    const byRank = new Map();
    for (const c of real) { if (!byRank.has(c.rank)) byRank.set(c.rank, []); byRank.get(c.rank).push(c); }
    const groups = [...byRank.values()].sort((a, b) => b.length - a.length || b[0].rank - a[0].rank);
    const need = four ? 4 : 5;
    let flushC = null;
    if (real.length >= need) for (let s = 0; s < 4; s++) { const f = real.filter(c => c.suit === s || c.enh === 'wild'); if (f.length >= need) { flushC = f; break; } }
    let straightC = null;
    if (byRank.size >= need) {
      const has = r => byRank.has(r === 1 ? 14 : r);
      for (let top = 14; top >= need && !straightC; top--) {
        let ok = true;
        for (let k = 0; k < need; k++) if (!has(top - k)) { ok = false; break; }
        if (ok) { straightC = []; for (let k = 0; k < need; k++) straightC.push(byRank.get(top - k === 1 ? 14 : top - k)[0]); }
      }
    }
    const n0 = groups[0] ? groups[0].length : 0, n1 = groups[1] ? groups[1].length : 0;
    const has = new Set();
    if (n0 >= 2) has.add('pair');
    if ((n0 >= 2 && n1 >= 2) || n0 >= 4) has.add('two');
    if (n0 >= 3) has.add('three');
    if (n0 >= 4) has.add('four');
    if (n0 >= 3 && n1 >= 2) has.add('full');
    if (straightC) has.add('straight');
    if (flushC) has.add('flush');
    let type, sc;
    if (n0 >= 5 && flushC) { type = 'ffive'; sc = real; }
    else if (n0 >= 3 && n1 >= 2 && flushC) { type = 'fhouse'; sc = real; }
    else if (n0 >= 5) { type = 'five'; sc = groups[0]; }
    else if (straightC && flushC) { type = 'sflush'; sc = [...new Set([...straightC, ...flushC])]; }
    else if (n0 >= 4) { type = 'four'; sc = groups[0]; }
    else if (n0 >= 3 && n1 >= 2) { type = 'full'; sc = [...groups[0], ...groups[1]]; }
    else if (flushC) { type = 'flush'; sc = flushC; }
    else if (straightC) { type = 'straight'; sc = straightC; }
    else if (n0 >= 3) { type = 'three'; sc = groups[0]; }
    else if (n0 >= 2 && n1 >= 2) { type = 'two'; sc = [...groups[0], ...groups[1]]; }
    else if (n0 >= 2) { type = 'pair'; sc = groups[0]; }
    else { type = 'high'; sc = real.length ? [real.reduce((a, b) => (b.rank > a.rank ? b : a))] : []; }
    has.add(type);
    const set = new Set([...sc, ...stones]);
    return { type, scoring: cards.filter(c => set.has(c)), has };
  }

  // ---- カードの強化 ----
  const ENH = {
    pearl: { jp: '真珠', desc: 'チップ +30', bg: '#e2f2ff' },
    coral: { jp: 'サンゴ', desc: '倍率 +4', bg: '#ffe2e8' },
    glass: { jp: 'ガラス', desc: '倍率 ×2（1/4 で われる）', bg: '#d8fbff' },
    gold: { jp: '金貨', desc: '手札にのこったまま テーブルが終わると $3', bg: '#ffeaa8' },
    lucky: { jp: '四つ葉', desc: '1/5 で 倍率+20、1/15 で $20', bg: '#e4f8dc' },
    steel: { jp: '鉄', desc: '手札にのこすと 倍率 ×1.5', bg: '#d6dae8' },
    wild: { jp: '虹', desc: 'どのマークとしても 数える', bg: '#fffaf0' },
    stone: { jp: '石', desc: 'チップ +50。数字もマークもなく、いつも点になる', bg: '#a8a2b8' },
  };
  const EDS = {
    foil: { jp: 'キラ', desc: 'チップ +50', cost: 2 },
    holo: { jp: 'ホロ', desc: '倍率 +10', cost: 3 },
    poly: { jp: '虹色', desc: '倍率 ×1.5', cost: 5 },
  };

  // ---- なかま（パッシブの効果）----
  // card(c,X) / held(c,X) / hand(X) → {chips, mult, xmult, money}
  // retrig(c,i,X) → 回数, play(X), discard(cards,X), end(X) → $, boss(X), pass:{hsize,disc,reroll,intcap,four}
  const allSuits = cs => [0, 1, 2, 3].every(s => cs.some(c => suitIs(c, s)));
  const CHARMS = [
    { id: 'kumanomi', jp: 'クマノミ', r: 1, cost: 4, desc: '倍率 +4', hand: () => ({ mult: 4 }) },
    { id: 'yadokari', jp: 'ヤドカリ', r: 1, cost: 4, desc: 'ペアをふくむ役なら チップ +50', hand: X => X.has.has('pair') ? { chips: 50 } : null },
    { id: 'kurage', jp: 'ハートクラゲ', r: 1, cost: 5, desc: '♥ のカードが 点になるたび 倍率 +3', card: c => suitIs(c, 1) ? { mult: 3 } : null },
    { id: 'ika', jp: 'スペードイカ', r: 1, cost: 5, desc: '♠ のカードが 点になるたび 倍率 +3', card: c => suitIs(c, 0) ? { mult: 3 } : null },
    { id: 'tatsu', jp: 'ダイヤのタツ', r: 1, cost: 5, desc: '♦ のカードが 点になるたび チップ +30', card: c => suitIs(c, 3) ? { chips: 30 } : null },
    { id: 'kame', jp: 'クローバーガメ', r: 1, cost: 5, desc: '♣ のカードが 点になるたび チップ +30', card: c => suitIs(c, 2) ? { chips: 30 } : null },
    { id: 'kani', jp: 'ペアガニ', r: 1, cost: 4, desc: 'ペアをふくむ役なら 倍率 +8', hand: X => X.has.has('pair') ? { mult: 8 } : null },
    { id: 'ebi', jp: 'みつごエビ', r: 1, cost: 5, desc: 'スリーカードをふくむ役なら 倍率 +12', hand: X => X.has.has('three') ? { mult: 12 } : null },
    { id: 'iwashi', jp: 'ならびイワシ', r: 1, cost: 5, desc: 'ストレートをふくむ役なら 倍率 +12', hand: X => X.has.has('straight') ? { mult: 12 } : null },
    { id: 'tobiuo', jp: 'トビウオ', r: 1, cost: 5, desc: 'フラッシュをふくむ役なら 倍率 +10', hand: X => X.has.has('flush') ? { mult: 10 } : null },
    { id: 'pengin', jp: 'ペンギン夫婦', r: 1, cost: 5, desc: 'ツーペアをふくむ役なら 倍率 +10', hand: X => X.has.has('two') ? { mult: 10 } : null },
    { id: 'hitode', jp: 'ヒトデ', r: 1, cost: 5, desc: '出したカードが 3まい以下なら 倍率 +15', hand: X => X.played.length <= 3 ? { mult: 15 } : null },
    { id: 'fugu', jp: 'フグ', r: 1, cost: 5, desc: 'のこりの「すてる」1回につき チップ +25', hand: X => X.round.disc > 0 ? { chips: 25 * X.round.disc } : null },
    { id: 'isogin', jp: 'イソギンチャク', r: 1, cost: 4, desc: '絵札(J Q K)が 点になるたび チップ +25', card: c => isFace(c) ? { chips: 25 } : null },
    { id: 'hotate', jp: 'ホタテ', r: 1, cost: 4, desc: '偶数(2 4 6 8 10)が 点になるたび 倍率 +3', card: c => notStone(c) && c.rank <= 10 && c.rank % 2 === 0 ? { mult: 3 } : null },
    { id: 'makigai', jp: 'マキガイ', r: 1, cost: 4, desc: '奇数(A 3 5 7 9)が 点になるたび チップ +25', card: c => notStone(c) && (c.rank === 14 || (c.rank <= 9 && c.rank % 2 === 1)) ? { chips: 25 } : null },
    { id: 'harisen', jp: 'ハリセンボン', r: 1, cost: 5, desc: 'テーブルに 勝つたび $3 もらえる', end: () => 3 },
    { id: 'namako', jp: 'ナマコ', r: 1, cost: 4, desc: 'カードを 1まい すてるたび チップ +3（ずっと）', discard: (cs, X) => { X.inst.v = (X.inst.v || 0) + 3 * cs.length; }, hand: X => X.inst.v ? { chips: X.inst.v } : null, val: i => '+' + (i.v || 0) },
    { id: 'katsuo', jp: 'カツオ', r: 2, cost: 6, desc: 'A が 点になるたび チップ +20 倍率 +4', card: c => notStone(c) && c.rank === 14 ? { chips: 20, mult: 4 } : null },
    { id: 'takonoko', jp: 'タコの子', r: 2, cost: 6, desc: '8 が 点になるたび 倍率 +8', card: c => notStone(c) && c.rank === 8 ? { mult: 8 } : null },
    { id: 'rakko', jp: 'ラッコ', r: 2, cost: 6, desc: '役を出すたび 倍率 +2 ずつ ふえる。すてると 0 にもどる', play: X => { X.inst.v = (X.inst.v || 0) + 2; }, discard: (cs, X) => { X.inst.v = 0; }, hand: X => X.inst.v ? { mult: X.inst.v } : null, val: i => '+' + (i.v || 0) },
    { id: 'shachi', jp: 'シャチ', r: 2, cost: 7, desc: 'フラッシュをふくむ役なら 倍率 ×2', hand: X => X.has.has('flush') ? { xmult: 2 } : null },
    { id: 'iruka', jp: 'イルカ', r: 2, cost: 7, desc: 'ストレートをふくむ役なら 倍率 ×2', hand: X => X.has.has('straight') ? { xmult: 2 } : null },
    { id: 'manta', jp: 'マンタ', r: 2, cost: 6, desc: 'ペアをふくむ役なら 倍率 ×1.5', hand: X => X.has.has('pair') ? { xmult: 1.5 } : null },
    { id: 'kajiki', jp: 'カジキ', r: 2, cost: 6, desc: 'ハイカードで 出すと 倍率 ×3', hand: X => X.type === 'high' ? { xmult: 3 } : null },
    { id: 'umiushi', jp: 'ウミウシ', r: 2, cost: 7, desc: '点になるカードに ♠♥♣♦ が ぜんぶ あると 倍率 ×3', hand: X => allSuits(X.scoring) ? { xmult: 3 } : null },
    { id: 'takaashi', jp: 'タカアシガニ', r: 2, cost: 6, desc: '手札が 1まい ふえる', pass: { hsize: 1 } },
    { id: 'hotaruika', jp: 'ホタルイカ', r: 2, cost: 6, desc: '「すてる」が 1回 ふえる', pass: { disc: 1 } },
    { id: 'kamome', jp: 'カモメ', r: 2, cost: 5, desc: 'お店の リロールが $2 やすくなる', pass: { reroll: 2 } },
    { id: 'budai', jp: 'おかねもちブダイ', r: 2, cost: 6, desc: '利子の 上限が $5 ふえる', pass: { intcap: 5 } },
    { id: 'manbou', jp: 'マンボウ', r: 2, cost: 6, desc: 'いちばん左の 点になるカードが もう1回 点になる', retrig: (c, i) => i === 0 ? 1 : 0 },
    { id: 'hirame', jp: 'ヒラメ', r: 2, cost: 7, desc: '絵札(J Q K)が もう1回 点になる', retrig: c => isFace(c) ? 1 : 0 },
    { id: 'anko', jp: 'チョウチンアンコウ', r: 2, cost: 6, desc: '手札に のこった いちばん小さい数字 ×2 を 倍率に', hand: X => { const h = X.held.filter(notStone); if (!h.length) return null; return { mult: 2 * Math.min(...h.map(chipsOf)) }; } },
    { id: 'utsubo', jp: 'ウツボ', r: 2, cost: 6, desc: 'さいごの「出す」なら 倍率 ×2', hand: X => X.round.hands === 0 ? { xmult: 2 } : null },
    { id: 'kurione', jp: 'クリオネ', r: 2, cost: 7, desc: 'フラッシュと ストレートが 4まいで できる', pass: { four: 1 } },
    { id: 'taraba', jp: 'タラバガニ', r: 3, cost: 8, desc: '手札に のこした K 1まいにつき 倍率 ×1.5', held: c => notStone(c) && c.rank === 13 ? { xmult: 1.5 } : null },
    { id: 'ryugu', jp: 'リュウグウノツカイ', r: 3, cost: 10, desc: '右どなりの なかまの 効果を まねする', copy: true },
    { id: 'kujira', jp: 'クジラ', r: 3, cost: 9, desc: '倍率 ×3', hand: () => ({ xmult: 3 }) },
    { id: 'mendako', jp: 'メンダコ', r: 3, cost: 8, desc: 'ぬしに 勝つたび 倍率 ×0.5 ずつ ふえる（はじめ ×1）', boss: X => { X.inst.v = (X.inst.v || 0) + 1; }, hand: X => X.inst.v ? { xmult: 1 + 0.5 * X.inst.v } : null, val: i => '×' + (1 + 0.5 * (i.v || 0)) },
    { id: 'same', jp: 'サメ', r: 3, cost: 8, desc: '5まい出して ぜんぶ 点になると 倍率 ×2.5', hand: X => X.played.length === 5 && X.scoring.length === 5 ? { xmult: 2.5 } : null },
    { id: 'ningyo', jp: 'にんぎょ', r: 3, cost: 9, desc: '♥ のカードが 点になるたび 1/2 で 倍率 ×1.5', card: (c, X) => suitIs(c, 1) && X.rng() < 0.5 ? { xmult: 1.5 } : null },
  ];
  const CH = Object.fromEntries(CHARMS.map(c => [c.id, c]));

  // ---- おふだ（カードを かえる）----
  const FUDA = [
    { id: 'fire', jp: '炎の札', k: '炎', desc: 'えらんだカードを 2まいまで デッキから 消す', min: 1, max: 2 },
    { id: 'copy', jp: 'うつしの札', k: '写', desc: '2まい えらぶ。左のカードを 右のカードと 同じにする', min: 2, max: 2 },
    { id: 'pearl', jp: '真珠の札', k: '珠', desc: '2まいまで 真珠カードにする（チップ+30）', min: 1, max: 2, enh: 'pearl' },
    { id: 'coral', jp: 'サンゴの札', k: '珊', desc: '2まいまで サンゴカードにする（倍率+4）', min: 1, max: 2, enh: 'coral' },
    { id: 'glass', jp: 'ガラスの札', k: '硝', desc: '1まいを ガラスカードにする（倍率×2・われることも）', min: 1, max: 1, enh: 'glass' },
    { id: 'gold', jp: '金貨の札', k: '金', desc: '1まいを 金貨カードにする（手札にのこると $3）', min: 1, max: 1, enh: 'gold' },
    { id: 'lucky', jp: '四つ葉の札', k: '葉', desc: '2まいまで 四つ葉カードにする（ときどき 大当たり）', min: 1, max: 2, enh: 'lucky' },
    { id: 'steel', jp: '鉄の札', k: '鉄', desc: '1まいを 鉄カードにする（手札にのこすと 倍率×1.5）', min: 1, max: 1, enh: 'steel' },
    { id: 'wild', jp: '虹の札', k: '虹', desc: '1まいを 虹カードにする（どのマークにもなる）', min: 1, max: 1, enh: 'wild' },
    { id: 'stone', jp: '石の札', k: '石', desc: '1まいを 石カードにする（チップ+50・いつも点に）', min: 1, max: 1, enh: 'stone' },
    { id: 'up', jp: '力の札', k: '力', desc: '2まいまで 数字を 1 上げる', min: 1, max: 2 },
    { id: 'sun', jp: '太陽の札', k: '日', desc: '3まいまで ♥ にする', min: 1, max: 3, suit: 1 },
    { id: 'moon', jp: '月の札', k: '月', desc: '3まいまで ♠ にする', min: 1, max: 3, suit: 0 },
    { id: 'mori', jp: '森の札', k: '森', desc: '3まいまで ♣ にする', min: 1, max: 3, suit: 2 },
    { id: 'hoshi', jp: '星くずの札', k: '星', desc: '3まいまで ♦ にする', min: 1, max: 3, suit: 3 },
    { id: 'tide', jp: '満ち潮の札', k: '潮', desc: 'お金を 2ばいにする（さいだい +$20）', min: 0, max: 0 },
    { id: 'maneki', jp: 'まねきの札', k: '招', desc: 'ランダムな なかまが 1体 くる（空きが ひつよう）', min: 0, max: 0 },
    { id: 'kira', jp: 'キラキラの札', k: '輝', desc: 'ランダムな なかまに キラ・ホロ・虹色の どれかを つける', min: 0, max: 0 },
    { id: 'takara', jp: '宝船の札', k: '宝', desc: 'なかまの 売値の 合計を もらう（さいだい $40）', min: 0, max: 0 },
  ];
  const FU = Object.fromEntries(FUDA.map(f => [f.id, f]));

  // ---- ぬし（ボス）----
  const BOSSES = [
    { id: 'heart', jp: 'クラゲ女王', spr: 'kurage', col: '#ff6a9a', desc: '♥ のカードは 点にならない', debuff: c => notStone(c) && c.suit === 1 && c.enh !== 'wild' },
    { id: 'spade', jp: '黒イカ大王', spr: 'ika', col: '#7a5ae8', desc: '♠ のカードは 点にならない', debuff: c => notStone(c) && c.suit === 0 && c.enh !== 'wild' },
    { id: 'club', jp: 'こけむした大ガメ', spr: 'kame', col: '#4aa85a', desc: '♣ のカードは 点にならない', debuff: c => notStone(c) && c.suit === 2 && c.enh !== 'wild' },
    { id: 'dia', jp: '金色のタツ', spr: 'tatsu', col: '#f2a93b', desc: '♦ のカードは 点にならない', debuff: c => notStone(c) && c.suit === 3 && c.enh !== 'wild' },
    { id: 'face', jp: 'ねむりザメ', spr: 'same', col: '#8b87a6', desc: '絵札(J Q K)は 点にならない', debuff: c => isFace(c) },
    { id: 'small', jp: 'しぼみ貝', spr: 'hotate', col: '#ff8fae', desc: '手札が 1まい へる' },
    { id: 'nodisc', jp: 'いかりのウツボ', spr: 'utsubo', col: '#5cc24c', desc: '「すてる」が できない' },
    { id: 'hands', jp: '大うずまき', spr: 'manta', col: '#2f8fe6', desc: '「出す」が 1回 へる' },
    { id: 'five', jp: '五本足のヒトデ', spr: 'hitode', col: '#f7842a', desc: 'かならず 5まい 出す' },
    { id: 'once', jp: 'まねっこフグ', spr: 'fugu', col: '#ffe156', desc: '同じ役は 1回しか 点にならない' },
    { id: 'half', jp: '深海アンコウ', spr: 'anko', col: '#5d5878', desc: '役の 基本チップと 倍率が 半分' },
    { id: 'dark', jp: 'くらやみホタルイカ', spr: 'hotaruika', col: '#1c4f96', desc: '配られた カードの 半分が うら向き' },
    { id: 'money', jp: 'がめついカニ', spr: 'kani', col: '#e8384a', desc: '出すたびに $1 とられる' },
    { id: 'numb', jp: 'シビレエイ', spr: 'hirame', col: '#ffe156', desc: '出すたびに なかま1体が しびれて 効かない' },
  ];
  const FINAL = { id: 'king', jp: '深海の王', spr: 'ika', col: '#c03a8a', desc: '目標が とても高い・出す／すてる -1回', mul: 2.5, final: true };
  const BO = Object.fromEntries([...BOSSES, FINAL].map(b => [b.id, b]));

  // ---- チケット（ずっと続く 強化）----
  const VOUCHERS = [
    { id: 'hands', jp: 'ひろいテーブル', k: '卓', desc: '「出す」が ずっと +1' },
    { id: 'disc', jp: 'おおきなゴミばこ', k: '箱', desc: '「すてる」が ずっと +1' },
    { id: 'hsize', jp: 'おおきな手', k: '手', desc: '手札が ずっと +1まい' },
    { id: 'slot', jp: 'なかまの へや', k: '部', desc: 'なかまの 枠が +1' },
    { id: 'cslot', jp: 'おふだいれ', k: '札', desc: 'おふだの 枠が +1' },
    { id: 'sale', jp: 'わりびきクーポン', k: '割', desc: 'お店の ねだんが 25% びき' },
    { id: 'reroll', jp: 'リロール券', k: '券', desc: 'リロールが $2 やすくなる' },
    { id: 'bank', jp: 'ちょきんばこ', k: '貯', desc: '利子の 上限が $5 ふえる' },
    { id: 'scope', jp: 'ぼうえんきょう', k: '望', desc: '星のカードが お店に 出やすくなる' },
    { id: 'net', jp: 'レアのあみ', k: '網', desc: 'めずらしい なかまが 出やすくなる' },
  ];
  const VO = Object.fromEntries(VOUCHERS.map(v => [v.id, v]));

  // ---- デッキ ----
  const DECKS = [
    { id: 'red', jp: 'サンゴのデッキ', col: '#e8384a', desc: '「すてる」が +1回' },
    { id: 'blue', jp: 'しんかいのデッキ', col: '#2f8fe6', desc: '「出す」が +1回' },
    { id: 'gold', jp: 'たからのデッキ', col: '#ffc83d', desc: 'お金が $10 多い ところから スタート' },
    { id: 'black', jp: 'やみのデッキ', col: '#6a5a9a', desc: 'なかまの枠 +1 / 「出す」 -1回' },
  ];

  // ---- パック ----
  const PACKS = {
    charm: { jp: 'なかまパック', desc: '2体の なかまから 1体 えらぶ', col: '#4fc489', cost: 4 },
    fuda: { jp: 'おふだパック', desc: '3まいの おふだから 1まい えらぶ', col: '#ff8a5a', cost: 4 },
    star: { jp: '星のパック', desc: '3まいの 星のカードから 1まい えらぶ（すぐ使う）', col: '#7a6ae8', cost: 4 },
    card: { jp: 'トランプパック', desc: '3まいの カードから 1まい デッキに 入れる', col: '#3aa6d6', cost: 4 },
  };

  // ---- 目標スコア ----
  const BASE = [0, 250, 650, 1800, 4500, 10000, 20000, 35000, 55000];
  function baseTarget(n) {
    if (n <= 8) return BASE[n];
    const v = 55000 * Math.pow(1.9, n - 8), p = Math.pow(10, Math.floor(Math.log10(v)) - 1);
    return Math.round(v / p) * p;
  }

  return { HANDS, HAND_LIST, STARS, evaluate, ENH, EDS, CHARMS, CH, FUDA, FU, BOSSES, FINAL, BO, VOUCHERS, VO, DECKS, PACKS, baseTarget, chipsOf, isFace, suitIs, notStone };
})();
