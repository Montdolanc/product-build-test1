'use strict';
const assert=require('node:assert/strict');
require('../assets/pillar-insights.js');
const I=global.KoreanSajuInsights;
assert.equal(I.version,'0.8.0');
// 일간 甲을 기준으로 전통 십성 열 관계의 음양 대응.
for(const [stem,name] of Object.entries({
 甲:'비견',乙:'겁재',丙:'식신',丁:'상관',戊:'편재',
 己:'정재',庚:'편관',辛:'정관',壬:'편인',癸:'정인'
})) assert.equal(I.relation('甲',stem).name,name,`甲 => ${stem}`);
// 음간 일간의 상호관계도 반전되어야 합니다.
assert.equal(I.relation('癸','丁').name,'편재');
assert.equal(I.relation('癸','丙').name,'정재');
// 출생시간이 없거나 절입 시각이 미상인 경우 차트에 빈칸 유지.
const a=I.analyze({hour:null,day:'癸巳',month:'丙申',year:'丙寅'});
assert.equal(a.dayStem,'癸');
assert.deepEqual(a.rows.map(p=>p.title),['시주','일주','월주','연주']);
assert.equal(a.rows[0].value,null);
assert.equal(a.rows[0].tenGod,null);
assert.equal(a.rows[1].tenGod,'일간(기준)');
assert.equal(a.rows[2].tenGod,'정재');
assert.equal(a.rows[3].branchElement,'목');
const b=I.analyze({hour:'丁巳',day:'癸巳',month:null,year:null});
assert.equal(b.rows[0].tenGod,'편재');
assert.equal(b.rows[2].value,null);
assert.equal(b.rows[3].value,null);
assert.throws(()=>I.analyze({day:null}),/일주/);
assert.throws(()=>I.analyze({day:'甲X'}),/일지/);
assert.throws(()=>I.analyze({day:'甲子',year:'WX'}),/기둥/);
assert.equal(typeof I.analyze({day:'甲子'}).rows[1].description,'string');
console.log('PASS: v0.8 ten-god mapping, four-pillar labels and unknown pillar handling');
