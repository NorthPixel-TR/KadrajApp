// 7.1.9: Ayarlar'dan İstiklal Marşı dinle + sözler; uygulamada (sahte KadrajGaleri.oku) yerel sesle okuma
const {open}=require('/home/user/kadraj-test/m70/lib.js');let pass=0,fail=0;const ok=(c,m)=>{console.log((c?"OK  ":"FAIL")+" "+m);c?pass++:fail++};
(async()=>{const {b,p,errors}=await open(390);
 await p.evaluate(()=>{window.__oku=[];window.Capacitor={isNativePlatform:()=>true,Plugins:{KadrajGaleri:{oku:o=>{__oku.push(o.text);return Promise.resolve()},sus:()=>Promise.resolve(),surum:()=>Promise.resolve({surum:10})}}};go("settings")});await p.waitForTimeout(900);
 ok(await p.$("#k719M"),"Ayarlar'da İstiklal Marşı satırları");
 await p.click('[data-act="k719soz"]');await p.waitForTimeout(1200);
 const soz=await p.evaluate(()=>{const l=document.querySelector('[data-layer="imsoz"]');return l&&{k:l.querySelectorAll("section").length,t:l.textContent}});
 ok(soz&&soz.k===10,"bütün sözler: 10 kıta");ok(soz&&/Korkma, sönmez/.test(soz.t)&&/Dalgalan sen de şafaklar/.test(soz.t),"ilk ve son kıta yazıyor");
 await p.evaluate(()=>closeAll());await p.waitForTimeout(400);
 const gal=await p.evaluate(()=>typeof kgal==="function"&&!!kgal());
 await p.click('[data-act="k719im"]');await p.waitForTimeout(7000);
 const st=await p.evaluate(()=>({on:!!document.querySelector('[data-layer="marsi"]'),line:(document.querySelector("#imLine")||{}).textContent,oku:__oku.slice(),soz:!!document.querySelector("#imSoz")}));
 ok(st.on&&/Korkma/.test(st.line||""),"tören açıldı, ilk dize ekranda");ok(st.soz,"törende Bütün sözler düğmesi");
 ok(gal?st.oku.length>=1&&/Korkma/.test(st.oku[0]):true,"uygulamada telefonun sesiyle okundu ("+(gal?st.oku.length:"tarayıcı")+")");
 await p.click("#imSoz");await p.waitForTimeout(500);ok(await p.evaluate(()=>!!document.querySelector('[data-layer="imsoz"]')),"törende sözler açılıyor");
 await p.evaluate(()=>{closeLayer("imsoz");MARSI.stop()});await p.waitForTimeout(400);ok(await p.evaluate(()=>!MARSI._cur()),"kapanıyor");
 ok(errors.length===0,"sayfa hatası yok "+errors.join(" | "));
 console.log(pass+"/"+(pass+fail));await b.close();process.exit(fail?1:0)})();
