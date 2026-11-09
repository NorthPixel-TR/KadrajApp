/* Hata: engellediğin kişi Meydan'a yazınca yine "Meydan" bildirimi (kart + telefon) geliyordu (sohbette mesajı gizli);
   gizli kullanıcıya da kapalı olan Meydan'ın bildirimleri geliyordu. */
const L=require('./lib.js');const {ok}=L;
(async()=>{const A=await L.open();const p=A.page;await L.seed(p);await p.waitForTimeout(3500);
 const fire=async(from)=>p.evaluate(async from=>{KN.cards.forEach(c=>c.remove());KN.cards=[];KN.queue=[];const at=Date.now();await DB.set("chats/meydan/msgs/x"+at,{from,at,text:"meydan mesajı "+from});await DB.set("chats/meydan",{last:{text:"meydan mesajı "+from,from,at},updatedAt:at});
  await new Promise(r=>setTimeout(r,500));return KN.cards.map(c=>c._o.text).concat(KN.queue.map(q=>q.text))},from);
 let r=await fire("u2");ok(r.length===1,"engellenmemiş kişinin Meydan mesajı bildirilir "+JSON.stringify(r));
 await p.evaluate(()=>blkSet("u2",true));await p.waitForTimeout(400);
 r=await fire("u2");ok(r.length===0,"engellenen kişinin Meydan mesajı bildirilmez "+JSON.stringify(r));
 await p.evaluate(()=>go("chats"));await p.waitForTimeout(400);
 const mc=await p.evaluate(()=>{const b=document.querySelector('[data-chat="meydan"]');return b&&b.textContent});ok(mc&&!/meydan mesajı u2/.test(mc)&&!/YENİ/.test(mc),"Meydan kartı engellenenin mesajını göstermez "+mc);
 r=await fire("u3");ok(r.length===1,"başkasınınki bildirilir");
 await p.evaluate(()=>{S.adm={...(S.adm||{}),gizli:{list:{u1:{at:1,ok:{u3:1}}}}}});
 r=await fire("u3");ok(r.length===0,"gizli kullanıcıya Meydan bildirimi gelmez "+JSON.stringify(r));
 await L.done(A)})();
