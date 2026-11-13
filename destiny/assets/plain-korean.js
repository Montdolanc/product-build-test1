/* Destiny Garden v0.9.1 — natural Korean presentation text only.
   Year/month/day/hour calculation and the guardian mapping stay unchanged.
   Traditional symbols are storytelling prompts, not predictions. */
(function(g){'use strict';
const STEMS={
 甲:{name:'갑',image:'큰 나무',element:'나무',phrase:'곧게 뻗어 자라는 큰 나무'},
 乙:{name:'을',image:'풀과 덩굴',element:'나무',phrase:'바람에 따라 유연하게 움직이는 풀과 덩굴'},
 丙:{name:'병',image:'태양',element:'불',phrase:'따뜻하게 빛나는 태양'},
 丁:{name:'정',image:'촛불',element:'불',phrase:'조용히 빛을 내는 촛불'},
 戊:{name:'무',image:'큰 산',element:'흙',phrase:'묵묵히 자리를 지키는 큰 산'},
 己:{name:'기',image:'밭의 흙',element:'흙',phrase:'씨앗을 품고 자라게 하는 밭의 흙'},
 庚:{name:'경',image:'단단한 쇠',element:'쇠',phrase:'단단하게 다듬어진 쇠'},
 辛:{name:'신',image:'보석',element:'쇠',phrase:'빛을 머금은 작은 보석'},
 壬:{name:'임',image:'큰 바다',element:'물',phrase:'넓고 깊게 펼쳐진 바다'},
 癸:{name:'계',image:'이슬비',element:'물',phrase:'조용히 대지를 적시는 이슬비'}
};
const BRANCHES={
 子:{name:'자',animal:'쥐'},丑:{name:'축',animal:'소'},寅:{name:'인',animal:'호랑이'},
 卯:{name:'묘',animal:'토끼'},辰:{name:'진',animal:'용'},巳:{name:'사',animal:'뱀'},
 午:{name:'오',animal:'말'},未:{name:'미',animal:'양'},申:{name:'신',animal:'원숭이'},
 酉:{name:'유',animal:'닭'},戌:{name:'술',animal:'개'},亥:{name:'해',animal:'돼지'}
};
const ELEMENTS={목:'나무',화:'불',토:'흙',금:'쇠',수:'물'};
const TEN_GODS={
 비견:'나와 비슷한 모습',겁재:'함께 성장하는 모습',
 식신:'꾸준히 표현하는 모습',상관:'새롭게 표현하는 모습',
 편재:'새로운 선택을 살피는 모습',정재:'차근차근 챙기는 모습',
 편관:'어려움에 맞서는 모습',정관:'약속을 지키는 모습',
 편인:'새로운 생각을 배우는 모습',정인:'배운 것을 쌓는 모습'
};
const TEN_GOD_THEMES={
 비견:'나만의 기준',겁재:'협력과 균형',
 식신:'꾸준한 표현',상관:'새로운 발상',
 편재:'선택의 우선순위',정재:'차근차근 정리',
 편관:'차분한 도전',정관:'책임과 약속',
 편인:'호기심과 발견',정인:'배움과 성장'
};
const TEN_GOD_SUMMARIES={
 비견:'스스로 결정할 일과 다른 사람과 상의할 일을 나누어 생각해 보세요.',
 겁재:'함께할 일과 각자 맡을 일을 구분해 보면 어떨까요?',
 식신:'떠오른 생각을 작은 것부터 꾸준히 표현해 보세요.',
 상관:'익숙한 문제를 다른 방식으로 바라봐도 좋겠어요.',
 편재:'여러 선택지 가운데 지금 중요한 것이 무엇인지 살펴보세요.',
 정재:'시간과 노력을 어디에 쓸지 차근차근 정리해 보세요.',
 편관:'어려운 일을 만나더라도 서두르지 않고 풀어 가는 모습을 떠올려 보세요.',
 정관:'내가 지키고 싶은 약속과 소중한 관계를 돌아보세요.',
 편인:'평소와 다른 생각이나 새로운 분야를 가볍게 탐색해 보세요.',
 정인:'새로 알게 된 것을 내 방식으로 정리해 보세요.'
};
const POSITION={hour:'태어난 시간',day:'태어난 날',month:'태어난 계절',year:'태어난 해'};
const POSITION_ROLE={hour:'시간을 나타내는 상징',day:'수호신을 정하는 기준',month:'계절을 나타내는 상징',year:'태어난 해의 상징'};
function stemInfo(stem){return STEMS[stem]||null;}
function branchInfo(branch){return BRANCHES[branch]||null;}
function simplePillar(pillar){
 if(!pillar || typeof pillar!=='string' || pillar.length!==2)return '출생정보가 부족해 표시할 수 없어요.';
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
 return s&&b?s.phrase+'와 '+b.animal+'를 떠올려 보세요.':'아직 알 수 없어요.';
}
function tenGod(name){return TEN_GODS[name]||'조금 더 살펴봐야 해요';}
function tenGodStory(name){return TEN_GOD_SUMMARIES[name]||'옛사람들이 자연의 관계를 풀어낸 이야기예요.';}
function tenGodTheme(name){return TEN_GOD_THEMES[name]||'일상의 작은 발견';}
function yearHeadline(first,second){
 return '2027년 이야기의 주제: '+tenGodTheme(first)+' · '+tenGodTheme(second);
}
function yearIntro(first,second){return tenGodStory(first)+' '+tenGodStory(second);}
function monthIntro(topic,name){
 return '이번 달에는 ‘'+topic+'’를 떠올려 보세요. '+tenGodStory(name);
}
function element(element){return ELEMENTS[element]||element;}
function stemPhrase(stem){return stemInfo(stem)?.phrase||'자연의 기운';}
function branchName(branch){return branchInfo(branch)?.animal||'동물의 상징';}
function branchRelation(text){
 if(text==='충(沖)')return '변화를 마주하는 모습';
 if(text==='육합(六合)')return '서로 어울리는 모습';
 if(text==='기본')return '이 이야기에서는 특별한 관계를 다루지 않아요';
 return text==='미확인'?'정보가 더 필요해요':text;
}
g.DestinyPlainKorean=Object.freeze({version:'0.9.1',STEMS:Object.freeze(STEMS),BRANCHES:Object.freeze(BRANCHES),
 stemInfo,branchInfo,simplePillar,reading,phrase,tenGod,tenGodStory,tenGodTheme,yearHeadline,yearIntro,monthIntro,
 element,stemPhrase,branchName,branchRelation,position:POSITION,positionRole:POSITION_ROLE});
})(typeof window!=='undefined'?window:globalThis);
