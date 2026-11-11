// 7.1.12 Canlı Bilgi Yarışması: soru verisi, Rota'ya karşı tam oyun, iki sekmede oda (kur, katıl, başlat, cevap, puan, kurucu çıkınca kapanır), sohbet daveti
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const HTML='/home/user/kadrajapp/index.html',BASE='http://kadraj.test/';const W=+process.argv[2]||390;let pass=0,fail=0;const ok=(c,m)=>{console.log((c?"OK  ":"FAIL")+" "+m);c?pass++:fail++};
async function page(ctx,errors){const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));
 await p.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE)){const q=decodeURIComponent(new URL(u).pathname);if(q==='/'||q==='/index.html')return r.fulfill({body:fs.readFileSync(HTML),contentType:'text/html; charset=utf-8'});const f=path.join(path.dirname(HTML),q);if(fs.existsSync(f)&&fs.statSync(f).isFile())return r.fulfill({body:fs.readFileSync(f)});return r.fulfill({status:404,body:''})}if(u.startsWith('data:')||u.startsWith('blob:'))return r.continue();return r.abort()});
 await p.goto(BASE+'index.html');await p.waitForTimeout(1200);return p}
const over=p=>p.evaluate(()=>{const iw=innerWidth,o=[];for(const e of document.querySelectorAll("#overlay .qz *")){const r=e.getBoundingClientRect();if(r.width&&(r.right>iw+1||r.left<-1))o.push(e.className+" "+Math.round(r.right))}return o.slice(0,3)});
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:W,height:800},hasTouch:true});const errors=[];
 const A=await page(ctx,errors);
 await A.evaluate(async()=>{if(S.mode!=="local"||!DB)await bootLocal();const T=Date.now();for(const [uid,name,un] of [["u1","Bilal Kara","bilal"],["u2","Ayşe Yılmaz","ayse"]])await DB.set("profiles/"+uid,{uid,username:un,name,bio:"",avatar:null,following:{u2:1,u1:1},botFollowers:{},private:false,createdAt:T});
  await DB.set("chats/"+cidFor("u1","u2"),{members:["u1","u2"],last:{text:"selam",from:"u2",at:T-1000},updatedAt:T-1000,reads:{}});S.uid="u1";settings.clawd=false;await enterApp(false)});
 /* giriş */
 await A.evaluate(()=>{closeAll();gmHub()});await A.waitForTimeout(400);
 ok(await A.$('[data-layer="games"] [data-gm="qz"]'),"Oyunlar penceresinde Bilgi Yarışması");
 await A.click('[data-gm="qz"]');await A.waitForFunction(()=>window.YARISMA&&document.querySelector(".qz [data-qz=solo]"),null,{timeout:8000});
 ok(true,"yarisma.js yüklendi, menü açıldı");
 /* veri */
 const dv=await A.evaluate(()=>{const {Q,qOf,ptsOf}=YARISMA._t;const bad=[];Q.forEach((q,i)=>{const [c,t]=q[0].split("|");if(q.length!==5||!c||!t||new Set(q.slice(1)).size!==4||q.slice(1).some(x=>!x))bad.push(i)});
  let pm=true;for(let k=0;k<50;k++){const x=[k%Q.length,[3,1,0,2]];const o=qOf(x);if(o.opts[o.ok]!==Q[x[0]][1])pm=false}
  return{n:Q.length,bad,pm,p:[ptsOf(true,0),ptsOf(true,5000),ptsOf(true,10000),ptsOf(false,100)]}});
 ok(dv.n>=150&&dv.bad.length===0,"soru verisi: "+dv.n+" soru, hatalı "+dv.bad.length);ok(dv.pm,"karışık seçeneklerde doğru cevap yerinde");ok(dv.p.join()==="1000,750,500,0","puan: hız ve doğruluk "+dv.p.join());
 ok((await over(A)).length===0,"menüde taşma yok");
 /* Rota'ya karşı tam oyun (hızlandırılmış) */
 await A.evaluate(()=>YARISMA._t.set({TQ:2500,TR:500}));await A.click('[data-qz="solo"]');await A.waitForTimeout(300);
 const qs=[];for(let i=0;i<10;i++){await A.waitForFunction(i=>{const R=YARISMA._t.R();if(!R||!R.d)return false;const s=JSON.parse(R.d.s||"{}");return s.qi===i&&s.ph==="q"&&document.querySelector('.qz-o button:not(:disabled)')},i,{timeout:9000}).catch(()=>{});
  const r=await A.evaluate(i=>{const R=YARISMA._t.R(),s=JSON.parse(R.d.s);const q=YARISMA._t.qOf(s.qs[s.qi]);const pick=i===4?(q.ok+1)%4:q.ok;document.querySelector(`[data-qz="a:${pick}"]`).click();return{t:q.txt,n:document.querySelectorAll(".qz-o button").length,who:document.querySelectorAll("#qzWho span").length}},i);qs.push(r);
  if(i===0){ok(r.n===4&&r.who===3,"soru ekranı: 4 seçenek, 3 yarışmacı");ok((await over(A)).length===0,"soru ekranında taşma yok");}
  if(i===4){await A.waitForSelector(".qz-res",{timeout:6000}).catch(()=>{});ok(await A.evaluate(()=>/Doğru cevap/.test(document.querySelector(".qz-res").textContent)&&!!document.querySelector(".qz-o button.ok")),"yanlışta doğru cevap gösteriliyor")}}
 ok(new Set(qs.map(x=>x.t)).size===10,"10 farklı soru");
 await A.waitForSelector(".qz-pod",{timeout:12000}).catch(()=>{});
 const fin=await A.evaluate(()=>{const R=YARISMA._t.R(),s=JSON.parse(R.d.s);return{st:R.d.st,me:s.sc[S.uid],rota:s.sc["bot:rota"],cl:s.sc["bot:clawd"],rows:document.querySelectorAll(".qz-sr").length,lsb:(LS.get("kadraj_qz_u1",{})||{}).best,again:!!document.querySelector('[data-qz="again"]')}});
 ok(fin.st==="over"&&fin.rows===3&&fin.again,"sonuç ekranı: kürsü, 3 satır, Yeniden oyna");
 ok(fin.me>=4500&&fin.me<=9000,"puanım 9 doğruyla mantıklı: "+fin.me+" (Rota "+fin.rota+", Clawd "+fin.cl+")");ok(fin.lsb===fin.me,"en iyi puan cihazda saklandı");
 ok((await over(A)).length===0,"sonuç ekranında taşma yok");
 ok(await A.evaluate(()=>!Object.keys(JSON.parse(localStorage.kadraj_db||"{}")).some(k=>/qz-/.test(k))),"Rota'ya karşı veritabanına yazmıyor");
 /* sohbet daveti boyanır */
 await A.evaluate(async()=>{closeAll();openChat("u:u2");await new Promise(r=>setTimeout(r,500));await sendMessage("u:u2",{text:"Bilgi yarışmasına gel! Kod: ABCDE",qz:"ABCDE"})});await A.waitForTimeout(900);
 ok(await A.evaluate(()=>!!document.querySelector('#msgs [data-qzjoin="ABCDE"]')),"sohbette davet mesajında Yarışmaya katıl düğmesi");
 await A.click('[data-qzjoin="ABCDE"]');await A.waitForTimeout(900);ok(await A.evaluate(()=>!!document.querySelector(".qz")),"davete dokununca yarışma açılıyor (oda yoksa uyarı)");
 /* iki sekme: oda */
 const B=await page(ctx,errors);await B.evaluate(async()=>{if(S.mode!=="local"||!DB)await bootLocal();S.uid="u2";settings.clawd=false;await enterApp(false)});
 for(const p of [A,B])await p.evaluate(()=>new Promise(r=>qzGo(Y=>{closeAll();Y._t.set({TQ:3000,TR:2500});Y.open();r()})));await A.waitForTimeout(300);
 await A.click('[data-qz="make"]');await A.waitForTimeout(800);const code=await A.evaluate(()=>YARISMA._t.R().c);ok(/^[A-Z0-9]{5}$/.test(code||""),"oda kuruldu: "+code);
 ok(await A.evaluate(()=>document.querySelector('[data-qz="go"]').disabled),"tek kişiyken Başlat kapalı");
 await B.fill("#qzCode",code.toLowerCase());await B.click('[data-qz="join"]');await B.waitForTimeout(1200);
 ok(await A.evaluate(()=>[...document.querySelectorAll(".qz-p b")].map(x=>x.textContent).join()==="Bilal Kara,Ayşe Yılmaz"),"kurucu katılanı görüyor");
 ok(await B.evaluate(()=>/bekleniyor/.test(document.querySelector("#qzB").textContent)),"katılan bekliyor");
 await A.click('[data-qz="go"]');await A.waitForTimeout(1000);
 const s1=await Promise.all([A,B].map(p=>p.evaluate(()=>{const R=YARISMA._t.R(),s=JSON.parse(R.d.s);return YARISMA._t.qOf(s.qs[s.qi]).txt+"|"+document.querySelectorAll(".qz-o button").length})));
 ok(s1[0]===s1[1]&&/\|4$/.test(s1[0]),"iki ekranda aynı ilk soru");
 /* A doğru, B yanlış cevap */
 for(const [p,right] of [[A,1],[B,0]])await p.evaluate(right=>{const R=YARISMA._t.R(),s=JSON.parse(R.d.s),q=YARISMA._t.qOf(s.qs[s.qi]);document.querySelector(`[data-qz="a:${right?q.ok:(q.ok+1)%4}"]`).click()},right);
 for(const p of [A,B])await p.waitForFunction(()=>{const R=YARISMA._t.R();return R&&JSON.parse(R.d.s).ph==="r"&&document.querySelector(".qz-res")},null,{timeout:2500}).catch(()=>{});
 const rv=await Promise.all([A,B].map(p=>p.evaluate(()=>{const R=YARISMA._t.R(),s=JSON.parse(R.d.s);return{ph:s.ph,sc:s.sc,res:(document.querySelector(".qz-res")||{}).className||""}})));
 ok(rv[0].ph==="r"&&rv[1].ph==="r","herkes cevaplayınca cevap hemen açıldı");
 ok(rv[0].sc.u1>500&&rv[0].sc.u2===0&&JSON.stringify(rv[0].sc)===JSON.stringify(rv[1].sc),"puanlar iki ekranda aynı: "+JSON.stringify(rv[0].sc));
 ok(/ok/.test(rv[0].res)&&/no/.test(rv[1].res),"kurucuda Doğru, katılanda Yanlış");
 /* ikinci soru: B cevap vermez, süre dolunca açılır */
 await A.waitForFunction(()=>{const s=JSON.parse(YARISMA._t.R().d.s);return s.qi===1&&s.ph==="q"},null,{timeout:7000}).catch(()=>{});
 await A.evaluate(()=>{const R=YARISMA._t.R(),s=JSON.parse(R.d.s),q=YARISMA._t.qOf(s.qs[s.qi]);document.querySelector(`[data-qz="a:${q.ok}"]`).click()});
 await B.waitForTimeout(3200);ok(await B.evaluate(()=>[...document.querySelectorAll(".qz-o button")].every(b=>b.disabled)),"süre dolunca katılanın düğmeleri kapandı");
 await B.waitForFunction(()=>JSON.parse(YARISMA._t.R().d.s).ph==="r",null,{timeout:4000}).catch(()=>{});
 ok(await B.evaluate(()=>/Cevap vermedin/.test((document.querySelector(".qz-res")||{}).textContent||"")),"süre dolunca açıldı: Cevap vermedin");
 ok((await over(B)).length===0,"oda ekranlarında taşma yok");
 /* kurucu çıkar, oda kapanır */
 await A.evaluate(()=>closeAll());await B.waitForTimeout(1300);
 ok(await B.evaluate(()=>!!document.querySelector('.qz [data-qz="solo"]')&&!YARISMA._t.R()),"kurucu çıkınca katılan menüye döndü");
 ok(errors.length===0,"sayfa hatası yok "+errors.slice(0,2).join(" | "));
 console.log(pass+"/"+(pass+fail));await b.close()})();
