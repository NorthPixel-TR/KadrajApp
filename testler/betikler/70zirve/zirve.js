/* 7.0 Zirve: node zirve.js <genişlik> [koyu] */
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const HTML='/home/user/kadrajapp/.claude/worktrees/agent-a814d3297f0c28720/index.html',BASE='http://kadraj.test/';const W=+process.argv[2]||390;const DARK=process.argv[3]==="koyu";
const SH='/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/70ZIRVE/shots/';
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:W,height:860},colorScheme:DARK?'dark':'light'});const p=await ctx.newPage();
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.route('**/*',r=>{const u=r.request().url();
  if(u.startsWith(BASE)){const q=decodeURIComponent(new URL(u).pathname);if(q==='/'||q==='/index.html')return r.fulfill({body:fs.readFileSync(HTML),contentType:'text/html; charset=utf-8'});
  const f=path.join(path.dirname(HTML),q);if(fs.existsSync(f)&&fs.statSync(f).isFile())return r.fulfill({body:fs.readFileSync(f)});return r.fulfill({status:404,body:''})}
  if(u.startsWith('data:')||u.startsWith('blob:'))return r.continue();return r.abort()});
 await p.goto(BASE+'index.html');await p.waitForTimeout(1500);
 const D=s=>`ZIRVE.today=()=>new Date("${s}")`;
 await p.evaluate(async()=>{if(S.mode!=="local"||!DB)await bootLocal();const T=Date.now();
  for(const [uid,name,un] of [["u1","Bilal Kara","bilal"],["u2","Ayşe Yılmaz","ayse"]])await DB.set("profiles/"+uid,{uid,username:un,name,bio:"",avatar:null,following:{u1:1,u2:1},botFollowers:{},private:false,createdAt:Date.UTC(2026,2,12)});
  await DB.set("posts/p2",{uid:"u1",at:T-4e5,kind:"note",text:"Selam",bg:0,caption:"ilk"});
  ZIRVE.today=()=>new Date("2026-11-04T15:20:00+03:00");S.uid="u1";LS.set("kadraj_session","u1");await enterApp(false)});
 await p.waitForTimeout(900);await p.evaluate(()=>closeAll());await p.evaluate(()=>tab("feed"));await p.waitForTimeout(500);
 /* 1. geri sayım kartı */
 let r=await p.evaluate(()=>{const c=document.querySelector(".zrc");const st=document.querySelector("#main .stories");return c&&{t:c.querySelector(".t>b").textContent,cd:c.querySelector("[data-zrcd]").textContent,after:!!st&&st.nextElementSibling===c,me:c.querySelector(".zr-me").getAttribute("cx"),w:c.getBoundingClientRect().width,sw:document.documentElement.scrollWidth}});
 ok(r&&/Zirve'ye 147 gün/.test(r.t)&&/146gün8saat40dk/.test(r.cd),"4 Kasım 15:20'de geri sayım 147 gün (146 gün 8 saat 40 dk) "+JSON.stringify(r));
 ok(r&&r.after&&r.me&&r.sw<=W,"kart hikâye şeridinin altında, tırmanan nokta yerinde, yatay taşma yok");
 await p.screenshot({path:SH+`zr_card_${W}${DARK?"_d":""}.png`});
 /* kaydırma sabitlemesi: yeniden çizimde kart yer değiştirmesin */
 r=await p.evaluate(async()=>{const m=$("#main");m.scrollTop=300;const a=m.scrollTop;render(false);await new Promise(z=>setTimeout(z,50));return[a,m.scrollTop]});ok(r[0]===r[1],"yeniden çizimde kaydırma yerinde "+r);
 /* kapat → bugün çıkmaz */
 await p.evaluate(()=>{$("#main").scrollTop=0;document.querySelector(".zrc [data-zrx]").click()});await p.evaluate(()=>render(false));
 ok(await p.evaluate(()=>!document.querySelector(".zrc")),"kapatılınca bugün çıkmıyor");
 await p.evaluate(()=>{ZIRVE.today=()=>new Date("2026-11-05T09:00:00+03:00");render(false)});ok(await p.evaluate(()=>!!document.querySelector(".zrc")),"ertesi gün yeniden çıkıyor");
 /* 30 Mart */
 await p.evaluate(()=>{ZIRVE.today=()=>new Date("2027-03-30T22:30:00+03:00");render(false)});
 r=await p.evaluate(()=>document.querySelector(".zrc .t>b").textContent+"|"+document.querySelector(".zrc [data-zrcd]").textContent);ok(/Yarın Zirve günü/.test(r)&&/0gün1saat30dk/.test(r),"30 Mart 22:30: yarın, 1 saat 30 dk "+r);
 /* 2. mektup: yaz, mühürle, kilitli */
 await p.evaluate(()=>zrLetter());await p.waitForTimeout(400);
 await p.fill("#zrTa","Merhaba gelecekteki ben, <b>LGS</b> nasıl geçti?");await p.evaluate(()=>{const g=document.querySelectorAll("[data-zrg]");g[0].value="Kitap oku";g[1].value="Yüzme öğren"});
 await p.evaluate(()=>document.getElementById("zrGo").click());await p.waitForTimeout(700);
 r=await p.evaluate(async()=>{const d=await DB.get("data/users/u1/zirve");const l=document.querySelector('[data-layer="zirve"]');return{d,txt:l.textContent,hasTa:!!l.querySelector("#zrTa"),goals:l.querySelectorAll(".zr-g").length}});
 ok(r.d&&/LGS/.test(r.d.text)&&r.d.goals.length===2&&!r.d.opened,"mektup data/users/u1/zirve'ye kaydedildi "+JSON.stringify(r.d).slice(0,120));
 ok(/mühürlü/.test(r.txt)&&!/LGS/.test(r.txt)&&!r.hasTa&&r.goals===2,"Zirve'den önce mühürlü: yazı görünmüyor, hedefler görünüyor");
 await p.screenshot({path:SH+`zr_sealed_${W}${DARK?"_d":""}.png`});
 await p.evaluate(()=>document.querySelector('[data-zrgo="0"]').click());await p.waitForTimeout(300);
 ok(await p.evaluate(async()=>(await DB.get("data/users/u1/zirve")).goals[0].ok===1),"hedef işaretlendi ve kaydedildi");
 await p.evaluate(()=>closeAll());
 /* okuma bütçesi: Zirve'den önce açılışta mektup okunmaz */
 const reads=await p.evaluate(async()=>{let n=0;const g=DB.get;DB.get=function(x){if(/zirve/.test(x))n++;return g.apply(this,arguments)};runHooks("enter",false);tab("feed");await new Promise(z=>setTimeout(z,400));DB.get=g;return n});ok(reads===0,"Zirve'den önce açılışta mektup okunmuyor ("+reads+")");
 /* 3. 31 Mart: kutlama, rozet, Rota, mektup açılır */
 await p.evaluate(()=>{ZIRVE.today=()=>new Date("2027-03-31T08:15:00+03:00");LS.del("kadraj_zrcel_u1");LS.del("kadraj_zrlt_u1");ZIRVE.cel=0;ZIRVE.lq=0;ZIRVE.wr=0;zrBotPost();runHooks("enter",false)});
 await p.waitForTimeout(1200);
 r=await p.evaluate(()=>({cel:!!document.querySelector('[data-layer="zirvecel"] .zr-cel'),txt:(document.querySelector(".zr-ct")||{}).textContent,fw:document.querySelectorAll(".zr-fw").length,z:!!(S.profiles.u1||{}).zirve,rota:BOT_POSTS.some(x=>x.id==="zirve-2027")}));
 ok(r.cel&&/Zirve'desin/.test(r.txt)&&r.fw===5,"31 Mart açılışta kutlama (havai fişek) "+JSON.stringify(r).slice(0,140));
 ok(r.z&&await p.evaluate(async()=>(await DB.get("profiles/u1")).zirve===1),"profiles.zirve=1 yazıldı");ok(r.rota,"Rota'nın Zirve paylaşımı");
 await p.waitForTimeout(1600);await p.screenshot({path:SH+`zr_cel_${W}${DARK?"_d":""}.png`});
 await p.waitForTimeout(3200);r=await p.evaluate(()=>document.getAnimations().filter(a=>a.playState==="running").map(a=>(a.animationName||"waapi")+"@"+String(a.effect.target.getAttribute&&a.effect.target.getAttribute("class"))).join(","));ok(!r,"animasyonlar bitti (sonsuz yok) "+r);
 await p.evaluate(()=>document.querySelector("[data-zrcl]").click());await p.waitForTimeout(500);
 r=await p.evaluate(()=>({t:(document.querySelector(".zr-tx")||{}).innerHTML||"",env:!!document.querySelector(".zr-env.open")}));ok(/LGS/.test(r.t)&&/&lt;b&gt;/.test(r.t)&&r.env,"mektup açıldı, HTML kaçırılmış "+r.t.slice(0,60));
 await p.waitForTimeout(900);await p.screenshot({path:SH+`zr_letter_${W}${DARK?"_d":""}.png`});
 ok(await p.evaluate(async()=>!!(await DB.get("data/users/u1/zirve")).opened),"opened yazıldı");await p.evaluate(()=>closeAll());
 await p.evaluate(()=>{closeAll();ZIRVE.cel=0;runHooks("enter",false)});await p.waitForTimeout(900);ok(await p.evaluate(()=>!document.querySelector('[data-layer="zirvecel"]')),"kutlama o gün bir kez");
 await p.evaluate(()=>go("profile",{uid:"u1"}));await p.waitForTimeout(500);ok(await p.evaluate(()=>/Zirve'deydim/.test((document.querySelector(".zrbadge")||{}).textContent||"")),"profilde Zirve'deydim rozeti");
 await p.evaluate(()=>tab("feed"));await p.waitForTimeout(300);ok(await p.evaluate(()=>document.querySelector(".zrc.day")&&/Zirve'deyiz/.test(document.querySelector(".zrc").textContent)),"Akış'ta Zirve günü kartı");
 await p.screenshot({path:SH+`zr_day_${W}${DARK?"_d":""}.png`});
 /* Zirve teması */
 await p.evaluate(()=>zrTheme());await p.waitForTimeout(300);r=await p.evaluate(()=>({a:document.documentElement.getAttribute("data-accent"),s:settings.accent}));ok(r.a==="zirve"&&r.s==="zirve","Zirve teması açıldı "+JSON.stringify(r));
 await p.evaluate(()=>tab("settings"));await p.waitForTimeout(400);ok(await p.evaluate(()=>!!document.querySelector('.accg [data-v="zirve"]')&&!!document.querySelector('#k70Z [data-zrth]')),"Ayarlar'da Zirve teması seçilebilir");
 await p.evaluate(()=>zrTheme());
 /* 1 Nisan: kutlama yok, rozet kalır, açılmamış mektup kartı */
 await p.evaluate(async()=>{ZIRVE.today=()=>new Date("2027-04-01T10:00:00+03:00");await DB.update("data/users/u1/zirve",{opened:0});LS.del("kadraj_zrlt_u1");LS.del("kadraj_zrcel_u1");ZIRVE.cel=0;ZIRVE.lq=0;runHooks("enter",false);tab("feed")});
 await p.waitForTimeout(900);await p.evaluate(()=>render(false));await p.waitForTimeout(200);
 r=await p.evaluate(()=>({cel:!!document.querySelector('[data-layer="zirvecel"]'),card:(document.querySelector(".zrc")||{}).textContent||""}));ok(!r.cel&&/Geçmişten bir mektubun var/.test(r.card),"1 Nisan: kutlama yok, açılmamış mektup kartı "+JSON.stringify(r).slice(0,100));
 /* 4. yönetici önizlemesi (bugün 4 Kasım 2026) */
 await p.evaluate(()=>{ZIRVE.today=()=>new Date("2026-11-04T15:20:00+03:00");const i=BOT_POSTS.findIndex(x=>x.id==="zirve-2027");if(i>=0)BOT_POSTS.splice(i,1);LS.del("kadraj_zrc_u1");delete S.profiles.u1.zirve});await p.evaluate(()=>DB.update("profiles/u1",{zirve:0}));
 r=await p.evaluate(()=>{const e=ADM_EXTRA.find(x=>x.id==="zirve");if(!e)return null;const d=document.createElement("div");d.innerHTML=e.html();document.body.appendChild(d);e.wire(d);d.querySelector('[data-zrp="day"]').click();const o={c:e.count()};d.remove();return o});
 await p.waitForTimeout(900);r={...r,cel:await p.evaluate(()=>!!document.querySelector('[data-layer="zirvecel"]')),card:await p.evaluate(()=>!!document.querySelector(".zrc.day")),z:await p.evaluate(async()=>!!(await DB.get("profiles/u1")).zirve)};
 ok(r.cel&&r.card&&!r.z,"önizleme: kutlama ve gün kartı, hiçbir şey yazılmadı "+JSON.stringify(r));
 await p.evaluate(()=>{closeAll();zrLetter()});await p.waitForTimeout(500);ok(await p.evaluate(()=>/LGS/.test((document.querySelector(".zr-tx")||{}).textContent||"")),"önizlemede mektup açılışı");
 r=await p.evaluate(async()=>(await DB.get("data/users/u1/zirve")).opened);ok(!r,"önizleme opened yazmadı");
 await p.evaluate(()=>{closeAll();const e=ADM_EXTRA.find(x=>x.id==="zirve");const d=document.createElement("div");d.innerHTML=e.html();document.body.appendChild(d);e.wire(d);d.querySelector('[data-zrp="off"]').click();d.remove()});await p.waitForTimeout(400);
 ok(await p.evaluate(()=>!ZIRVE.prev&&!BOT_POSTS.some(x=>x.id==="zirve-2027")&&!document.querySelector(".zrc.day")),"önizleme kapandı");
 /* ayrıntılı geri sayım */
 await p.evaluate(()=>zrInfo());await p.waitForTimeout(1300);r=await p.evaluate(()=>{const e=document.querySelector('[data-layer="zrinfo"] [data-zrcd]');return{t:e&&e.textContent,s:document.querySelector('[data-layer="zrinfo"]').textContent}});
 ok(/sn/.test(r.t)&&/Kadraj'daki ilk günün/.test(r.s)&&/12 Mart 2026/.test(r.s),"ayrıntılı geri sayım saniyeli, ilk gün "+r.t);
 await p.screenshot({path:SH+`zr_info_${W}${DARK?"_d":""}.png`});await p.evaluate(()=>closeAll());
 await p.evaluate(()=>tab("settings"));await p.waitForTimeout(400);ok(await p.evaluate(()=>!!document.querySelector('.sg[data-g="yardim"] #k70Z')),"Ayarlar › Yardım ve hakkında'da Zirve");
 ok(!errors.length,"sayfa hatası yok "+errors.join(" | "));
 console.log(`\n${pass} geçti, ${fail} kaldı`);await b.close();process.exit(fail?1:0)})();
