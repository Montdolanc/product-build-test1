const assert = require('node:assert/strict');
require('../assets/calendar-core.js');
require('../assets/solar-terms.js');
require('../assets/saju-pillars.js');
const day = global.KoreanCalendarCore;
const solar = global.KoreanSolarTerms;
const saju = global.KoreanSajuPillars;
const calc = (d,time=null)=>saju.compute({solarDate:d,timeKnown:time!==null,time:time||'12:00'});
assert.equal(day.lunarToSolar(1900,1,1,false),'1900-01-31');
assert.equal(day.lunarToSolar(1986,1,1,false),'1986-02-09');
assert.equal(day.dayPillar('2000-01-01'),'戊午');
assert.equal(calc('1986-08-17','10:00').year,'丙寅');
assert.equal(calc('1986-08-17','10:00').month,'丙申');
assert.equal(calc('1986-08-17','10:00').day,'癸巳');
assert.equal(calc('1986-08-17','10:00').hour,'丁巳');
assert.equal(calc('1986-08-17').hour,null);
assert.equal(new Date(solar.termUtc(2027,2)).toISOString(),'2027-02-04T01:46:18.000Z');
assert.equal(calc('2027-02-04','10:45').year,'丙午');
assert.equal(calc('2027-02-04','10:47').year,'丁未');
assert.equal(calc('2027-02-04').month,null);
let cases=0;
for(let y=1900;y<=2026;y++){
  const terms=solar.yearTerms(y);assert.equal(terms.length,24);
  for(let i=1;i<terms.length;i++)assert.ok(terms[i]>terms[i-1]);
  for(let m=1;m<=12;m++){
    const d=`${y}-${String(m).padStart(2,'0')}-15`;
    const p=calc(d,'13:00');
    for(const key of ['year','month','day','hour'])assert.match(p[key],/^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午申酉戌亥未]$/);
    cases++;
  }
}
console.log(`PASS: ${cases} representative months + lunar conversion, four pillars, 2027 Ipchun edge`);
