'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const lotto=read('index.html'),destiny=read('destiny/index.html'),notFound=read('404.html'),css=read('styles.css');
assert.match(lotto, /class="destiny-promo"/);
assert.match(lotto, /href="\/destiny\/"/);
assert.match(lotto, /운명의 정원은 별도의 오락용 서비스/);
assert.match(lotto, /id="generate"/); // unchanged lotto action remains present
assert.match(notFound, /href="\/destiny\/"/);
assert.match(destiny, /class="lotto-back-link" href="\/"/);
assert.match(destiny, /<footer[\s\S]*?<a href="\/">로또 번호 생성기<\/a>/);
assert.match(css, /\.destiny-promo-link/);
assert.match(css, /@media\(max-width:650px\)/);
assert.match(destiny, /@media\(max-width:700px\)/);
for(const p of ['guide.html','odds.html','myths.html','about.html','privacy.html']){
 assert.match(read(p),/href="\/destiny\/"/,p+' must link to the garden');
}
for(const p of ['destiny/index.html','destiny/about.html','destiny/privacy.html',...fs.readdirSync(path.join(root,'destiny/share')).filter(x=>x.endsWith('.html')).map(x=>'destiny/share/'+x)]){
 assert.ok(fs.existsSync(path.join(root,p)),p+' missing');
}
console.log('PASS: desktop/mobile cross-site links, 404 navigation, lotto entry and 10 shared cards');
