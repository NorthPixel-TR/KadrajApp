/* 7.0.4: çoklu profil fotoğrafı + Ben'e çift dokunma ile hesap değiştirme */
const {open,OUT}=require('./lib');const W=+process.argv[2]||390;
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
const px=c=>`data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="${c}"/></svg>`)}`;
(async()=>{const {b,p,errors}=await open(W);
 /* tohum: u1'in 3 fotoğrafı, u2'nin 2 fotoğrafı */
 await p.evaluate(async({a,b2,c,d})=>{await DB.update("profiles/u1",{avatar:a,avs:[b2,c]});S.profiles.u1={...S.profiles.u1,avatar:a,avs:[b2,c]};
  await DB.update("profiles/u2",{avatar:d,avs:[a]});S.profiles.u2={...S.profiles.u2,avatar:d,avs:[a]}},{a:px("red"),b2:px("blue"),c:px("green"),d:px("gold")});
 ok(await p.evaluate(()=>avsOf("u1").length===3&&avsOf("u3").length<=1),"avsOf: 3 fotoğraf, tek fotoğraflıda 1");
 /* 1) profil: noktalar, kaydırınca değişir */
 await p.evaluate(()=>go("profile",{uid:"u1"}));
 const seq=[];let rot=false;const t0=Date.now();
 while(Date.now()-t0<2600){const v=await p.evaluate(()=>({i:AVI.u1,t:document.querySelector("#main .prof-top > .av img")?.style.transform||""}));if(seq[seq.length-1]!==v.i)seq.push(v.i);if(/rotateY\((9|-9)/.test(v.t))rot=true;await p.waitForTimeout(40)}
 ok(rot,"dönme efekti (rotateY) oynadı");
 ok(JSON.stringify(seq)==="[0,1,2,0]","3 fotoğraf bir tur döndü ve ana fotoğrafta durdu "+JSON.stringify(seq));
 ok(await p.evaluate(()=>AVR.done===S.route&&!AVR.t),"tur bitti, zamanlayıcı yok");
 await p.waitForTimeout(1200);
 ok(await p.evaluate(()=>AVI.u1===0),"bir daha dönmüyor");
 await p.evaluate(()=>render(false));await p.waitForTimeout(1500);
 ok(await p.evaluate(()=>AVI.u1===0&&!AVR.t),"yeniden çizim turu baştan başlatmaz");
 await p.evaluate(()=>tab("feed"));await p.waitForTimeout(300);
 ok(await p.evaluate(()=>!AVR.t),"profilden çıkınca zamanlayıcı durur");
 await p.evaluate(()=>go("profile",{uid:"u2"}));await p.waitForTimeout(500);
 ok(await p.evaluate(()=>AVI.u2===1),"başka profile girince hemen döner (0,5 sn içinde ikinci fotoğraf)");
 await p.waitForTimeout(700);
 ok(await p.evaluate(()=>AVI.u2===0&&AVR.done===S.route),"2 fotoğraflı profilde tur bitti");
 await p.screenshot({path:OUT+`av704_prof_${W}.png`});
 /* tek fotoğraflı profilde nokta yok */
 await p.evaluate(()=>go("profile",{uid:"u3"}));await p.waitForTimeout(500);
 ok(await p.evaluate(()=>!document.querySelector("#main .k704-dots")),"tek fotoğraflı profilde nokta yok");
 /* 2) düzenle şeridi */
 await p.evaluate(()=>go("edit"));await p.waitForTimeout(600);
 r=await p.evaluate(()=>({t:document.querySelectorAll("#main .k704-avs .k704-t:not(.add)").length,add:!!document.querySelector("#k704Add"),main:!!document.querySelector("#main .k704-t.main b")}));
 ok(r.t===3&&r.add&&r.main,"Düzenle'de 3 fotoğraf + ekle "+JSON.stringify(r));
 await p.screenshot({path:OUT+`av704_edit_${W}.png`});
 /* ana fotoğraf yap */
 await p.click('#main [data-avi="2"]');await p.waitForTimeout(500);await p.click("#k704Main");await p.waitForTimeout(600);
 r=await p.evaluate(async()=>{const d=await DB.get("profiles/u1");return{av:decodeURIComponent(d.avatar).includes("green"),n:d.avs.length,dock:decodeURIComponent(document.querySelector('#dock [data-tab="profile"] img')?.src||"").includes("green")}});
 ok(r.av&&r.n===2,"Ana fotoğraf yap kaydedildi "+JSON.stringify(r));
 /* kaldır */
 await p.click('#main [data-avi="1"]');await p.waitForTimeout(500);await p.click("#k704Rm");await p.waitForTimeout(600);
 r=await p.evaluate(async()=>{const d=await DB.get("profiles/u1");return{n:d.avs.length,strip:document.querySelectorAll("#main .k704-avs .k704-t:not(.add)").length}});
 ok(r.n===1&&r.strip===2,"Kaldır kaydedildi "+JSON.stringify(r));
 /* ekle (pickImage taklidi) */
 await p.evaluate(()=>{window._pi=pickImage;pickImage=async()=>{const c=document.createElement("canvas");c.width=c.height=50;c.getContext("2d").fillStyle="#f0f";c.getContext("2d").fillRect(0,0,50,50);return{img:c,src:""}}});
 await p.click("#k704Add");await p.waitForTimeout(600);
 r=await p.evaluate(async()=>{const d=await DB.get("profiles/u1");return{n:d.avs.length,jpg:d.avs[1]&&d.avs[1].startsWith("data:image/jpeg")}});
 ok(r.n===2&&r.jpg,"Fotoğraf ekle kaydedildi "+JSON.stringify(r));
 /* Fotoğrafı değiştir: eski ana fotoğraf diğerlerine geçer */
 const before=await p.evaluate(()=>me().avatar);
 await p.click("#editAvBtn");await p.waitForTimeout(800);
 r=await p.evaluate(async(bf)=>{const d=await DB.get("profiles/u1");return{changed:d.avatar!==bf,kept:d.avs.includes(bf),n:avsOf("u1").length}},before);
 ok(r.changed&&r.kept&&r.n===4,"Fotoğrafı değiştir eski ana fotoğrafı korur "+JSON.stringify(r));
 /* 3) Ben'e çift dokunma */
 await p.evaluate(()=>{back&&tab("feed");S.mode="cloud";window._sw=[];accSwitch=async a=>{_sw.push(a)};LS.set("kadraj_accs",{main:"[DEFAULT]",list:[{a:"[DEFAULT]",uid:"u1",un:"bilal"},{a:"k2",uid:"u9",un:"ikinci"}]})});await p.waitForTimeout(500);
 ok(await p.evaluate(()=>accOther()==="k2"),"accOther diğer hesabı verir");
 {const q=await p.locator('#dock [data-tab="profile"]').boundingBox();await p.mouse.click(q.x+q.width/2,q.y+q.height/2);await p.waitForTimeout(150);await p.mouse.click(q.x+q.width/2,q.y+q.height/2)}await p.waitForTimeout(300);
 r=await p.evaluate(()=>({sw:_sw,route:S.route.name}));
 ok(r.sw.length===1&&r.sw[0]==="k2","Ben'e çift dokunma → diğer hesap "+JSON.stringify(r));
 await p.evaluate(()=>{_sw.length=0;tab("feed")});await p.waitForTimeout(400);
 await p.click('#dock [data-tab="profile"]');await p.waitForTimeout(600);
 r=await p.evaluate(()=>({sw:_sw.length,route:S.route.name}));
 ok(r.sw===0&&r.route==="profile","tek dokunma profile gider, hesap değişmez "+JSON.stringify(r));
 await p.evaluate(()=>{LS.set("kadraj_accs",{main:"[DEFAULT]",list:[{a:"[DEFAULT]",uid:"u1",un:"bilal"}]});tab("feed")});await p.waitForTimeout(400);
 {const q=await p.locator('#dock [data-tab="profile"]').boundingBox();await p.mouse.click(q.x+q.width/2,q.y+q.height/2);await p.waitForTimeout(150);await p.mouse.click(q.x+q.width/2,q.y+q.height/2)}await p.waitForTimeout(300);
 r=await p.evaluate(()=>({sw:_sw.length,tip:LS.get("kadraj_k704_tip"),other:accOther(),toast:[...document.querySelectorAll("#toasts *")].map(x=>x.textContent).join("|")}));
 ok(r.sw===0&&/Başka hesabın yok/.test(r.toast),"tek hesapta ipucu "+JSON.stringify(r));
 const ov=await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);ok(ov<=0,"yatay taşma yok");
 ok(errors.length===0,"sayfa hatası yok "+errors.join(" | "));
 console.log(pass+"/"+(pass+fail));await b.close()})();
