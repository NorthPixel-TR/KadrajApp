/* yeniden çizim (refresh/render(false)) maliyeti: 4x yavaş işlemci, her sayfada 5 kez */
const {open}=require('../m70/lib');
(async()=>{const {b,p,errors}=await open(+process.argv[2]||390);
 await p.evaluate(async()=>{const T=Date.now();const img=(c)=>{const cv=document.createElement('canvas');cv.width=1080;cv.height=1080;const g=cv.getContext('2d');for(let i=0;i<400;i++){g.fillStyle=`hsl(${Math.random()*360},60%,50%)`;g.fillRect(Math.random()*1080,Math.random()*1080,80,80)}return cv.toDataURL('image/jpeg',.8)};
  for(let i=0;i<30;i++)await DB.set('posts/pf'+i,{uid:'u'+(1+i%5),at:T-i*3600e3,kind:'photo',src:img(),caption:'Paylaşım '+i+' #kadraj'})});
 const cdp=await p.context().newCDPSession(p);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 for(const t of ["feed","explore","profile","chats","activity"]){await p.evaluate(t=>{closeAll();t==="profile"?go("profile",{uid:"u2"}):tab(t)},t);await p.waitForTimeout(2500);
  const r=await p.evaluate(async()=>{const out=[];for(let i=0;i<5;i++){const a=performance.now();refresh();await new Promise(r=>setTimeout(r,0));const m=performance.now();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));out.push([m-a,performance.now()-a]);await new Promise(r=>setTimeout(r,300))}return out});
  console.log(t.padEnd(9),"refresh JS ms",r.map(x=>x[0].toFixed(0)).join(","),"| ekrana gelene kadar",r.map(x=>x[1].toFixed(0)).join(","))}
 console.log("hatalar",errors);await b.close()})();
