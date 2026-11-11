/* 7.0.29 İstiklal Marşı töreni: tarih kapısı, kendiliğinden (4 kişi), kurucu saati, uyarı şeridi, tören, geç katılma, yönetici bölümü. node t.js <genişlik> */
process.env.KBLOCK="/ses/istiklal.mp3"; /* bu test dosyasız (telefonun sesiyle) yolu dener; dosyalı yol v7114 */
const {open}=require('../m70/lib.js');const W=+process.argv[2]||390;let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
const OUT='/tmp/claude-0/-home-user/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/marsi/';require('fs').mkdirSync(OUT,{recursive:true});
(async()=>{const {b,p,errors}=await open(W,820);
 const setNow=ms=>p.evaluate(ms=>{const t0=Date.now();IM.today=()=>ms+(Date.now()-t0)},ms);
 const MON=Date.UTC(2027,3,5,7,0,0); /* 5 Nisan 2027 Pazartesi 10:00 TR */
 let s=await p.evaluate(()=>{imCheck();return{iv:!!IM.iv,run:IM.run,on:imOn(imNow()),m:!!window.MARSI}});ok(!s.iv&&!s.run&&!s.on&&!s.m,"bugün (2026) tören kapalı, zamanlayıcı ve dosya yok");
 await setNow(Date.UTC(2027,2,29,7,0,0));s=await p.evaluate(()=>{S.online=new Set(["u2","u3","u4"]);imCheck();return{on:imOn(imNow()),run:IM.run}});ok(!s.on&&!s.run,"29 Mart 2027 Pazartesi: henüz yok");
 await setNow(Date.UTC(2027,3,6,7,0,0));await p.evaluate(()=>{imCheck()});await p.waitForTimeout(300);s=await p.evaluate(async()=>({d:await DB.get("games/im-20270406"),day:imDay(imNow())}));ok(!s.d&&s.day==="20270406","6 Nisan Salı: kendiliğinden başlamaz");
 await setNow(Date.UTC(2027,3,5,20,30,0));await p.evaluate(()=>{imCheck()});await p.waitForTimeout(300);s=await p.evaluate(async()=>await DB.get("games/im-20270405"));ok(!s,"pazartesi 23:30: başlamaz");
 await setNow(MON);await p.evaluate(()=>{S.online=new Set(["u2","u3"]);imCheck()});await p.waitForTimeout(300);s=await p.evaluate(async()=>await DB.get("games/im-20270405"));ok(!s,"pazartesi 10:00, 3 kişi: başlamaz");
 await p.evaluate(()=>{S.online=new Set(["u2","u3","u4"]);imCheck()});await p.waitForTimeout(3600);
 s=await p.evaluate(async()=>({d:await DB.get("games/im-20270405"),ls:LS.get("kadraj_im"),n:imNow()}));const T=s.d&&s.d.t;ok(T&&T%60000===0&&T-s.n>=60000&&T-s.n<=131000&&s.ls&&s.ls.t===T&&s.ls.d==="20270405","4 kişi: games/im-20270405 yazıldı, "+Math.round((T-s.n)/1000)+" sn sonraya (tam dakika)");
 /* 63 sn kala: kur, şerit */
 await setNow(T-63500);await p.evaluate(()=>imCheck());await p.waitForFunction(()=>document.getElementById("imBar"),null,{timeout:8000});
 s=await p.evaluate(()=>{const b=document.getElementById("imBar"),r=b.getBoundingClientRect();return{t:b.textContent,l:r.left,r:r.right,top:r.top,vw:innerWidth}});ok(/1 dakika sonra okunacak/.test(s.t)&&s.l>=0&&s.r<=s.vw&&s.top<60,"üstte uyarı: "+s.t.replace(/\s+/g," "));
 await p.waitForTimeout(600);await p.screenshot({path:OUT+"bar-"+W+".png"});
 await setNow(T-2500);await p.waitForFunction(()=>document.querySelector('#overlay [data-layer="marsi"] .imc'),null,{timeout:8000});
 s=await p.evaluate(()=>({bar:!!document.getElementById("imBar"),sub:document.getElementById("imSub").textContent,flag:!!document.querySelector(".imflag svg")}));ok(!s.bar&&s.flag&&/Saygı duruşu/.test(s.sub),"tören açıldı: bayrak, saygı duruşu, şerit kalktı");
 await setNow(T+4500);await p.waitForTimeout(900);s=await p.evaluate(()=>document.getElementById("imLine").textContent);ok(/^Korkma, sönmez/.test(s),"1. satır: "+s);await p.screenshot({path:OUT+"line1-"+W+".png"});
 await setNow(T+4000+8000*4+500);await p.waitForTimeout(900);s=await p.evaluate(()=>({l:document.getElementById("imLine").textContent,sub:document.getElementById("imSub").textContent,ov:document.querySelector(".imc").scrollWidth-document.querySelector(".imc").clientWidth}));ok(/^Çatma, kurban olayım/.test(s.l)&&/2\. kıta/.test(s.sub)&&s.ov<=0,"5. satır (2. kıta): "+s.l);
 await setNow(T+4000+8000*8+500);await p.waitForTimeout(900);s=await p.evaluate(()=>document.getElementById("imLine").textContent);ok(/Ne mutlu/.test(s),"son: "+s);
 await setNow(T+4000+8000*8+5200);await p.waitForTimeout(1200);s=await p.evaluate(()=>({l:!!document.querySelector('#overlay [data-layer="marsi"]'),cur:!!MARSI._cur()}));ok(!s.l&&!s.cur,"bitince kendiliğinden kapandı");
 await p.evaluate(()=>imCheck());await p.waitForTimeout(600);ok(!(await p.evaluate(()=>!!document.querySelector('#overlay [data-layer="marsi"]')||!!document.getElementById("imBar"))),"aynı gün yeniden başlamaz");
 /* geç katılma + Kapat */
 await p.evaluate(()=>{IM.run=0});await setNow(T+21000);await p.evaluate(()=>imCheck());await p.waitForFunction(()=>document.querySelector('.imc'),null,{timeout:8000});await p.waitForTimeout(700);
 s=await p.evaluate(()=>document.getElementById("imLine").textContent);ok(/^O benim milletimin/.test(s),"21. saniyede açan kaldığı yerden katılır: "+s);
 await p.click("#imX");await p.waitForTimeout(500);await p.evaluate(()=>imCheck());await p.waitForTimeout(500);ok(!(await p.evaluate(()=>!!document.querySelector('.imc'))),"Kapat: kapanır, yeniden açılmaz");
 /* kurucu saati: ertesi pazartesi */
 const MON2=Date.UTC(2027,3,12,7,0,0);await setNow(MON2);
 await p.evaluate(()=>{S.online=new Set();closeAll();S.admin=true;go("admin")});await p.waitForTimeout(800);
 await p.evaluate(()=>{const h=document.querySelector("#admH-marsi");h&&h.click()});await p.waitForTimeout(500);
 s=await p.evaluate(()=>{const sec=document.getElementById("admS-marsi");return{sec:!!sec,txt:sec?sec.textContent.replace(/\s+/g," ").slice(0,140):"",now:!!(sec&&sec.querySelector("#imNowB")&&!sec.querySelector("#imNowB").disabled)}});ok(s.sec&&s.now&&/pazartesi/.test(s.txt),"Yönetici › İstiklal Marşı: "+s.txt.slice(0,80));
 await p.screenshot({path:OUT+"adm-"+W+".png"});
 await p.evaluate(()=>document.querySelector("#admS-marsi #imNowB").click());await p.waitForTimeout(1200);
 s=await p.evaluate(async()=>({d:await DB.get("admin/marsi"),n:imNow(),adm:S.adm&&S.adm.marsi&&S.adm.marsi.t}));const T2=s.d&&s.d.t;ok(T2&&T2-s.n>=55000&&T2-s.n<=131000&&s.adm===T2,"1 dakika sonra başlat: admin/marsi.t yazıldı ("+Math.round((T2-s.n)/1000)+" sn sonra)");
 await setNow(T2-61000);await p.evaluate(()=>imCheck());await p.waitForFunction(()=>document.getElementById("imBar"),null,{timeout:8000});ok(true,"kurucunun saatiyle uyarı çıktı (kimse açık değilken de)");
 await p.evaluate(()=>document.querySelector("#admS-marsi #imOffB")&&document.querySelector("#admS-marsi #imOffB").click());await p.waitForTimeout(900);
 s=await p.evaluate(async()=>({bar:!!document.getElementById("imBar"),t:(await DB.get("admin/marsi")).t}));ok(!s.bar&&!s.t,"İptal et: uyarı kalktı, saat silindi");
 /* tarihten önce: düğmeler kapalı, önizleme çalışır */
 await p.evaluate(()=>{IM.today=null;render(true)});await p.waitForTimeout(600);await p.evaluate(()=>{const h=document.querySelector("#admH-marsi");const sec=document.getElementById("admS-marsi");if(!sec||sec.hidden)h&&h.click()});await p.waitForTimeout(400);
 s=await p.evaluate(()=>{const sec=document.getElementById("admS-marsi");return sec?{dis:sec.querySelector("#imNowB").disabled&&sec.querySelector("#imSetB").disabled,txt:/31 Mart 2027/.test(sec.textContent),prev:!!sec.querySelector("#imPrevB")}:{}});ok(s.dis&&s.txt&&s.prev,"bugün (2026): başlatma kapalı, önizleme var");
 ok(errors.length===0,"sayfa hatası yok "+errors.join(" | "));console.log(pass+"/"+(pass+fail));await b.close()})().catch(e=>{console.error(e);process.exit(1)});
