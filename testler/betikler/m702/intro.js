/* 7.0 Zirve: açılış animasyonu ve açılış emniyeti. node intro.js [kök] */
const {chromium}=require('playwright');const fs=require('fs');
const FK='/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/fbsdk/fake/';
const R=(process.argv[2]||'/home/user/kadrajapp')+'/';
const SH='/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/70ZIRVE/shots/';
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
async function run(mode,{logged=true,wait=4000,rm=false,slowFb=0,tapAt=0,shots=null}={}){const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:844},reducedMotion:rm?'reduce':'no-preference'});const p=await c.newPage();
 const errs=[];p.on('pageerror',e=>errs.push(e.message));let appHits=0;
 await c.addInitScript(l=>{const T=Date.now();if(l)window.__FAKE_USER={uid:"u1",email:"u1@x.com"};
  window.__FS={"profiles/u1":{uid:"u1",username:"bilal",name:"Bilal",following:{},createdAt:T-9e9},"meta/_surum":{v:60904}};
  window.__iGone=0;window.__iLive=0;new MutationObserver(()=>{if(document.getElementById("intro"))window.__iSeen=1;else if(!window.__iGone&&window.__iSeen)window.__iGone=performance.now();if(!window.__iLive&&document.documentElement.classList.contains("k-live"))window.__iLive=performance.now()}).observe(document,{subtree:true,childList:true,attributes:true})},logged);
 await c.route(/^https?:\/\/(?!kadrajsosyalmedya\.github\.io)/,r=>r.abort());
 await c.route(/www\.gstatic\.com\/firebasejs\/[^/]+\/([^?]+)/,async r=>{const f=r.request().url().match(/firebasejs\/[^/]+\/([^?]+)/)[1];if(slowFb)await new Promise(z=>setTimeout(z,slowFb));r.fulfill({status:200,contentType:'application/javascript',body:fs.readFileSync(FK+f)})});
 const MT={js:'application/javascript',css:'text/css',html:'text/html',json:'application/json',png:'image/png',jpg:'image/jpeg'};
 await c.route(/^https:\/\/kadrajsosyalmedya\.github\.io\/Kadraj\/(.*)$/,r=>{const url=r.request().url();let f=url.replace(/^https:\/\/kadrajsosyalmedya\.github\.io\/Kadraj\//,'').split(/[?#]/)[0]||'index.html';
  if(f==='sw.js')return r.fulfill({status:404,body:''});
  if(f==='app.js'){appHits++;if(mode==="404"||(mode==="404once"&&appHits===1))return r.fulfill({status:404,body:'Not Found'})}
  const fp=R+decodeURIComponent(f);if(!fs.existsSync(fp)||fs.statSync(fp).isDirectory())return r.fulfill({status:404,body:'yok'});r.fulfill({status:200,contentType:MT[f.split('.').pop()]||'application/octet-stream',body:fs.readFileSync(fp)})});
 const t0=Date.now();p.goto('https://kadrajsosyalmedya.github.io/Kadraj/').catch(()=>{});
 if(shots){for(const ms of shots){await p.waitForTimeout(Math.max(0,ms-(Date.now()-t0)));await p.screenshot({path:SH+`intro_${ms}.png`}).catch(()=>{})}}
 if(tapAt){await p.waitForTimeout(Math.max(0,tapAt-(Date.now()-t0)));await p.mouse.click(195,420).catch(()=>{})}
 await p.waitForTimeout(Math.max(0,wait-(Date.now()-t0)));
 const st=await p.evaluate(()=>({live:document.documentElement.classList.contains("k-live"),card:(document.getElementById("kStuck")||{}).innerText||"",route:typeof S!=="undefined"?S.route.name+"/"+S.mode+"/"+S.authed:"-",gone:Math.round(window.__iGone),ready:typeof INTRO!=="undefined"?Math.round(INTRO.readyAt||0):0,liveAt:Math.round(window.__iLive),intro:!!document.getElementById("intro"),msg:(()=>{const m=document.getElementById("splashMsg");return m?getComputedStyle(m).opacity:"-"})()}));
 return{p,b,st,appHits,errs}}
(async()=>{
 await (await run("ok",{wait:3000,shots:[150,400,650,900,1150]})).b.close();
 let r=await run("ok",{wait:4000});ok(r.st.live&&r.st.route==="feed/cloud/true"&&!r.st.intro,"normal açılış Akış'a geldi "+JSON.stringify(r.st));
 ok(r.st.gone>0&&r.st.gone-r.st.ready<=Math.max(700,1700-r.st.ready),"uygulama hazır olunca perde kısa sürede kalkıyor (hazır "+r.st.ready+" ms, kalktı "+r.st.gone+" ms)");ok(!r.errs.length,"hata yok "+r.errs.join("|"));await r.b.close();
 r=await run("ok",{wait:3000,slowFb:2500});ok(r.st.intro&&r.st.msg==="0","Firebase yavaşken logo duruyor, yazı yok "+JSON.stringify(r.st));
 const an=await r.p.evaluate(()=>document.getAnimations().filter(a=>a.effect&&a.effect.target&&a.effect.target.closest&&a.effect.target.closest("#intro")).map(a=>a.animationName+":"+a.playState));
 ok(an.every(x=>!/inBreathe|inPulse|inSlide/.test(x)),"eski sonsuz animasyonlar yok "+an.join(","));await r.p.waitForTimeout(3000);
 const s2=await r.p.evaluate(()=>({intro:!!document.getElementById("intro"),r:S.route.name}));ok(!s2.intro&&s2.r==="feed","Firebase gelince geçti "+JSON.stringify(s2));await r.b.close();
 r=await run("ok",{wait:2800,slowFb:1500,tapAt:300});ok(!r.st.intro&&r.st.gone>0&&r.st.gone-r.st.ready<650,"dokununca çizim atlanıyor, hazır olunca beklemeden geçiyor (hazır "+r.st.ready+", kalktı "+r.st.gone+" ms)");await r.b.close();
 r=await run("ok",{wait:3000,rm:true});ok(!r.st.intro&&r.st.gone<1500&&r.st.live,"hareket azaltılmış: yalnızca solma ("+r.st.gone+" ms)");await r.b.close();
 r=await run("404once",{wait:4500});ok(r.st.live&&!r.st.card&&r.st.route==="feed/cloud/true"&&r.appHits===2,"app.js ilk denemede inmedi, ikincide açıldı "+JSON.stringify(r.st));await r.b.close();
 r=await run("404",{wait:4000});ok(/Kadraj açılamadı/.test(r.st.card)&&r.appHits===2,"app.js hiç inmezse kStuck kartı çıkıyor "+JSON.stringify(r.st.card));await r.p.screenshot({path:SH+'intro_404.png'});await r.b.close();
 console.log(`\n${pass} geçti, ${fail} kaldı`);process.exit(fail?1:0)})();
