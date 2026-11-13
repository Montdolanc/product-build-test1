'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../..');
const load=p=>fs.readFileSync(path.join(root,p),'utf8');
const rootFiles=['index.html','guide.html','odds.html','myths.html','about.html','privacy.html','randomness.html','probability-lab.html','responsible-play.html'];
const articles=['randomness.html','probability-lab.html','responsible-play.html','destiny/methodology.html'];
const domain='https://product-build-test1-1o7.pages.dev';
assert.equal(rootFiles.length,9);
for(const name of articles){
 const src=load(name);
 const visible=src.replace(/<style[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<script[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&[^;]+;/g,' ');
 assert.ok(visible.replace(/\s/g,'').length>1400,name+' has too little original educational text');
 assert.equal((src.match(/<h1(?:\s|>)/g)||[]).length,1,name+' needs one h1');
 assert.ok((src.match(/<h2(?:\s|>)/g)||[]).length>=6,name+' requires substantive sections');
 assert.match(src,/name="description"/);
 assert.match(src,/rel="canonical"/);
 assert.doesNotMatch(src,/lorem ipsum|TODO|준비 중|페이지 제작 중/i);
}
const allRootPages=[...rootFiles,'404.html'];
for(const name of allRootPages){
 const src=load(name);
 assert.match(src,/<title>[^<]+<\/title>/,name+' title');
 assert.ok(src.includes('href="/destiny/"'),name+' garden link missing');
 if(name!=='404.html')assert.ok(src.includes('href="probability-lab.html"'),name+' probability link missing');
 assert.match(src,/https:\/\/product-build-test1-1o7.pages.dev/,name+' canonical mismatch');
}
assert.match(load('destiny/index.html'),/href="methodology.html"/);
assert.match(load('destiny/methodology.html'),/href="\.\/"/);
const meta=load('.assetsignore');
for(const name of ['randomness.html','probability-lab.html','responsible-play.html'])assert.ok(meta.includes('!'+name),name+' excluded from Workers static assets');
const xml=load('sitemap.xml');
for(const slug of ['/randomness.html','/probability-lab.html','/responsible-play.html','/destiny/','/destiny/methodology.html']){
 assert.ok(xml.includes(domain+slug),slug+' missing from sitemap');
}
assert.ok(load('robots.txt').includes(domain+'/sitemap.xml'));
assert.match(load('404.html'),/name="robots" content="noindex"/);
for(const file of fs.readdirSync(path.join(root,'destiny/share')).filter(x=>x.endsWith('.html'))){
 const src=load('destiny/share/'+file);
 assert.match(src,/name="robots" content="noindex,follow"/,file+' is a low-text share page that must not be indexed');
 assert.doesNotMatch(src,/pagead2\.googlesyndication\.com/,file+' must not include AdSense scripts');
}
for(const name of ['privacy.html','404.html','destiny/privacy.html']){
 assert.doesNotMatch(load(name),/pagead2\.googlesyndication\.com/,name+' must not include AdSense script');
}
const ads=load('ads.txt').trim();
assert.match(ads,/google\.com, pub-3184173879744918, DIRECT, f08c47fec0942fa0/);
assert.match(load('index.html'),/ca-pub-3184173879744918/);
const choose=(n,k)=>{let v=1;for(let i=1;i<=k;i++)v=v*(n-i+1)/i;return Math.round(v)};
assert.equal(choose(45,6),8145060);
assert.equal(choose(6,3)*choose(39,3),182780);
console.log('PASS: 4 substantial articles, internal navigation, 10 noindex share pages, canonical, sitemap, ads.txt, 6/45 math');
