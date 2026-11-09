/* 7.0 sohbet (70CHAT) işlev testi: node t70.js <genişlik> */
const {open,OUT}=require('./lib');const W=+process.argv[2]||390;
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
(async()=>{const {b,p,errors}=await open(W,860,{});
 const nMsgs=()=>p.evaluate(()=>S.msgs.filter(m=>!m.sch).length);
 /* liste */
 await p.evaluate(()=>go("chats"));await p.waitForTimeout(800);
 let r=await p.evaluate(()=>({h1:document.querySelector("#top h1")?.textContent,act:document.querySelector("#top h1")?.dataset.act,sr:!!document.querySelector("#main .k70l #k70Q"),quick:!!document.querySelector("#main .quick"),mh:[...document.querySelectorAll("#main .sec-h span")].map(x=>x.textContent),cams:[...document.querySelectorAll("#main [data-k70cam]")].map(x=>x.dataset.k70cam),rotaCam:!!document.querySelector('[data-crow="u:bot:rota"] [data-k70cam]'),meydan:!!document.querySelector('#main [data-chat="meydan"]'),notes:!!document.querySelector("#main .notes"),ov:document.documentElement.scrollWidth-innerWidth}));
 ok(/bilal/.test(r.h1)&&r.act==="k69acc","üstte kullanıcı adı ve hesap oku "+JSON.stringify([r.h1,r.act]));
 ok(r.sr&&!r.quick&&r.mh.includes("Mesajlar")&&r.meydan&&r.notes,"arama kutusu, Mesajlar başlığı, Meydan ve notlar var, hızlı düğmeler yok");
 ok(r.cams.length===4&&!r.rotaCam,"DM ve grup satırlarında kamera, Rota'da yok "+r.cams.join(","));
 ok(r.ov<=0,"yatay taşma yok");
 r=await p.evaluate(()=>{const c=getComputedStyle(document.querySelector('#main [data-crow="u:u2"] .av img')).borderRadius;return c});ok(r==="50%","liste avatarı yuvarlak "+r);
 await p.evaluate(()=>{S.online.add("u2");render(false)});await p.waitForTimeout(200);
 ok(await p.evaluate(()=>!!document.querySelector('#main [data-crow="u:u2"] .av .on')),"çevrimiçi yeşil nokta");
 ok(await p.evaluate(()=>{const r=document.querySelector('#main [data-crow="u:u2"]');return r.classList.contains("unread")&&!!r.querySelector(".udot")}),"okunmamış satır kalın + nokta");
 /* arama */
 await p.fill("#k70Q","zey");await p.waitForTimeout(150);
 r=await p.evaluate(()=>[...document.querySelectorAll("#main [data-crow],#main [data-chat='meydan']")].filter(x=>!x.hidden).map(x=>x.dataset.crow||"meydan"));
 ok(r.length===1&&r[0]==="u:u4","arama süzer: "+r.join(","));
 await p.fill("#k70Q","mert");await p.waitForTimeout(150);
 r=await p.evaluate(()=>({ppl:[...document.querySelectorAll("#main .k70-ppl [data-msg]")].map(x=>x.dataset.msg),notes:getComputedStyle(document.querySelector("#main .notes")).display}));
 ok(r.ppl.includes("u5")&&r.notes==="none","sohbeti olmayan kişi Kişiler altında "+JSON.stringify(r));
 await p.fill("#k70Q","qqqq");await p.waitForTimeout(150);ok(await p.evaluate(()=>!document.querySelector("#main .k70-none").hidden),"sonuç yok yazısı");
 await p.fill("#k70Q","");await p.waitForTimeout(150);ok(await p.evaluate(()=>[...document.querySelectorAll("#main [data-crow]")].every(x=>!x.hidden)),"arama boşalınca hepsi");
 /* satırdaki kamera: dosya seçicisi açılır, satır açılmaz */
 const [fc]=await Promise.all([p.waitForEvent("filechooser",{timeout:3000}).catch(()=>null),p.click('#main [data-crow="u:u3"] .k70-cam')]);
 r=await p.evaluate(()=>S.route.name);ok(fc&&r==="chats","kamera dokunuşu dosya seçicisini açar, sohbete gitmez ("+r+")");
 if(fc){const c=Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==","base64");await fc.setFiles({name:"a.png",mimeType:"image/png",buffer:c});await p.waitForTimeout(1200);
  r=await p.evaluate(()=>({n:S.route.name,k:S.route.params.key,img:S.msgs.some(m=>m.img&&m.from==="u1")}));ok(r.n==="chat"&&r.k==="u:u3"&&r.img,"seçilen fotoğraf o sohbete gider "+JSON.stringify(r))}
 /* sohbet ekranı */
 await p.evaluate(()=>openChat("u:u2"));await p.waitForTimeout(1200);
 r=await p.evaluate(()=>{const g=k=>{const m=document.querySelector(`#msgs .mrow[data-k="${k}"] .msg`);const s=getComputedStyle(m);return[s.borderTopLeftRadius,s.borderTopRightRadius,s.borderBottomRightRadius,s.borderBottomLeftRadius].join(" ")};return{m1:g("m1"),m2:g("m2"),m3:g("m3"),m4:g("m4")}});
 ok(r.m1==="20px 20px 20px 5px"&&r.m2==="5px 20px 20px 20px"&&r.m3==="20px 20px 5px 20px"&&r.m4==="20px 5px 20px 20px","art arda balon köşeleri birleşik "+JSON.stringify(r));
 r=await p.evaluate(()=>[...document.querySelectorAll('#msgs .stamp[data-k^="t-"]')].map(x=>x.textContent));ok(r.length&&r.every(x=>/^(Bugün|Dün) \d\d:\d\d$/.test(x)),"tarih damgası "+r.join(" | "));
 r=await p.evaluate(()=>{const a=document.querySelector("#msgs.k70dm .seenrow:not(.sr-ph) .seenav");return a&&getComputedStyle(a,"::before").content});ok(r==='"Görüldü"',"DM'de Görüldü yazısı "+r);
 /* yazma çubuğu */
 r=await p.evaluate(()=>{const b=document.getElementById("sendBtn");return{mic:!!b.querySelector(".k70-mic"),snd:!!b.querySelector(".k70-snd"),has:document.getElementById("composer").classList.contains("k693-has"),so:getComputedStyle(b.querySelector(".k70-snd")).opacity,tw:getComputedStyle(document.querySelector("#composer .k693-tools")).maxWidth}});
 ok(r.mic&&r.snd&&!r.has&&r.so==="0"&&r.tw!=="0px","boşken mikrofon görünür, gönder gizli, araçlar açık "+JSON.stringify(r));
 await p.click("#msgIn");await p.keyboard.type("zamanla beni");await p.waitForTimeout(700);
 r=await p.evaluate(()=>{const b=document.getElementById("sendBtn");return{has:document.getElementById("composer").classList.contains("k693-has"),so:getComputedStyle(b.querySelector(".k70-snd")).opacity,mo:getComputedStyle(b.querySelector(".k70-mic")).opacity,tw:getComputedStyle(document.querySelector("#composer .k693-tools")).maxWidth,html:b.innerHTML.includes("k70-mic"),tip:!!document.querySelector("#composer .k70-tip"),tr:getComputedStyle(b.querySelector(".k70-snd")).transitionProperty}});
 ok(r.has&&r.so==="1"&&r.mo==="0"&&r.tw==="0px"&&r.html,"yazınca gönder ikonu (geçişle), araçlar kayarak kapandı "+JSON.stringify(r));
 ok(/opacity/.test(r.tr)&&/transform/.test(r.tr),"ikon geçişi animasyonlu");
 ok(r.tip,"ilk yazıda zamanlama ipucu");
 ok(await p.evaluate(()=>!!LS.get("kadraj_k70_schtip")),"ipucu cihazda bir kez (kayıt)");
 /* basılı tut (fare) → zamanlama, gönderim yok */
 let n0=await nMsgs();const bb=await p.locator("#sendBtn").boundingBox();
 await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await p.mouse.down();await p.waitForTimeout(650);await p.mouse.up();await p.waitForTimeout(400);
 r=await p.evaluate(()=>({sch:!!document.querySelector('#overlay [data-layer="sch"]'),t:document.querySelector("#schT")?.value,inp:document.getElementById("msgIn").value}));
 ok(r.sch&&r.t==="zamanla beni","basılı tut (fare) zamanlama penceresini açar, yazıyı alır "+JSON.stringify(r));
 ok(await nMsgs()===n0&&r.inp==="zamanla beni","basılı tutunca normal gönderim olmadı");
 await p.evaluate(()=>document.querySelector('#schF').requestSubmit());await p.waitForTimeout(700);
 r=await p.evaluate(()=>({sch:S.msgs.filter(m=>m.sch).length,inp:document.getElementById("msgIn").value,has:document.getElementById("composer").classList.contains("k693-has")}));
 ok(r.sch===1&&r.inp===""&&!r.has,"zamanlandı, kutu boşaldı, düğme mikrofona döndü "+JSON.stringify(r));
 /* basılı tut (dokunmatik olay) */
 await p.evaluate(()=>{const i=document.getElementById("msgIn");i.value="dokunarak";i.dispatchEvent(new Event("input"))});n0=await nMsgs();
 await p.evaluate(async()=>{const b=document.getElementById("sendBtn");const r=b.getBoundingClientRect();const o={bubbles:true,cancelable:true,pointerType:"touch",pointerId:7,clientX:r.x+10,clientY:r.y+10,isPrimary:true};b.dispatchEvent(new PointerEvent("pointerdown",o));await new Promise(x=>setTimeout(x,600));b.dispatchEvent(new PointerEvent("pointerup",o));b.click()});await p.waitForTimeout(400);
 r=await p.evaluate(()=>!!document.querySelector('#overlay [data-layer="sch"]'));ok(r&&await nMsgs()===n0,"basılı tut (dokunmatik) zamanlama açar, tıklama yutulur");
 await p.evaluate(()=>closeAll());await p.waitForTimeout(300);
 /* kısa dokunuş gönderir */
 n0=await nMsgs();await p.click("#sendBtn");await p.waitForTimeout(700);
 r=await p.evaluate(()=>({last:S.msgs.filter(m=>!m.sch).slice(-1)[0]?.text,sch:!!document.querySelector('#overlay [data-layer="sch"]')}));
 ok(await nMsgs()===n0+1&&r.last==="dokunarak"&&!r.sch,"kısa dokunuş gönderir "+JSON.stringify(r));
 /* boşken basılı tut: zamanlama yok */
 await p.evaluate(()=>{window.__rec=0;window.startRec=()=>{window.__rec++}});
 await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await p.mouse.down();await p.waitForTimeout(650);await p.mouse.up();await p.waitForTimeout(300);
 r=await p.evaluate(()=>({sch:!!document.querySelector('#overlay [data-layer="sch"]'),rec:window.__rec}));ok(!r.sch,"boşken basılı tut zamanlama açmaz "+JSON.stringify(r));
 /* ⊕ menüsü */
 await p.evaluate(()=>{closeAll();plusMenu()});await p.waitForTimeout(300);
 r=await p.evaluate(()=>({sch:!!document.querySelector("#overlay #psch"),once:!!document.querySelector("#overlay #pon")}));ok(!r.sch&&r.once,"⊕ menüsünde 'Mesajı zamanla' yok "+JSON.stringify(r));
 await p.evaluate(()=>closeAll());
 /* çift dokunma tepkisi */
 await p.evaluate(()=>{settings.dblRx="heart";reactMsg("m7")});await p.waitForTimeout(80);ok(await p.evaluate(()=>!!document.querySelector(".k70-burst svg")),"çift dokunma büyük kalp");
 await p.waitForTimeout(1000);ok(await p.evaluate(()=>!document.querySelector(".k70-burst")),"kalp kendiliğinden kalkar");
 /* ayrıntılar */
 await p.evaluate(()=>chatInfo());await p.waitForTimeout(60);
 r=await p.evaluate(()=>{const l=document.querySelector(".cinfo");return{c:l.classList.contains("k70-in"),a:getComputedStyle(l).animationName}});ok(r.c&&r.a==="k70CiIn","ayrıntılar kayarak açılır "+JSON.stringify(r));
 await p.waitForTimeout(1200);ok(await p.evaluate(()=>!document.querySelector(".cinfo").classList.contains("k70-in")),"açılış sınıfı kalkar");
 await p.evaluate(()=>closeAll());
 /* grup köşeleri */
 await p.evaluate(async()=>{const T=Date.now();await DB.set("chats/gr-1/msgs/g2",{from:"u5",at:T-2e5,text:"ikinci"});await DB.set("chats/gr-1/msgs/g3",{from:"u2",at:T-1.9e5,text:"ayşe"})});
 await p.evaluate(()=>openChat("g:gr-1"));await p.waitForTimeout(1200);
 r=await p.evaluate(()=>["g1","g2","g3"].map(k=>{const m=document.querySelector(`#msgs .mrow[data-k="${k}"] .msg`);if(!m)return"yok";const s=getComputedStyle(m);return s.borderTopLeftRadius+"/"+s.borderBottomLeftRadius}));
 ok(r[0]==="20px/5px"&&r[1]==="5px/20px"&&r[2]==="20px/20px","grupta aynı kişinin mesajları birleşik, başkası ayrı "+r.join(" "));
 ok(!errors.length,"sayfa hatası yok "+errors.join(" | "));
 console.log(pass+"/"+(pass+fail));await b.close();process.exit(fail?1:0)})();
