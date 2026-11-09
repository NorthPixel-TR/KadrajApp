/* 7.0.14 kasma ölçümü: 4x yavaş işlemci, her sayfada boşta 5 sn ve Akış'ta kaydırma */
const {open}=require('../m70/lib');
(async()=>{const {b,p,errors}=await open(390);
 const ctx=p.context();const cdp=await ctx.newCDPSession(p);await cdp.send('Performance.enable');
 await p.evaluate(async()=>{const T=Date.now();const img=(c)=>{const cv=document.createElement('canvas');cv.width=600;cv.height=600;const g=cv.getContext('2d');g.fillStyle=c;g.fillRect(0,0,600,600);g.fillStyle='#fff';g.font='80px sans-serif';g.fillText('K',250,320);return cv.toDataURL('image/jpeg',.8)};
  const cs=['#c33','#3a6','#36c','#a3c','#ca3','#3cc'];for(let i=0;i<30;i++)await DB.set('posts/pf'+i,{uid:'u'+(1+i%5),at:T-i*3600e3,kind:i%4===3?'note':'photo',src:img(cs[i%6]),text:'not '+i,bg:0,caption:'Paylaşım '+i+' #kadraj @ayse'});
  window.__c={raf:0};const r=requestAnimationFrame;window.requestAnimationFrame=f=>r(t=>{__c.raf++;f(t)})});
 await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 const m=async()=>{const r=await cdp.send('Performance.getMetrics');const o={};for(const x of r.metrics)o[x.name]=x.value;return o};
 for(const t of ["feed","explore","reels","chats","activity","profile","settings"]){await p.evaluate(t=>{closeAll();t==="profile"?go("profile",{uid:S.uid}):tab(t)},t);await p.waitForTimeout(2500);
  await p.evaluate(()=>{__c.raf=0});const a=await m();await p.waitForTimeout(5000);const c=await m();const raf=await p.evaluate(()=>__c.raf);
  console.log(t.padEnd(9),"boşta script ms/sn",((c.ScriptDuration-a.ScriptDuration)*1000/5).toFixed(1).padStart(6),"görev ms/sn",((c.TaskDuration-a.TaskDuration)*1000/5).toFixed(1).padStart(6),"stil/sn",((c.RecalcStyleCount-a.RecalcStyleCount)/5).toFixed(1),"layout/sn",((c.LayoutCount-a.LayoutCount)/5).toFixed(1),"raf/sn",raf/5)}
 /* Akış kaydırma: uzun kareler */
 await p.evaluate(()=>{closeAll();tab("feed")});await p.waitForTimeout(2500);
 await p.evaluate(()=>{window.__f=[];let l=performance.now();const loop=t=>{__f.push(t-l);l=t;if(__f.length<400)requestAnimationFrame(loop)};requestAnimationFrame(loop)});
 for(let i=0;i<25;i++){await p.mouse.move(195,500);await p.mouse.wheel(0,220);await p.waitForTimeout(60)}
 await p.waitForTimeout(800);const f=await p.evaluate(()=>__f.slice(2));f.sort((a,b)=>a-b);
 console.log("Akış kaydırma kareleri",f.length,"medyan",f[f.length>>1].toFixed(1),"p95",f[Math.floor(f.length*.95)].toFixed(1),">50ms",f.filter(x=>x>50).length);
 console.log("hatalar",errors);await b.close()})();
