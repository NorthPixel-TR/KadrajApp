/* 6.8.24: bildirim düğmeleri (yanıt, kalp, görüldü) ve açılışta izin penceresi */
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const HTML='/home/user/Kadraj/index.html',BASE='http://kadraj.test/';
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
const FAKE=(surum,granted)=>`window.__kn=[];window.__ks=[];window.__L={};window.__ask=0;window.__granted=${granted};window.__ayar=0;window.Capacitor={isNativePlatform:()=>true,getPlatform:()=>"android",Plugins:{KadrajGaleri:{
 surum:async()=>({surum:${surum},yerel:${surum>=4},eylem:${surum>=5},fcm:false,ad:"x",paket:window.__pk||undefined}),bildirimIzin:async(o)=>{if(o&&o.sor){window.__ask++;return{ok:window.__grantOnAsk!==false}}return{ok:window.__granted}},
 bildirim:async(o)=>{window.__kn.push(o)},bildirimSil:async(o)=>{window.__ks.push(o)},bildirimAyar:async()=>{window.__ayar++},addListener:(n,f)=>{window.__L[n]=f;return{remove(){}}},izin:async()=>({ok:false}),renk:async()=>{},acilis:async()=>({}),ac:async()=>{window.__ac=1},guncelle:window.__gu?async(o)=>{window.__gn=(window.__gn||0)+1;window.__gurl=o.url;const r=window.__gr.shift();if(r==="err")throw new Error("http 500");return r}:undefined}}};`;
async function open(surum,granted,extra=""){const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},userAgent:"Mozilla/5.0 (Linux; Android 14) KadrajApp"});const p=await ctx.newPage();
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE)){const q=decodeURIComponent(new URL(u).pathname);if(q==='/'||q==='/index.html')return r.fulfill({body:fs.readFileSync(HTML),contentType:'text/html; charset=utf-8'});
  const f=path.join(path.dirname(HTML),q);if(fs.existsSync(f)&&fs.statSync(f).isFile())return r.fulfill({body:fs.readFileSync(f)});return r.fulfill({status:404,body:''})}
  if(u.startsWith('data:')||u.startsWith('blob:'))return r.continue();return r.abort()});
 await p.addInitScript(extra+FAKE(surum,granted));await p.goto(BASE+'index.html');await p.waitForTimeout(1500);
 await p.evaluate(async()=>{if(S.mode!=="local"||!DB)await bootLocal();const T=Date.now();
  for(const [uid,name,un] of [["u1","Bilal Kara","bilal"],["u2","Ayşe Yılmaz","ayse"]])await DB.set("profiles/"+uid,{uid,username:un,name,bio:"",avatar:null,following:{u1:1,u2:1},botFollowers:{},private:false,createdAt:T-1e6});
  const cid=cidFor("u1","u2");await DB.set("chats/"+cid,{members:["u1","u2"],last:{text:"naber",from:"u2",at:T-1000},updatedAt:T-1000,reads:{}});await DB.set("chats/"+cid+"/msgs/m1",{from:"u2",at:T-1000,text:"naber"});
  S.uid="u1";LS.set("kadraj_session","u1");await enterApp(false)});
 return {b,p,errors}}
(async()=>{
 const NEW="io.github.kadrajsosyalmedya.kadrajapp";
 const txt=p=>p.evaluate(()=>[...document.querySelectorAll("#overlay .layer")].map(x=>x.textContent).join("|")+"#"+[...document.querySelectorAll("#toasts *")].map(x=>x.textContent).join("|"));
 const btn=(p,t)=>p.evaluate(t=>{const b=[...document.querySelectorAll("#overlay button")].find(x=>x.textContent.trim()===t);if(b){b.click();return true}return false},t);
 /* 1: yeni paket, izin yok → izin penceresi, dönünce kendiliğinden yeniden */
 let {b,p,errors}=await open(6,true,`window.__pk="${NEW}";window.__gu=1;window.__gr=[{izin:false},{ok:true}];`);
 await p.evaluate(()=>{closeAll();LS.del("kadraj_apkask_u1")});await p.evaluate(()=>apkCheck(true));await p.waitForTimeout(300);
 let t=await txt(p);ok(/üstüne kurulur/.test(t),"yeni paket: üstüne kurulur yazıyor");
 ok(await btn(p,"Güncelle"),"düğme adı Güncelle");await p.waitForTimeout(500);
 t=await txt(p);ok(/Bir kerelik izin/.test(t),"izin yoksa izin penceresi");
 ok(await p.evaluate(()=>window.__gn===1&&window.__gurl===APK_URL),"guncelle APK_URL ile çağrıldı");
 await p.evaluate(()=>{closeAll();window.kAppBg(true)});await p.waitForTimeout(200);await p.evaluate(()=>window.kAppBg(false));await p.waitForTimeout(1200);
 ok(await p.evaluate(()=>window.__gn===2),"izinden dönünce indirme kendiliğinden yeniden başladı");
 t=await txt(p);ok(/Güncelle'ye dokun/.test(t),"Android penceresi için uyarı");
 ok(await p.evaluate(()=>!window.__ac),"tarayıcı açılmadı");
 ok(!errors.length,"sayfa hatası yok "+errors.join(";"));await b.close();
 /* 2: hata → yeniden dene / tarayıcı */
 ({b,p,errors}=await open(6,true,`window.__pk="${NEW}";window.__gu=1;window.__gr=["err"];`));
 await p.evaluate(()=>{closeAll();apkOpen()});await p.waitForTimeout(600);t=await txt(p);
 ok(/Güncelleme inmedi/.test(t),"hata penceresi");ok(await btn(p,"Tarayıcıdan indir"),"tarayıcıdan indir düğmesi");await p.waitForTimeout(200);
 ok(await p.evaluate(()=>window.__ac===1),"tarayıcı yedeği çalışıyor");ok(!errors.length,"sayfa hatası yok");await b.close();
 /* 3: eski paket → tarayıcı */
 ({b,p,errors}=await open(5,true,""));
 await p.evaluate(()=>{closeAll();LS.del("kadraj_apkask_u1")});await p.evaluate(()=>apkCheck(true));await p.waitForTimeout(300);
 t=await txt(p);ok(/son kez/.test(t),"eski paket: bir kereliğine yanına kur");ok(await btn(p,"İndir"),"eski pakette düğme İndir");await p.waitForTimeout(200);
 ok(await p.evaluate(()=>window.__ac===1),"eski pakette tarayıcı");ok(!errors.length,"sayfa hatası yok");await b.close();
 /* 4: güncel uygulama → pencere yok */
 ({b,p,errors}=await open(9,true,`window.__pk="${NEW}";window.__gu=1;window.__gr=[];`));
 await p.evaluate(()=>{closeAll();LS.del("kadraj_apkask_u1")});ok(await p.evaluate(()=>apkCheck(true))===false,"güncel uygulamada pencere yok");ok(!errors.length,"sayfa hatası yok");await b.close();
 console.log(pass+"/"+(pass+fail));process.exit(fail?1:0)})();
