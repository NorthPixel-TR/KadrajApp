/* sayfa başına iz: hangi olaylar zaman alıyor (boşta 4 sn + kaydırma) */
const {open}=require('../m70/lib');const page=process.argv[2]||"chats";const scroll=process.argv[3]==="s";
(async()=>{const {b,p}=await open(390);
 await p.evaluate(async()=>{const T=Date.now();const img=(c)=>{const cv=document.createElement('canvas');cv.width=600;cv.height=600;const g=cv.getContext('2d');g.fillStyle=c;g.fillRect(0,0,600,600);return cv.toDataURL('image/jpeg',.8)};
  for(let i=0;i<30;i++)await DB.set('posts/pf'+i,{uid:'u'+(1+i%5),at:T-i*3600e3,kind:'photo',src:img(['#c33','#3a6','#36c'][i%3]),caption:'Paylaşım '+i})});
 await p.evaluate(t=>{closeAll();t==="profile"?go("profile",{uid:S.uid}):tab(t)},page);await p.waitForTimeout(2500);
 await b.startTracing(p,{categories:['devtools.timeline','disabled-by-default-devtools.timeline','v8.execute','cc','gpu']});
 if(scroll){for(let i=0;i<20;i++){await p.mouse.move(195,500);await p.mouse.wheel(0,220);await p.waitForTimeout(80)}}else await p.waitForTimeout(4000);
 const buf=await b.stopTracing();const ev=JSON.parse(buf.toString()).traceEvents;const agg={};
 for(const e of ev){if(e.ph!=="X"||!e.dur)continue;let n=e.name;if(n==="FunctionCall"||n==="TimerFire"||n==="EventDispatch"){const d=e.args&&e.args.data;n+=" "+(d&&(d.url?String(d.url).split("/").pop().split("?")[0]+":"+d.lineNumber:d.type||d.functionName)||"")}const a=agg[n]||(agg[n]={t:0,c:0});a.t+=e.dur/1000;a.c++}
 Object.entries(agg).sort((a,b)=>b[1].t-a[1].t).slice(0,14).forEach(([n,a])=>console.log(a.t.toFixed(1).padStart(8),"ms",String(a.c).padStart(5),"x ",n.slice(0,90)));
 await b.close()})();
