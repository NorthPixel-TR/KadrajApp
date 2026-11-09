/* 7.0.20 NorthPixel imzası: açılış, karşılama, giriş, ayarlar; açık/koyu; taşma ve hata */
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const HTML='/home/user/Kadraj/index.html',BASE='http://kadraj.test/',OUT=process.argv[3]||'/tmp/claude-0/-home-user/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/np/';fs.mkdirSync(OUT,{recursive:true});
const W=+process.argv[2]||390;let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
(async()=>{const b=await chromium.launch();
 for(const dark of [false,true]){const ctx=await b.newContext({viewport:{width:W,height:820},colorScheme:dark?"dark":"light",deviceScaleFactor:2});const p=await ctx.newPage();const err=[];p.on('pageerror',e=>err.push(e.message));
  let hold=true;await p.route('**/*',async r=>{const u=r.request().url();if(u.startsWith(BASE)){const q=decodeURIComponent(new URL(u).pathname);if(q==='/'||q==='/index.html')return r.fulfill({body:fs.readFileSync(HTML),contentType:'text/html; charset=utf-8'});
   if(/app\.js/.test(q)){while(hold)await new Promise(x=>setTimeout(x,50))}
   const f=path.join(path.dirname(HTML),q);if(fs.existsSync(f))return r.fulfill({body:fs.readFileSync(f)});return r.fulfill({status:404,body:''})}
   if(u.startsWith('data:')||u.startsWith('blob:'))return r.continue();return r.abort()});
  const tg=dark?"koyu":"acik";
  await p.goto(BASE+'index.html',{waitUntil:'commit'});await p.waitForTimeout(1200);
  const ib=await p.evaluate(()=>{const e=document.querySelector('#intro .np-from');if(!e)return null;const r=e.getBoundingClientRect();return{t:e.innerText.replace(/\s+/g," "),y:r.bottom,w:r.width,o:getComputedStyle(e).opacity}});
  ok(ib&&/from NorthPixel/.test(ib.t)&&ib.y<820&&ib.w>60,`${tg}: açılışta "from NorthPixel" ${JSON.stringify(ib)}`);{const c=await ctx.newCDPSession(p);const {data}=await c.send('Page.captureScreenshot');fs.writeFileSync(OUT+`intro-${tg}.png`,Buffer.from(data,'base64'))}
  hold=false;await p.waitForTimeout(2500);
  await p.evaluate(()=>{if(S.mode!=="local"||!DB)return bootLocal()});await p.waitForTimeout(800);await p.evaluate(()=>{try{showWelcome()}catch(e){}});await p.waitForTimeout(900);
  const wl=await p.evaluate(()=>{const e=document.querySelector('#main .auth .np-from');return e?{n:document.querySelectorAll('#main .np-from').length,y:e.getBoundingClientRect().top}:null});
  ok(wl&&wl.n===1,`${tg}: karşılama ekranında bir kez ${JSON.stringify(wl)}`);await p.screenshot({path:OUT+`wel-${tg}.png`,fullPage:false});
  await p.evaluate(()=>{try{showLogin()}catch(e){}});await p.waitForTimeout(600);
  ok(await p.evaluate(()=>document.querySelectorAll('#main .auth .np-from').length===1),`${tg}: giriş ekranında bir kez`);await p.screenshot({path:OUT+`login-${tg}.png`});
  await p.evaluate(async()=>{S.uid="u_np";await saveNewProfile("Test","test",null)});await p.waitForTimeout(1500);
  await p.evaluate(()=>{closeAll();go("settings")});await p.waitForTimeout(1200);
  for(let i=0;i<3;i++){await p.evaluate(()=>render(false));await p.waitForTimeout(200)}
  const st=await p.evaluate(()=>{const l=document.querySelectorAll('#main .np-from');const e=l[0];const sf=document.querySelector('#main .setfoot');return{n:l.length,afterFoot:!!(sf&&e&&sf.compareDocumentPosition(e)&4)&&e===$("#main").lastElementChild}});
  ok(st.n===1&&st.afterFoot,`${tg}: Ayarlar'ın altında bir kez ${JSON.stringify(st)}`);
  await p.evaluate(()=>{const m=$("#main");m.scrollTop=m.scrollHeight});await p.waitForTimeout(400);await p.screenshot({path:OUT+`set-${tg}.png`});
  ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${tg}: taşma yok`);
  ok(await p.evaluate(()=>String(APP_V)===document.querySelector("meta[name=kadraj-version]").content),`${tg}: sürüm 7.0.20`);
  ok(err.length===0,`${tg}: sayfa hatası yok `+err.join(" | "));await ctx.close()}
 console.log(pass+"/"+(pass+fail));await b.close()})();
