/* 7.3.0 tanıtım ekran görüntüleri: gerçek uygulamayı demo modda gerçekçi içerikle açar, tanitim/*.jpg üretir (585x1266, 1,5x).
   node shots.js [çıktı klasörü]  (varsayılan /home/user/kadrajapp/tanitim) */
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const HTML='/home/user/kadrajapp/index.html',BASE='http://kadraj.test/',OUT=process.argv[2]||'/home/user/kadrajapp/tanitim';
(async()=>{const b=await chromium.launch();const errors=[];
 async function app(dark){const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:1.5,hasTouch:true,colorScheme:dark?"dark":"light"});const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));
  await p.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE)){const q=decodeURIComponent(new URL(u).pathname);if(q==='/'||q==='/index.html')return r.fulfill({body:fs.readFileSync(HTML),contentType:'text/html; charset=utf-8'});const f=path.join(path.dirname(HTML),q);if(fs.existsSync(f)&&fs.statSync(f).isFile())return r.fulfill({body:fs.readFileSync(f)});return r.fulfill({status:404,body:''})}if(u.startsWith('data:')||u.startsWith('blob:'))return r.continue();return r.abort()});
  await p.goto(BASE+'index.html');await p.waitForTimeout(1500);
  await p.evaluate(async dark=>{if(S.mode!=="local"||!DB)await bootLocal();const T=Date.now(),H=36e5,D=24*H;settings.theme=dark?"dark":"light";settings.ui="vizor";settings.anim="akici";settings.clawd=true;saveSettings();
   const ppl=[["u1","Bilal Kara","bilal","img/sisli-dag.jpg","Fotoğraf, satranç ve kısa notlar."],["u2","Ayşe Yılmaz","ayse","img/kedi.jpg","Kedi annesi. Fotoğraf ve kahve."],["u3","Mert Demir","mert","img/motor.jpg","Yol, motor, rüzgâr."],["u4","Zeynep Kaya","zeynep",null,"Çiziyorum."],["u5","Can Öztürk","can","img/roket.jpg","Uzay meraklısı"],["u6","Elif Şahin","elif",null,"Müzik + manzara"]];
   for(const [uid,name,un,av,bio] of ppl)await DB.set("profiles/"+uid,{uid,username:un,name,bio,avatar:av||initialsAv(name,uid),following:Object.fromEntries(ppl.map(x=>[x[0],T-50*H])),botFollowers:{},private:false,createdAt:T-62*D,
    ...(uid==="u2"?{note:{text:"Kahve molası kimde?",at:T-H}}:{}),...(uid==="u4"?{note:{text:"Sınav haftası",at:T-2*H}}:{}),...(uid==="u1"?{pth:"erciyes",chess:{g:14,r:1460,w:9,l:4,d:1},kosu:860}:{}),...(uid==="u3"?{kosu:1240}:{}),...(uid==="u2"?{kosu:610,pth:"lale"}:{})});
   const h=hmNow(),tg="#"+h.tag;
   const posts=[{id:"p1",uid:"u2",kind:"photo",src:"img/kahve.jpg",at:T-.4*H,caption:"Pazar sabahı, bu fincan bitmeden kimse bana ödev söylemesin "+tg,loc:"Kadıköy",ar:"4/5"},
    {id:"p2",uid:"u3",kind:"photo",src:"img/motor.jpg",more:["img/col.jpg","img/gunbatimi.jpg"],at:T-1.4*H,caption:"Hafta sonu rotası "+tg,loc:"Kapadokya"},
    {id:"p3",uid:"u4",kind:"note",text:"İyi bir fotoğrafın yarısı ışık, yarısı sabır.",bg:5,at:T-2.5*H},
    {id:"p4",uid:"u5",kind:"poll",question:"Cumartesi ne yapalım?",options:["Kamp","Sinema","Evde oyun","Kahvaltı"],at:T-3*H},
    {id:"p5",uid:"u1",kind:"photo",src:"img/sisli-dag.jpg",at:T-5*H,caption:"Sisin arasından sabah #manzara",ar:"4/5"},
    {id:"p6",uid:"u1",kind:"photo",src:"img/iskele.jpg",at:T-30*H,caption:"Uzun pozlama denemesi"},{id:"p7",uid:"u1",kind:"photo",src:"img/gunbatimi.jpg",at:T-80*H,caption:"Gün batımı #manzara"},
    {id:"p8",uid:"u6",kind:"photo",src:"img/uzay.jpg",at:T-7*H,caption:"Gece gökyüzü "+tg},{id:"p9",uid:"u1",kind:"photo",src:"img/uzay.jpg",at:T-200*H,caption:"Yıldızlar"},{id:"p10",uid:"u1",kind:"photo",src:"img/kedi.jpg",at:T-300*H,caption:"Pamuk"},
    {id:"r1",uid:"u5",kind:"reel",video:"reels/roket.mp4",poster:"reels/roket.jpg",at:T-4*H,caption:"Roket kalkışı, sesini aç #uzay",music:"enerjik"}];
   for(const x of posts){const {id,...d}=x;await DB.set("posts/"+id,d)}
   const lk=n=>Object.fromEntries(["u2","u3","u4","u5","u6","x1","x2","x3","x4","x5","x6","x7"].slice(0,n).map(u=>[u,T-H]));
   await DB.set("meta/p1",{likes:lk(9),comments:{c1:{uid:"u3",text:"Bu fincan çok güzelmiş",at:T-.2*H}}});await DB.set("meta/p5",{likes:lk(12),comments:{c1:{uid:"u2",text:"Harika ışık!",at:T-4*H},c2:{uid:"u2",text:"Nerede burası?",at:T-3*H}}});await DB.set("meta/p6",{likes:lk(6)});await DB.set("meta/p2",{likes:lk(7)});
   await DB.set("stories/s1",{uid:"u2",at:T-2*H,img:"img/kedi.jpg",views:{}});await DB.set("stories/s2",{uid:"u3",at:T-3*H,img:"img/col.jpg",views:{}});await DB.set("stories/s3",{uid:"u5",at:T-5*H,img:"img/uzay.jpg",views:{}});
   const c2=cidFor("u1","u2");const ms=[["u2","Fotoğrafın çok güzel olmuş",-50],["u1","Teşekkürler! Sabah erkenden çıktım",-48],["u2","Bu arada yarın Elif'in doğum günü",-12],["u1","İyi ki doğdun Elif!",-1]];
   let i=0;for(const [f,t,m] of ms)await DB.set(`chats/${c2}/msgs/m${++i}`,{from:f,at:T+m*60e3,text:t,...(i===1?{reacts:{u1:"heart"}}:{})});
   await DB.set("chats/"+c2,{members:["u1","u2"],last:{text:"İyi ki doğdun Elif!",from:"u1",at:T-60e3},updatedAt:T-60e3,reads:{u1:T,u2:T},streak:{n:12,best:12,at:T}});
   await DB.set("chats/gr-1",{group:true,name:"8-B Hafta sonu",members:["u1","u2","u3","u4"],createdBy:"u1",last:{text:"Çiz Bil oynayalım mı?",from:"u4",at:T-20*60e3},updatedAt:T-20*60e3,reads:{u1:T-H}});
   await DB.set("chats/gr-1/msgs/g1",{from:"u4",at:T-20*60e3,text:"Çiz Bil oynayalım mı?"});
   LS.set("kadraj_qz_u1",{wins:3,best:7800,games:5});LS.set("kadraj_masa_u1",{okey:4,renk:3});LS.set("kadraj_kosu_u1",{best:860,games:9});LS.set("kadraj_inst_hide",1);LS.set("kadraj_pushcard_u1",1);
   S.uid="u1";LS.set("kadraj_session","u1");await enterApp(false);S.online=new Set(["u2","u4"]);try{applyTheme()}catch{}},dark);
  await p.waitForTimeout(3500);
  await p.evaluate(()=>{try{achCheck(true)}catch{}});await p.waitForTimeout(600);
  await p.evaluate(()=>{for(const s of ["#achPop",".gconf","#kfx"])document.querySelectorAll(s).forEach(e=>e.remove());closeAll()});return p}
 const clean=p=>p.evaluate(()=>{for(const s of ["#achPop",".gconf",".toast","#toasts > *",".cwb"])document.querySelectorAll(s).forEach(e=>e.remove());const c=document.querySelector(".cwd");if(c)c.style.visibility=S.route.name==="feed"?"":"hidden"});
 const shot=async(p,n)=>{await clean(p);await p.screenshot({path:path.join(OUT,n+".jpg"),type:"jpeg",quality:80});console.log("çekildi",n)};
 let p=await app(false);
 await p.evaluate(()=>tab("feed"));await p.waitForTimeout(2500);await shot(p,"akis");
 await p.evaluate(()=>tab("explore"));await p.waitForTimeout(1200);await shot(p,"kesfet");
 await p.evaluate(()=>tab("profile"));await p.waitForTimeout(2200);await shot(p,"profil");
 await p.evaluate(()=>{tab("chats");gmHub()});await p.waitForTimeout(1100);await shot(p,"oyunlar");
 await p.evaluate(()=>{closeAll();go("chess")});await p.waitForTimeout(1300);await shot(p,"satranc");
 await p.evaluate(()=>{closeAll();go("chat",{key:"u:u2"})});await p.waitForTimeout(1200);
 await p.evaluate(()=>{FX_SEEN.clear();kfxPlay("balon")});await p.waitForTimeout(1150);await p.screenshot({path:path.join(OUT,"sohbet.jpg"),type:"jpeg",quality:80});console.log("çekildi sohbet");
 await p.waitForTimeout(3000);
 await p.evaluate(()=>{closeAll();ACT.yolOpen()});await p.waitForTimeout(400);await p.evaluate(()=>{yolGo(1);yolGo(1)});await p.waitForTimeout(1500);await p.evaluate(()=>yolPause(true));await shot(p,"yolculuk");
 await p.evaluate(()=>closeAll());
 const d=await app(true);
 await d.evaluate(()=>{closeAll();kuGo(K=>K.open())});await d.waitForTimeout(1200);
 await d.evaluate(()=>{document.querySelector("#kuCv").dispatchEvent(new PointerEvent("pointerdown",{bubbles:true}));const g=KOSU._t.G();g.obs=[];g.next=99999});await d.waitForTimeout(300);
 await d.evaluate(()=>{const g=KOSU._t.G();g.dist=760*6;g.obs=[{k:0,x:150,w:16,h:12},{k:2,x:215,w:11,h:16}];g.gems=[{x:96,y:92,got:false},{x:110,y:92,got:false},{x:124,y:92,got:false}];g.y=110;g.vy=-2;g.ground=false;g.next=99999;g.nextG=99999});
 await d.waitForTimeout(120);await d.evaluate(()=>{KOSU._t.G().st="paused"});await d.evaluate(()=>{const o=document.querySelector("#kuOv");if(o)o.hidden=true});await shot(d,"kosu");
 await d.evaluate(()=>{closeAll();tab("reels")});await d.waitForTimeout(1800);await shot(d,"klaket");
 console.log("hatalar",errors.length,errors.slice(0,3).join(" | "));await b.close()})();
