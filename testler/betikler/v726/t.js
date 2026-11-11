// 7.2.6 Sohbet efektleri: sözler doğru efekti seçer, yeni mesajda bir kez oynar, eski mesajda oynamaz, ayar kapatır, katman tıklamayı geçirir. node t.js <genişlik>
const {open}=require('../m70/lib');const W=+process.argv[2]||390;let pass=0,fail=0;const ok=(c,m)=>{console.log((c?"OK  ":"FAIL")+" "+m);c?pass++:fail++};
const O='/tmp/claude-0/-home-user/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/';
(async()=>{const {b,p,errors}=await open(W,820);
 let r=await p.evaluate(()=>["İyi ki doğdun Ayşe!","TEBRİKLER","Yaşasın kazandık","kar yağıyor dışarıda","Günaydın herkese","iyi geceler","Mutlu yıllar","merhaba","karton"].map(kfxKind));
 ok(JSON.stringify(r)==='["balon","konfeti","fisek","kar","gunes","gece","fisek","",""]',"sözler → efekt "+JSON.stringify(r));
 await p.evaluate(()=>{settings.clawd=false;closeAll();openChat("u:u2")});await p.waitForTimeout(900);
 for(const [k,txt] of [["balon","İyi ki doğdun!"],["fisek","Yaşasın!"],["kar","Kar yağıyor"],["gunes","Günaydın"],["gece","İyi geceler"]]){
  await p.evaluate(t=>sendMessage("u:u2",{text:t}),txt);await p.waitForTimeout(700);
  r=await p.evaluate(()=>{const e=document.getElementById("kfx");return e&&{c:e.className,n:e.children.length,pe:getComputedStyle(e).pointerEvents}});
  ok(r&&r.c.includes("kfx-"+k)&&r.n>0&&r.pe==="none",`"${txt}" → ${k} (${r&&r.n} parça)`);
  await p.screenshot({path:O+"fx-"+k+"-"+W+".png"});await p.waitForTimeout(3300);ok(await p.evaluate(()=>!document.getElementById("kfx")),k+" kendiliğinden kalktı")}
 await p.evaluate(()=>sendMessage("u:u2",{text:"Tebrikler!"}));await p.waitForTimeout(500);ok(await p.evaluate(()=>!!document.querySelector(".gconf")),"tebrikler → konfeti");await p.waitForTimeout(3500);
 // yeniden çizim tekrar oynatmaz
 await p.evaluate(()=>{renderMsgs();renderMsgs()});await p.waitForTimeout(300);ok(await p.evaluate(()=>!document.getElementById("kfx")&&!document.querySelector(".gconf")),"yeniden çizimde tekrar yok");
 // eski mesaj oynamaz
 await p.evaluate(async()=>{const cid=cidFor("u1","u2");await DB.set("chats/"+cid+"/msgs/old1",{from:"u2",at:Date.now()-60000,text:"iyi ki doğdun eski"});});await p.waitForTimeout(800);ok(await p.evaluate(()=>!document.getElementById("kfx")),"eski mesajda efekt yok");
 // karşıdan gelen yeni mesaj oynar
 await p.evaluate(async()=>{const cid=cidFor("u1","u2");await DB.set("chats/"+cid+"/msgs/new1",{from:"u2",at:Date.now(),text:"günaydın canım"})});await p.waitForTimeout(900);ok(await p.evaluate(()=>{const e=document.getElementById("kfx");return e&&e.className.includes("kfx-gunes")}),"karşıdan gelen yeni mesajda oynar");await p.waitForTimeout(3500);
 // tıklama geçer: efekt sürerken yazma kutusuna tıkla
 await p.evaluate(()=>kfxPlay("balon"));await p.click("#msgIn");ok(await p.evaluate(()=>document.activeElement&&document.activeElement.id==="msgIn"),"efekt sürerken dokunuşlar geçer");await p.waitForTimeout(3500);
 // ayar kapalı
 await p.evaluate(()=>{closeAll();go("settings")});await p.waitForTimeout(600);r=await p.evaluate(()=>{const i=document.querySelector('#main input[data-set="fx72"]');return i&&i.checked});ok(r===true,"Ayarlar'da Sohbet efektleri (açık)");
 await p.evaluate(()=>{const i=document.querySelector('#main input[data-set="fx72"]');i.closest("details,section");i.checked=false;i.dispatchEvent(new Event("change"))});ok(await p.evaluate(()=>settings.fx72===false&&kfxPlay("balon")===false&&!document.getElementById("kfx")),"kapatınca oynamaz");
 await p.evaluate(()=>{settings.fx72=true;document.documentElement.classList.add("reduce-motion");settings.reduceMotion=true});ok(await p.evaluate(()=>kfxPlay("kar")===false),"hareket azaltılmışsa oynamaz");
 ok(errors.length===0,"sayfa hatası yok "+errors.join(" | "));console.log(pass+"/"+(pass+fail));await b.close()})();
