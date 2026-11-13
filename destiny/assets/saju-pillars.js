/* Destiny Garden v0.6 - Korean year, month, day and hour pillars.
   Year begins at 立春 (solar longitude 315°). Months begin at the 12 節,
   not calendar month or lunar first day. Hour pillars are 2-hour branches.
   Day transition convention: midnight 00:00 (자정/조자시 option, sect2),
   including 子 hour 23:00-00:59 without shifting the date at 23:00.
   Birth clock uses Asia/Seoul civil time, including historic standard/DST offsets.
   Does not apply optional longitude/true solar time or contested master-specific methods.
   No server calls or birth-data storage. */
(function(g){'use strict';
const STEMS='甲乙丙丁戊己庚辛壬癸',BRANCHES='子丑寅卯辰巳午未申酉戌亥';
const fmt=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
function positiveMod(n,base){return ((n%base)+base)%base;}
function localAsUTC(millis){
 const p=Object.fromEntries(fmt.formatToParts(new Date(millis)).filter(x=>x.type!=='literal').map(x=>[x.type,Number(x.value)]));
 return Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute,p.second);
}
function civilToInstant(y,m,d,h,mi){
 const target=Date.UTC(y,m-1,d,h,mi,0);
 let guess=target-9*3600000;
 for(let i=0;i<9;i++){
   const diff=target-localAsUTC(guess);
   guess+=diff;
   if(diff===0){
     // Some DST autumn dates occur twice; use earliest and disclose ambiguity.
     const alternatives=[guess-3600000,guess+3600000].filter(v=>localAsUTC(v)===target);
     return {instant:Math.min(guess,...alternatives),ambiguous:alternatives.length>0};
   }
 }
 throw Error('일광절약시간제 등으로 존재하지 않는 출생시각입니다. 다른 시각을 확인해 주세요.');
}
function yearPillarFor(instant,localYear){
 const year=instant>=g.KoreanSolarTerms.termUtc(localYear,2)?localYear:localYear-1;
 const index=positiveMod(year-1984,60);
 return {year,index,stem:STEMS[index%10],branch:BRANCHES[index%12],name:STEMS[index%10]+BRANCHES[index%12]};
}
function monthPillarFor(instant,localYear,yearStemIndex){
 let latest=null;
 for(let y=localYear-1;y<=localYear+1;y++){
   if(y<1899 || y>2028)continue;
   for(let i=0;i<24;i+=2){
     const t=g.KoreanSolarTerms.termUtc(y,i);
     if(t<=instant && (!latest || t>latest.time))latest={year:y,index:i,time:t};
   }
 }
 if(!latest)throw Error('해당 날짜의 절기 정보를 계산할 수 없습니다.');
 const slot=latest.index===0?11:latest.index/2-1;
 const stemIndex=positiveMod(2+(yearStemIndex%5)*2+slot,10);
 const branchIndex=(2+slot)%12;
 return {name:STEMS[stemIndex]+BRANCHES[branchIndex],stem:STEMS[stemIndex],branch:BRANCHES[branchIndex],slot,jieUtc:latest.time};
}
function hourPillarFor(dayStemIndex,h){
 const branchIndex=Math.floor(((h+1)%24)/2);
 const stemIndex=((dayStemIndex%5)*2+branchIndex)%10;
 return STEMS[stemIndex]+BRANCHES[branchIndex];
}
function compute({solarDate,timeKnown=false,time='12:00'}){
 if(!g.KoreanSolarTerms || !g.KoreanCalendarCore)throw Error('만세력 데이터 파일을 불러오지 못했습니다.');
 const [y,m,d]=solarDate.split('-').map(Number);
 g.KoreanCalendarCore.isoDate(y,m,d);
 if(y<1900 || y>2027)throw Error('지원하지 않는 출생 연도입니다.');
 const day=g.KoreanCalendarCore.dayPillar(solarDate),dayStemIdx=STEMS.indexOf(day[0]);
 if(dayStemIdx<0)throw Error('일간 계산에 실패했습니다.');
 const warnings=[];
 let year=null,month=null,hour=null,termBoundary=false,clockAmbiguous=false;
 if(timeKnown){
   if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))throw Error('출생시간은 HH:MM 형식으로 입력해 주세요.');
   const h=Number(time.slice(0,2)), mi=Number(time.slice(3,5));
   const res=civilToInstant(y,m,d,h,mi);
   const yr=yearPillarFor(res.instant,y);
   const mo=monthPillarFor(res.instant,y,yr.index%10);
   year=yr.name;month=mo.name;hour=hourPillarFor(dayStemIdx,h);
   clockAmbiguous=res.ambiguous;
   if(clockAmbiguous)warnings.push('서머타임의 반복 시각이므로 가능한 두 순간 중 이른 쪽을 적용했습니다.');
 }else{
   const a=civilToInstant(y,m,d,0,0).instant;
   const b=civilToInstant(y,m,d,23,59).instant;
   const y1=yearPillarFor(a,y),y2=yearPillarFor(b,y);
   year=y1.name===y2.name?y1.name:null;
   const m1=monthPillarFor(a,y,y1.index%10),m2=monthPillarFor(b,y,y2.index%10);
   month=m1.name===m2.name?m1.name:null;
   termBoundary=!year || !month;
   if(termBoundary)warnings.push('출생시각 미상: 해당 날짜에 절입이 있어 연주 또는 월주가 달라질 수 있으므로 확정하지 않았습니다.');
   warnings.push('출생시각이 없어 시주를 계산하지 않았습니다.');
 }
 return {year,month,day,hour,mode:'full',timeKnown:!!timeKnown,termBoundary,clockAmbiguous,warnings,
  dayStem:day[0],calculationVersion:'0.6.0',solarTermsVersion:g.KoreanSolarTerms.version,
  dayBoundaryConvention:'00:00; 23:00 Zi hour uses same calendar-day stem',
  timezone:'Asia/Seoul (historical civil offsets; no longitude correction)'};
}
g.KoreanSajuPillars=Object.freeze({version:'0.6.0',compute,civilToInstant});
})(typeof window!=='undefined'?window:globalThis);