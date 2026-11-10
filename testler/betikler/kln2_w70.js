/* 6.8.24: bildirim düğmeleri (yanıt, kalp, görüldü) ve açılışta izin penceresi */
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const HTML='/home/user/kadrajapp/.claude/worktrees/agent-a3b2f14b534c80de8/index.html',BASE='http://kadraj.test/';
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
const FAKE=(surum,granted)=>`window.__kn=[];window.__ks=[];window.__L={};window.__ask=0;window.__granted=${granted};window.__ayar=0;window.Capacitor={isNativePlatform:()=>true,getPlatform:()=>"android",Plugins:{KadrajGaleri:{
 surum:async()=>({surum:${surum},yerel:${surum>=4},eylem:${surum>=5},fcm:false,ad:"x"}),bildirimIzin:async(o)=>{if(o&&o.sor){window.__ask++;return{ok:window.__grantOnAsk!==false}}return{ok:window.__granted}},
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
 /* 1: yeni APK, izin yok → açılışta Kadraj penceresi */
 let {b,p,errors}=await open(5,false,"window.__grantOnAsk=false;");
 await p.waitForTimeout(9000);
 let r=await p.evaluate(()=>({dlg:[...document.querySelectorAll("#overlay .dialog,#overlay .layer")].map(x=>x.textContent).join("|").slice(0,300),ask:window.__ask}));
 ok(/Bildirimleri aç/.test(r.dlg)||r.ask>=1,"izin yoksa açılışta soruluyor "+JSON.stringify(r).slice(0,200));
 /* pencere çıktıysa İzin ver'e bas, telefon reddedince ayarlar penceresi */
 const had=await p.evaluate(()=>{const b=[...document.querySelectorAll("#overlay button")].find(x=>x.textContent.trim()==="İzin ver");if(b){b.click();return true}return false});
 if(had){await p.waitForTimeout(800);r=await p.evaluate(()=>[...document.querySelectorAll("#overlay button")].map(x=>x.textContent.trim()));ok(r.includes("Ayarları aç"),"reddedilince 'Ayarları aç' çıkıyor "+JSON.stringify(r));
  await p.evaluate(()=>[...document.querySelectorAll("#overlay button")].find(x=>x.textContent.trim()==="Ayarları aç").click());await p.waitForTimeout(300);ok(await p.evaluate(()=>window.__ayar===1),"telefonun bildirim ayarları açılıyor")}
 else ok(false,"Kadraj izin penceresi çıkmadı");
 await p.evaluate(()=>closeAll());
 /* dinleyici kurulu mu, yanıt eylemi */
 ok(await p.evaluate(()=>typeof window.__L.bildirimEylem==="function"),"bildirim düğmesi dinleyicisi kurulu");
 const cid=await p.evaluate(()=>cidFor("u1","u2"));
 await p.evaluate(c=>window.__L.bildirimEylem({action:"reply",key:"u:u2",cid:c,mid:"m1",from:"u2",tag:"m-"+c,title:"Ayşe Yılmaz",body:"naber",text:"iyiyim sen",at:Date.now()}),cid);await p.waitForTimeout(1200);
 r=await p.evaluate(async c=>{const ms=JSON.parse(localStorage.getItem("kadraj_db")||"{}");const keys=Object.keys(ms).filter(k=>k.startsWith("chats/"+c+"/msgs/"));const mine=keys.map(k=>ms[k]).filter(m=>m.from==="u1");return{mine:mine.map(m=>({t:m.text,re:m.reply&&m.reply.mid})),kn:window.__kn.slice(-1)[0],reads:(ms["chats/"+c]||{}).reads}},cid);
 ok(r.mine.some(m=>m.t==="iyiyim sen"&&m.re==="m1"),"bildirimden yanıt gönderildi (alıntılı) "+JSON.stringify(r.mine));
 ok(r.kn&&r.kn.sessiz&&/Sen: iyiyim sen/.test(r.kn.body),"bildirim 'Sen: …' diye güncellendi");
 ok(!(r.reads&&r.reads.u1),"yanıt görüldü göndermedi "+JSON.stringify(r.reads));
 await p.evaluate(c=>window.__L.bildirimEylem({action:"heart",key:"u:u2",cid:c,mid:"m1",from:"u2",tag:"m-"+c,title:"Ayşe Yılmaz",body:"naber",at:Date.now()}),cid);await p.waitForTimeout(800);
 r=await p.evaluate(c=>{const ms=JSON.parse(localStorage.getItem("kadraj_db")||"{}");return{m:ms["chats/"+c+"/msgs/m1"],kn:window.__kn.slice(-1)[0]}},cid);
 ok(r.m&&r.m.reacts&&r.m.reacts.u1==="heart","bildirimden kalp atıldı");ok(r.kn&&/Kalp attın/.test(r.kn.body),"bildirim 'Kalp attın'");
 await p.evaluate(c=>window.__L.bildirimEylem({action:"seen",key:"u:u2",cid:c,mid:"m1",from:"u2",tag:"m-"+c,at:Date.now()}),cid);await p.waitForTimeout(800);
 r=await p.evaluate(c=>{const ms=JSON.parse(localStorage.getItem("kadraj_db")||"{}");return{reads:(ms["chats/"+c]||{}).reads,ks:window.__ks}},cid);
 ok(r.reads&&r.reads.u1&&r.ks.some(x=>x.tag==="m-"+cid),"Görüldü: okundu yazıldı, bildirim silindi");
 /* mesaj bildirimi düğmeler için tür/mid taşıyor */
 r=await p.evaluate(c=>{window.__granted=true;KLN.perm="granted";kAppBg(true);knNotify({kind:"msg",uid:"u2",title:"Ayşe Yılmaz",text:"yeni",key:"u:u2",cid:c,mid:"m9",at:Date.now()});return 1},cid);await p.waitForTimeout(400);
 r=await p.evaluate(()=>window.__kn.slice(-1)[0]);ok(r&&r.kind==="msg"&&r.mid==="m9"&&r.from==="u2"&&r.key==="u:u2","mesaj bildirimi tür, kimlik ve gönderen taşıyor "+JSON.stringify(r));
 ok(!errors.length,"sayfa hatası yok "+errors.join("|"));await b.close();
 /* 2: izin varsa pencere yok */
 ({b,p,errors}=await open(5,true));await p.waitForTimeout(8000);
 ok(await p.evaluate(()=>!/Bildirimleri aç/.test(document.querySelector("#overlay").textContent)),"izin varsa pencere çıkmıyor");await b.close();
 /* 3: eski APK → güncelleme penceresi */
 ({b,p,errors}=await open(3,false));await p.waitForTimeout(8000);
 r=await p.evaluate(()=>document.querySelector("#overlay").textContent);ok(/Bildirimler için güncelle/.test(r),"eski uygulamada güncelleme penceresi");
 await p.evaluate(()=>[...document.querySelectorAll("#overlay button")].find(x=>x.textContent.trim()==="İndir").click());await p.waitForTimeout(300);ok(await p.evaluate(()=>window.__ac===1),"İndir çalışıyor");
 ok(!errors.length,"sayfa hatası yok (eski) "+errors.join("|"));await b.close();
 console.log(pass+"/"+(pass+fail));process.exit(fail?1:0)})();
