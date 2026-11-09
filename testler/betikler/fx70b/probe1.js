/* 70FXB keşif: hikâye uç durumları. node probe1.js <w> <light|dark> <vizor|klasik> [anim] */
const sd=require('/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/a60ui/seed.js');
const HTML=process.env.KADRAJ_HTML||'/home/user/Kadraj/.claude/worktrees/agent-a493c6425937c90fc/index.html';
const OUT='/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/70FXB/p1';require('fs').mkdirSync(OUT,{recursive:true});
const [,,W='390',TH='light',UI='vizor',AN='akici']=process.argv;
(async()=>{const {page:p,errors,close}=await sd.open(HTML,{width:+W,height:844,dark:TH==="dark",ui:UI});const tag=W+TH[0]+UI[0]+AN[0];
 const log=(...a)=>console.log(...a);
 await p.evaluate(async(an)=>{settings.anim=an;try{k69Apply()}catch{}const T=Date.now();
  await DB.set("stories/s1",{uid:"u2",at:T-2*36e5,img:"img/kedi.jpg",views:{},st:[{t:"poll",q:"Nasıl?",o:["İyi","Kötü"],x:.5,y:.25},{t:"ask",q:"Soru?",x:.5,y:.6}]});
  await DB.set("stories/s1b",{uid:"u2",at:T-1*36e5,img:"img/kahve.jpg",views:{},st:[{t:"quiz",q:"Başkent?",o:["Ankara","İzmir"],a:0,x:.5,y:.4}]});
  await DB.set("stories/s9",{uid:"u1",at:T-1*36e5,img:"img/iskele.jpg",views:{u2:T}});
  await DB.set("hl/h1",{uid:"u1",name:"Tatil",at:T,up:T,items:[{img:"img/col.jpg",at:T},{img:"img/uzay.jpg",at:T}]});
  tab("feed")},AN);await p.waitForTimeout(1500);
 const st=async()=>p.evaluate(()=>({layers:[...document.querySelectorAll("#overlay .layer")].map(l=>l.dataset.layer),gh:document.querySelectorAll("#k70Gh .k70-gw").length,who:(document.querySelector('#overlay [data-layer="story"] .shd .n')||{}).firstChild?.textContent}));
 // 1) hızlı çift tıklama
 await p.evaluate(()=>{const b=document.querySelector('.stories [data-story="u2"]');b.click();b.click()});await p.waitForTimeout(150);log("çift tık",JSON.stringify(await st()));
 await p.screenshot({path:`${OUT}/sv_${tag}.png`});await p.waitForTimeout(700);
 // anket oyu
 const pv=await p.evaluate(()=>{const b=document.querySelector('#overlay .svst button, #overlay .svst [data-pv]');if(!b)return "yok: "+document.querySelector('#overlay .svst')?.innerHTML.slice(0,300);b.click();return b.outerHTML.slice(0,120)});log("anket",pv);
 await p.waitForTimeout(400);log("anket sonrası",JSON.stringify(await st()));await p.screenshot({path:`${OUT}/svpoll_${tag}.png`});
 // ileri (2. hikâye, test)
 await p.evaluate(()=>document.getElementById("svNext").click());await p.waitForTimeout(500);await p.screenshot({path:`${OUT}/svquiz_${tag}.png`});
 const qz=await p.evaluate(()=>{const b=document.querySelector('#overlay .svst button');if(!b)return"yok";b.click();return b.textContent});log("quiz",qz);await p.waitForTimeout(400);log("quiz sonrası",JSON.stringify(await st()));
 // kapat düğmesine hızlı iki kez
 await p.evaluate(()=>{const b=document.querySelector('#overlay .sv [data-act="close"]');b.click();b.click()});await p.waitForTimeout(80);log("kapat x2",JSON.stringify(await st()));await p.waitForTimeout(800);log("sonra",JSON.stringify(await st()));
 // kendi hikâyen
 await p.evaluate(()=>{const b=document.querySelector('.stories [data-story="u1"]')||document.querySelector('.stories .story');b.click()});await p.waitForTimeout(700);log("kendi",JSON.stringify(await st()));await p.screenshot({path:`${OUT}/svown_${tag}.png`});
 await p.evaluate(()=>document.getElementById("svViews")&&document.getElementById("svViews").click());await p.waitForTimeout(500);log("görenler",JSON.stringify(await st()));
 await p.evaluate(()=>closeTop());await p.waitForTimeout(500);log("görenler kapandı",JSON.stringify(await st()));
 await p.evaluate(()=>closeAll());await p.waitForTimeout(600);
 // öne çıkan
 await p.evaluate(()=>tab("profile"));await p.waitForTimeout(800);
 await p.evaluate(()=>{hlOpen("u1","h1")});await p.waitForTimeout(600);log("hl",JSON.stringify(await st()));await p.screenshot({path:`${OUT}/hl_${tag}.png`});
 // hl'de aşağı kaydır
 const box=await p.evaluate(()=>{const r=document.querySelector("#overlay .layer:last-child .sv, #overlay .layer:last-child .img")?.getBoundingClientRect();return r&&{x:r.x+r.width/2,y:r.y+r.height/3}});
 if(box){await p.mouse.move(box.x,box.y);await p.mouse.down();for(let i=1;i<=8;i++){await p.mouse.move(box.x,box.y+i*25);await p.waitForTimeout(16)}await p.mouse.up();await p.waitForTimeout(600);log("hl kaydır",JSON.stringify(await st()))}
 await p.evaluate(()=>closeAll());await p.waitForTimeout(500);
 // profil halkası
 await p.evaluate(()=>go("profile",{uid:"u2"}));await p.waitForTimeout(800);
 const pr=await p.evaluate(()=>{const b=document.querySelector('#main .prof [data-story]');if(!b)return"halka yok";b.click();return"ok"});await p.waitForTimeout(700);log("profil halkası",pr,JSON.stringify(await st()),JSON.stringify(await p.evaluate(()=>K70U.sq)));
 // hikâye sonu kendiliğinden: bars doldur
 await p.evaluate(()=>{document.querySelectorAll('#overlay .sv .bars b').forEach(b=>b.style.width="100%");closeLayer("story")});await p.waitForTimeout(700);log("profil son",JSON.stringify(await st()));
 await p.evaluate(()=>closeAll());await p.waitForTimeout(500);
 // tab değişimi hikâye açıkken
 await p.evaluate(()=>tab("feed"));await p.waitForTimeout(700);
 await p.evaluate(()=>document.querySelector('.stories [data-story="u3"]').click());await p.waitForTimeout(600);
 await p.evaluate(()=>{document.querySelectorAll('#overlay .sv .bars b').forEach(b=>b.style.width="100%");tab("explore")});await p.waitForTimeout(800);log("tab sırasında",JSON.stringify(await st()),await p.evaluate(()=>S.route.name));
 await p.evaluate(()=>closeAll());await p.waitForTimeout(500);
 log("hatalar",JSON.stringify(errors.slice(0,5)));await close()})();
