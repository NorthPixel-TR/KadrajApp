/* 7.1.12 oyun hata avı: her oyunu açar, rastgele dokunuşlarla (maymun testi) uzun süre oynar; sayfa hatası, konsol hatası,
   yatay taşma ve ekranda undefined/NaN arar. node oyun.js <genişlik> [tohum] */
const {open}=require('../m70/lib');
const W=+process.argv[2]||390,SEED=+process.argv[3]||7;let rs=SEED;const rnd=()=>{rs=(rs*1103515245+12345)%2147483648;return rs/2147483648};
const probs=[];
(async()=>{const {b,p,errors}=await open(W,820);const cons=[];
 p.on('console',m=>{if(m.type()==="error"&&!/Failed to load resource|net::ERR|favicon/.test(m.text()))cons.push(m.text().slice(0,200))});
 p.on('dialog',d=>d.dismiss());
 const look=async(name)=>{const r=await p.evaluate(()=>{const iw=innerWidth,over=[];
   for(const e of document.querySelectorAll("#overlay *, #main *")){const cs=getComputedStyle(e);if(cs.display==="none"||cs.visibility==="hidden"||cs.position==="fixed"||cs.position==="absolute")continue;const rc=e.getBoundingClientRect();if(rc.width>0&&rc.height>0&&(rc.right>iw+2||rc.left<-2)){let a=e.parentElement,clip=false;while(a&&a!==document.body){const s=getComputedStyle(a);if(/(auto|scroll|hidden|clip)/.test(s.overflowX)&&a.getBoundingClientRect().right<=iw+2){clip=true;break}a=a.parentElement}if(!clip)over.push(String(e.className&&e.className.baseVal!==undefined?e.className.baseVal:e.className).split(" ")[0]+" "+Math.round(rc.left)+"→"+Math.round(rc.right))}}
   const txt=(document.querySelector("#overlay")?.innerText||"")+"\n"+(document.querySelector("#main")?.innerText||"");
   return {over:over.slice(0,3),bad:(txt.match(/.{0,25}(undefined|NaN|\[object ).{0,15}/g)||[]).slice(0,2),sw:document.documentElement.scrollWidth>iw+1}});
  const e=errors.splice(0),c=cons.splice(0);
  if(e.length||c.length||r.over.length||r.bad.length||r.sw){probs.push(name);console.log("SORUN",name,JSON.stringify({e,c,...r}).slice(0,500));await p.screenshot({path:`/tmp/claude-0/-home-user/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/oyun-${name.replace(/\W+/g,"_")}.png`});return false}return true};
 /* rastgele tıklanabilir öğe: üstteki katmanda (yoksa #main) data-* özniteliği olan ya da button; kapatma/çıkış düğmeleri az seçilir */
 const monkey=async(name,n,sel,reopen)=>{let clicks=0,reopens=0;
  for(let i=0;i<n;i++){
   const r=rnd(),r2=rnd();
   const did=await p.evaluate(({sel,r,r2})=>{const ls=[...document.querySelectorAll("#overlay [data-layer]")];const top=ls[ls.length-1];const root=top||document.querySelector("#main");if(!root)return "yok";
    if(sel&&!document.querySelector(sel))return "kapandı";
    let c=[...root.querySelectorAll("button,[data-ok],[data-dr],[data-pt],[data-ab],[data-oki],[data-cq],[data-sq],[data-col],[data-k],[data-key],canvas,.sq,[data-i]")].filter(e=>{const rc=e.getBoundingClientRect();return rc.width>0&&rc.height>0&&!e.disabled&&getComputedStyle(e).visibility!=="hidden"&&getComputedStyle(e).pointerEvents!=="none"});
    if(!c.length)return "boş";
    const quit=e=>/^(menu|x|new)$/.test(e.dataset.ms||"")||/close|kapat|çık|quit|back|geri|vazgeç|teslim|menü|yeni oyun|baştan/i.test((e.dataset.act||"")+" "+(e.getAttribute("aria-label")||"")+" "+(e.textContent||"").slice(0,20));
    const nq=c.filter(e=>!quit(e));if(nq.length&&r2<.985)c=nq;
    const e=c[Math.floor(r*c.length)];const rc=e.getBoundingClientRect();
    if(e.tagName==="CANVAS"){const x=rc.left+rc.width*r2,y=rc.top+rc.height*((r*7)%1);for(const t of ["pointerdown","pointerup","click"])e.dispatchEvent(new PointerEvent(t,{bubbles:true,clientX:x,clientY:y,pointerId:1,pointerType:"mouse",isPrimary:true,button:0}));return "canvas"}
    e.click();return "ok"},{sel,r,r2});
   if(did==="kapandı"||did==="yok"){if(reopen&&reopens<6){reopens++;await p.evaluate(reopen);await p.waitForTimeout(600);continue}break}
   clicks++;await p.waitForTimeout(40+Math.floor(rnd()*120));
   if(i%40===39&&!(await look(name+" #"+i)))break}
  await p.waitForTimeout(400);const ok=await look(name+" son");console.log((ok?"ok   ":"     ")+name+": "+clicks+" dokunuş, "+reopens+" yeniden açma")};
 const masa=k=>p.evaluate(k=>{closeAll();msGo(M=>M.open(k))},k);
 for(const k of ["okey","renk","pisti","amiral"]){await masa(k);await p.waitForTimeout(900);await monkey("masa "+k,260,".ms",`()=>{closeAll();msGo(M=>M.open("${k}"))}`)}
 await p.evaluate(()=>{closeAll();msGo(M=>M.open())});await p.waitForTimeout(700);await monkey("masa menü",80,".ms",`()=>{closeAll();msGo(M=>M.open())}`);
 /* satranç: lobi + Rota'ya karşı oyun */
 await p.evaluate(()=>{closeAll();go("chess")});await p.waitForTimeout(700);await look("satranç lobi");
 await p.evaluate(()=>{const b=document.querySelector('[data-cgame],[data-act="chplay"],[data-cply]');if(b)b.click()});await p.waitForTimeout(900);
 await monkey("satranç oyun",200,null,null);
 await p.evaluate(()=>{closeAll();go("chess")});await p.waitForTimeout(500);
 await p.evaluate(()=>{closeAll();anGo({})});await p.waitForTimeout(1200);await monkey("analiz",150,".an,[data-layer=analiz]",`()=>{closeAll();anGo({})}`);
 await p.evaluate(()=>{closeAll();typeof pzOpen==="function"&&pzOpen(30)});await p.waitForTimeout(800);await monkey("bulmaca",100,null,null);
 /* sohbet oyunları */
 await p.evaluate(async()=>{closeAll();openChat("u:u2");await new Promise(r=>setTimeout(r,500));await new Promise(r=>ogGo(async O=>{await O.invite("u:u2","xox");r()}))});await p.waitForTimeout(800);
 const gid=await p.evaluate(()=>{const ks=Object.keys(JSON.parse(localStorage.kadraj_db||"{}")).filter(k=>/^games\/og-/.test(k));return ks.length?ks[ks.length-1].split("/")[1]:null});
 if(gid){for(const t of ["xox","c4","kel"]){const g=await p.evaluate(async t=>{closeAll();await new Promise(r=>ogGo(async O=>{await O.invite("u:u2",t);r()}));const db=JSON.parse(localStorage.kadraj_db||"{}");const ks=Object.keys(db).filter(k=>/^games\/og-/.test(k)).sort((a,b)=>(db[a].at||0)-(db[b].at||0));return ks[ks.length-1].split("/")[1]},t);
   await p.evaluate(g=>{closeAll();OYUNLAR.open(g)},g);await p.waitForTimeout(700);await monkey("sohbet "+t,90,null,null)}}
 else console.log("     sohbet oyunları: oyun belgesi bulunamadı (LocalDB biçimi farklı olabilir)");
 /* Cephe: tek kişilik savaşa gir, haritaya dokun */
 await p.evaluate(()=>{closeAll();cpGo(C=>C.open())});await p.waitForTimeout(1500);await monkey("cephe",140,"#cp",null);
 await p.evaluate(()=>{try{closeAll()}catch{}});await p.waitForTimeout(300);
 console.log("SORUN SAYISI",probs.length);await b.close()})();
