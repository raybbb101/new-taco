'use strict';
// =========================================================
//  ノノグラム・アトリエの絵 ★ かんたん（1まい絵 5×5 / 10×10）
//  英字＝ぬるマス、数字・. ＝ぬらないマス（色は NONO.STD）
// =========================================================
(() => {
  const C = NONO.char;
  // ---- 5×5 ----
  C(1, 'heart', 'ハート', `
.R.R.
RPRRR
RRRRR
.RRR.
..R..`, { '.': '#ffe8ee' });
  C(1, 'smile', 'にっこり', `
.YYY.
Y0Y0Y
YYYYY
Y000Y
.YYY.`, { '.': '#e8f6ff' });
  C(1, 'star5', 'ほし', `
..Y..
.YYY.
YYYYY
.YYY.
.Y.Y.`, { '.': '#2a2a5a' });
  C(1, 'house5', 'おうち', `
..R..
.RRR.
RRRRR
.I0I.
.I0I.`, { '.': '#dff3ff' });
  C(1, 'shroom5', 'きのこ', `
.RRR.
RR1RR
RRRRR
.III.
..I..`, { '.': '#eaf8e0' });
  C(1, 'fish5', 'さかな', `
.....
.BB.B
B0BBB
.BB.B
.....`, { '.': '#d8f4ff' });
  C(1, 'cat5', 'ねこ', `
O...O
OO.OO
OOOOO
O0O0O
.OOO.`, { '.': '#fff3d8' });
  C(1, 'gem5', 'ダイヤ', `
..C..
.CSC.
CCCCC
.CCC.
..C..`, { '.': '#e8e4ff' });
  C(1, 'drop5', 'しずく', `
..B..
.BBB.
BB1BB
BBBBB
.BBB.`, { '.': '#eef9ff' });
  C(1, 'note5', 'おんぷ', `
..KKK
..K.K
..K..
KKK..
KK...`, { '.': '#fff0f6' });

  // ---- 10×10 ----
  C(1, 'apple', 'りんご', `
.....n....
....nGG...
..RRnRRR..
.RRRRRR1R.
RRRRRRRR1R
RRRRRRRRRR
RRRRRRRRRR
.RRRRRRRR.
.rRRRRRRr.
..rr..rr..`, { '.': '#fff1e6' });
  C(1, 'cherry', 'さくらんぼ', `
......GG..
.....nGGG.
....n.n...
...n...n..
..n....n..
.RRR..RRR.
RR1RRRR1RR
RRRR.RRRRR
RRRR..RRR.
.RR....R..`, { '.': '#fff5e8' });
  C(1, 'mushroom', 'きのこ', `
...RRRR...
.RR11RRRR.
RRR11RR1RR
RRRRRRR1RR
R1RRRRRRRR
.RRRRRRRR.
...IIII...
...I0I0...
...IIII...
....II....`, { '.': '#e6f6dc' });
  C(1, 'fish', 'さかな', `
..........
....BB....
..BBBBB..B
.BBBBBBBBB
B0BBBBBBB.
BBBBBBBBB.
.BBBBBBBBB
..BBBBB..B
....BB....
..........`, { '.': '#d6f2ff' });
  C(1, 'catface', 'ねこ', `
O........O
OO......OO
OOO....OOO
OOOOOOOOOO
OO0OOOO0OO
OO0OOOO0OO
O8OOO0OO8O
OOOO00OOOO
.OOOOOOOO.
..OOOOOO..`, { '.': '#fff4d6', 8: '#ffb0a8' });
  C(1, 'dog', 'いぬ', `
nN......Nn
nNNNNNNNNn
nNNNNNNNNn
nN0NNNN0Nn
.NNNNNNNN.
.NNNTTNNN.
.NNT00TNN.
..NTTTTN..
..NNTTNN..
...NNNN...`, { '.': '#eaf4ff' });
  C(1, 'chick', 'ひよこ', `
....YY....
...YYYY...
..YYYYYY..
..Y0YY0Y..
..YYOOYY..
.YYYYYYYY.
YYYYYYYYYY
.YYYYYYYY.
..YYYYYY..
...O..O...`, { '.': '#e4f7e4' });
  C(1, 'ghost', 'おばけ', `
...EEEE...
..EUUUUE..
.EUUUUUUE.
.EU0UU0UE.
.EU0UU0UE.
.EUUUUUUE.
.EUUU5UUE.
.EUUUUUUE.
.EUUUUUUE.
.E.EE.EE..`, { '.': '#3a2f5c', 5: '#ff8fae' });
  C(1, 'rocket', 'ロケット', `
....RR....
...RRRR...
...UUUU...
...U77U...
...U77U...
...UUUU...
..RUUUUR..
.RRUUUURR.
.R..OO..R.
....YY....`, { '.': '#1f2350', 7: '#82d8f7' });
  C(1, 'moon', 'つき', `
...YYY..1.
..YYY.....
.YYY....1.
.YY.......
YYY.......
YYY...1...
YYYY......
.YYYY...YY
.YYYYYYYYY
...YYYYY..`, { '.': '#1c2048', 1: '#ffe9a0' });
  C(1, 'sun', 'たいよう', `
....O.....
.O..O..O..
..OYYYO...
..YYYYY...
OOYY0Y0YOO
..YYYYYY..
..YY00YY..
...YYYYO..
.O..O...O.
....O.....`, { '.': '#dff3ff' });
  C(1, 'rain', 'あめ', `
...UUU....
..UUUUUU..
.UUUUUUUU.
UUUUUUUUUU
UUUUUUUUUU
.UUUUUUUU.
..........
.B..B..B..
..B..B..B.
.B..B..B..`, { '.': '#5a6a8a', U: '#e8eef8' });
  C(1, 'tree', 'き', `
...GGGG...
..GGGLGG..
.GGLGGGGG.
.GGGGGGLG.
GGGGGLGGGG
GLGGGGGGGG
.GGGGGGGG.
...GnnG...
....nn....
...nnnn...`, { '.': '#e9f7ff' });
  C(1, 'tulip', 'チューリップ', `
..R.R.R...
..RRRRR...
..RRRRR...
..RRRRR...
...RRR....
....G..G..
.G..G.GG..
.GG.GGG...
..GGGG....
....G.....`, { '.': '#fff2f6' });
  C(1, 'house', 'おうち', `
....RR....
...RRRR...
..RRRRRR..
.RRRRRRRR.
RRRRRRRRRR
.IIIIIIII.
.I33IIIII.
.I33I00II.
.IIII00II.
.IIII00II.`, { '.': '#d8f0ff' });
  C(1, 'car', 'くるま', `
..........
...BBBB...
..B33B3B..
.B333B33B.
BBBBBBBBBB
BBBBBBBBBB
BYBBBBBBYB
.BBBBBBBB.
..00..00..
..00..00..`, { '.': '#e8f7e8' });
  C(1, 'boat', 'ヨット', `
....R.....
....RW....
....RWW...
....RWWW..
....RWWWW.
....RWWWWW
....R.....
NNNNNNNNNN
.NNNNNNNN.
..........`, { '.': '#bfe8ff', 1: '#ffffff' });
  C(1, 'key', 'かぎ', `
..YYY.....
.YY0YY....
.Y000Y....
.YY0YY....
..YYY.....
...Y......
...YY.....
...Y......
...YYY....
...Y......`, { '.': '#ece6ff' });
  C(1, 'sword', 'けん', `
........UU
.......UWU
......UWU.
.....UWU..
....UWU...
.y.UWU....
.yyWU.....
..yy......
.n.yy.....
n...y.....`, { '.': '#2b2a4a' });
  C(1, 'potion', 'ポーション', `
....nn....
....nn....
....UU....
...U11U...
..UMMMMU..
.UMM1MMMU.
.UM1MMMMU.
.UMMMMMMU.
..UMMMMU..
...UUUU...`, { '.': '#efe8ff', 1: '#ffffff' });
  C(1, 'gem', 'ほうせき', `
..........
..CCCCCC..
.CSCSSCSC.
CSSCSSCSSC
CCCCCCCCCC
.CccCCccC.
..CccCcC..
...CccC...
....cC....
..........`, { '.': '#efe6ff', S: '#c8fbff' });
  C(1, 'crown', 'おうかん', `
..........
Y...Y...Y.
YY.YYY.YY.
YYYYYYYYY.
YYRYYYBYY.
YYYYYYYYY.
YYYYYYYYY.
yyyyyyyyy.
..........
..........`, { '.': '#3b2b55' });
  C(1, 'music', 'おんぷ', `
....KKKKKK
....KKKKKK
....K....K
....K....K
....K....K
....K....K
..KKK..KKK
.KKKK.KKKK
.KKK..KKK.
..........`, { '.': '#fff4d8' });
  C(1, 'coffee', 'コーヒー', `
..2..2....
...2..2...
..2..2....
.RRRRRRR..
.RnnnnnRRR
.RRRRRRR.R
.RRRRRRR.R
.RRRRRRRRR
..RRRRR...
NNNNNNNNN.`, { '.': '#fde9d4', 2: '#d8cdc4' });
  C(1, 'cake', 'ケーキ', `
....R.....
...WWW....
..WWWWWW..
.WWWWWWWWW
PPPPPPPPPP
TTTTTTTTTT
WWWWWWWWWW
TTTTTTTTTT
TTTTTTTTTT
..........`, { '.': '#fff0f4' });
  C(1, 'icecream', 'アイス', `
...PPPP...
..PPP1PP..
.PPPPPPPP.
.PPPPPPPP.
..WWWWWW..
..tTtTtT..
...TtTt...
...tTtT...
....Tt....
....t.....`, { '.': '#e2f7ff' });
  C(1, 'onigiri', 'おにぎり', `
....WW....
...WWWW...
..WWWWWW..
..WWWWWW..
.WWWWWWWW.
.WWWAAWWW.
WWWAAAAWWW
WWWAAAAWWW
WWWAAAAWWW
.WWAAAAWW.`, { '.': '#fff5dc', A: '#25343a' });
  C(1, 'octopus', 'タコ', `
...PPPP...
..PPPPPP..
.PP1PP1PP.
.PP0PP0PP.
.PPPPPPPP.
..PP00PP..
.P.PPPP.P.
P.PP.PP.P.
P.P..P..P.
.P...P.P..`, { '.': '#dff4ff' });
  C(1, 'snowman', 'ゆきだるま', `
...kkkk...
...kkkk...
..kkkkkk..
...UUUU...
..UU0U0U..
..UUOUUU..
...RRRR...
..UUUUUU..
.UUU0UUUU.
.UUUUUUUU.`, { '.': '#c7dcf4', U: '#ffffff' });
  C(1, 'whale', 'くじら', `
..S..S....
...SS.....
....S.....
..BBBBB...
.BBBBBBB..
BBBBBBBBB.
B0BBBBBBBB
BBBBBBBB.B
.SSSSSSB..
..SSSS....`, { '.': '#c8ecff', S: '#e3f6ff' });
})();
