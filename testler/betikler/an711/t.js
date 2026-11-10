/* 7.1.1 gelişmiş satranç: yeni bulmacalar + analiz tahtası. node t.js <genişlik> */
const {open}=require('../m70/lib.js');const W=+process.argv[2]||390;let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
const OUT='/tmp/claude-0/-home-user/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/an711/';require('fs').mkdirSync(OUT,{recursive:true});
(async()=>{const {b,p,errors}=await open(W,840);
 /* bulmacalar: hepsi motorla yeniden doğrulanır */
 let s=await p.evaluate(()=>{const isM=g=>CC.inCheck(g)&&!CC.legal(g).length;let bad=[];const ids=new Set();
  for(const z of PUZZLES){if(ids.has(z.id))bad.push("çift "+z.id);ids.add(z.id);const g=CC.fromFen(z.fen);
   if(z.n===1){const m=CC.fromUci(g,z.sol[0]);if(!m){bad.push(z.id);continue}CC.make(g,m);if(!isM(g))bad.push(z.id)}
   else{let mv=g;for(let k=0;k<z.sol.length;k++){const m=CC.fromUci(g,z.sol[k]);if(!m){bad.push(z.id+"@"+k);break}CC.make(g,m)}if(!isM(g))bad.push(z.id+" mat değil")}}
  return{n:PUZZLES.length,bad,newN:PUZZLES.filter(z=>/^g\d/.test(z.id)).length}});
 ok(s.n===84&&s.newN===60&&!s.bad.length,`bulmaca sayısı ${s.n} (yeni ${s.newN}), hatalı: ${s.bad.join(",")||"yok"}`);
 /* yeni iki hamlelik bulmacayı arayüzden çöz */
 await p.evaluate(()=>{const i=PUZZLES.findIndex(z=>z.id==="g26");pzOpen(i)});await p.waitForTimeout(900);
 s=await p.evaluate(()=>({mode:CH&&CH.mode,t:(document.querySelector("#cplT")||{}).textContent||""}));ok(s.mode==="puzzle","g26 bulmacası açıldı: "+s.t.replace(/\s+/g," ").slice(0,60));
 await p.evaluate(()=>{const z=PUZZLES[CH.pz.i];pzMove(CC.fromUci(CH.g,z.sol[0]))});await p.waitForTimeout(1600);
 await p.evaluate(()=>{const z=PUZZLES[CH.pz.i];const ms=CC.legal(CH.g);let m=null;for(const x of ms){CC.make(CH.g,x);const mt=CC.inCheck(CH.g)&&!CC.legal(CH.g).length;CC.unmake(CH.g);if(mt){m=x;break}}pzMove(m)});await p.waitForTimeout(900);
 s=await p.evaluate(()=>({done:CH.pz.done,solved:!!pzProg().s["g26"]}));ok(s.done&&s.solved,"iki hamlede mat çözüldü ve kaydedildi");
 /* lobi kutucuğu */
 await p.evaluate(()=>{closeAll();go("chess")});await p.waitForTimeout(800);
 s=await p.evaluate(()=>{const t=document.querySelector('.c6play [data-act="anOpen"]');const pz=document.querySelector('[data-act="pzgo"] small');return{t:!!t,pz:pz&&pz.textContent,ov:document.documentElement.scrollWidth-innerWidth}});
 ok(s.t&&/\/84/.test(s.pz||"")&&s.ov<=0,`lobide Analiz tahtası kutucuğu, bulmacalar "${s.pz}", taşma yok`);await p.screenshot({path:OUT+"lobby-"+W+".png"});
 /* analiz tahtası */
 await p.click('.c6play [data-act="anOpen"]');await p.waitForFunction(()=>window.ANALIZ&&document.querySelector("#anBd .an-s"),null,{timeout:8000});
 await p.waitForFunction(()=>!/düşünüyor/.test(document.getElementById("anIn").textContent),null,{timeout:12000});
 s=await p.evaluate(()=>({sq:document.querySelectorAll("#anBd .an-s").length,img:document.querySelectorAll("#anBd img").length,info:document.getElementById("anIn").textContent,ar:!!document.querySelector("#anBd .an-ar"),ev:document.getElementById("anEv").textContent,ov:document.querySelector(".an").scrollWidth-document.querySelector(".an").clientWidth}));
 ok(s.sq===64&&s.img===32&&/En iyi/.test(s.info)&&s.ar&&s.ov<=0,`tahta 64 kare 32 taş, ${s.info} (${s.ev}), ok çizildi, taşma yok`);
 /* e2-e4 dokunarak */
 const tap=async q=>{await p.click(`#anBd [data-ans="${q}"]`);await p.waitForTimeout(120)};
 await tap(52);s=await p.evaluate(()=>document.querySelectorAll("#anBd .an-s.tg").length);ok(s===2,"e2 piyonu seçildi, 2 hedef");
 await tap(36);await p.waitForTimeout(200);s=await p.evaluate(()=>ANALIZ._s().moves.map(m=>m.s).join(" "));ok(s==="e4","e4 oynandı: "+s);
 /* en iyiyi oyna x3 */
 for(let k=0;k<3;k++){await p.waitForFunction(()=>!document.querySelector('[data-an="best"]').disabled,null,{timeout:12000});await p.click('[data-an="best"]');await p.waitForTimeout(150)}
 s=await p.evaluate(()=>ANALIZ._s().moves.length);ok(s===4,"En iyiyi oyna üç kez: "+s+" hamle");
 /* geri / ileri / dal */
 await p.click('[data-an="first"]');await p.waitForTimeout(150);s=await p.evaluate(()=>ANALIZ._s().ply);ok(s===0,"başa dönüldü");
 await p.click('#anMv [data-anp="2"]');await p.waitForTimeout(150);s=await p.evaluate(()=>({ply:ANALIZ._s().ply,on:document.querySelector("#anMv .on").textContent}));ok(s.ply===2,"şeritten 2. hamleye: "+s.on);
 await p.keyboard.press("ArrowRight");await p.waitForTimeout(120);s=await p.evaluate(()=>ANALIZ._s().ply);ok(s===3,"sağ ok tuşu ileri");
 await p.evaluate(()=>ANALIZ._go(2));await p.waitForTimeout(100);await p.evaluate(()=>{const A=ANALIZ._s();const m=A.legal.find(x=>CC.uci(x)==="a2a3")||A.legal.find(x=>CC.uci(x)==="a7a6");ANALIZ._tap(m.f);ANALIZ._tap(m.t)});await p.waitForTimeout(150);
 s=await p.evaluate(()=>ANALIZ._s().moves.length);ok(s===3,"geçmişte yeni hamle: sonrası silindi ("+s+" hamle)");
 s=await p.evaluate(()=>ANALIZ._pgn());ok(/^1\. e4 \S+ 2\. \S+$/.test(s),"PGN: "+s);
 await p.screenshot({path:OUT+"an-"+W+".png"});
 /* çevir */
 await p.click('[data-an="flip"]');await p.waitForTimeout(150);s=await p.evaluate(()=>document.querySelector("#anBd .an-s").dataset.ans);ok(s==="63","tahta çevrildi");
 /* FEN: mat-1 konumu kur, motor M1 bulsun */
 await p.click('[data-an="fen"]');await p.waitForTimeout(400);await p.fill("#anFi","6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1");await p.click("#anFs");
 await p.waitForFunction(()=>/En iyi/.test(document.getElementById("anIn").textContent),null,{timeout:12000});
 s=await p.evaluate(()=>({i:document.getElementById("anIn").textContent,ev:document.getElementById("anEv").textContent,w:document.getElementById("anBar").style.width}));ok(/Kd8/.test(s.i)&&/M1/.test(s.ev)&&parseFloat(s.w)===100,"FEN kuruldu, motor matı buldu: "+s.i+" "+s.ev);
 await p.click('[data-an="best"]');await p.waitForTimeout(300);s=await p.evaluate(()=>document.getElementById("anIn").textContent);ok(/Şah mat/.test(s),"mat: "+s);
 await p.click('[data-an="fen"]');await p.waitForTimeout(400);await p.fill("#anFi","bozuk fen");await p.click("#anFs");await p.waitForTimeout(300);s=await p.evaluate(()=>!!document.querySelector('#overlay [data-layer="anfen"]'));ok(s,"geçersiz FEN reddedildi");
 await p.evaluate(()=>closeLayer("anfen"));await p.waitForTimeout(300);
 /* terfi */
 await p.evaluate(()=>{ANALIZ.open({fen:"8/4P3/8/8/8/8/k7/6K1 w - - 0 1"})});await p.waitForTimeout(400);await tap(12);await tap(4);s=await p.evaluate(()=>document.querySelectorAll(".an-pr button").length);ok(s===4,"terfi seçici: 4 taş");
 await p.click('.an-pr [data-anpr="2"]');await p.waitForTimeout(200);s=await p.evaluate(()=>ANALIZ._s().moves[0].s);ok(/=A/.test(s),"ata terfi: "+s);
 /* kapatma */
 await p.evaluate(()=>closeTop());await p.waitForTimeout(400);ok(!(await p.evaluate(()=>!!document.querySelector(".an"))),"geri tuşu kapatır");
 /* oyun sonu kartında Analiz et */
 await p.evaluate(()=>{chNew("bot",{my:0,level:0});for(const u of ["f2f3","e7e5","g2g4","d8h4"]){const m=CC.fromUci(CH.g,u);chApply(m)}chOpen()});await p.waitForTimeout(1600);
 s=await p.evaluate(()=>{const ov=document.querySelector("#cOv");return{over:!!(CH&&CH.over),b:!!document.querySelector('#cOv [data-act="anGame"]'),t:ov&&ov.textContent.replace(/\s+/g," ").slice(0,60)}});
 if(!s.b){await p.evaluate(()=>{try{chOver()}catch(e){}});await p.waitForTimeout(1600);s=await p.evaluate(()=>({over:!!(CH&&CH.over),b:!!document.querySelector('#cOv [data-act="anGame"]'),t:(document.querySelector("#cOv")||{}).textContent}))}
 ok(s.over&&s.b,"oyun sonu kartında Analiz et: "+JSON.stringify(s).slice(0,120));
 if(s.b){await p.click('#cOv [data-act="anGame"]');await p.waitForFunction(()=>document.querySelector(".an"),null,{timeout:6000});await p.waitForTimeout(400);
  s=await p.evaluate(()=>({n:ANALIZ._s().moves.length,i:document.getElementById("anIn").textContent}));ok(s.n===4&&/Şah mat/.test(s.i),"oyun analizde açıldı: "+s.n+" hamle, "+s.i)}
 ok(errors.length===0,"sayfa hatası yok "+errors.join(" | "));console.log(pass+"/"+(pass+fail));await b.close()})().catch(e=>{console.error(e);process.exit(1)});
