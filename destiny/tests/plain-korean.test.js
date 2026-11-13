'use strict';
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const chinese=/[\u3400-\u9fff]/;
const plain=fs.readFileSync(path.join(root,'assets/plain-korean.js'),'utf8');
const c={console,Intl,Date,Math,Number,String,Object,Array,Boolean,RegExp,Error,Map,Set,JSON};
c.window=c;
c.globalThis=c;
vm.createContext(c);
vm.runInContext(plain,c);
const p=c.DestinyPlainKorean;
assert.equal(p.version,'0.9.1');
assert.equal(Object.keys(p.STEMS).length,10);
assert.equal(Object.keys(p.BRANCHES).length,12);
for(const stem of Object.keys(p.STEMS)){
 assert.ok(!chinese.test(p.stemPhrase(stem)));
 for(const branch of Object.keys(p.BRANCHES)){
  for(const str of [p.simplePillar(stem+branch),p.reading(stem+branch),p.phrase(stem+branch)]){
   assert.ok(!chinese.test(str),'Korean display should not contain Hanzi: '+str);
  }
 }
}
for(const name of ['비견','겁재','식신','상관','편재','정재','편관','정관','편인','정인']){
 assert.ok(!chinese.test(p.tenGod(name)));
 assert.ok(!chinese.test(p.tenGodStory(name)));
}
assert.equal(p.simplePillar('丙寅'),'태양 · 호랑이');
assert.equal(p.simplePillar(null),'출생정보가 부족해 표시할 수 없어요.');
assert.equal(p.branchRelation('충(沖)'),'변화를 마주하는 모습');
assert.equal(p.branchRelation('육합(六合)'),'서로 어울리는 모습');
assert.match(p.yearHeadline('비견','정재'),/나만의 기준/);
assert.match(p.monthIntro('정리','정재'),/차근차근 정리/);
for(const [name,value] of Object.entries(p.positionRole))assert.ok(value.length>4,name);
for(const name of ['비견','겁재','식신','상관','편재','정재','편관','정관','편인','정인'])assert.ok(!chinese.test(p.tenGodTheme(name)));

// Execute the actual inline site code with a minimal DOM so result-template output
// can be checked, without installing a browser or posting birth data anywhere.
const app={innerHTML:'',querySelectorAll(){return []},addEventListener(){},focus(){}};
const dummy={addEventListener(){},querySelectorAll(){return []}};
c.document={getElementById(id){return id==='app'?app:dummy}};
for(const script of ['calendar-core.js','solar-terms.js','saju-pillars.js','pillar-insights.js']){
 vm.runInContext(fs.readFileSync(path.join(root,'assets',script),'utf8'),c,{filename:script});
}
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const m of index.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)){
 if(m[1].trim()&&!/application\/ld\+json/.test(m[0])&&!m[1].includes('clarity.ms/tag'))vm.runInContext(m[1],c,{filename:'destiny/index.html inline script'});
}
vm.runInContext(`saju={pillars:{hour:'丁巳',day:'癸巳',month:'丙申',year:'丙寅'},timeKnown:true,solarDate:'1986-08-17',warning:'한국 기준으로 계산했어요.',counts:{목:1,화:3,토:0,금:1,수:3},total:8};guardian=guardians.find(x=>x.stem==='癸');isDemo=false;month=1;`,c);
for(const fn of ['home()','guardianPage()','fortunePage()','sharePage()','codexPage()']){
 const html=vm.runInContext(fn,c);
 assert.ok(html.length>300,fn+' was empty');
 assert.ok(!chinese.test(html),fn+' contains visible Hanzi: '+html.match(chinese)?.[0]);
}
vm.runInContext(`saju={pillars:{hour:null,day:'癸巳',month:null,year:null},timeKnown:false,solarDate:'1986-08-17',warning:'태어난 시간을 몰라요.',counts:{목:0,화:1,토:0,금:0,수:1},total:2};`,c);
const unknown=vm.runInContext('guardianPage()',c);
assert.ok(unknown.includes('시간 정보')||unknown.includes('태어난 시간을'));
assert.ok(!chinese.test(unknown));
for(const file of fs.readdirSync(path.join(root,'share')).filter(x=>x.endsWith('.html'))){
 const html=fs.readFileSync(path.join(root,'share',file),'utf8');
 assert.ok(!chinese.test(html),'public shared page has Hanzi: '+file);
}
console.log('PASS: Korean-only pillar/fortune/codex/card display and 10 public share pages');
