/* 70UI animasyon kareleri: node anim.js <outdir> <w> <light|dark> <vizor|klasik> */
const sd=require('/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/a60ui/seed.js');
const HTML=process.env.KADRAJ_HTML||'/home/user/Kadraj/.claude/worktrees/agent-a9f158a676dc2d78c/index.html';
const [,,OUT,W,TH,UI]=process.argv;const H=+W>600?1000:844;
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
(async()=>{const {page:p,errors,close}=await sd.open(HTML,{width:+W,height:H,dark:TH==="dark",ui:UI});
 const tag=`${W}${TH[0]}${UI[0]}`;
 await p.evaluate(()=>{settings.anim="akici";k69Apply()});
 const frames=async(name,ts)=>{let t0=Date.now();for(const t of ts){const w=t-(Date.now()-t0);if(w>0)await p.waitForTimeout(w);await p.screenshot({path:`${OUT}/${name}_${tag}_${t}.png`})}};
 /* ayarlar grubu */
 await p.evaluate(()=>go("settings"));await p.waitForTimeout(900);
 const hb=await p.evaluate(()=>{const g=document.querySelector('.sg[data-g="gorunum"]');return{h:g.getBoundingClientRect().height,b:g.querySelector(".sg-b").getBoundingClientRect().height}});
 await p.evaluate(()=>document.querySelector('.sg[data-g="gorunum"] .sg-h').click());
 const mid=[];for(let i=0;i<6;i++){await p.waitForTimeout(70);mid.push(await p.evaluate(()=>Math.round(document.querySelector('.sg[data-g="gorunum"] .sg-b').getBoundingClientRect().height)))}
 await p.waitForTimeout(500);const full=await p.evaluate(()=>Math.round(document.querySelector('.sg[data-g="gorunum"] .sg-b').getBoundingClientRect().height));
 ok(hb.b<1&&full>150&&mid.some(x=>x>5&&x<full-5),"ayarlar grubu yumuşak açılıyor "+JSON.stringify({kapali:hb.b,ara:mid,tam:full}));
 await p.evaluate(()=>document.querySelector('.sg[data-g="gorunum"] .sg-h').click());
 await frames("sgclose",[0,120,260,600]);
 const cl=await p.evaluate(()=>Math.round(document.querySelector('.sg[data-g="gorunum"] .sg-b').getBoundingClientRect().height));ok(cl<1,"grup kapanınca yükseklik 0 ("+cl+")");
 await p.evaluate(()=>{document.querySelector('.sg[data-g="hesap"] .sg-h').click()});await frames("sgopen",[60,160,280,700]);
 /* arama: hepsi açık */
 await p.evaluate(()=>{const q=document.getElementById("setQ");q.value="tema";q.dispatchEvent(new Event("input",{bubbles:true}))});await p.waitForTimeout(500);
 const sq=await p.evaluate(()=>({sgq:document.getElementById("main").classList.contains("sgq"),vis:[...document.querySelectorAll("#main .sg:not([hidden]) .sg-b")].map(b=>Math.round(b.getBoundingClientRect().height))}));
 ok(sq.sgq&&sq.vis.length&&sq.vis.every(h=>h>20),"ayarlar araması grupları açık gösteriyor "+JSON.stringify(sq));
 await p.screenshot({path:`${OUT}/setsearch_${tag}.png`});
 await p.evaluate(()=>{const q=document.getElementById("setQ");q.value="";q.dispatchEvent(new Event("input",{bubbles:true}))});await p.waitForTimeout(300);
 /* hikâye */
 await p.evaluate(()=>tab("feed"));await p.waitForTimeout(900);
 await p.evaluate(()=>{const b=[...document.querySelectorAll(".stories [data-story]")].find(x=>x.dataset.story==="u2");b.click()});
 const svc=await p.evaluate(()=>{const s=document.querySelector("#overlay .sv");return s&&{c:s.className,an:getComputedStyle(s).animationName}});
 ok(svc&&/k70-svin/.test(svc.c)&&svc.an==="k70SvIn","hikâye sağdan açılıyor "+JSON.stringify(svc));
 await frames("svopen",[40,140,260,600]);
 const tr=await p.evaluate(()=>getComputedStyle(document.querySelector("#overlay .sv")).transform);ok(tr==="none","açılış bitince yerinde ("+tr+")");
 /* son hikâyede ileri: sıradaki kişiye küp */
 await p.evaluate(()=>{document.getElementById("svNext").click()});
 await frames("svcube",[30,130,250,600]);
 const nu=await p.evaluate(()=>{const l=document.querySelector('#overlay [data-layer="story"]');return l&&l.querySelector(".shd .n").firstChild.textContent});
 ok(nu==="mert","ileri dokununca sıradaki kişi (mert) "+nu);
 /* ilk hikâyede geri: önceki kişi */
 await p.evaluate(()=>{document.getElementById("svPrev").click()});await p.waitForTimeout(700);
 const pv=await p.evaluate(()=>{const l=document.querySelector('#overlay [data-layer="story"]');return l&&l.querySelector(".shd .n").firstChild.textContent});ok(pv==="ayse","geri dokununca önceki kişi (ayse) "+pv);
 /* aşağı kaydır: kapanır */
 const box=await p.evaluate(()=>{const r=document.querySelector("#overlay .sv .img").getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/3}});
 await p.mouse.move(box.x,box.y);await p.mouse.down();for(let i=1;i<=8;i++){await p.mouse.move(box.x,box.y+i*25);await p.waitForTimeout(16)}
 await p.screenshot({path:`${OUT}/svdrag_${tag}.png`});await p.mouse.up();
 await frames("svclose",[30,150,300]);await p.waitForTimeout(400);
 ok(await p.evaluate(()=>!document.querySelector('#overlay [data-layer="story"]')),"aşağı kaydırınca hikâye kapandı");
 /* kapat düğmesi: kopyası kayarak söner */
 await p.evaluate(()=>{const b=[...document.querySelectorAll(".stories [data-story]")].find(x=>x.dataset.story==="u5");b.click()});await p.waitForTimeout(700);
 await p.evaluate(()=>document.querySelector('#overlay .sv [data-act="close"]').click());
 ok(await p.evaluate(()=>!!document.querySelector("#k70Gh .k70-svout .sv")&&!document.querySelector('#overlay [data-layer="story"]')),"kapanış kopyası kayıyor");
 await p.waitForTimeout(700);ok(await p.evaluate(()=>!document.querySelector("#k70Gh .k70-gw")),"kopya temizlendi");
 /* pencere */
 await p.evaluate(()=>postMenu("p1"));await frames("sheet",[40,150,400]);await p.evaluate(()=>closeAll());await p.waitForTimeout(400);
 /* kart: beğenenler */
 await p.evaluate(()=>tab("feed"));await p.waitForTimeout(800);
 const lk=await p.evaluate(()=>{const b=document.querySelector('[data-k70lk="p1"]');return b&&b.textContent});ok(/beğendi|beğenme/.test(lk||""),"beğeni satırı: "+lk);
 await p.evaluate(()=>document.querySelector('[data-k70lk="p1"]').click());await p.waitForTimeout(500);
 ok(await p.evaluate(()=>document.querySelectorAll('#overlay .k70-lkl .row').length>=2),"Beğenenler penceresi");await p.evaluate(()=>closeAll());await p.waitForTimeout(300);
 ok(await p.evaluate(()=>{const c=document.querySelector('article.card[data-pid="p1"]');return !!c.querySelector(".k70-tm")&&!!c.querySelector(".k70-add")&&!c.querySelector('[data-like] span')}),"kartta zaman, yorum ekle, sayısız kalp");
 /* çift dokunma kalbi */
 await p.evaluate(()=>{const m=document.querySelector('article.card[data-pid="p2"] [data-dbl],article.card[data-pid="p5"] [data-dbl]');m.scrollIntoView();burst(m)});await frames("heart",[60,200,500]);
 /* taşma */
 for(const r of ["feed","explore","profile","activity","settings"]){await p.evaluate(r=>r==="profile"?tab("profile"):r==="settings"?go("settings"):tab(r),r);await p.waitForTimeout(600);
  const ov=await p.evaluate(()=>({d:document.documentElement.scrollWidth>innerWidth,m:$("#main").scrollWidth>$("#main").clientWidth+1,bad:[...document.querySelectorAll("#main *")].filter(e=>{const b=e.getBoundingClientRect();return b.width&&b.right>innerWidth+1&&!(()=>{for(let a=e.parentElement;a&&a.id!=="main";a=a.parentElement){const o=getComputedStyle(a).overflowX;if(o!=="visible")return true}return false})()}).slice(0,3).map(e=>e.className+"|"+Math.round(e.getBoundingClientRect().right))}));
  ok(!ov.d&&!ov.m&&!ov.bad.length,r+" taşma yok "+JSON.stringify(ov))}
 ok(!errors.length,"sayfa hatası yok "+errors.slice(0,3).join(" | "));
 console.log(tag,pass+"/"+(pass+fail));await close();process.exit(fail?1:0)})();
