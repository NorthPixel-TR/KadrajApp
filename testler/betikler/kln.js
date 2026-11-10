/* 6.8.22: Android uygulamasında yerel bildirim + No.1 Hayran rozeti (sahte Capacitor) */
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const HTML='/home/user/kadrajapp/index.html',BASE='http://kadraj.test/';
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
const FAKE=(surum)=>`window.__kn=[];window.__ks=[];window.__ask=0;window.Capacitor={isNativePlatform:()=>true,getPlatform:()=>"android",Plugins:{KadrajGaleri:{
 surum:async()=>({surum:${surum},yerel:${surum>=4},fcm:false,ad:"x"}),bildirimIzin:async(o)=>{if(o&&o.sor)window.__ask++;return{ok:!!(o&&o.sor)||window.__granted}},
 bildirim:async(o)=>{window.__kn.push(o)},bildirimSil:async(o)=>{window.__ks.push(o)},izin:async()=>({ok:false}),renk:async()=>{},acilis:async()=>({})}}};`;
async function open(surum,granted){const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},userAgent:"Mozilla/5.0 (Linux; Android 14) KadrajApp"});const p=await ctx.newPage();
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE)){const q=decodeURIComponent(new URL(u).pathname);if(q==='/'||q==='/index.html')return r.fulfill({body:fs.readFileSync(HTML),contentType:'text/html; charset=utf-8'});
  const f=path.join(path.dirname(HTML),q);if(fs.existsSync(f)&&fs.statSync(f).isFile())return r.fulfill({body:fs.readFileSync(f)});return r.fulfill({status:404,body:''})}
  if(u.startsWith('data:')||u.startsWith('blob:'))return r.continue();return r.abort()});
 await p.addInitScript(FAKE(surum)+(granted?"window.__granted=true;":""));
 await p.goto(BASE+'index.html');await p.waitForTimeout(1500);
 await p.evaluate(async()=>{if(S.mode!=="local"||!DB)await bootLocal();const T=Date.now();
  for(const [uid,name,un] of [["u1","Bilal Kara","bilal"],["u2","Ayşe Yılmaz","ayse"]]){await DB.set("profiles/"+uid,{uid,username:un,name,bio:"",avatar:null,following:{},botFollowers:{},private:false,createdAt:T-1e6})}
  S.uid="u1";LS.set("kadraj_session","u1");await enterApp(false)});await p.waitForTimeout(8000);
 return {b,p,errors}}
(async()=>{
 /* 1: yeni APK (SURUM 4), izin yok → bir kez sorulur */
 let {b,p,errors}=await open(4,false);
 let r=await p.evaluate(()=>({on:KLN.on,perm:notifPerm(),ask:window.__ask}));
 ok(r.on===true,"yeni uygulamada yerel bildirim açık");ok(r.ask===1&&r.perm==="granted","izin bir kez soruldu ve verildi "+JSON.stringify(r));
 r=await p.evaluate(()=>{sysNote("Ayşe","selam","m-x",{key:"u:u2"});return window.__kn.length});ok(r===0,"uygulama öndeyken telefon bildirimi yok");
 r=await p.evaluate(()=>{kAppBg(true);const v=document.visibilityState;knNotify({kind:"msg",uid:"u2",title:"Ayşe Yılmaz",text:"naber",key:"u:u2",cid:"dm-u1-u2",mid:"m1",at:Date.now()});return v});
 await p.waitForTimeout(300);
 const kn=await p.evaluate(()=>window.__kn);ok(r==="hidden","arka plana geçince sayfa gizli sayılıyor");
 ok(kn.length===1&&kn[0].title==="Ayşe Yılmaz"&&kn[0].body==="naber"&&kn[0].key==="u:u2"&&/^m-/.test(kn[0].tag),"mesaj gelince yerel bildirim "+JSON.stringify(kn));
 r=await p.evaluate(()=>{settings.notify=false;sysNote("A","b","t",{key:"u:u2"});settings.notify=true;return window.__kn.length});ok(r===1,"bildirimler kapalıysa gelmez");
 r=await p.evaluate(()=>{kAppBg(false);clearChatNotes("dm-u1-u2");return{v:document.visibilityState,ks:window.__ks}});ok(r.v==="visible"&&r.ks.length===1&&r.ks[0].tag==="m-dm-u1-u2","öne dönünce görünür, sohbet açılınca bildirim silinir");
 /* rozet */
 r=await p.evaluate(()=>{S.adm={...(S.adm||{}),rozet:{list:{u2:["hayran"]}}};RZC=null;return{ids:rzOf("u2"),t:RZM.hayran&&RZM.hayran.t,ic:!!IP.rzno1}});
 ok(r.ids.includes("hayran")&&r.t==="No.1 Hayran"&&r.ic,"No.1 Hayran rozeti "+JSON.stringify(r));
 await p.evaluate(()=>go("profile",{uid:"u2"}));await p.waitForTimeout(800);
 ok(await p.evaluate(()=>/No\.1 Hayran/.test(document.querySelector("#main").textContent)),"profilde rozet görünüyor");
 await p.screenshot({path:__dirname+'/rozet.png'});
 ok(!errors.length,"sayfa hatası yok "+errors.join("|"));await b.close();
 /* 2: eski APK (SURUM 3): yerel bildirim yok, eski davranış */
 ({b,p,errors}=await open(3,false));
 r=await p.evaluate(()=>({on:KLN.on,perm:notifPerm()}));ok(r.on===false,"eski uygulamada eski davranış "+JSON.stringify(r));
 ok(!errors.length,"sayfa hatası yok (eski) "+errors.join("|"));await b.close();
 /* 3: tarayıcı (Capacitor yok) */
 const b2=await chromium.launch();const p2=await b2.newPage();const e2=[];p2.on('pageerror',e=>e2.push(e.message));
 await p2.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE)){const q=decodeURIComponent(new URL(u).pathname);if(q==='/'||q==='/index.html')return r.fulfill({body:fs.readFileSync(HTML),contentType:'text/html; charset=utf-8'});const f=path.join(path.dirname(HTML),q);if(fs.existsSync(f)&&fs.statSync(f).isFile())return r.fulfill({body:fs.readFileSync(f)});return r.fulfill({status:404,body:''})}return r.abort()});
 await p2.goto(BASE+'index.html');await p2.waitForTimeout(1500);r=await p2.evaluate(()=>({on:KLN.on,v:document.visibilityState}));ok(r.on===false&&r.v==="visible","tarayıcıda değişiklik yok");ok(!e2.length,"tarayıcı hatasız "+e2.join("|"));await b2.close();
 console.log(pass+"/"+(pass+fail));process.exit(fail?1:0)})();
