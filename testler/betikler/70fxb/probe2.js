/* uzun içerikle yatay taşma taraması: node probe2.js 360 */
const {rich,ok,done}=require('./h.js');const W=+process.argv[2]||360;
(async()=>{const A=await rich({width:W,dark:process.argv[3]==="dark"});const p=A.page;
 const L="Çokuzunkelimeboşluksuzbirsatır".repeat(6);
 await p.evaluate(async(L)=>{const T=Date.now();await DB.set("profiles/u9",{uid:"u9",username:"muhammedalikarakaya_2008",name:"Çok Uzun İsimli Bir Kullanıcı "+L,bio:L+" @ayse #"+L.slice(0,30),avatar:null,following:{u1:T},botFollowers:{},private:false,createdAt:T,note:{text:L.slice(0,60),at:T}});
  await DB.update("profiles/u1",{following:{u9:T}});
  await DB.set("posts/L1",{uid:"u9",at:T-1000,kind:"photo",src:"img/kahve.jpg",caption:L+" #"+L.slice(0,30)+" @ayse",loc:L.slice(0,60),exif:L,tags:["u2","u3","u4","u5"]});
  await DB.set("posts/L2",{uid:"u9",at:T-2000,kind:"poll",question:L.slice(0,120),options:[L.slice(0,40),L.slice(0,40)]});
  await DB.set("posts/L3",{uid:"u9",at:T-3000,kind:"note",text:L.slice(0,280),bg:1});
  await DB.set("meta/L1",{likes:{},comments:{z1:{uid:"u9",text:L,at:T-500},z2:{uid:"u2",text:L,at:T-400,re:"z1"}},votes:{}});
  await DB.set("posts/L4",{uid:"u1",at:T-4000,kind:"note",text:"benim",bg:1});
  await DB.set("meta/L4",{likes:{u9:T},comments:{z3:{uid:"u9",text:L,at:T-100}},votes:{}});
  await DB.set("stories/LS",{uid:"u9",at:T-1000,img:"img/kedi.jpg",views:{},st:[{t:"poll",q:L.slice(0,60),o:[L.slice(0,20),L.slice(0,20)],x:.5,y:.4},{t:"quiz",q:L.slice(0,60),o:[L.slice(0,20),L.slice(0,20),L.slice(0,20)],a:1,x:.5,y:.7}],mus:{u:"it:1",t:L.slice(0,80),p:"https://a.mzstatic.com/x.m4a",s:0}});
 },L);await p.waitForTimeout(500);
 const chk=async name=>{await p.waitForTimeout(450);const r=await p.evaluate(()=>{const out=[];const vw=document.documentElement.clientWidth;const sw=document.documentElement.scrollWidth;
  for(const e of document.querySelectorAll("#main *, #overlay *")){const b=e.getBoundingClientRect();if(!b.width||!b.height)continue;const cs=getComputedStyle(e);if(cs.position==="fixed")continue;
   let anc=e.parentElement,clip=false;while(anc&&anc!==document.body){const o=getComputedStyle(anc);if(/(hidden|auto|scroll|clip)/.test(o.overflowX)){const ab=anc.getBoundingClientRect();if(b.right>ab.right+1||b.left<ab.left-1){clip=true;break}else break}anc=anc.parentElement}
   if(!clip&&(b.right>vw+1||b.left<-1))out.push((e.id?"#"+e.id:"")+"."+String(e.className).slice(0,40)+"<"+e.tagName+"> r="+Math.round(b.right)+" l="+Math.round(b.left))}
  return{sw,vw,ms:document.getElementById("main").scrollWidth,mc:document.getElementById("main").clientWidth,out:out.slice(0,6)}});
  const bad=r.sw>r.vw+1||r.ms>r.mc+1||r.out.length;ok(!bad,name+" taşma yok "+(bad?JSON.stringify(r):""))};
 for(const [n,js] of [["akış",'tab("feed")'],["paylaşım",'go("post",{id:"L1"})'],["anket",'go("post",{id:"L2"})'],["not",'go("post",{id:"L3"})'],["profil",'go("profile",{uid:"u9"})'],["bildirim",'tab("activity")'],["keşfet",'tab("explore")'],["kişiler",'go("people",{uid:"u9",type:"followers"})']]){await p.evaluate(js);await chk(n)}
 await p.evaluate(()=>{go("post",{id:"L1"});openComments("L1")});await chk("yorumlar");await p.evaluate(()=>closeAll());
 await p.evaluate(()=>openStories("u9"));await chk("hikâye");await p.screenshot({path:'/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/70fxb/story_long.png'});await p.evaluate(()=>closeAll());
 await p.evaluate(()=>postMenu("L1"));await chk("menü");await p.evaluate(()=>closeAll());
 await p.evaluate(()=>{go("post",{id:"L1"})});await p.waitForTimeout(300);await p.screenshot({path:'/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/70fxb/post_long.png',fullPage:false});
 await done(A)})();
