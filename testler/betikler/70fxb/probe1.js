const {rich,ok,done}=require('./h.js');
(async()=>{const A=await rich({width:390});const p=A.page;
 // engellenen kişinin beğenisi/takibi bildirimlerde
 let r=await p.evaluate(async()=>{await DB.update("profiles/u1",{blocked:{u3:Date.now()}});S.profiles.u1={...S.profiles.u1,blocked:{u3:Date.now()}};
  return activity().filter(a=>a.uid==="u3").map(a=>a.t)});
 console.log("blocked activity",r);
 // gizli kelime: yorum önizlemesi
 r=await p.evaluate(async()=>{settings.hideW=["pazartesi"];await setMeta("p1",{comments:{cx:{uid:"u2",text:"pazartesi berbat",at:Date.now()}}});tab("feed");await new Promise(r=>setTimeout(r,300));
  const card=document.querySelector('article.card[data-pid="p1"]');return{card:card&&/pazartesi/.test(card.textContent),act:activity().some(a=>a.text&&/pazartesi/.test(a.text))}});
 console.log("hw",r);
 await p.evaluate(()=>{tab("activity")});await p.waitForTimeout(300);
 console.log("act page shows",await p.evaluate(()=>/pazartesi/.test(document.querySelector("#main").textContent)));
 // arşivlenmiş Klaket
 r=await p.evaluate(async()=>{await DB.set("posts/rk1",{uid:"u1",at:Date.now()-5000,kind:"reel",slides:["img/kahve.jpg"],fx:"zoom",music:"none",text:"x",arch:1});await new Promise(r=>setTimeout(r,300));
  arcSheet();await new Promise(r=>setTimeout(r,200));const b=document.querySelector('[data-arcv="rk1"]');b&&b.click();await new Promise(r=>setTimeout(r,600));return{route:S.route.name,has:!!document.querySelector('.reel[data-pid="rk1"]'),n:document.querySelectorAll(".reel").length}});
 console.log("arch reel",r);
 await done(A)})();
