/* 7.0 Neler yeni hikâye sunumu: node wn.js <genişlik> */
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const HTML='/home/user/kadrajapp/.claude/worktrees/agent-a814d3297f0c28720/index.html',BASE='http://kadraj.test/';const W=+process.argv[2]||390;
const SH='/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/70ZIRVE/shots/';
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
async function open(rm){const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:W,height:860},reducedMotion:rm?'reduce':'no-preference'});const p=await ctx.newPage();
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.route('**/*',r=>{const u=r.request().url();
  if(u.startsWith(BASE)){const q=decodeURIComponent(new URL(u).pathname);if(q==='/'||q==='/index.html')return r.fulfill({body:fs.readFileSync(HTML),contentType:'text/html; charset=utf-8'});
  const f=path.join(path.dirname(HTML),q);if(fs.existsSync(f)&&fs.statSync(f).isFile())return r.fulfill({body:fs.readFileSync(f)});return r.fulfill({status:404,body:''})}
  if(u.startsWith('data:')||u.startsWith('blob:'))return r.continue();return r.abort()});
 await p.goto(BASE+'index.html');await p.waitForTimeout(1500);
 await p.evaluate(async()=>{if(S.mode!=="local"||!DB)await bootLocal();await DB.set("profiles/u1",{uid:"u1",username:"bilal",name:"Bilal",following:{},createdAt:Date.now()-9e9});S.uid="u1";LS.set("kadraj_session","u1");await enterApp(false)});
 await p.waitForTimeout(800);await p.evaluate(()=>{closeAll();LS.set("kadraj_seen_ver",0)});return{b,p,errors}}
(async()=>{let {b,p,errors}=await open(false);
 await p.evaluate(()=>showWhatsNew(false));await p.waitForTimeout(700);
 let r=await p.evaluate(()=>({n:document.querySelectorAll(".k70s-c").length,bars:document.querySelectorAll(".k70s-bars i").length,on:(document.querySelector(".k70s-c.on")||{}).dataset.i,items:wnItems().length}));
 ok(r.n===r.items+2&&r.bars===r.n&&r.on==="0","hikâye sunumu: kapak + "+r.items+" yenilik + son kart "+JSON.stringify(r));
 await p.screenshot({path:SH+`wn_cover_${W}.png`});
 const box=await p.evaluate(()=>{const r=document.querySelector(".k70s").getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height}});
 await p.mouse.click(box.x+box.w*.8,box.y+box.h*.5);await p.waitForTimeout(900);
 r=await p.evaluate(()=>({on:document.querySelector(".k70s-c.on").dataset.i,b0:getComputedStyle(document.querySelectorAll(".k70s-bars b")[0]).transform}));ok(r.on==="1"&&/matrix\(1, 0/.test(r.b0),"sağa dokununca sonraki kart, ilk çubuk dolu "+JSON.stringify(r));
 await p.screenshot({path:SH+`wn_item_${W}.png`});
 await p.mouse.click(box.x+box.w*.1,box.y+box.h*.5);await p.waitForTimeout(400);ok(await p.evaluate(()=>document.querySelector(".k70s-c.on").dataset.i==="0"),"sola dokununca geri");
 /* basılı tut duraklat */
 await p.mouse.move(box.x+box.w*.6,box.y+box.h*.5);await p.mouse.down();await p.waitForTimeout(500);r=await p.evaluate(()=>({h:document.querySelector(".k70s").classList.contains("hold"),ps:K70W.st.a.playState}));await p.mouse.up();await p.waitForTimeout(200);
 const ps2=await p.evaluate(()=>({i:document.querySelector(".k70s-c.on").dataset.i,ps:K70W.st.a.playState}));ok(r.h&&r.ps==="paused"&&ps2.i==="0"&&ps2.ps==="running","basılı tutunca duruyor, bırakınca devam "+JSON.stringify([r,ps2]));
 /* kendiliğinden ilerleme (kapak 3,6 sn) */
 await p.waitForTimeout(3700);ok(await p.evaluate(()=>document.querySelector(".k70s-c.on").dataset.i==="1"),"kapak kendiliğinden geçti");
 /* ok tuşu ve son kart */
 const n=await p.evaluate(()=>document.querySelectorAll(".k70s-c").length);for(let i=0;i<n;i++)await p.keyboard.press("ArrowRight");await p.waitForTimeout(500);
 r=await p.evaluate(()=>({l:!!document.querySelector('[data-layer="whatsnew"]'),seen:LS.get("kadraj_seen_ver",0)}));ok(!r.l&&r.seen>0,"son karttan ileri: kapandı, görüldü yazıldı "+JSON.stringify(r));
 /* Dene düğmesi */
 await p.evaluate(()=>{LS.set("kadraj_seen_ver",0);showWhatsNew(true)});await p.waitForTimeout(300);await p.keyboard.press("ArrowRight");await p.waitForTimeout(600);
 const go=await p.evaluate(()=>{const b=document.querySelector(".k70s-c.on [data-act=wnGo]");const r=b&&b.dataset.r;if(b)b.click();return r});await p.waitForTimeout(500);
 ok(go&&await p.evaluate(g=>!document.querySelector('[data-layer="whatsnew"]')&&(S.route.name===g||g==="profile"),go),"Dene düğmesi ilgili yere gidiyor ("+go+")");
 /* liste olarak gör */
 await p.evaluate(()=>{showWhatsNew(true);K70W.st.show(K70W.st.cards.length-1)});await p.waitForTimeout(600);await p.screenshot({path:SH+`wn_end_${W}.png`});
 await p.evaluate(()=>document.querySelector("[data-k70l]").click());await p.waitForTimeout(400);ok(await p.evaluate(()=>!!document.querySelector('[data-layer="whatsnew"] .wn-list')&&!document.querySelector(".k70s")),"Liste olarak gör eski listeyi açıyor");
 ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),"yatay taşma yok");
 ok(!errors.length,"sayfa hatası yok "+errors.join("|"));await b.close();
 ({b,p,errors}=await open(true));await p.evaluate(()=>showWhatsNew(true));await p.waitForTimeout(400);ok(await p.evaluate(()=>!!document.querySelector(".wn-list")&&!document.querySelector(".k70s")),"hareket azaltılmışsa eski liste");await b.close();
 console.log(`\n${pass} geçti, ${fail} kaldı`);process.exit(fail?1:0)})();
