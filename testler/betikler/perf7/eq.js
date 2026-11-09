/* 7.0.15 doğruluk: yerinde güncelleme (morph) taze çizimle aynı sayfayı veriyor mu, dinleyici çoğalıyor mu, yer tutucu sızıyor mu */
const {open}=require('../m70/lib');const W=+process.argv[2]||390;
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
(async()=>{const {b,p,errors}=await open(W);const cdp=await p.context().newCDPSession(p);
 await p.evaluate(async()=>{const T=Date.now();const img=(c)=>{const cv=document.createElement('canvas');cv.width=400;cv.height=400;const g=cv.getContext('2d');for(let i=0;i<300;i++){g.fillStyle=`hsl(${Math.random()*360},60%,50%)`;g.fillRect(Math.random()*400,Math.random()*400,30,30)}return cv.toDataURL('image/jpeg',.9)};
  for(let i=0;i<12;i++)await DB.set('posts/eq'+i,{uid:'u'+(1+i%5),at:T-i*3600e3,kind:i===3?'note':'photo',src:img(),more:i===1?[img(),img()]:undefined,text:'not',bg:0,caption:'Paylaşım '+i+' #kadraj @ayse'})});
 const norm=()=>p.evaluate(()=>{const m=$("#main");const c=m.cloneNode(true);for(const e of c.querySelectorAll("*")){e.classList.remove("k6-ld","kpop","in","k6-in","enter");if(!e.classList.length)e.removeAttribute("class");e.removeAttribute("style")}return [...c.children].filter(x=>!/zrc|gqc|gnc|bdc|memc|qmb|kpc/.test(x.className)).map(x=>x.outerHTML)});
 const leak=()=>p.evaluate(()=>{let n=0;for(const e of document.querySelectorAll("*"))for(const a of e.attributes)if(a.value.indexOf("kdu7015x")>=0)n++;return n});
 const lis=async()=>{const {result}=await cdp.send('Runtime.evaluate',{expression:'document.querySelector("#main")'});let tot=0;
  const {result:arr}=await cdp.send('Runtime.evaluate',{expression:'[document.querySelector("#main"),...document.querySelectorAll("#main *")]'});
  const {result:props}=await cdp.send('Runtime.getProperties',{objectId:arr.objectId,ownProperties:true});
  for(const pr of props){if(!/^\d+$/.test(pr.name))continue;const {listeners}=await cdp.send('DOMDebugger.getEventListeners',{objectId:pr.value.objectId});tot+=listeners.length}return tot};
 for(const pg of ["feed","explore","profile"]){
  await p.evaluate(pg=>{closeAll();pg==="profile"?go("profile",{uid:"u2"}):tab(pg)},pg);await p.waitForTimeout(1200);
  const L0=await lis();
  /* veri değişiklikleri + yenilemeler */
  await p.evaluate(async()=>{await setMeta("eq0",{likes:{u3:Date.now()}});await setMeta("eq2",{comments:{c1:{uid:"u2",text:"güzel",at:Date.now()}}})});
  for(let i=0;i<6;i++){await p.evaluate(()=>refresh());await p.waitForTimeout(120)}
  await p.waitForTimeout(400);
  const A=await norm();const L1=await lis();ok(await leak()===0,pg+": yer tutucu sızmıyor");
  /* taze çizim */
  await p.evaluate(()=>{$("#main")._kr=null;render(false)});await p.waitForTimeout(400);const B=await norm();const L2=await lis();
  const same=A.length===B.length&&A.every((x,i)=>x===B[i]);let d="";if(!same){for(let i=0;i<Math.max(A.length,B.length);i++)if(A[i]!==B[i]){const a=A[i]||"",bb=B[i]||"";let k=0;while(k<a.length&&a[k]===bb[k])k++;d=`#${i} ${a.slice(Math.max(0,k-80),k+60)} ||| ${bb.slice(Math.max(0,k-80),k+60)}`;break}}
  ok(same,pg+": yerinde güncelleme taze çizimle aynı ("+A.length+" parça) "+d);
  ok(L1<=Math.max(L0,L2)+2,pg+": dinleyici çoğalmıyor (yerinde "+L1+", taze "+L2+", başta "+L0+")");
 }
 /* beğeni sayısı karta yansıyor mu, resimler gerçek data adresi mi */
 await p.evaluate(()=>{closeAll();tab("feed")});await p.waitForTimeout(800);
 const r=await p.evaluate(async()=>{const c=document.querySelector('article.card[data-pid="eq4"]');const before=c&&c.querySelector(".k70-lk")?.textContent||"";await setMeta("eq4",{likes:{u2:Date.now(),u3:Date.now()}});refresh();await new Promise(r=>setTimeout(r,300));const c2=document.querySelector('article.card[data-pid="eq4"]');
  const im=c2&&c2.querySelector("img[src^='data:image/jpeg']");return {before,after:c2&&c2.querySelector(".k70-lk")?.textContent||"",img:!!im,imgOk:im?im.complete&&im.naturalWidth>0:false}});
 ok(/beğen/.test(r.after)&&r.after!==r.before,"beğeni karta yansıdı: "+r.after);ok(r.img,"kart resmi gerçek data adresi");
 await p.waitForTimeout(500);ok(await p.evaluate(()=>{const im=document.querySelector('article.card[data-pid="eq4"] img[src^="data:image/jpeg"]');return !!im&&im.naturalWidth>0}),"resim yüklendi");
 /* kaydırırken yenileme ertelenir, sonra yapılır */
 const dz=await p.evaluate(async()=>{let n=0;const f=renderDock;renderDock=function(...a){n++;return f.apply(this,a)};const m=$("#main");m.dispatchEvent(new Event("scroll"));refresh();const a=n;await new Promise(r=>setTimeout(r,700));renderDock=f;return [a,n]});
 ok(dz[0]===0&&dz[1]>=1,"kaydırırken ertelendi, sonra yapıldı "+dz);
 ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),"taşma yok");
 ok(errors.length===0,"sayfa hatası yok "+errors.join(" | "));console.log(pass+"/"+(pass+fail));await b.close()})();
