/* Akış refresh'inin CPU profili: en çok süren fonksiyonlar (kendi süresi ve toplam) */
const {open}=require('../m70/lib');const page=process.argv[2]||"feed";
(async()=>{const {b,p}=await open(390);
 await p.evaluate(async()=>{const T=Date.now();const img=(c)=>{const cv=document.createElement('canvas');cv.width=1080;cv.height=1080;const g=cv.getContext('2d');for(let i=0;i<400;i++){g.fillStyle=`hsl(${Math.random()*360},60%,50%)`;g.fillRect(Math.random()*1080,Math.random()*1080,80,80)}return cv.toDataURL('image/jpeg',.8)};
  for(let i=0;i<30;i++)await DB.set('posts/pf'+i,{uid:'u'+(1+i%5),at:T-i*3600e3,kind:'photo',src:img(),caption:'Paylaşım '+i+' #kadraj'})});
 await p.evaluate(t=>{closeAll();tab(t)},page);await p.waitForTimeout(2500);
 const cdp=await p.context().newCDPSession(p);if(process.env.T)await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});await cdp.send('Profiler.enable');await cdp.send('Profiler.setSamplingInterval',{interval:100});await cdp.send('Profiler.start');
 await p.evaluate(async()=>{for(let i=0;i<5;i++){refresh();await new Promise(r=>setTimeout(r,50))}});
 const {profile}=await cdp.send('Profiler.stop');
 const byId={};for(const n of profile.nodes)byId[n.id]=n;const self={};const dt={};
 profile.samples.forEach((s,i)=>{dt[s]=(dt[s]||0)+(profile.timeDeltas[i]||0)});
 const parent={};for(const n of profile.nodes)for(const c of n.children||[])parent[c]=n.id;
 const tot={};const key=n=>`${n.callFrame.functionName||"(anon)"} ${String(n.callFrame.url).split("/").pop().split("?")[0]}:${n.callFrame.lineNumber+1}`;
 for(const id in dt){const n=byId[id];const k=key(n);self[k]=(self[k]||0)+dt[id];const seen=new Set();let c=+id;while(c!=null){const kk=key(byId[c]);if(!seen.has(kk)){seen.add(kk);tot[kk]=(tot[kk]||0)+dt[id]}c=parent[c]}}
 console.log("== kendi süresi");Object.entries(self).sort((a,b)=>b[1]-a[1]).slice(0,15).forEach(([k,v])=>console.log((v/1000).toFixed(1).padStart(7),"ms",k.slice(0,100)));
 console.log("== toplam");Object.entries(tot).filter(([k])=>/app\.js/.test(k)).sort((a,b)=>b[1]-a[1]).slice(0,30).forEach(([k,v])=>console.log((v/1000).toFixed(1).padStart(7),"ms",k.slice(0,100)));
 await b.close()})();
