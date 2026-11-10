// 7.1.5: NorthPixel hakkında sayfası
const {open}=require('/home/user/kadraj-test/m70/lib.js');let pass=0,fail=0;const ok=(c,m)=>{console.log((c?"OK  ":"FAIL")+" "+m);c?pass++:fail++};
(async()=>{const W=+process.argv[2]||390;const {b,p,errors}=await open(W);
 await p.evaluate(()=>{S.profiles.u1.username="bilolotr";go("settings")});await p.waitForTimeout(900);
 ok(await p.$("#k715N"),"Ayarlar'da NorthPixel hakkında satırı");
 await p.click('#k715N [data-act="npAbout"]');await p.waitForTimeout(1600);
 const st=await p.evaluate(()=>{const l=document.querySelector('[data-layer="npabout"]');if(!l)return null;return{px:l.querySelectorAll(".np-big rect").length,pr:l.querySelectorAll(".np-pr").length,tl:l.querySelectorAll(".np-tl li").length,ver:l.textContent.includes(APP_VER),own:!!l.querySelector('[data-prof="u1"]'),ov:document.documentElement.scrollWidth>innerWidth+1}});
 ok(st&&st.px===17,"kuzey yıldızı 17 piksel");ok(st&&st.pr>=5,"ürünler ve kurucu");ok(st&&st.tl>=13,"Kadraj'ın yolu (güncelleme adları + Zirve)");ok(st&&st.ver,"sürüm yazıyor");ok(st&&st.own,"kurucu profiline dokunulabilir");ok(st&&!st.ov,"yatay taşma yok");
 await p.screenshot({path:"/tmp/np715.png"});
 await p.click('[data-layer="npabout"] [data-act="close"]');await p.waitForTimeout(500);
 ok(await p.evaluate(()=>!document.querySelector('[data-layer="npabout"]')),"kapanıyor");
 await p.click("#main .np-from");await p.waitForTimeout(600);
 ok(await p.evaluate(()=>!!document.querySelector('[data-layer="npabout"]')),"imzaya dokununca açılıyor");
 ok(errors.length===0,"sayfa hatası yok "+errors.join(" | "));
 console.log(pass+"/"+(pass+fail));await b.close();process.exit(fail?1:0)})();
