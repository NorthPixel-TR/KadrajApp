/* 6.8.24: bildirim düğmeleri (yanıt, kalp, görüldü) ve açılışta izin penceresi */
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const HTML='/home/user/kadrajapp/index.html',BASE='http://kadraj.test/';
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
const FAKE=(surum,granted)=>`window.__kn=[];window.__ks=[];window.__L={};window.__ask=0;window.__granted=${granted};window.__ayar=0;window.Capacitor={isNativePlatform:()=>true,getPlatform:()=>"android",Plugins:{KadrajGaleri:{
 surum:async()=>({surum:${surum},yerel:${surum>=4},eylem:${surum>=5},fcm:false,ad:"x",paket:window.__pk||undefined}),bildirimIzin:async(o)=>{if(o&&o.sor){window.__ask++;return{ok:window.__grantOnAsk!==false}}return{ok:window.__granted}},
 bildirim:async(o)=>{window.__kn.push(o)},bildirimSil:async(o)=>{window.__ks.push(o)},bildirimAyar:async()=>{window.__ayar++},addListener:(n,f)=>{window.__L[n]=f;return{remove(){}}},izin:async()=>({ok:false}),renk:async()=>{},acilis:async()=>({}),ac:async()=>{window.__ac=1}}}};`;
async function open(surum,granted,extra=""){const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},userAgent:"Mozilla/5.0 (Linux; Android 14) KadrajApp"});const p=await ctx.newPage();
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE)){const q=decodeURIComponent(new URL(u).pathname);if(q==='/'||q==='/index.html')return r.fulfill({body:fs.readFileSync(HTML),contentType:'text/html; charset=utf-8'});
  const f=path.join(path.dirname(HTML),q);if(fs.existsSync(f)&&fs.statSync(f).isFile())return r.fulfill({body:fs.readFileSync(f)});return r.fulfill({status:404,body:''})}
  if(u.startsWith('data:')||u.startsWith('blob:'))return r.continue();return r.abort()});
 await p.addInitScript(FAKE(surum,granted)+extra);await p.goto(BASE+'index.html');await p.waitForTimeout(1500);
 await p.evaluate(async()=>{if(S.mode!=="local"||!DB)await bootLocal();const T=Date.now();
  for(const [uid,name,un] of [["u1","Bilal Kara","bilal"],["u2","Ayşe Yılmaz","ayse"]])await DB.set("profiles/"+uid,{uid,username:un,name,bio:"",avatar:null,following:{u1:1,u2:1},botFollowers:{},private:false,createdAt:T-1e6});
  const cid=cidFor("u1","u2");await DB.set("chats/"+cid,{members:["u1","u2"],last:{text:"naber",from:"u2",at:T-1000},updatedAt:T-1000,reads:{}});await DB.set("chats/"+cid+"/msgs/m1",{from:"u2",at:T-1000,text:"naber"});
  S.uid="u1";LS.set("kadraj_session","u1");await enterApp(false)});
 return {b,p,errors}}
(async()=>{
 for(const [sv,pk,want] of [[5,"","yan"],[9,"io.github.kadrajsosyalmedya.kadrajapp","yok"],[5,"io.github.kadrajsosyalmedya.kadrajapp","ust"]]){
  const {b,p,errors}=await open(sv,true,pk?`window.__pk=${JSON.stringify(pk)};`:"");
  await p.evaluate(()=>{closeAll();LS.del("kadraj_apkask_u1")});const r=await p.evaluate(()=>apkCheck(true));await p.waitForTimeout(400);
  const t=await p.evaluate(()=>[...document.querySelectorAll("#overlay .layer")].map(x=>x.textContent).join("|"));
  if(want==="yok")ok(r===false&&!/yeni sürümü var/.test(t),"yeni paket, güncel: pencere yok");
  if(want==="yan")ok(/yanına ayrı kurulur/.test(t)&&/eski Kadraj'ı sil/.test(t),"eski paket: yanına kur, eskisini sil "+t.slice(0,160));
  if(want==="ust")ok(/üstüne kurulur/.test(t),"yeni paket eski sürüm: üstüne kurulur");
  ok(!errors.length,"sayfa hatası yok "+errors.join(";"));await b.close()}
 console.log(pass+"/"+(pass+fail));process.exit(fail?1:0)})();
