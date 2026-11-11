// 7.2.2 Çiz Bil (iki sekme, aynı LocalDB): oda, katılma, kelime seçme, çizim karşıya geçer, yanlış/doğru tahmin, puan, tur geçişi, oyun sonu, sohbet daveti. node t.js [genişlik]
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const HTML='/home/user/kadrajapp/index.html',BASE='http://kadraj.test/',W=+process.argv[2]||390,O='/tmp/claude-0/-home-user/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/';let pass=0,fail=0;const ok=(c,m)=>{console.log((c?"OK  ":"FAIL")+" "+m);c?pass++:fail++};
async function page(ctx,errors){const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));
 await p.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE)){const q=decodeURIComponent(new URL(u).pathname);if(q==='/'||q==='/index.html')return r.fulfill({body:fs.readFileSync(HTML),contentType:'text/html; charset=utf-8'});const f=path.join(path.dirname(HTML),q);if(fs.existsSync(f)&&fs.statSync(f).isFile())return r.fulfill({body:fs.readFileSync(f)});return r.fulfill({status:404,body:''})}return r.abort()});
 await p.goto(BASE+'index.html');await p.waitForTimeout(1200);return p}
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:W,height:820},hasTouch:true});const errors=[];
 const A=await page(ctx,errors);
 await A.evaluate(async()=>{if(S.mode!=="local"||!DB)await bootLocal();const T=Date.now();for(const [uid,name,un] of [["u1","Bilal Kara","bilal"],["u2","Ayşe Yılmaz","ayse"]])await DB.set("profiles/"+uid,{uid,username:un,name,bio:"",avatar:null,following:{u1:T,u2:T},botFollowers:{},private:false,createdAt:T});S.uid="u1";await enterApp(false);settings.clawd=false});
 const B=await page(ctx,errors);
 await B.evaluate(async()=>{if(S.mode!=="local"||!DB)await bootLocal();S.uid="u2";await enterApp(false);settings.clawd=false});
 // Oyunlar penceresinden aç
 await A.evaluate(()=>{closeAll();gmHub()});await A.waitForTimeout(300);ok(await A.$('[data-gm="cz"]'),"Oyunlar penceresinde Çiz Bil");await A.click('[data-gm="cz"]');await A.waitForTimeout(900);
 ok(await A.evaluate(()=>!!window.CIZ&&/Çiz Bil/.test(document.querySelector(".cz").textContent)),"ciz.js yüklendi, menü açıldı");
 for(const p of [A,B])await p.evaluate(()=>new Promise(r=>czGo(C=>{C._t.set({TD:9000,TC:2500,TR:1200});r()})));
 const wl=await A.evaluate(()=>{const W=CIZ._t.WORDS;return{n:W.length,dup:W.length-new Set(W).size,bad:W.filter(w=>!/^[a-zçğıöşü ]+$/.test(w)).length}});ok(wl.n>=150&&!wl.dup&&!wl.bad,"kelime listesi "+JSON.stringify(wl));
 ok(await A.evaluate(()=>{const t=CIZ._t;return t.fold("Kaplumbağa")==="kaplumbaga"&&t.fold(" Kardan  Adam!")==="kardanadam"&&t.near("kaplumbaa","kaplumbağa")&&!t.near("kedi","kedi")&&t.dec(t.enc("şemsiye","AB12C",3),"AB12C",3)==="şemsiye"&&t.dec(t.enc("şemsiye","AB12C",3),"AB12C",4)!=="şemsiye"}),"katlama, yakınlık ve şifre");
 await A.click('[data-cz="make"]');await A.waitForTimeout(800);const code=await A.evaluate(()=>CIZ._t.R()&&CIZ._t.R().c);ok(/^[A-Z0-9]{5}$/.test(code||""),"oda kuruldu "+code);
 ok(await A.evaluate(()=>document.querySelector('[data-cz="go"]').disabled),"tek kişiyken Başlat kapalı");
 await B.evaluate(()=>CIZ.open());await B.waitForTimeout(300);await B.fill("#czCode",code.toLowerCase());await B.click('[data-cz="join"]');await B.waitForTimeout(1200);
 ok(await A.evaluate(()=>document.querySelectorAll(".cz-p").length===2&&!document.querySelector('[data-cz="go"]').disabled),"katılan lobide, Başlat açık");
 await A.screenshot({path:O+"cz-lobby-"+W+".png"});
 await A.click('[data-cz="go"]');await A.waitForTimeout(1000);
 const who=async()=>{const s=await A.evaluate(()=>JSON.parse(CIZ._t.R().d.s));return s};let s=await who();
 const D=s.dr==="u1"?A:B,G=s.dr==="u1"?B:A;ok(s.ph==="ch"&&s.n===4,"oyun başladı, 4 tur, çizen "+s.dr);
 ok(await D.evaluate(()=>document.querySelectorAll(".cz-ch button").length===3)&&await G.evaluate(()=>/kelime seçiyor/.test(document.querySelector(".cz").textContent)),"çizen 3 kelime görüyor, diğeri bekliyor");
 await D.screenshot({path:O+"cz-choose-"+W+".png"});
 const w=await D.evaluate(()=>document.querySelectorAll(".cz-ch button")[1].textContent);await D.click('.cz-ch button:nth-child(2)');await D.waitForTimeout(1200);
 s=await who();ok(s.ph==="dr",`kelime seçildi (${w}), çizim başladı`);
 ok(await G.evaluate(w=>!document.querySelector(".cz").textContent.includes(w)&&/harf/.test(document.querySelector(".cz-wd").textContent),w),"tahmin eden kelimeyi görmüyor, harf sayısını görüyor");
 // çiz: iki çizgi, renk değiştir
 const cv=await D.$("#czC");const bb=await cv.boundingBox();await D.click('[data-cz="c:2"]');
 await D.mouse.move(bb.x+40,bb.y+40);await D.mouse.down();for(let i=1;i<20;i++)await D.mouse.move(bb.x+40+i*8,bb.y+40+i*5);await D.mouse.up();
 await D.click('[data-cz="c:6"]');await D.click('[data-cz="w:2"]');await D.mouse.move(bb.x+60,bb.y+bb.height-60);await D.mouse.down();for(let i=1;i<15;i++)await D.mouse.move(bb.x+60+i*10,bb.y+bb.height-60-i*3);await D.mouse.up();
 await D.waitForTimeout(1300);
 const got=await G.evaluate(()=>{const R=CIZ._t.R();const c=document.querySelector("#czC").getContext("2d").getImageData(0,0,document.querySelector("#czC").width,document.querySelector("#czC").height).data;let n=0;for(let i=0;i<c.length;i+=4)if(c[i]<250||c[i+1]<250||c[i+2]<250)n++;return{st:R.strokes.length,cols:R.strokes.map(x=>x.c+"/"+x.w).join(","),ink:n}});
 ok(got.st===2&&got.cols==="2/1,6/2"&&got.ink>500,"çizim karşıda göründü "+JSON.stringify(got));
 await D.click('[data-cz="undo"]');await D.waitForTimeout(500);ok(await G.evaluate(()=>CIZ._t.R().strokes.length===1),"geri al karşıya geçti");
 // yanlış ve yakın tahmin
 const wr=await D.evaluate(()=>{const s=JSON.parse(CIZ._t.R().d.s);return CIZ._t.dec(s.w,CIZ._t.R().c,s.g*100+s.r)});
 await G.fill("#czG","yanlışbirşey");await G.click('[data-cz="guess"]');await G.waitForTimeout(700);
 ok(await D.evaluate(()=>/yanlışbirşey/.test(document.querySelector("#czF").textContent)),"yanlış tahmin herkesin listesinde");
 if(wr.replace(/ /g,"").length>=4){await G.fill("#czG",wr.slice(0,-1));await G.click('[data-cz="guess"]');await G.waitForTimeout(300);ok(await G.evaluate(()=>/yakın/.test(document.querySelector("#czN").textContent))&&!(await D.evaluate(x=>document.querySelector("#czF").textContent.includes(x),wr.slice(0,-1))),"bir harf eksikte yalnızca kendine Çok yakın")}
 await G.screenshot({path:O+"cz-guess-"+W+".png"});await D.screenshot({path:O+"cz-draw-"+W+".png"});
 await G.fill("#czG",wr.toLocaleUpperCase("tr").replace(/ /g,"  "));await G.click('[data-cz="guess"]');await G.waitForTimeout(1600);
 s=await who();ok(s.ph==="rv"&&Object.values(s.last).filter(x=>x>0).length===2,"doğru tahmin: tur bitti, ikisi de puan aldı "+JSON.stringify(s.last));
 ok(await A.evaluate(w=>document.querySelector(".cz-rv h2").textContent===w.toLocaleUpperCase("tr"),wr),"sonuçta kelime görünür");
 await A.screenshot({path:O+"cz-reveal-"+W+".png"});
 await A.waitForTimeout(1800);s=await who();ok(s.r===1&&s.ph==="ch"&&s.dr!==(D===A?"u1":"u2"),"sonraki tur, çizen değişti");
 // seçmezse ilk kelime, kimse bilmezse süre dolunca tur biter
 await A.waitForTimeout(4200);s=await who();ok(s.ph==="dr","seçim süresi dolunca kendiliğinden kelime");
 await A.waitForTimeout(10500);s=await who();ok(s.r===1&&s.ph==="rv"||s.r===2,"süre dolunca tur bitti");
 // kalan turları hızla bitir
 for(let k=0;k<40;k++){s=await who();if(s.ph==="end"||(await A.evaluate(()=>CIZ._t.R().d.st))==="over")break;const P=s.dr==="u1"?A:B,Q2=s.dr==="u1"?B:A;
  if(s.ph==="ch")await P.evaluate(()=>{const b=document.querySelector(".cz-ch button");if(b)b.click()});
  else if(s.ph==="dr"){const x=await P.evaluate(()=>{const s=JSON.parse(CIZ._t.R().d.s);return CIZ._t.dec(s.w,CIZ._t.R().c,s.g*100+s.r)});await Q2.evaluate(x=>{const g=document.querySelector("#czG");if(g){g.value=x;document.querySelector('[data-cz="guess"]').click()}},x)}
  await A.waitForTimeout(800)}
 ok(await A.evaluate(()=>CIZ._t.R().d.st==="over")&&await B.evaluate(()=>/Oyun bitti/.test(document.querySelector(".cz").textContent)),"4 tur sonunda oyun bitti, iki ekranda sonuç");
 await B.screenshot({path:O+"cz-over-"+W+".png"});
 ok(await A.evaluate(()=>!!document.querySelector('[data-cz="again"]'))&&await B.evaluate(()=>!document.querySelector('[data-cz="again"]')),"yalnızca kurucu yeniden başlatabilir");
 ok(await A.evaluate(()=>{const o=LS.get("kadraj_cz_u1",{});return o.games===1}),"istatistik kaydı");
 // kurucu çıkınca oda kapanır
 await A.evaluate(()=>closeLayer("ciz"));await A.waitForTimeout(1000);ok(await B.evaluate(()=>/Kodla katıl/.test(document.querySelector(".cz").textContent)),"kurucu çıkınca katılan menüye döndü");
 // sohbetten davet
 await A.evaluate(()=>{closeAll();openChat("u:u2")});await A.waitForTimeout(800);await A.evaluate(()=>gmChat("u:u2",true));await A.waitForTimeout(300);ok(await A.$('[data-gmc="cz"]'),"sohbet Oyunlar listesinde Çiz Bil");
 await A.click('[data-gmc="cz"]');await A.waitForTimeout(1500);const c2=await A.evaluate(()=>CIZ._t.R()&&CIZ._t.R().c);
 await A.evaluate(()=>closeLayer("ciz"));await A.waitForTimeout(300);await B.evaluate(()=>{closeAll();openChat("u:u1")});await B.waitForTimeout(1200);
 ok(await B.evaluate(c=>{const x=document.querySelector("[data-czjoin]");return x&&x.dataset.czjoin===c},c2),"davet mesajında Oyuna katıl ("+c2+")");
 const sw=await A.evaluate(()=>document.documentElement.scrollWidth-innerWidth);ok(sw<=0,"taşma yok");
 ok(errors.length===0,"sayfa hatası yok "+errors.join(" | "));console.log(pass+"/"+(pass+fail));await b.close()})();
