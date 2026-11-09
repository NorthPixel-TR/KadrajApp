/* 6.9 çoklu hesap: gerçek Firestore+Auth emülatörü. npx firebase-tools@15.34.1 emulators:exec --only firestore,auth --project kadraj-6f1e0 "node acc.js" */
const {chromium}=require('playwright');const fs=require('fs');const PK='/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/fbsdk/package/';
const PRJ="kadraj-6f1e0",FS="http://127.0.0.1:8089",AU="http://127.0.0.1:9099";
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};const W=ms=>new Promise(r=>setTimeout(r,ms));
async function mkUser(name,un){const r=await fetch(`${AU}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=x`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:un+"@t.com",password:"sifre123",returnSecureToken:true})});const j=await r.json();const uid=j.localId;
 const f=v=>typeof v==="number"?{integerValue:String(v)}:{stringValue:v};const body={fields:{uid:f(uid),username:f(un),name:f(name),createdAt:f(Date.now()),bio:f("")}};
 const r2=await fetch(`${FS}/v1/projects/${PRJ}/databases/(default)/documents/profiles?documentId=${uid}`,{method:"POST",headers:{"content-type":"application/json",Authorization:"Bearer owner"},body:JSON.stringify(body)});if(!r2.ok)throw new Error(await r2.text());
 await fetch(`${FS}/v1/projects/${PRJ}/databases/(default)/documents/unames?documentId=${un}`,{method:"POST",headers:{"content-type":"application/json",Authorization:"Bearer owner"},body:JSON.stringify({fields:{uid:f(uid),email:f(un+"@t.com")}})});return{uid,email:un+"@t.com",un}}
