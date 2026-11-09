/* Hata: DM'de @rota çağrılınca Rota'nın yanıtı karşı tarafa "Rota" bildirimi olarak gidiyor; karta dokununca
   arkadaşla DM yerine kişinin kendi Rota sohbeti açılıyor, karttan yanıt Rota botuna gidiyor. */
const L=require('./lib.js');const {ok}=L;
(async()=>{const A=await L.open();const p1=A.page;await L.seed(p1,{as:"u1"});
 const B=await L.open({browser:A.browser,ctx:A.ctx});const p2=B.page;await p2.evaluate(async()=>{await bootLocal();S.uid="u2";await enterApp(false)});await p2.waitForTimeout(800);await p2.evaluate(()=>closeAll());
 await p1.waitForTimeout(3600);await p1.evaluate(()=>go("chat",{key:"u:u2"}));await p1.waitForTimeout(600);
 await p1.fill("#msgIn","@rota bize bir film öner");await p1.evaluate(()=>document.querySelector("#composer").requestSubmit());await p1.waitForTimeout(2500);
 const last=await p1.evaluate(()=>S.chats[cidFor("u1","u2")].last);ok(last&&last.from==="bot:rota","Rota DM'de yanıt verdi (last.from="+(last&&last.from)+")");
 const cards=await p2.evaluate(()=>KN.cards.map(c=>({key:c._o.key,title:c._o.title,text:c._o.text})));
 console.log("u2 kartları:",JSON.stringify(cards));
 ok(cards.length&&cards.every(c=>c.key==="u:u1"),"u2'nin kartı Bilal ile DM'i açar (u:u1)");
 ok(!cards.some(c=>c.key==="u:bot:rota"),"Rota sohbetine giden kart yok");
 // karttan yanıt: Bilal ile DM'e gitmeli
 await p2.evaluate(()=>{const c=KN.cards[KN.cards.length-1];if(c)c.querySelector('[data-kn="reply"]').click()});await p2.waitForTimeout(200);
 await p2.evaluate(()=>{const c=KN.cards[KN.cards.length-1];const i=c&&c.querySelector(".kn-in");if(i){i.value="sağol";c.querySelector(".kn-r").requestSubmit()}});await p2.waitForTimeout(1200);
 const r=await p2.evaluate(async()=>{const d=JSON.parse(localStorage.getItem("kadraj_db"));const dm=Object.entries(d).filter(([k,v])=>k.startsWith("chats/"+cidFor("u1","u2")+"/msgs/")&&v.text==="sağol").length;const bot=((await DB.get("data/users/u2/bot-rota"))||{msgs:[]}).msgs.filter(m=>m.text==="sağol").length;return{dm,bot}});
 ok(r.dm===1&&r.bot===0,"karttan yanıt Bilal ile DM'e gitti "+JSON.stringify(r));
 // telefon bildirimi anahtarı
 const sys=await p2.evaluate(()=>{let o=null;const f=knSys;knSys=x=>{o=x};try{const c=S.chats[cidFor("u1","u2")];notifyChats({[cidFor("u1","u2")]:{...c,last:{text:"x",from:"bot:rota",at:Date.now()+5}}})}finally{knSys=f}return o&&{key:o.key,title:o.title}});
 console.log("telefon bildirimi:",JSON.stringify(sys));ok(sys&&sys.key==="u:u1","telefon bildirimi de Bilal ile DM'e gider");
 B.errors.forEach(e=>A.errors.push(e));await L.done(A)})();
