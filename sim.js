// 확률 페이지: 구매 시뮬레이터
// 4·5등은 고정 당첨금, 1~3등은 회차마다 달라지므로 대략적인 가정값을 씁니다.
const PRIZES = [2000000000, 50000000, 1500000, 50000, 5000];
const won = (n) => n.toLocaleString('ko-KR') + '원';

document.querySelector('#sim-run').addEventListener('click', () => {
  const games = Number(document.querySelector('#sim-games').value);
  const picked = drawNumbers(7);
  const winning = new Set(picked.slice(0, 6));
  const bonus = picked[6];
  const tally = [0, 0, 0, 0, 0];
  for (let g = 0; g < games; g++) {
    const mine = drawNumbers();
    let hit = 0;
    for (const n of mine) if (winning.has(n)) hit++;
    if (hit === 6) tally[0]++;
    else if (hit === 5) tally[mine.includes(bonus) ? 1 : 2]++;
    else if (hit === 4) tally[3]++;
    else if (hit === 3) tally[4]++;
  }
  const spent = games * 1000;
  const earned = tally.reduce((sum, count, i) => sum + count * PRIZES[i], 0);

  const drawn = document.querySelector('#sim-winning');
  drawn.replaceChildren('이번 가상 추첨 번호 ');
  for (const n of [...winning].sort((a, b) => a - b)) drawn.append(makeBall(n, true), ' ');
  drawn.append('+ 보너스 ', makeBall(bonus, true));

  tally.forEach((count, i) => { document.querySelector(`#sim-r${i + 1}`).textContent = count.toLocaleString('ko-KR') + '번'; });
  document.querySelector('#sim-spent').textContent = won(spent);
  document.querySelector('#sim-earned').textContent = won(earned);
  document.querySelector('#sim-rate').textContent = (earned / spent * 100).toFixed(1) + '%';
  document.querySelector('#sim-result').hidden = false;
  document.querySelector('#sim-status').textContent =
    `${games.toLocaleString('ko-KR')}게임을 가상으로 구매한 결과입니다. 다시 누르면 새 추첨으로 계산합니다.`;
});
