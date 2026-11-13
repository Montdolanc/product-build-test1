/* Destiny Garden v0.9 — Korean-first display text only.
   Underlying pillar / solar-term calculation is unchanged.
   Symbols are traditional metaphors, not personality/health predictions. */
(function(g){'use strict';
const STEMS={
 甲:{name:'갑',image:'큰 나무',element:'나무',phrase:'곧게 자라는 큰 나무'},
 乙:{name:'을',image:'풀과 덩굴',element:'나무',phrase:'유연하게 자라는 풀과 덩굴'},
 丙:{name:'병',image:'태양',element:'불',phrase:'밝은 태양'},
 丁:{name:'정',image:'촛불',element:'불',phrase:'은은한 촛불'},
 戊:{name:'무',image:'큰 산',element:'흙',phrase:'든든한 큰 산'},
 己:{name:'기',image:'밭의 흙',element:'흙',phrase:'생명을 돌보는 밭의 흙'},
 庚:{name:'경',image:'단단한 쇠',element:'쇠',phrase:'단단하게 단련한 쇠'},
 辛:{name:'신',image:'보석',element:'쇠',phrase:'세심하게 다듬은 보석'},
 壬:{name:'임',image:'큰 바다',element:'물',phrase:'넓게 흐르는 바다'},
 癸:{name:'계',image:'이슬비',element:'물',phrase:'조용히 내리는 이슬비'}
};
const BRANCHES={
 子:{name:'자',animal:'쥐'},丑:{name:'축',animal:'소'},寅:{name:'인',animal:'호랑이'},
 卯:{name:'묘',animal:'토끼'},辰:{name:'진',animal:'용'},巳:{name:'사',animal:'뱀'},
 午:{name:'오',animal:'말'},未:{name:'미',animal:'양'},申:{name:'신',animal:'원숭이'},
 酉:{name:'유',animal:'닭'},戌:{name:'술',animal:'개'},亥:{name:'해',animal:'돼지'}
};
const ELEMENTS={목:'나무',화:'불',토:'흙',금:'쇠',수:'물'};
const TEN_GODS={
 비견:'나와 비슷한 힘',겁재:'함께하거나 경쟁하는 힘',
 식신:'꾸준히 표현하는 힘',상관:'새롭게 표현하는 힘',
 편재:'새로운 자원을 다루는 힘',정재:'차근차근 관리하는 힘',
 편관:'도전과 압박을 마주하는 힘',정관:'책임과 질서를 세우는 힘',
 편인:'새로운 관점을 배우는 힘',정인:'차곡차곡 배워 쌓는 힘'
};
const TEN_GOD_SUMMARIES={
 비견:'내가 스스로 선택하는 일과 누군가와 발맞추는 일을 함께 생각해 보세요.',
 겁재:'협력할 부분과 각자 맡을 부분을 나눠 보는 이야기입니다.',
 식신:'좋아하는 일을 꾸준히 만들고 표현하는 이야기를 떠올려 보세요.',
 상관:'다른 방식으로 생각을 표현하는 모험을 그려 보세요.',
 편재:'새로운 선택지가 나타났을 때 우선순위를 정하는 이야기입니다.',
 정재:'시간과 노력을 차근차근 나누어 쓰는 이야기입니다.',
 편관:'어려운 상황에서도 내 속도를 지키는 이야기를 떠올려 보세요.',
 정관:'내가 맡은 역할과 약속을 돌보는 이야기입니다.',
 편인:'익숙하지 않은 생각을 가볍게 탐색해 보는 이야기입니다.',
 정인:'배운 것을 천천히 나의 것으로 만드는 이야기입니다.'
};
const POSITION={hour:'태어난 시간',day:'태어난 날',month:'태어난 달의 계절',year:'태어난 해'};
function stemInfo(stem){return STEMS[stem]||null;}
function branchInfo(branch){return BRANCHES[branch]||null;}
function simplePillar(pillar){
 if(!pillar || typeof pillar!=='string' || pillar.length!==2)return '시간 정보가 없어 표시할 수 없어요.';
 const s=stemInfo(pillar[0]),b=branchInfo(pillar[1]);
 if(!s||!b)return '아직 설명할 수 없는 상징이에요.';
 return s.image+' · '+b.animal;
}
function reading(pillar){
 if(!pillar||pillar.length!==2)return '미확정';
 const s=stemInfo(pillar[0]),b=branchInfo(pillar[1]);
 return s&&b?s.name+b.name:'미확정';
}
function phrase(pillar){
 if(!pillar||pillar.length!==2)return '아직 알 수 없어요.';
 const s=stemInfo(pillar[0]),b=branchInfo(pillar[1]);
 return s&&b?s.phrase+'와 '+b.animal+'의 상징':'아직 알 수 없어요.';
}
function tenGod(name){return TEN_GODS[name]||'관계를 더 살펴봐야 해요';}
function tenGodStory(name){return TEN_GOD_SUMMARIES[name]||'전통에서 사용하는 상징적 관계이며 실제 삶을 예측하지 않아요.';}
function element(element){return ELEMENTS[element]||element;}
function stemPhrase(stem){return stemInfo(stem)?.phrase||'자연의 기운';}
function branchName(branch){return branchInfo(branch)?.animal||'동물의 상징';}
function branchRelation(text){
 if(text==='충(沖)')return '변화와 마주침';
 if(text==='육합(六合)')return '연결과 조화';
 if(text==='기본')return '특별한 관계 표시 없음';
 return text==='미확인'?'정보를 더 확인해야 해요':text;
}
g.DestinyPlainKorean=Object.freeze({version:'0.9.0',STEMS:Object.freeze(STEMS),BRANCHES:Object.freeze(BRANCHES),
 stemInfo,branchInfo,simplePillar,reading,phrase,tenGod,tenGodStory,element,stemPhrase,branchName,branchRelation,position:POSITION});
})(typeof window!=='undefined'?window:globalThis);
