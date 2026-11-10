/* 70FXB keşif: gizli hesap, bot profili, çocuk modu, animasyon kapalı. node probe4.js <w> <light|dark> <vizor|klasik> */
const sd=require('/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/a60ui/seed.js');
const HTML=process.env.KADRAJ_HTML||'/home/user/kadrajapp/.claude/worktrees/agent-a493c6425937c90fc/index.html';
const OUT='/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/70FXB/p4';require('fs').mkdirSync(OUT,{recursive:true});
const [,,W='390',TH='light',UI='vizor',RM]=process.argv;const tag=W+TH[0]+UI[0]+(RM?"r":"");
(async()=>{const {page:p,errors,close}=await sd.open(HTML,{width:+W,height:844,dark:TH==="dark",ui:UI,reducedMotion:!!RM});
 const shot=async n=>{await p.waitForTimeout(800);await p.screenshot({path:`${OUT}/${n}_${tag}.png`})};
 await p.evaluate(async()=>{await DB.update("profiles/u6",{private:true});await DB.update("profiles/u1",{following:{u6:0}})});
 await p.evaluate(()=>go("profile",{uid:"u6"}));await shot("priv");
 console.log("gizli btns",await p.evaluate(()=>[...document.querySelectorAll("#main .prof .btns>*")].map(b=>b.textContent.trim()||b.getAttribute("aria-label")).join(" | ")));
 await p.evaluate(()=>go("profile",{uid:"bot:rota"}));await shot("bot");
 console.log("bot btns",await p.evaluate(()=>[...document.querySelectorAll("#main .prof .btns>*")].map(b=>b.textContent.trim()||b.getAttribute("aria-label")).join(" | ")));
 // animasyon kapalı: hikâye aç/kapat/küp
 await p.evaluate(()=>{settings.anim="off";try{k69Apply()}catch{};tab("feed")});await p.waitForTimeout(800);
 await p.evaluate(()=>document.querySelector('.stories [data-story="u2"]').click());await p.waitForTimeout(400);
 await p.evaluate(()=>document.getElementById("svNext").click());await p.waitForTimeout(50);
 console.log("anim kapalı küp",await p.evaluate(()=>JSON.stringify({gh:document.querySelectorAll("#k70Gh .k70-gw").length,cls:document.querySelector("#overlay .sv")?.className,who:document.querySelector('#overlay .shd .n')?.firstChild.textContent})));
 await p.evaluate(()=>document.querySelector('#overlay .sv [data-act="close"]').click());await p.waitForTimeout(50);
 console.log("anim kapalı kapanış",await p.evaluate(()=>JSON.stringify({gh:document.querySelectorAll("#k70Gh .k70-gw").length,l:document.querySelectorAll("#overlay .layer").length})));
 // ayarlar grubu animasyon kapalı
 await p.evaluate(()=>go("settings"));await p.waitForTimeout(600);await p.evaluate(()=>document.querySelector('.sg[data-g="gorunum"] .sg-h').click());await p.waitForTimeout(60);
 console.log("ayar grubu (kapalı anim) 60ms",await p.evaluate(()=>Math.round(document.querySelector('.sg[data-g="gorunum"] .sg-b').getBoundingClientRect().height)));
 // çift hızlı tık sg
 await p.evaluate(()=>{settings.anim="akici";k69Apply();const h=document.querySelector('.sg[data-g="hesap"] .sg-h');h.click();h.click();h.click()});await p.waitForTimeout(900);
 console.log("sg 3 tık",await p.evaluate(()=>[...document.querySelectorAll("#main .sg")].map(g=>g.dataset.g+":"+(g.classList.contains("open")?1:0)+":"+Math.round(g.querySelector(".sg-b").getBoundingClientRect().height)).join(" ")));
 // çocuk modu akış
 await p.evaluate(async()=>{await DB.update("profiles/u1",{child:1});tab("feed")});await shot("kid");
 console.log("çocuk kart sayısı",await p.evaluate(()=>document.querySelectorAll("#main article.k70c").length));
 console.log("hatalar",JSON.stringify(errors.slice(0,5)));await close()})();
