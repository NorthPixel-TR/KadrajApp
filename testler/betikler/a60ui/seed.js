/* a60ui: gerçekçi içerikle Kadraj demo modu (yerel). Kullanım:
   const sd=require('./seed.js'); const {page,errors,close}=await sd.open(HTML,{width,height,dark,ui:'vizor'|'klasik'});
*/
const kt=require('../k40/kt.js');
async function seed(page){
 await page.evaluate(async()=>{
  const H=3600e3,T=Date.now();const me=S.uid;
  const ppl=[
   ["u2","Ayşe Yılmaz","ayse","img/kedi.jpg","Kedi annesi · İstanbul\nFotoğraf ve kahve."],
   ["u3","Mert Demir","mert","img/motor.jpg","Yol, motor, rüzgâr."],
   ["u4","Zeynep Kaya","zeynep",null,"Mimarlık öğrencisi. Çiziyorum."],
   ["u5","Can Öztürk","can","img/roket.jpg","Uzay meraklısı"],
   ["u6","Elif Şahin","elif",null,"Müzik + manzara"],
  ];
  for(const [uid,name,un,av,bio] of ppl){
   const prof={uid,username:un,name,bio,avatar:av||initialsAv(name,uid),following:{[me]:T-50*H,u2:T-40*H},botFollowers:{},private:false,createdAt:T-90*24*H};
   if(uid==="u4")prof.note={text:"Final haftası, dua edin",at:T-2*H};
   if(uid==="u2")prof.note={text:"Kahve molası kimde?",at:T-1*H};
   await DB.set("profiles/"+uid,prof)}
  await DB.update("profiles/"+me,{following:{u2:T,u3:T,u4:T,u5:T},bio:"Kadraj'da fotoğraf ve kısa notlar.\nKonya · 22",avatar:"img/sisli-dag.jpg",note:{text:"Bugün hava çok güzel",at:T-.5*H}});
  const posts=[
   {id:"p1",uid:"u2",kind:"photo",src:"img/kahve.jpg",at:T-.4*H,caption:"Pazar sabahı. Bu fincan bitmeden kimse bana iş söylemesin #kahve #pazar",loc:"Kadıköy",ar:"4/5"},
   {id:"p2",uid:"u3",kind:"photo",src:"img/motor.jpg",more:["img/col.jpg","img/gunbatimi.jpg"],at:T-1.4*H,caption:"Hafta sonu rotası: çöl yolu, gün batımı ve bol toz #motor #yol",loc:"Kapadokya",exif:"f/2.8 · 1/500 sn · ISO 200"},
   {id:"p3",uid:"u4",kind:"note",text:"Bugün öğrendiğim şey: iyi bir fotoğrafın yarısı ışık, yarısı sabır.",bg:5,at:T-2.5*H},
   {id:"p4",uid:"u5",kind:"poll",question:"Hafta sonu ne yapalım?",options:["Kamp","Sinema","Evde oyun","Kahvaltı"],at:T-3*H},
   {id:"p5",uid:me,kind:"photo",src:"img/sisli-dag.jpg",at:T-5*H,caption:"Sisin arasından sabah #manzara",loc:"Uludağ"},
   {id:"p6",uid:me,kind:"photo",src:"img/iskele.jpg",at:T-30*H,caption:"Uzun pozlama denemesi"},
   {id:"p7",uid:me,kind:"note",text:"Yeni kamerayla ilk hafta. Öneri olan?",bg:2,at:T-50*H},
   {id:"p8",uid:"u6",kind:"photo",src:"img/uzay.jpg",at:T-7*H,caption:"Gece gökyüzü, uzun pozlama #uzay"},
   {id:"p9",uid:"u2",kind:"photo",src:"img/sikke.jpg",at:T-9*H,caption:"Dedemden kalma"},
   {id:"p10",uid:me,kind:"photo",src:"img/roket.jpg",at:T-70*H,caption:"Fırlatma günü"},
  ];
  for(const p of posts)await DB.set("posts/"+p.id,p);
  await DB.set("meta/p1",{likes:{u3:T-.3*H,u4:T-.2*H,[me]:T-.1*H},comments:{c1:{uid:"u3",text:"Fincan çok güzelmiş",at:T-.3*H},c2:{uid:"u4",text:"Bende de aynı sabah keyfi",at:T-.2*H}},votes:{}});
  await DB.set("meta/p2",{likes:{u2:T,u5:T},comments:{c3:{uid:"u2",text:"Manzara efsane!",at:T-H}},votes:{}});
  await DB.set("meta/p4",{likes:{},comments:{},votes:{u2:0,u3:0,u6:2}});
  await DB.set("meta/p5",{likes:{u2:T-4*H,u3:T-3*H,u5:T-2*H},comments:{c5:{uid:"u2",text:"Bayıldım bu tona",at:T-3.5*H}},votes:{}});
  await DB.set("stories/s1",{uid:"u2",at:T-2*H,img:"img/kedi.jpg",views:{}});
  await DB.set("stories/s2",{uid:"u3",at:T-3*H,img:"img/col.jpg",views:{}});
  await DB.set("stories/s3",{uid:"u5",at:T-5*H,img:"img/uzay.jpg",views:{}});
  // sohbetler
  const dm=(o)=>cidFor(me,o);
  const c2=dm("u2"),c3=dm("u3");
  const msgs2=[["u2","Selam! Fotoğrafın çok güzel olmuş",-50],[me,"Teşekkürler, sabah erkenden çıktım",-48],["u2","Hafta sonu bir yere gidiyor muyuz?",-30],[me,"Kapadokya olabilir, Mert de gelir",-29],["u2","Süper, ben varım",-5]];
  for(const [f,t,m] of msgs2){const at=T+m*60e3;await DB.set(`chats/${c2}/msgs/${at.toString(36)}`,{from:f,at,text:t})}
  await DB.set("chats/"+c2,{members:[me,"u2"].sort(),last:{text:"Süper, ben varım",from:"u2",at:T-5*60e3},updatedAt:T-5*60e3,reads:{[me]:T-6*60e3,u2:T-5*60e3}});
  await DB.set(`chats/${c3}/msgs/a1`,{from:me,at:T-3*H,text:"Motor fotoğrafını gönderir misin?"});
  await DB.set("chats/"+c3,{members:[me,"u3"].sort(),last:{text:"Motor fotoğrafını gönderir misin?",from:me,at:T-3*H},updatedAt:T-3*H,reads:{[me]:T-3*H,u3:T-2*H}});
  await DB.set("chats/gr-ekip",{group:true,name:"Hafta sonu ekibi",members:[me,"u2","u3","u4"],createdBy:me,last:{text:"Ben pizza getiririm",from:"u4",at:T-20*60e3},updatedAt:T-20*60e3,reads:{[me]:T-H}});
  await DB.set("chats/gr-ekip/msgs/g1",{from:"u3",at:T-40*60e3,text:"Cumartesi saat kaçta?"});
  await DB.set("chats/gr-ekip/msgs/g2",{from:"u4",at:T-20*60e3,text:"Ben pizza getiririm"});
  await DB.set("chats/meydan",{last:{text:"Herkese günaydın!",from:"u5",at:T-15*60e3},updatedAt:T-15*60e3});
  await DB.set("chats/meydan/msgs/m1",{from:"u5",at:T-15*60e3,text:"Herkese günaydın!"});
  S.online=new Set(["u2","u4"]);S.lastSeen={u2:T,u4:T,u3:T-25*60e3};
 });
 await page.waitForTimeout(700);
}
async function open(HTML,{width=390,height=844,dark=false,ui='vizor',reducedMotion=false,init,clawd=false}={}){
 const r=await kt.openApp(HTML,{width,height,dark,reducedMotion,init});
 await kt.login(r.page,{uid:'u1',name:'Bilal Kara',un:'bilal'});
 await seed(r.page);
 await r.page.evaluate(([ui,dark,cw])=>{settings.ui=ui;settings.theme=dark?"dark":"light";if(!cw)settings.clawd=false;saveSettings();applyTheme();vzApply();try{if(!cw){const c=document.getElementById("clawd");if(c)c.style.display="none"}}catch{}render(true)},[ui,dark,clawd]);
 await r.page.waitForTimeout(600);
 return r;
}
const SCREENS=[
 ["feed",'tab("feed")'],["explore",'tab("explore")'],["chats",'tab("chats")'],["chat",'go("chat",{key:"u:u2"})'],["group",'go("chat",{key:"g:gr-ekip"})'],
 ["profile",'tab("profile")'],["other",'go("profile",{uid:"u2"})'],["activity",'tab("activity")'],["settings",'go("settings")'],["post",'go("post",{id:"p2"})']];
module.exports={open,seed,SCREENS,kt};
