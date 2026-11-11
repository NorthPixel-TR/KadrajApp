/* 7.1 Masa Oyunları: motor + arayüz. node t.js <genişlik> */
const {open}=require('../m70/lib.js');const W=+process.argv[2]||390;let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
const OUT='/tmp/claude-0/-home-user/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/masa/';require('fs').mkdirSync(OUT,{recursive:true});
(async()=>{const {b,p,errors}=await open(W,820);
 await p.evaluate(()=>{go("chats")});await p.waitForTimeout(500);
 await p.evaluate(()=>gmHub());await p.waitForTimeout(400);
 const hub=await p.evaluate(()=>[...document.querySelectorAll('[data-layer="games"] [data-gm]')].map(x=>x.dataset.gm));
 ok(["ms:okey","ms:renk","ms:pisti","ms:amiral"].every(k=>hub.includes(k))&&hub.includes("chess"),"Oyunlar penceresinde dört yeni oyun: "+hub.join(","));
 await p.screenshot({path:OUT+"hub-"+W+".png"});
 await p.click('[data-gm="ms:okey"]');await p.waitForFunction(()=>window.MASA&&document.querySelector(".ok-rack"),null,{timeout:8000});
 /* motor */
 const eng=await p.evaluate(()=>{const T=MASA._t,ok={c:0,n:5},t=(c,n)=>({c,n}),r={};
  r.runs=T.okSolve([t(1,1),t(1,2),t(1,3),t(1,4),t(2,7),t(2,8),t(2,9),t(3,10),t(3,11),t(3,12),t(3,13),t(0,9),t(1,9),t(3,9)],ok);
  r.wrap=T.okSolve([t(1,12),t(1,13),t(1,1),t(2,2),t(2,3),t(2,4),t(2,5),t(3,6),t(3,7),t(3,8),t(0,1),t(2,1),t(3,1),t(1,1)],ok);
  r.bad=T.okSolve([t(1,13),t(1,1),t(1,2),t(2,2),t(2,3),t(2,4),t(2,5),t(3,6),t(3,7),t(3,8),t(0,11),t(2,11),t(3,11),t(1,11)],ok);
  r.joker=T.okSolve([t(1,1),t(0,5),t(1,3),t(1,4),t(2,7),t(2,8),t(2,9),t(3,10),t(3,11),t(3,12),t(3,13),t(0,9),t(1,9),t(0,5)],ok);
  r.fake=T.okSolve([t(0,3),t(0,4),{f:1},t(0,6),t(2,7),t(2,8),t(2,9),t(3,10),t(3,11),t(3,12),t(3,13),t(0,9),t(1,9),t(3,9)],ok);
  r.pairs=T.okSolve([t(1,1),t(1,1),t(2,3),t(2,3),t(3,7),t(3,7),t(0,9),t(0,9),t(1,12),t(1,12),t(2,13),t(2,13),t(3,4),t(0,5)],ok);
  r.no=T.okSolve([t(1,1),t(1,3),t(2,3),t(2,6),t(3,7),t(3,9),t(0,9),t(0,11),t(1,12),t(1,8),t(2,13),t(2,10),t(3,4),t(0,2)],ok);
  r.dup=T.okSolve([t(1,1),t(1,2),t(1,3),t(1,1),t(1,2),t(1,3),t(2,7),t(2,8),t(2,9),t(2,10),t(0,9),t(1,9),t(3,9),t(2,9)],ok);
  /* 4 botla 30 el: taş sayısı korunuyor mu, el bitiyor mu */
  let wins=0,ties=0,bad=0,ms=0,turns=0;const t0=performance.now();
  for(let g=0;g<30;g++){const G=T.okDeal();let n=0,done=false;
   while(!done&&n<400){const i=G.turn,h=G.hands[i];if(h.length===14){const prev=G.dis[(i+3)%4],top=prev[prev.length-1];let took=false;if(top){const cur=T.okScore(h,G.ok),pk=T.okPick(h.concat([top]),G.ok);const after=T.okScore(h.concat([top]).filter((_,k)=>k!==pk.i),G.ok);if(pk.win||after>cur+6){h.push(prev.pop());took=true}}if(!took){const x=G.stock.pop();if(!x){ties++;done=true;break}h.push(x)}}
    const pk=T.okPick(h,G.ok),x=h.splice(pk.i,1)[0];G.dis[i].push(x);n++;if(pk.win){wins++;done=true;if(!T.okSolve(h,G.ok))bad++}G.turn=(i+1)%4}
   const tot=G.hands.reduce((a,h)=>a+h.length,0)+G.dis.reduce((a,d)=>a+d.length,0)+G.stock.length+1;if(tot!==106)bad++;turns+=n}
  r.sim={wins,ties,bad,ms:Math.round(performance.now()-t0),turns};
  const d=T.drDeck();r.dr=d.length;const pd=T.ptDeck();r.pt=pd.length;const ab=T.abPlace();r.ab=ab.ships.length+":"+ab.g.filter(Boolean).length;return r});
 ok(eng.runs&&eng.wrap&&!eng.bad,"okey: seri ve per bitiyor, 12-13-1 geçerli, 13-1-2 geçersiz");
 ok(eng.joker&&eng.fake,"okey: okey taşı joker, sahte okey okey taşının yerine");ok(eng.pairs&&!eng.no,"okey: 7 çift bitiyor, dağınık el bitmiyor");ok(eng.dup,"okey: aynı serinin iki kopyası");
 ok(eng.sim.bad===0&&eng.sim.wins+eng.sim.ties===30,`okey 30 bot eli: ${eng.sim.wins} biten, ${eng.sim.ties} berabere, ${eng.sim.turns} hamle, ${eng.sim.ms} ms`);
 ok(eng.dr===108&&eng.pt===52&&eng.ab==="5:14","desteler: Dörtrenk "+eng.dr+", Pişti "+eng.pt+", Amiral "+eng.ab);
 /* okey arayüzü */
 let s=await p.evaluate(()=>{const G=MASA._t.G();return{rack:document.querySelectorAll(".ok-rack [data-oki]").length,mine:G.rack.filter(Boolean).length,ov:document.querySelector(".ms").scrollWidth-document.querySelector(".ms").clientWidth,rw:document.querySelector(".ok-rack").scrollWidth-document.querySelector(".ok-rack").clientWidth,bw:document.querySelector("#msB").scrollWidth-document.querySelector("#msB").clientWidth}});
 ok(s.rack===24&&s.mine===15,"okey: ıstaka 24 yer, 15 taş");ok(s.ov<=0&&s.rw<=0&&s.bw<=0,"okey: yatay taşma yok ("+[s.ov,s.rw,s.bw]+")");
 await p.screenshot({path:OUT+"okey-"+W+".png"});
 /* bir taş seç, at; botlar oynar, sıra bana döner */
 await p.evaluate(()=>{const G=MASA._t.G();const i=G.rack.findIndex(Boolean);document.querySelector(`[data-oki="${i}"]`).click()});await p.waitForTimeout(100);
 await p.click('[data-ok="dis"]');await p.waitForTimeout(300);
 s=await p.evaluate(()=>{const G=MASA._t.G();return{t:G.turn,d0:G.dis[0].length,mine:G.rack.filter(Boolean).length}});ok(s.d0===1&&s.mine===14&&s.t!==0,"okey: taş atıldı, sıra botta");
 await p.waitForFunction(()=>{const G=MASA._t.G();return G&&(G.turn===0||G.over)},null,{timeout:9000});
 s=await p.evaluate(()=>{const G=MASA._t.G();return{t:G.turn,over:!!G.over,h:G.hands.slice(1).map(h=>h.length),st:G.stock.length}});ok(s.over||(s.t===0&&s.h.every(x=>x===14)),"okey: üç bot oynadı, sıra bende ("+JSON.stringify(s)+")");
 if(!s.over){await p.click('[data-ok="draw"]');await p.waitForTimeout(150);s=await p.evaluate(()=>{const G=MASA._t.G();return{mine:G.rack.filter(Boolean).length,sel:G.sel}});ok(s.mine===15&&s.sel>=0,"okey: ortadan çekildi, çekilen taş seçili");
  await p.click('[data-ok="sort"]');await p.waitForTimeout(100);await p.click('[data-ok="pairs"]');await p.waitForTimeout(100);
  /* yer değiştirme */
  const sw=await p.evaluate(()=>{const G=MASA._t.G();const a=G.rack[0];document.querySelector('[data-oki="0"]').click();document.querySelector('[data-oki="20"]').click();const G2=MASA._t.G();return G2.rack[20]===a&&G2.rack.filter(Boolean).length===15});ok(sw,"okey: taş boş yere taşındı");
  /* kazanma: eli bitecek şekilde kur */
  const won=await p.evaluate(()=>{const G=MASA._t.G(),t=(c,n)=>({c,n});G.ok={c:0,n:5};const h=[t(1,1),t(1,2),t(1,3),t(1,4),t(2,7),t(2,8),t(2,9),t(3,10),t(3,11),t(3,12),t(3,13),t(0,9),t(1,9),t(3,9),t(2,2)];G.rack=h.concat(new Array(9).fill(null));G.sel=14;G.drew=true;G.turn=0;document.querySelector('[data-ok="dis"]').click();return{over:!!MASA._t.G().over,end:(document.querySelector(".ms-end h2")||{}).textContent}});
  ok(won.over&&/Kazandın/.test(won.end||""),"okey: el bitince kazanma ekranı ("+won.end+")");await p.screenshot({path:OUT+"okey-win-"+W+".png"})}
 /* Dörtrenk: tam oyun, hep ilk oynanabilir kart */
 await p.click('.ms-end [data-ms="menu"]').catch(()=>{});await p.waitForTimeout(200);
 const menu=await p.evaluate(()=>document.querySelectorAll(".ms-menu .ms-m").length);ok(menu===5,"menü: 4 oyun + Dörtrenk arkadaşlarla");await p.screenshot({path:OUT+"menu-"+W+".png"});
 await p.click('[data-ms="g:renk"]');await p.waitForTimeout(300);await p.screenshot({path:OUT+"renk-"+W+".png"});
 let n=0;for(;n<400;n++){const st=await p.evaluate(()=>{const G=MASA._t.G();if(!G||G.over)return"over";if(G.pick!=null){document.querySelector("[data-drc]").click();return"pick"}if(G.turn!==0)return"wait";const c=document.querySelector(".cd-hand .cd.ok");if(c){c.click();return"play"}document.querySelector("[data-drd]").click();return"draw"});if(st==="over")break;await p.waitForTimeout(st==="wait"?250:40)}
 s=await p.evaluate(()=>{const G=MASA._t.G();const tot=G.hands.reduce((a,h)=>a+h.length,0)+G.pile.length+G.deck.length;return{over:!!G.over,tot,end:(document.querySelector(".ms-end h2")||{}).textContent,ov:document.querySelector("#msB").scrollWidth-document.querySelector("#msB").clientWidth}});
 ok(s.over&&s.tot===108,"Dörtrenk: oyun bitti ("+s.end+"), 108 kart korunuyor, "+n+" adım");ok(s.ov<=0,"Dörtrenk: taşma yok");
 /* Pişti: tam oyun */
 await p.click('.ms-end [data-ms="menu"]');await p.waitForTimeout(150);await p.click('[data-ms="g:pisti"]');await p.waitForTimeout(300);await p.screenshot({path:OUT+"pisti-"+W+".png"});
 for(n=0;n<200;n++){const st=await p.evaluate(()=>{const G=MASA._t.G();if(!G||G.over)return"over";if(G.turn!==0)return"wait";const c=document.querySelector("[data-pt]");if(c){c.click();return"play"}return"wait"});if(st==="over")break;await p.waitForTimeout(st==="wait"?200:30)}
 s=await p.evaluate(()=>{const G=MASA._t.G();return{over:!!G.over,tot:G.p[0].won.length+G.p[1].won.length+G.pile.length+G.deck.length+G.p[0].h.length+G.p[1].h.length,end:(document.querySelector(".ms-end h2")||{}).textContent,sub:(document.querySelector(".ms-end p")||{}).textContent}});
 ok(s.over&&s.tot===52,"Pişti: oyun bitti ("+s.end+" · "+s.sub+"), 52 kart");
 /* Amiral: tam oyun */
 await p.click('.ms-end [data-ms="menu"]');await p.waitForTimeout(150);await p.click('[data-ms="g:amiral"]');await p.waitForTimeout(300);await p.screenshot({path:OUT+"amiral-"+W+".png"});
 for(n=0;n<400;n++){const st=await p.evaluate(()=>{const G=MASA._t.G();if(!G||G.over)return"over";if(G.turn!==0)return"wait";const c=[...document.querySelectorAll("[data-ab]")].find(x=>!G.bot.shot[+x.dataset.ab]);c.click();return"play"});if(st==="over")break;await p.waitForTimeout(st==="wait"?200:20)}
 s=await p.evaluate(()=>{const G=MASA._t.G();return{over:!!G.over,end:(document.querySelector(".ms-end h2")||{}).textContent,ov:document.querySelector("#msB").scrollHeight-document.querySelector("#msB").clientHeight}});
 ok(s.over,"Amiral Battı: oyun bitti ("+s.end+")");await p.screenshot({path:OUT+"amiral-end-"+W+".png"});
 /* geri/Esc: oyun sürerken sorar, menüden kapanır */
 await p.click('.ms-end [data-ms="new"]');await p.waitForTimeout(200);
 await p.evaluate(()=>{const G=MASA._t.G();const c=[...document.querySelectorAll("[data-ab]")][0];c.click()});await p.waitForTimeout(100);
 await p.evaluate(()=>closeTop());await p.waitForTimeout(250);
 let d=await p.evaluate(()=>({dlg:!!document.querySelector('#overlay .dialog'),ms:!!document.querySelector('.ms')}));ok(d.dlg&&d.ms,"geri tuşu oyun sürerken sorar");
 await p.evaluate(()=>{const bt=[...document.querySelectorAll('#overlay .dialog button')].find(x=>/Çık/.test(x.textContent));bt.click()});await p.waitForTimeout(250);
 d=await p.evaluate(()=>({menu:!!document.querySelector('.ms-menu'),g:!!MASA._t.G()}));ok(d.menu&&!d.g,"Çık → oyun menüsü");
 await p.evaluate(()=>closeTop());await p.waitForTimeout(400);d=await p.evaluate(()=>!document.querySelector('.ms'));ok(d,"menüde geri → kapanır");
 const st2=await p.evaluate(()=>LS.get("kadraj_masa_u1"));ok(st2&&st2.okey===1,"galibiyet sayısı kaydedildi: "+JSON.stringify(st2));
 ok(errors.length===0,"sayfa hatası yok "+errors.join(" | "));console.log(pass+"/"+(pass+fail));await b.close()})().catch(e=>{console.error(e);process.exit(1)});
