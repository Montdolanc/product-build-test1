// 모든 페이지 공통: 테마 전환과 번호 추첨 함수
const themeToggle = document.querySelector('#theme-toggle');
function updateThemeButton() {
  const dark = document.documentElement.dataset.theme === 'dark';
  themeToggle.textContent = dark ? '라이트 모드로' : '다크 모드로';
  themeToggle.setAttribute('aria-pressed', String(dark));
}
if (themeToggle) {
  updateThemeButton();
  themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('six-numbers-theme', theme); } catch {}
    updateThemeButton();
    document.dispatchEvent(new CustomEvent('themechange'));
  });
}

// 암호학적 난수를 묶음으로 받아 두고 하나씩 꺼내 씁니다.
const randomBuffer = new Uint32Array(1024);
let randomIndex = randomBuffer.length;
function nextRandom() {
  if (randomIndex >= randomBuffer.length) { crypto.getRandomValues(randomBuffer); randomIndex = 0; }
  return randomBuffer[randomIndex++];
}
// 나머지 연산의 치우침을 없애기 위해 범위를 벗어난 값은 버리고 다시 뽑습니다.
function randomBelow(limit) {
  const range = 4294967296;
  const cutoff = range - (range % limit);
  let value;
  do { value = nextRandom(); } while (value >= cutoff);
  return value % limit;
}
// 1~45에서 겹치지 않게 count개를 뽑습니다(피셔-예이츠 섞기의 앞부분).
function drawNumbers(count = 6) {
  const pool = Array.from({ length: 45 }, (_, i) => i + 1);
  for (let i = 0; i < count; i++) {
    const j = i + randomBelow(45 - i);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}
function ballColor(n) {
  return ['gold', 'blue', 'red', 'gray', 'green'][Math.floor((n - 1) / 10)];
}
function makeBall(n, small) {
  const ball = document.createElement('span');
  ball.className = 'ball ' + ballColor(n) + (small ? ' sm' : '');
  ball.textContent = n;
  return ball;
}
