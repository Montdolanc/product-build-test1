// Historical Korean civil-time regressions (no external test runner needed).
// Run: node destiny/tests/historical-time.test.js from the repository root.
const assert=require('node:assert/strict');
require('../assets/calendar-core.js');
require('../assets/solar-terms.js');
require('../assets/saju-pillars.js');
const c=global.KoreanSajuPillars;
const compute=(solarDate,time=null)=>c.compute({solarDate,timeKnown:time!==null,time:time||'12:00'});
const historicalSkippedMidnight=[
  '1908-04-01', // +08:27:52 to +08:30:00
  '1912-01-01', // +08:30 to +09:00
  '1948-06-01', // daylight saving clock advance
  '1955-05-05', // daylight saving clock advance
  '1961-08-10'  // +08:30 to +09:00
];
for(const d of historicalSkippedMidnight){
  const r=compute(d);
  assert.match(r.year,/^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午申酉戌亥未]$/);
  assert.match(r.month,/^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午申酉戌亥未]$/);
  assert.equal(r.hour,null);
}
for(const [date,time] of [
  ['1912-01-01','00:10'],
  ['1948-06-01','00:30'],
  ['1987-05-10','02:30'],
  ['1988-05-08','02:30']
]){
  assert.throws(()=>compute(date,time),/존재하지 않는 출생시각/);
}
for(const [date,time,differenceMinutes] of [
  ['1954-03-20','23:45',30],
  ['1948-09-12','23:30',60],
  ['1987-10-11','02:30',60],
  ['1988-10-09','02:30',60]
]){
  const [y,m,d]=date.split('-').map(Number);
  const [h,min]=time.split(':').map(Number);
  const r=c.civilToInstant(y,m,d,h,min);
  assert.equal(r.ambiguous,true);
  assert.equal((r.lastInstant-r.instant)/60000,differenceMinutes);
  assert.equal(compute(date,time).clockAmbiguous,true);
}
for(const [date,time,year] of [
  ['2027-02-04','10:45','丙午'],
  ['2027-02-04','10:47','丁未']
]) assert.equal(compute(date,time).year,year);
console.log('PASS: historical skipped midnights, missing/repeated civil times, Ipchun 2027');
