/* 6.9 Bora: node t69.js <genişlik> */
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const HTML='/home/user/kadrajapp/.claude/worktrees/agent-a0942c59d363ea730/index.html',BASE='http://kadraj.test/';const W=+process.argv[2]||390;
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
const GIF="R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:W,height:860},hasTouch:true});const p=await ctx.newPage();
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.route('**/*',r=>{const u=r.request().url();
  if(u.startsWith('https://api.giphy.com/')){const st=u.includes('/stickers/');return r.fulfill({contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify({data:[1,2,3,4].map(i=>({images:{fixed_width:{url:`https://media${i}.giphy.com/media/abc${i}/200w.${st?'webp':'gif'}`,width:"200",height:"150"}}})),meta:{status:200}})})}
  if(u.startsWith('https://media')&&u.includes('giphy.com'))return r.fulfill({contentType:'image/gif',body:Buffer.from(GIF,'base64')});
  if(u.startsWith(BASE)){const q=decodeURIComponent(new URL(u).pathname);if(q==='/'||q==='/index.html')return r.fulfill({body:fs.readFileSync(HTML),contentType:'text/html; charset=utf-8'});
  const f=path.join(path.dirname(HTML),q);if(fs.existsSync(f)&&fs.statSync(f).isFile())return r.fulfill({body:fs.readFileSync(f)});return r.fulfill({status:404,body:''})}
  if(u.startsWith('data:')||u.startsWith('blob:'))return r.continue();return r.abort()});
 await p.goto(BASE+'index.html');await p.waitForTimeout(400);
 const intro=await p.evaluate(()=>{const g=s=>{const e=document.querySelector(s);return e?getComputedStyle(e).display:"yok"};return{wm:g("#intro .in-wm"),tag:g("#intro .in-tag"),bar:g("#intro .in-bar"),vf:g("#intro .in-vf")}});
 ok(intro.wm==="none"&&intro.tag==="none"&&intro.bar==="none"&&intro.vf!=="none","açılışta yalnızca logo "+JSON.stringify(intro));
 await p.waitForTimeout(1200);
 await p.evaluate(async()=>{if(S.mode!=="local"||!DB)await bootLocal();const T=Date.now();
  for(const [uid,name,un,bio] of [["u1","Bilal Kara","bilal","stupid:@ayse brozilla:@can #kadraj"],["u2","Ayşe Yılmaz","ayse",""],["u3","Can Demir","can",""]])await DB.set("profiles/"+uid,{uid,username:un,name,bio,avatar:null,following:{u1:1,u2:1,u3:1},botFollowers:{},private:false,createdAt:T-1e6});
  await DB.set("posts/p2",{uid:"u3",at:T-4e5,kind:"note",text:"Selam",bg:0,caption:"Kahve @ayse"});
  const cid=cidFor("u1","u2");await DB.set("chats/"+cid,{members:["u1","u2"],last:{text:"naber",from:"u2",at:T-1000},updatedAt:T-1000,reads:{}});
  await DB.set("chats/"+cid+"/msgs/m1",{from:"u2",at:T-2000,text:"selam @bilal"});
  S.uid="u1";LS.set("kadraj_session","u1");await enterApp(false)});
 await p.waitForTimeout(700);await p.evaluate(()=>closeAll());
 /* bahsetme mavi */
 await p.evaluate(()=>go("profile",{uid:"u1"}));await p.waitForTimeout(500);
 let r=await p.evaluate(()=>{const m=[...document.querySelectorAll(".bio [data-mention]")];const t=document.querySelector(".bio [data-htag]");const acc=getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();const tmp=document.createElement("i");tmp.style.color=acc;document.body.appendChild(tmp);const ac=getComputedStyle(tmp).color;tmp.remove();return{n:m.length,c:m[0]&&getComputedStyle(m[0]).color,ac,t:t&&getComputedStyle(t).color}});
 ok(r.n===2&&r.c===r.ac,"biyografide 'stupid:@ayse' bahsetmeleri Kadraj tema renginde "+JSON.stringify(r));
 ok(r.t&&r.t!==r.ac&&/59, 91, 245|147, 169, 255/.test(r.t),"#etiket başka renk (mavi)");
 /* sol şerit */
 r=await p.evaluate(()=>{const d=document.getElementById("dock").getBoundingClientRect();return{rail:document.getElementById("shell").hasAttribute("data-rail"),x:d.x,w:d.width,h:d.height,logo:!!document.querySelector("#dock .k69-lg")}});
 ok(!r.rail&&!r.logo&&r.h<200,"menü altta, sol şerit yok "+JSON.stringify(r));
 r=await p.evaluate(()=>[...document.querySelectorAll("#dock nav>button")].map(b=>b.dataset.tab||b.dataset.go||b.dataset.act).join(","));ok(r==="feed,explore,chats,create,reels,activity,profile","alt menü sırası: Sohbet solda, Klaket sağda ("+r+")");
 /* sohbet kayarak açılır */
 await p.evaluate(()=>{settings.anim="akici";k69Apply()});
 await p.evaluate(()=>go("chats"));await p.waitForTimeout(300);
 await p.evaluate(()=>openChat("u:u2"));
 r=await p.evaluate(()=>({m:document.getElementById("main").className,d:getComputedStyle(document.documentElement).getPropertyValue("--k69-d").trim(),an:getComputedStyle(document.getElementById("main")).animationName}));
 ok(/k69-in-r/.test(r.m)&&r.an==="k69InR"&&r.d==="0.5s","sohbet sağdan kayarak açılıyor (0,5 sn) "+JSON.stringify(r));
 await p.waitForTimeout(700);ok(!/k69-in/.test(await p.evaluate(()=>document.getElementById("main").className)),"animasyon bitince sınıf kalkıyor");
 /* GIF */
 await p.evaluate(()=>{S.adm=S.adm||{};S.adm.gif={k:"abcdefghijklmnopqrstuvwx12"}});
 ok(await p.evaluate(()=>!!document.querySelector('#composer .k693-cam')&&document.querySelectorAll('#composer .k693-tools button').length===3&&!document.querySelector('#top [data-act="chatinfo"].ib')),"Instagram gibi yazma çubuğu (kamera, galeri, çıkartma, ⊕), üstte (i) yok");
 await p.evaluate(()=>plusMenu());await p.waitForTimeout(300);
 ok(await p.evaluate(()=>!document.querySelector('#overlay #pgif')&&!document.querySelector('#overlay #pph')&&!!document.querySelector('#overlay .k693-pl')),"⊕ menüsü kısa liste");
 await p.evaluate(()=>{closeAll();document.querySelectorAll('#composer .k693-tools button')[1].click()});await p.waitForTimeout(800);
 r=await p.evaluate(()=>document.querySelectorAll('#k69G .k69g-it').length);ok(r===4,"GIF sonuçları geldi ("+r+")");
 await p.fill('#k69Q','kedi');await p.waitForTimeout(900);
 await p.evaluate(()=>document.querySelector('#k69G .k69g-it').click());await p.waitForTimeout(800);
 r=await p.evaluate(()=>{const im=document.querySelector('#msgs img.k69-gif');const m=S.msgs.find(x=>x.gif);return{img:!!im,u:m&&m.gif.u,last:(S.chats[cidFor("u1","u2")]||{}).last}});
 ok(r.img&&/giphy\.com/.test(r.u),"GIF mesajı gönderildi ve görünüyor "+JSON.stringify(r).slice(0,160));
 ok(r.last&&/GIF/.test(r.last.text||""),"sohbet listesi özeti 'GIF'");
 ok(await p.evaluate(()=>!gifOk({u:"https://evil.com/x.gif"})&&!gifOk({u:"javascript:alert(1)"})&&gifOk({u:"https://media2.giphy.com/media/x/200w.gif"})),"GIF adresi süzgeci");
 /* çıkartma oluştur */
 await p.evaluate(()=>{window.pickImage=async()=>{const c=document.createElement("canvas");c.width=400;c.height=300;const x=c.getContext("2d");x.fillStyle="#e33";x.fillRect(0,0,400,300);x.fillStyle="#36f";x.fillRect(100,50,200,200);const im=new Image();im.src=c.toDataURL();await im.decode();return{img:im,src:im.src}}});
 await p.evaluate(()=>stkMake(S.route.params.key));await p.waitForTimeout(500);
 ok(await p.evaluate(()=>!!document.querySelector('#k69Cv')&&document.querySelectorAll("[data-sh]").length===6),"çıkartma oluşturucu açıldı (Otomatik + 5 şekil)");
 await p.evaluate(()=>{document.querySelector('[data-sh="heart"]').click();const t=document.getElementById('k69Tx');t.value="Selam";t.dispatchEvent(new Event('input'))});
 await p.evaluate(()=>document.getElementById('k69Go').click());await p.waitForTimeout(1000);
 r=await p.evaluate(async()=>{const im=document.querySelector('#msgs img.k69-stk');const d=await DB.get("data/users/u1/stk");const m=S.msgs.find(x=>x.stk);return{img:!!im,list:d&&d.list&&d.list.length,len:m&&m.stk.u.length,bub:im&&getComputedStyle(im.parentElement).backgroundColor}});
 ok(r.img&&r.list===1&&r.len<130000,"çıkartma gönderildi ve kaydedildi "+JSON.stringify(r));
 ok(r.bub==="rgba(0, 0, 0, 0)","çıkartma balonsuz");
 await p.evaluate(()=>document.querySelector('#msgs img.k69-stk').click());await p.waitForTimeout(300);
 ok(await p.evaluate(()=>!!document.querySelector('#overlay #k69Add')),"çıkartmaya dokununca 'Çıkartmalarıma ekle'");
 await p.evaluate(()=>closeAll());
 /* çift dokunma tepkisi */
 await p.evaluate(async()=>{settings.dblRx="fire";await reactMsg("m1")});await p.waitForTimeout(400);
 r=await p.evaluate(()=>{const m=S.msgs.find(x=>x.id==="m1");return m&&m.reacts&&m.reacts.u1});ok(r==="fire","çift dokunma tepkisi ayardan (ateş) "+r);
 /* sohbetteki fotoğraftan çıkartma */
 await p.evaluate(async()=>{const c=document.createElement("canvas");c.width=60;c.height=60;c.getContext("2d").fillRect(0,0,60,60);await sendMessage(S.route.params.key,{img:c.toDataURL("image/jpeg")})});await p.waitForTimeout(600);
 await p.evaluate(()=>{const m=S.msgs.find(x=>x.img&&!x.once);msgMenu(m.id)});await p.waitForTimeout(300);ok(await p.evaluate(()=>!!document.querySelector("#overlay #mmStk")),"fotoğrafa basılı tut › Çıkartma yap");
 await p.evaluate(()=>closeAll());
 /* Klaket: çerçeve ve hız */
 await p.evaluate(()=>go("reels"));await p.waitForTimeout(900);
 r=await p.evaluate(()=>{const el=document.querySelector("#main .reel");const s=getComputedStyle(el,"::after");return{bs:s.boxShadow,i:s.inset||s.top}});ok(/rgb\(0, 0, 0\)/.test(r.bs),"Klakette siyah çerçeve "+JSON.stringify(r));
 await p.evaluate(()=>{const el=document.querySelector("#main .reel");postMenu(el.dataset.pid)});await p.waitForTimeout(300);
 r=await p.evaluate(()=>{const b=document.querySelector("#overlay #mRate");if(!b)return null;b.click();b.click();return{t:b.textContent,s:settings.reelRate}});ok(r&&r.s===2&&/2x/.test(r.t),"Klaket oynatma hızı (1x→1,5x→2x) "+JSON.stringify(r));
 await p.evaluate(()=>{settings.reelRate=1;closeAll()});
 /* özet */
 await p.evaluate(()=>ozetSheet());await p.waitForTimeout(300);ok(await p.evaluate(()=>document.querySelectorAll('#overlay .k69-oz .k69-st span').length===4),"Bu ayın özeti");await p.evaluate(()=>closeAll());
 /* ayarlar */
 await p.evaluate(()=>go("settings"));await p.waitForTimeout(500);
 r=await p.evaluate(()=>({g:!!document.querySelector('.sg[data-g="k69"]'),an:document.querySelectorAll('[data-k69s="anim"]').length,rm:!!document.querySelector('[data-set="reduceMotion"]'),rx:document.querySelectorAll('[data-k69s="dblRx"]').length,oz:!!document.querySelector('[data-act="k69oz"]')}));
 ok(r.g&&r.an===4&&!r.rm&&r.rx>=4&&r.oz,"Ayarlar › Kadraj'a özel grubu "+JSON.stringify(r));
 await p.evaluate(()=>{document.querySelector('.sg[data-g="k69"] .sg-h').click();document.querySelector('[data-k69s="anim"][data-v="off"]').click()});
 r=await p.evaluate(()=>({rm:document.documentElement.classList.contains("reduce-motion"),s:settings.anim,d:k69Dur()}));ok(r.rm&&r.d===0,"Animasyonlar Kapalı = hareket yok "+JSON.stringify(r));
 await p.evaluate(()=>document.querySelector('[data-k69s="bub69"][data-v="k"]').click());ok(await p.evaluate(()=>document.documentElement.getAttribute("data-bub69")==="k"),"sohbet balonu köşeli");
 await p.evaluate(()=>{document.querySelector('[data-k69s="anim"][data-v="normal"]').click()});ok(await p.evaluate(()=>!document.documentElement.classList.contains("reduce-motion")&&k69Dur()===.35),"Normal 0,35 sn");
 /* yönetici */
 await p.evaluate(()=>{S.admin=true;go("admin")});await p.waitForTimeout(700);
 r=await p.evaluate(()=>["k69live","k69push","k69gif"].map(id=>!!document.querySelector(`#admH-${id}`)||!!document.querySelector(`[data-sec="${id}"],[data-id="${id}"]`)||document.body.innerHTML.includes(id)));
 ok(r.every(Boolean),"yönetici bölümleri: canlı durum, herkese bildirim, GIF "+JSON.stringify(r));
 r=await p.evaluate(()=>{const el=document.createElement("div");el.innerHTML=k69LiveHtml();return el.querySelectorAll(".k69-st span").length});ok(r===4,"canlı durum sayıları");
 /* yerel modda çoklu hesap uyarısı */
 r=await p.evaluate(()=>{let t="";const f=toast;window.toast=x=>{t=x};try{accSheet()}finally{window.toast=f}return t});ok(/yalnızca/.test(r),"demoda çoklu hesap uyarısı");
 ok(!errors.length,"sayfa hatası yok "+errors.join(" | "));
 console.log(pass+"/"+(pass+fail));await b.close();process.exit(fail?1:0)})();
