/* 70FXB keşif: kart çeşitleri + yeniden çizimde zıplama. node probe2.js <w> <light|dark> <vizor|klasik> */
const sd=require('/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/a60ui/seed.js');
const HTML=process.env.KADRAJ_HTML||'/home/user/Kadraj/.claude/worktrees/agent-a493c6425937c90fc/index.html';
const OUT='/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/70FXB/p2';require('fs').mkdirSync(OUT,{recursive:true});
const [,,W='390',TH='light',UI='vizor']=process.argv;const tag=W+TH[0]+UI[0];
(async()=>{const {page:p,errors,close}=await sd.open(HTML,{width:+W,height:844,dark:TH==="dark",ui:UI});
 await p.evaluate(async()=>{const T=Date.now(),H=36e5;
  await DB.set("posts/c1",{id:"c1",uid:"u2",kind:"photo",src:"img/gunbatimi.jpg",at:T-.2*H,caption:"kapsül",cap:T+5*24*H});
  await DB.set("posts/c2",{id:"c2",uid:"u3",kind:"note",text:"Açılmış kapsül notu",bg:1,at:T-.25*H,cap:T-H});
  await DB.set("posts/t1",{id:"t1",uid:"u4",kind:"photo",src:"img/col.jpg",at:T-.3*H,caption:"Etiketli @ayse #yol",tags:["u2","u3","u5","u6"],loc:"Çok uzun bir konum adı ki taşmasın diye deneme, Kapadokya Göreme Milli Parkı"});
  await DB.update("profiles/u2",{rp:{p5:T-.1*H}});
  await DB.set("meta/t1",{likes:Object.fromEntries(Array.from({length:40},(_,i)=>["x"+i,T])),comments:{},votes:{}});
  S.feedSeg="all";tab("feed")});await p.waitForTimeout(1500);
 const cards=await p.evaluate(()=>[...document.querySelectorAll("#main article.card")].map(c=>c.dataset.pid+":"+c.className));console.log(cards.join(" | "));
 for(const id of ["c1","c2","t1","p2","p3","p4","p5"]){const ok=await p.evaluate(id=>{const c=document.querySelector(`#main article.card[data-pid="${id}"]`);if(!c)return false;c.scrollIntoView({block:"start"});return true},id);if(!ok){console.log("yok",id);continue}
  await p.waitForTimeout(300);const el=await p.$(`#main article.card[data-pid="${id}"]`);await el.screenshot({path:`${OUT}/card_${id}_${tag}.png`})}
 const lk=await p.evaluate(()=>[...document.querySelectorAll(".k70-lk")].map(b=>b.dataset.k70lk+"="+b.textContent).join(" | "));console.log("beğeni",lk);
 // yeniden çizimde zıplama
 await p.evaluate(()=>{const m=document.getElementById("main");m.scrollTop=900});await p.waitForTimeout(400);
 const before=await p.evaluate(()=>{const c=[...document.querySelectorAll("#main article.card")].find(c=>c.getBoundingClientRect().top>60);return{id:c.dataset.pid,top:Math.round(c.getBoundingClientRect().top),st:document.getElementById("main").scrollTop}});
 await p.evaluate(async()=>{await DB.update("meta/p2",{likes:{u4:Date.now()}});render(false)});await p.waitForTimeout(500);
 const after=await p.evaluate(id=>({top:Math.round(document.querySelector(`#main article.card[data-pid="${id}"]`).getBoundingClientRect().top),st:document.getElementById("main").scrollTop}),before.id);
 console.log("zıplama",JSON.stringify(before),JSON.stringify(after));
 // hideLikes
 await p.evaluate(()=>{settings.hideLikes=true;render(true)});await p.waitForTimeout(500);
 console.log("gizli beğeni",await p.evaluate(()=>[...document.querySelectorAll(".k70-lk")].map(b=>b.dataset.k70lk).join(",")));
 // yorum ekle tıkla
 await p.evaluate(()=>{settings.hideLikes=false;render(true)});await p.waitForTimeout(400);
 await p.evaluate(()=>document.querySelector(".k70-add").click());await p.waitForTimeout(500);console.log("yorum ekle →",await p.evaluate(()=>[...document.querySelectorAll("#overlay .layer")].map(l=>l.dataset.layer).join()));
 await p.evaluate(()=>closeAll());
 // post sayfası
 await p.evaluate(()=>go("post",{id:"t1"}));await p.waitForTimeout(700);await p.screenshot({path:`${OUT}/post_${tag}.png`});
 console.log("taşma",await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth||$("#main").scrollWidth>$("#main").clientWidth+1));
 console.log("hatalar",JSON.stringify(errors.slice(0,5)));await close()})();
