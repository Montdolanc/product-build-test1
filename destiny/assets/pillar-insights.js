/* Destiny Garden v0.8 — explanatory UI model for the four pillars.
   The ten-god relation uses the *visible heavenly stems only* against the day stem.
   Hidden stems, seasonal weights, strength, luck, and real-world outcomes are NOT inferred.
   Returns plain immutable data; it never sends or stores birth information. */
(function(g){'use strict';
const STEMS='甲乙丙丁戊己庚辛壬癸';
const BRANCHES='子丑寅卯辰巳午未申酉戌亥';
const ELEMENTS=['목','목','화','화','토','토','금','금','수','수'];
const BRANCH_ELEMENT={子:'수',丑:'토',寅:'목',卯:'목',辰:'토',巳:'화',午:'화',未:'토',申:'금',酉:'금',戌:'토',亥:'수'};
const GENERATES={목:'화',화:'토',토:'금',금:'수',수:'목'};
const CONTROLS={목:'토',토:'수',수:'화',화:'금',금:'목'};
const TEN_GODS={
 same:['비견','겁재'],output:['식신','상관'],wealth:['편재','정재'],
 officer:['편관','정관'],resource:['편인','정인']
};
const TEN_GOD_NOTES={
 비견:'나와 같은 성질의 천간이라는 상징. 동료·자기주도성이라는 주제로 읽습니다.',
 겁재:'나와 같은 오행, 다른 음양의 천간. 협력과 경쟁의 균형이라는 주제로 읽습니다.',
 식신:'내 오행이 생하는 같은 음양의 천간. 표현·창작의 지속성을 상징합니다.',
 상관:'내 오행이 생하는 다른 음양의 천간. 발상·새로운 표현을 상징합니다.',
 편재:'내 오행이 극하는 같은 음양의 천간. 선택과 자원 활용을 상징합니다.',
 정재:'내 오행이 극하는 다른 음양의 천간. 계획과 꾸준한 관리를 상징합니다.',
 편관:'나를 극하는 같은 음양의 천간. 압박을 마주하는 태도를 상징합니다.',
 정관:'나를 극하는 다른 음양의 천간. 책임·질서·규칙을 상징합니다.',
 편인:'나를 생하는 같은 음양의 천간. 호기심과 독특한 배움을 상징합니다.',
 정인:'나를 생하는 다른 음양의 천간. 배움·돌봄·기반을 상징합니다.'
};
const POSITION={
 hour:{title:'시주',role:'시간과 지향',missing:'출생시간 미상'},
 day:{title:'일주',role:'나를 나타내는 기준',missing:'일주 미계산'},
 month:{title:'월주',role:'계절과 환경',missing:'절입 시각 미상'},
 year:{title:'연주',role:'출생의 배경',missing:'절입 시각 미상'}
};
const ORDER=['hour','day','month','year'];
function elementOfStem(stem){
 const i=STEMS.indexOf(stem);
 if(i<0||typeof stem!=='string'||stem.length!==1)throw Error('유효하지 않은 천간입니다.');
 return ELEMENTS[i];
}
function relation(dayStem,targetStem){
 const a=elementOfStem(dayStem),b=elementOfStem(targetStem);
 const kind=a===b?'same':GENERATES[a]===b?'output':CONTROLS[a]===b?'wealth':CONTROLS[b]===a?'officer':'resource';
 const samePolarity=(STEMS.indexOf(dayStem)%2)===(STEMS.indexOf(targetStem)%2);
 const name=TEN_GODS[kind][samePolarity?0:1];
 return Object.freeze({name,kind,samePolarity,dayStem,targetStem,description:TEN_GOD_NOTES[name]});
}
function analyze(pillars){
 if(!pillars||typeof pillars.day!=='string'||pillars.day.length!==2)throw Error('계산된 일주 정보가 필요합니다.');
 const dayStem=pillars.day[0];
 elementOfStem(dayStem);
 if(!BRANCHES.includes(pillars.day[1]))throw Error('일지 정보가 유효하지 않습니다.');
 const rows=ORDER.map(key=>{
  const value=pillars[key]||null,meta=POSITION[key];
  if(value===null)return Object.freeze({...meta,key,value:null,stem:null,branch:null,stemElement:null,branchElement:null,tenGod:null,description:meta.missing});
  if(typeof value!=='string'||value.length!==2||!BRANCHES.includes(value[1]))throw Error('사주 기둥의 글자가 유효하지 않습니다.');
  const stemElement=elementOfStem(value[0]);
  const rel=key==='day'?null:relation(dayStem,value[0]);
  return Object.freeze({...meta,key,value,stem:value[0],branch:value[1],stemElement,branchElement:BRANCH_ELEMENT[value[1]],
   tenGod:key==='day'?'일간(기준)':rel.name,
   description:key==='day'?'나머지 천간의 십성 관계를 판단하는 기준입니다.':rel.description});
 });
 return Object.freeze({dayStem,dayElement:elementOfStem(dayStem),rows:Object.freeze(rows)});
}
g.KoreanSajuInsights=Object.freeze({version:'0.8.0',relation,analyze,TEN_GOD_NOTES:Object.freeze(TEN_GOD_NOTES)});
})(typeof window!=='undefined'?window:globalThis);
