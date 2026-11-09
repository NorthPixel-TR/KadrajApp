/* Hata: sohbette zamanlanmış (henüz gitmemiş) mesajın varken son mesajını herkesten silince ya da düzenleyince
   sohbet listesindeki özet güncellenmiyordu (silinen mesaj iki tarafın listesinde de görünmeye devam ediyordu). */
const L=require('./lib.js');const {ok}=L;
(async()=>{const A=await L.open();const p=A.page;await L.seed(p);
 await p.evaluate(()=>go("chat",{key:"u:u2"}));await p.waitForTimeout(700);
 const cid=await p.evaluate(()=>cidFor("u1","u2"));
 await p.evaluate(async cid=>{await DB.set(`chats/${cid}/msgs/zz`,{from:"u1",at:Date.now()+3600e3,text:"gelecekteki mesaj",sch:1})},cid);await p.waitForTimeout(300);
 await p.fill("#msgIn","yanlış yazdım");await p.evaluate(()=>document.querySelector("#composer").requestSubmit());await p.waitForTimeout(600);
 let last=await p.evaluate(cid=>S.chats[cid].last.text,cid);ok(last==="yanlış yazdım","özet son mesaj");
 /* düzenle */
 const mid=await p.evaluate(()=>S.msgs.find(m=>m.text==="yanlış yazdım").id);
 await p.evaluate(mid=>msgMenu(mid),mid);await p.waitForTimeout(300);await p.evaluate(()=>document.getElementById("mmE").click());await p.waitForTimeout(300);
 await p.evaluate(()=>{document.getElementById("meT").value="doğrusu bu";document.getElementById("meF").requestSubmit()});await p.waitForTimeout(600);
 last=await p.evaluate(async cid=>(await DB.get("chats/"+cid)).last.text,cid);ok(last==="doğrusu bu","düzenlenince özet güncellendi ("+last+")");
 /* herkesten sil */
 await p.evaluate(mid=>msgMenu(mid),mid);await p.waitForTimeout(300);await p.evaluate(()=>document.getElementById("mmD").click());await p.waitForTimeout(300);
 await p.evaluate(()=>{const b=[...document.querySelectorAll("#overlay button")].find(x=>/Herkesten sil/.test(x.textContent)&&!x.id);b.click()});await p.waitForTimeout(700);
 last=await p.evaluate(async cid=>(await DB.get("chats/"+cid)).last,cid);ok(last&&last.text!=="doğrusu bu"&&last.text!=="yanlış yazdım"&&!/gelecekteki/.test(last.text),"silinince özet önceki mesaja döndü "+JSON.stringify(last));
 await L.done(A)})();
