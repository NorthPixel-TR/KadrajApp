/* fotoğrafsız kişi Düzenle'de "+" ile fotoğraf ekleyince: baş harf resmi kaydedilmemeli, yeni fotoğraf ana fotoğraf olmalı.
   Hızlı profil geçişinde önceki profilin dönmesi yeni profilin noktalarını değiştirmemeli. */
const {open,OUT}=require('./lib');const {px}=require('./seed');const W=+process.argv[2]||390;
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
(async()=>{const {b,p,errors}=await open(W,860);
 await p.evaluate(async()=>{await DB.update("profiles/u1",{avatar:null,avs:[]});S.profiles.u1={...S.profiles.u1,avatar:null,avs:[]};
  pickImage=async()=>{const c=document.createElement("canvas");c.width=c.height=50;const x=c.getContext("2d");x.fillStyle="#f0f";x.fillRect(0,0,50,50);return{img:c,src:""}}});
 await p.evaluate(()=>go("edit"));await p.waitForTimeout(600);
 await p.click("#k704Add");await p.waitForTimeout(700);
 let r=await p.evaluate(async()=>{const d=await DB.get("profiles/u1");return{av:String(d.avatar).slice(0,22),avs:(d.avs||[]).map(x=>x.slice(0,22)),n:avsOf("u1").length}});
 ok(/^data:image\/jpeg/.test(r.av)&&r.avs.length===0,"fotoğrafsız kişi + ile ekleyince yeni fotoğraf ana fotoğraf, baş harf resmi kaydedilmedi "+JSON.stringify(r));
 await p.click("#k704Add");await p.waitForTimeout(700);
 r=await p.evaluate(async()=>{const d=await DB.get("profiles/u1");return{av:String(d.avatar).slice(0,22),avs:(d.avs||[]).map(x=>x.slice(0,22))}});
 ok(/^data:image\/jpeg/.test(r.av)&&r.avs.length===1&&!r.avs.some(x=>x.startsWith("data:image/svg")),"ikinci fotoğraf diğerlerine eklendi "+JSON.stringify(r));
 /* hızlı geçiş: u1'in dönmesi u2'nin noktalarına karışmasın */
 await p.evaluate(async(c)=>{const set=async(u,o)=>{await DB.update("profiles/"+u,o);S.profiles[u]={...S.profiles[u],...o}};await set("u1",{avatar:c[0],avs:[c[1],c[2]]});await set("u2",{avatar:c[3],avs:[c[0]]})},[px("red"),px("blue"),px("green"),px("gold")]);
 let bad=0;for(let k=0;k<4;k++){await p.evaluate(()=>go("profile",{uid:"u1"}));await p.waitForTimeout(330);await p.evaluate(()=>go("profile",{uid:"u2"}));await p.waitForTimeout(110);
  const d=await p.evaluate(()=>[...document.querySelectorAll("#main .k704-dots i")].findIndex(x=>x.classList.contains("on")));if(d!==0)bad++;await p.waitForTimeout(1300)}
 ok(bad===0,"hızlı geçişte yeni profilin noktası doğru (yanlış: "+bad+"/4)");
 ok(!errors.length,"sayfa hatası yok "+errors.join(";"));console.log(pass+"/"+(pass+fail));await b.close()})();
