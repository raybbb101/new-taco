'use strict';
// 起動
function enterPcMode() {
  pcMode = true;
  document.body.classList.add('pc');
  setVisible(visible);
}
document.getElementById('pc-play').addEventListener('click', () => { Audio_.unlock(); enterPcMode(); });
if (/[?&]pc\b/.test(location.search)) enterPcMode();

// ドット絵フォント（DotGothic16）を読みこんでから はじめる（おそいときは 2.5秒で先に進む）
if (document.fonts) document.fonts.addEventListener('loadingdone', () => _jcache.clear());
const fontReady = document.fonts && document.fonts.load
  ? Promise.race([document.fonts.load('16px "DotGothic16"', 'あア漢字ABC123'), new Promise(r => setTimeout(r, 2500))]).catch(() => {})
  : Promise.resolve();
setVisible(visible);
fontReady.then(() => {
  _jcache.clear();
  const m = /[?&]game=(\w+)/.exec(location.search);
  const g = m && GAMES.find(x => x.id === m[1]);
  Engine.go(() => g ? g.create() : Boot(), true);
  requestAnimationFrame(frame);
});

// テスト用（?test のときだけ）：フレームを手で進める
if (/[?&]test\b/.test(location.search)) {
  window.NO_AUTOPAUSE = true;
  window.ADV = (n, every = 0, key = BTN.A) => { for (let i = 0; i < n; i++) { if (every && i % every === 0) Input.latched.add(key); Engine.update(); } Engine.draw(); return Engine.t; };
  window.PRESS = (key, n = 1) => { for (let i = 0; i < n; i++) { Input.latched.add(BTN[key]); Engine.update(); Engine.update(); } Engine.draw(); };
}
