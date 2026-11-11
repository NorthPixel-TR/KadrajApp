// 7.1.8: Dörtrenk arkadaşlarla (iki sekme, aynı LocalDB): oda kur, kodla katıl, başlat, sırayla oyna, bot oynar, çıkan bot olur
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const HTML='/home/user/kadrajapp/index.html',BASE='http://kadraj.test/';let pass=0,fail=0;const ok=(c,m)=>{console.log((c?"OK  ":"FAIL")+" "+m);c?pass++:fail++};
async function page(ctx,errors){const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));
 await p.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE)){const q=decodeURIComponent(new URL(u).pathname);if(q==='/'||q==='/index.html')return r.fulfill({body:fs.readFileSync(HTML),contentType:'text/html; charset=utf-8'});const f=path.join(path.dirname(HTML),q);if(fs.existsSync(f)&&fs.statSync(f).isFile())return r.fulfill({body:fs.readFileSync(f)});return r.fulfill({status:404,body:''})}if(u.startsWith('data:')||u.startsWith('blob:'))return r.continue();return r.abort()});
 await p.goto(BASE+'index.html');await p.waitForTimeout(1200);return p}
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:820},hasTouch:true});const errors=[];
 const A=await page(ctx,errors);
 await A.evaluate(async()=>{if(S.mode!=="local"||!DB)await bootLocal();const T=Date.now();for(const [uid,name,un] of [["u1","Bilal Kara","bilal"],["u2","Ayşe Yılmaz","ayse"]])await DB.set("profiles/"+uid,{uid,username:un,name,bio:"",avatar:null,following:{},botFollowers:{},private:false,createdAt:T});S.uid="u1";await enterApp(false);settings.clawd=false});
 const B=await page(ctx,errors);
 await B.evaluate(async()=>{if(S.mode!=="local"||!DB)await bootLocal();S.uid="u2";await enterApp(false);settings.clawd=false});
 const load=p=>p.evaluate(()=>new Promise(r=>msLoad?msLoad(()=>r()):r())).catch(()=>{});
 for(const p of [A,B]){await p.evaluate(()=>new Promise(r=>{const s=document.createElement("script");s.src="masa.js?v="+APP_V;s.onload=r;document.head.appendChild(s)}));await p.evaluate(()=>{closeAll();MASA.open()});await p.waitForTimeout(300)}
 ok(await A.$('[data-ms="on:renk"]'),"menüde Dörtrenk · Arkadaşlarla");
 await A.click('[data-ms="on:renk"]');await A.waitForTimeout(300);await A.click('[data-ms="on:make"]');await A.waitForTimeout(800);
 const code=await A.evaluate(()=>MASA._on.c);ok(/^[A-Z0-9]{5}$/.test(code||""),"oda kuruldu: "+code);
 ok(await A.evaluate(()=>!!document.querySelector(".on-code b")&&document.querySelector('[data-ms="on:go"]').disabled),"lobi: kod görünür, tek kişiyken Başlat kapalı");
 await B.click('[data-ms="on:renk"]');await B.waitForTimeout(300);await B.fill("#onCode",code.toLowerCase());await B.click('[data-ms="on:join"]');await B.waitForTimeout(1200);
 const lob=await A.evaluate(()=>[...document.querySelectorAll(".on-seats b")].map(x=>x.textContent));ok(lob[0]==="Bilal Kara"&&lob[1]==="Ayşe Yılmaz","kurucu katılanı görüyor: "+lob.join(","));
 ok(await B.evaluate(()=>/bekleniyor/.test(document.querySelector("#msB").textContent)),"katılan bekliyor");
 await A.click('[data-ms="on:go"]');await A.waitForTimeout(1200);
 const sA=await A.evaluate(()=>{const G=MASA._t.G();return{me:G.me,turn:G.turn,n:G.hands[0].length,h:G.human}}),sB=await B.evaluate(()=>{const G=MASA._t.G();return G&&{me:G.me,turn:G.turn,n:G.hands[1].length,opp:[...document.querySelectorAll(".ms-o b")].map(x=>x.textContent)}});
 ok(sA.me===0&&sB&&sB.me===1&&sA.turn===0&&sB.turn===0,"iki ekranda aynı oyun, sıra kurucuda");
 ok(sB&&sB.opp.includes("Bilal Kara")&&sB.opp.length===3,"katılan rakip olarak kurucuyu görüyor: "+(sB&&sB.opp.join(",")));
 // kurucu oynar (oynanabilir kart ya da çek)
 const playA=async(p)=>p.evaluate(()=>{const okb=document.querySelector(".cd-hand .cd.ok");if(okb){okb.click();const c=document.querySelector("[data-drc]");if(c)c.click()}else document.querySelector("[data-drd]").click()});
 await playA(A);await A.waitForTimeout(400);await A.evaluate(()=>{const G=MASA._t.G();if(G&&G.turn===0&&!G.over)document.querySelector("[data-drd]").click()});await A.waitForTimeout(1500);
 const t2=await B.evaluate(()=>{const G=MASA._t.G();return{turn:G.turn,seq:G.seq}}),t1=await A.evaluate(()=>MASA._t.G().seq);
 ok(t2.seq===t1&&t2.seq>=2,"hamle karşıya geçti (seq "+t1+"/"+t2.seq+")");
 // sıra B'ye gelene kadar bekle (botlar kurucuda oynar)
 let gotB=false;for(let i=0;i<60&&!gotB;i++){await B.waitForTimeout(400);if(await A.evaluate(()=>{const G=MASA._t.G();return G.turn===0&&!G.over}))await playA(A);gotB=await B.evaluate(()=>{const G=MASA._t.G();return G&&(G.turn===1||G.over)})}
 ok(gotB,"sıra katılana geldi (arada botlar oynadı)");
 if(await B.evaluate(()=>!MASA._t.G().over)){const s0=await A.evaluate(()=>MASA._t.G().seq);for(let k=0;k<6&&await B.evaluate(()=>{const G=MASA._t.G();return G.turn===1&&!G.over});k++){await playA(B);await B.waitForTimeout(400)}await B.waitForTimeout(1500);
  ok(await A.evaluate(s0=>{const G=MASA._t.G();return G.seq>s0||G.over},s0),"katılanın hamlesi kurucuya geçti")}
 // katılan çıkar: kurucuda bot olur
 await B.evaluate(()=>{MASA._t.G().moved=0;closeAll()});await B.waitForTimeout(1500);
 const hu=await A.evaluate(()=>MASA._t.G().human[1]);ok(hu===0,"çıkan oyuncunun yerine bot geçti");
 let moved=false;for(let i=0;i<25&&!moved;i++){await A.evaluate(()=>{const G=MASA._t.G();if(G.turn===0&&!G.over){const okb=document.querySelector(".cd-hand .cd.ok");if(okb){okb.click();const c=document.querySelector("[data-drc]");if(c)c.click()}else document.querySelector("[data-drd]").click()}});await A.waitForTimeout(500);moved=await A.evaluate(()=>{const G=MASA._t.G();return G.over||G.seq>12})}
 ok(moved,"oyun botlarla sürüyor");
 await A.screenshot({path:"/tmp/v718.png"});
 await A.evaluate(()=>{MASA._t.G().moved=0;closeAll()});await A.waitForTimeout(600);
 ok(await A.evaluate(c=>DB.get("games/ms-"+c).then(d=>d.st),code)==="over","kurucu çıkınca oda kapandı");
 ok(errors.length===0,"sayfa hatası yok "+errors.join(" | "));
 console.log(pass+"/"+(pass+fail));await b.close();process.exit(fail?1:0)})();
