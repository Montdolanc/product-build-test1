// 첫 화면: 번호 생성기와 댓글
document.querySelector('#generate').addEventListener('click', () => {
  const count = Number(document.querySelector('#count').value);
  const results = document.querySelector('#results');
  results.replaceChildren();
  for (let game = 0; game < count; game++) {
    const row = document.createElement('div'); row.className = 'row';
    const label = document.createElement('span'); label.className = 'label'; label.textContent = String.fromCharCode(65 + game);
    const balls = document.createElement('div'); balls.className = 'balls';
    for (const n of drawNumbers().sort((a, b) => a - b)) balls.append(makeBall(n));
    row.append(label, balls); results.append(row);
  }
  document.querySelector('#status').textContent = `${count}게임 생성 완료 · 각 게임은 작은 숫자부터 정렬됩니다.`;
});

// GitHub Pages와 Cloudflare 두 주소에서 같은 댓글 스레드를 보도록 대표 주소와 식별자를 고정합니다.
var disqus_config = function () {
  this.page.url = 'https://montdolanc.github.io/product-build-test1/';
  this.page.identifier = 'six-numbers-home';
};
(function () {
  var d = document, s = d.createElement('script');
  s.src = 'https://productbuilld.disqus.com/embed.js';
  s.setAttribute('data-timestamp', +new Date());
  (d.head || d.body).appendChild(s);
})();
// Disqus는 불러올 때의 글자색으로 테마를 정하므로, 테마가 바뀌면 다시 불러옵니다.
document.addEventListener('themechange', () => {
  if (window.DISQUS) window.DISQUS.reset({ reload: true, config: disqus_config });
});