const FSW=`import * as F from "https://www.gstatic.com/firebasejs/10.12.2/real-firestore.js";export * from "https://www.gstatic.com/firebasejs/10.12.2/real-firestore.js";
export function initializeFirestore(app,o){const db=F.initializeFirestore(app,{ignoreUndefinedProperties:true});F.connectFirestoreEmulator(db,"127.0.0.1",8089);return db}`;
const AUW=`import * as A from "https://www.gstatic.com/firebasejs/10.12.2/real-auth.js";export * from "https://www.gstatic.com/firebasejs/10.12.2/real-auth.js";
const M=new Map();export function getAuth(app){if(M.has(app.name))return M.get(app.name);const a=A.getAuth(app);A.connectAuthEmulator(a,"http://127.0.0.1:9099",{disableWarnings:true});M.set(app.name,a);return a}`;
(async()=>{const b=await chromium.launch({args:["--no-proxy-server","--disable-features=BlockInsecurePrivateNetworkRequests,PrivateNetworkAccessSendPreflights,PrivateNetworkAccessRespectPreflightResults,LocalNetworkAccessChecks"]});
 const [ali,bey,cem]=[await mkUser("Ali Ak","ali"),await mkUser("Beyza Bal","beyza"),await mkUser("Cem Can","cem")];
 const c=await b.newContext({viewport:{width:390,height:844}});
 await c.route(/www\.gstatic\.com\/firebasejs\/10\.12\.2\/(.*)$/,r=>{const f=r.request().url().match(/10\.12\.2\/([^?]+)/)[1];
  if(f==="firebase-firestore.js")return r.fulfill({status:200,contentType:'application/javascript',body:FSW});if(f==="firebase-auth.js")return r.fulfill({status:200,contentType:'application/javascript',body:AUW});
  r.fulfill({status:200,contentType:'application/javascript',body:fs.readFileSync(PK+f.replace(/^real-/,"firebase-"))})});
 await c.route(/fonts\.(googleapis|gstatic)\.com|supabase|googleapis\.com\/youtube|pexels|giphy/,r=>r.abort());
 const R='/home/user/Kadraj/',MT={js:'application/javascript',css:'text/css',html:'text/html',json:'application/json',png:'image/png',jpg:'image/jpeg',webmanifest:'application/manifest+json'};
 await c.route(/^https:\/\/kadrajsosyalmedya\.github\.io\/Kadraj\/(.*)$/,r=>{let f=r.request().url().replace(/^https:\/\/kadrajsosyalmedya\.github\.io\/Kadraj\//,'').split(/[?#]/)[0]||'index.html';const fp=R+decodeURIComponent(f);if(!fs.existsSync(fp)||fs.statSync(fp).isDirectory())return r.fulfill({status:404,body:'yok'});r.fulfill({status:200,contentType:MT[f.split('.').pop()]||'application/octet-stream',body:fs.readFileSync(fp)})});
 const p=await c.newPage();const err=[];p.on('pageerror',e=>{err.push(e.message);console.log('PERR',e.message)});p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')console.log('CON',m.text().slice(0,200))});p.on('requestfailed',r=>console.log('RF',r.url().slice(0,100)));
 const boot=async()=>{await p.goto("https://kadrajsosyalmedya.github.io/Kadraj/");for(let i=0;i<30;i++){const s=await p.evaluate(()=>({fb:typeof FB!=="undefined"&&!!FB&&!!FB.auth,msg:(document.getElementById("splashMsg")||{}).textContent,m:typeof S!=="undefined"&&S.mode}));if(s.fb)return;if(i%5==4)console.log("bekle",JSON.stringify(s));await W(1000)}throw new Error("FB yok")};
 const authed=uid=>p.waitForFunction(u=>S.authed&&S.uid===u&&S.route&&S.route.name,uid,{timeout:30000}).then(()=>true).catch(()=>false);
 await boot();await p.evaluate(async e=>{await FB.A.signInWithEmailAndPassword(FB.auth,e,"sifre123")},ali.email);ok(await authed(ali.uid),"Ali ana hesapla girdi");
 await W(1200);ok(await p.evaluate(()=>accData().list.length===1&&accData().main==="[DEFAULT]"),"hesap listesine kaydedildi");
 await p.evaluate(()=>accAdd());await p.waitForFunction(()=>!!document.querySelector(".auth"),null,{timeout:10000});
 ok(await p.evaluate(()=>!!document.querySelector(".k69-cancel")&&FB.app.name==="k2"),"Hesap ekle: giriş ekranı ve Vazgeç (k2)");
 await p.evaluate(async e=>{await FB.A.signInWithEmailAndPassword(FB.auth,e,"sifre123")},bey.email);ok(await authed(bey.uid),"ikinci hesap (Beyza) açıldı");
 await W(1200);ok(await p.evaluate(()=>accData().list.length===2),"listede 2 hesap");
 ok(await p.evaluate(async b=>{return await sendMessage("u:"+b,{text:"beyzadan selam"})},ali.uid)===true,"Beyza hesabıyla mesaj gitti (doğru veritabanı/oturum)");
 const t0=Date.now();await p.evaluate(()=>accSwitch("[DEFAULT]"));const veil=await p.evaluate(()=>!!document.querySelector(".k69-sw"));ok(await authed(ali.uid),"Ali'ye geri geçildi ("+(Date.now()-t0)+" ms)");
 await W(1500);ok(await p.evaluate(()=>!document.querySelector(".k69-sw")),"geçiş perdesi kalktı");
 ok(await p.evaluate(()=>FB.app.name==="[DEFAULT]"&&!!Object.values(S.chats).find(c=>c.last&&c.last.text==="beyzadan selam")),"Ali, Beyza'nın mesajını sohbet listesinde görüyor");
 const pr=await p.evaluate(async x=>{const{F}=FB;const g=async u=>{const d=await F.getDoc(F.doc(FB.db,"presence/"+u));return d.exists()?d.data().at:null};return{a:await g(x.a),b:await g(x.b),v:(await F.getDoc(F.doc(FB.db,"presence/"+x.a))).data().v}},{a:ali.uid,b:bey.uid});
 ok(pr.a>0&&pr.b===0&&pr.v>=60826,"çevrimiçi: Ali açık, Beyza kapandı, sürüm yazılıyor "+JSON.stringify(pr));
 /* ana hesap Beyza → yeniden aç */
 await p.evaluate(()=>{const d=accData();d.main="k2";accSave(d)});await boot();ok(await authed(bey.uid),"ana hesap Beyza: açılışta Beyza açıldı");
 await p.evaluate(()=>accSwitch("[DEFAULT]"));ok(await authed(ali.uid),"açılıştan sonra Ali'ye geçiş");
 /* Beyza'yı (açılış hesabı) listeden çıkar: Ali'nin oturumu bozulmamalı */
 await p.evaluate(()=>accRemove("k2"));await p.waitForTimeout(400);await p.evaluate(()=>{const b=[...document.querySelectorAll("#overlay .dialog button")].find(x=>x.textContent==="Çıkar");b&&b.click()});await W(1500);
 ok(await p.evaluate(u=>S.authed&&S.uid===u&&accData().list.length===1&&!accInst("k2").auth.currentUser,ali.uid),"Beyza çıkarıldı, Ali'de kalındı");
 /* Cem'i ekle, sonra Cem'den çıkış yap → Ali'ye dönülür */
 await p.evaluate(()=>accAdd());await p.waitForFunction(()=>!!document.querySelector(".auth"),null,{timeout:10000});
 const slot=await p.evaluate(()=>FB.app.name);await p.evaluate(async e=>{await FB.A.signInWithEmailAndPassword(FB.auth,e,"sifre123")},cem.email);ok(await authed(cem.uid),"Cem eklendi ("+slot+")");
 await W(1200);console.log("ÖNCE",JSON.stringify(await p.evaluate(()=>({l:accData(),boot:ACC.bootA,app:FB.app.name,live:ACC.live}))));await p.evaluate(async()=>{endSession();await FB.A.signOut(FB.auth)});await W(2500);console.log("SONRA",JSON.stringify(await p.evaluate(()=>({l:accData(),app:FB.app.name,uid:S.uid,au:S.authed,auth:!!document.querySelector(".auth"),busy:ACC.busy}))));ok(await authed(ali.uid),"Cem'den çıkınca Ali'ye dönüldü");
 await W(800);ok(await p.evaluate(()=>accData().list.length===1),"Cem listeden düştü");
 /* Vazgeç */
 await p.evaluate(()=>accAdd());await p.waitForFunction(()=>!!document.querySelector(".k69-cancel"),null,{timeout:10000});await p.evaluate(()=>document.querySelector(".k69-cancel").click());ok(await authed(ali.uid),"Hesap ekle'den Vazgeç → Ali");
 /* sayfa: hesaplar penceresi */
 await p.evaluate(()=>accSheet());await W(300);ok(await p.evaluate(()=>document.querySelectorAll(".k69-acr").length===1&&!!document.querySelector("#k69AccAdd")),"Hesaplar penceresi");
 ok(!err.length,"sayfa hatası yok "+err.join(" | "));
 console.log(pass+"/"+(pass+fail));await b.close();process.exit(fail?1:0)})();
