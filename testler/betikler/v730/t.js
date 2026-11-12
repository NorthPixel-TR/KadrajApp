// 7.3.0 yeni tanıtım sayfası: resimler yüklenir, taşma yok, sürüm etiketi, Zirve sayacı, kaydırınca belirme, hareket azaltılmış, dış istek yok, uygulamadan açılır.
// node t.js  (390, 360 ve 1280 genişlikte dener)
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const ROOT='/home/user/kadrajapp',BASE='http://kadraj.test/',O='/tmp/claude-0/-home-user/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/';let pass=0,fail=0;const ok=(c,m)=>{console.log((c?"OK  ":"FAIL")+" "+m);c?pass++:fail++};
async function page(b,W,H,rm){const ctx=await b.newContext({viewport:{width:W,height:H},reducedMotion:rm?"reduce":"no-preference",hasTouch:W<700});const p=await ctx.newPage();const errors=[],ext=[];p.on('pageerror',e=>errors.push(e.message));
 await p.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE)){let q=decodeURIComponent(new URL(u).pathname);if(q==='/')q='/index.html';const f=path.join(ROOT,q);if(fs.existsSync(f)&&fs.statSync(f).isFile())return r.fulfill({body:fs.readFileSync(f),contentType:q.endsWith('.html')?'text/html; charset=utf-8':undefined});return r.fulfill({status:404,body:''})}if(u.startsWith('data:'))return r.continue();ext.push(u);return r.abort()});
 await p.goto(BASE+'tanitim.html');await p.waitForTimeout(1600);return{p,errors,ext,ctx}}
(async()=>{const b=await chromium.launch();
 for(const [W,H] of [[390,844],[360,740],[1280,800]]){const {p,errors,ext}=await page(b,W,H,false);
  let r=await p.evaluate(()=>({sw:document.documentElement.scrollWidth-innerWidth,ver:document.getElementById("ver").hidden?"":document.getElementById("ver").textContent,cd:document.getElementById("cdD").textContent,font:document.fonts.check("800 20px 'Plus Jakarta Sans'"),h1:getComputedStyle(document.querySelector(".hero h1")).fontFamily}));
  ok(r.sw<=0,W+": yatay taşma yok ("+r.sw+")");ok(/Şimdi: Kadraj 4\.\d+\.\d+/.test(r.ver),W+": sürüm etiketi "+r.ver);ok(+r.cd>=0&&r.cd!=="-",W+": Zirve sayacı "+r.cd+" gün");ok(r.font&&/Plus Jakarta/.test(r.h1),W+": yazı tipi yerel Plus Jakarta Sans");
  await p.screenshot({path:O+"tn-hero-"+W+".png"});
  ok(await p.evaluate(()=>document.querySelectorAll(".f .rv.on").length===0),W+": aşağıdaki bölümler henüz gizli");
  // aşağı kaydır, hepsi belirsin ve resimler yüklensin
  for(let y=0;y<16000;y+=500){await p.mouse.wheel(0,500);await p.waitForTimeout(60)}await p.waitForTimeout(1200);
  r=await p.evaluate(()=>({rv:document.querySelectorAll(".rv").length,on:document.querySelectorAll(".rv.on").length,img:[...document.images].map(i=>[i.getAttribute("src"),i.complete&&i.naturalWidth])}));
  ok(r.on===r.rv,W+": kaydırınca bütün bölümler belirdi ("+r.on+"/"+r.rv+")");const bad=r.img.filter(x=>!x[1]);ok(r.img.length>=12&&!bad.length,W+": "+r.img.length+" resim yüklendi "+bad.map(x=>x[0]).join(","));
  const s1=await p.evaluate(()=>document.getElementById("cdS").textContent);await p.waitForTimeout(1100);const s2=await p.evaluate(()=>document.getElementById("cdS").textContent);ok(s1!==s2,W+": sayaç saniye saniye işliyor");
  ok(!ext.length,W+": dışarıya istek yok "+ext.slice(0,2).join(","));ok(!errors.length,W+": sayfa hatası yok "+errors.join("|"));
  await p.screenshot({path:O+"tn-full-"+W+".png",fullPage:true})}
 // hareket azaltılmış: her şey hemen görünür
 {const {p}=await page(b,390,844,true);const r=await p.evaluate(()=>{const e=document.querySelector(".f .rv");return{op:getComputedStyle(e).opacity,dot:getComputedStyle(document.querySelector(".logo .dot")).opacity}});ok(r.op==="1"&&r.dot==="1","hareket azaltılmışken bölümler ve logo hemen görünür")}
 // bağlantılar
 {const {p}=await page(b,390,844,false);const r=await p.evaluate(()=>[...document.querySelectorAll("a[href]")].map(a=>a.getAttribute("href")));ok(r.every(h=>h==="./"||h==="kadraj.apk"),"bağlantılar yalnızca uygulama ve APK: "+[...new Set(r)].join(","));
  const fs2=require('fs');ok(['akis','kesfet','profil','oyunlar','satranc','sohbet','yolculuk','kosu','klaket'].every(n=>fs2.existsSync(ROOT+'/tanitim/'+n+'.jpg')),"9 yeni ekran görüntüsü depoda")}
 console.log(pass+"/"+(pass+fail));await b.close()})();
