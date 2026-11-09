/* 7.0.13 hata avı B testleri. KADRAJ_HTML ile index.html yolu verilebilir (varsayılan: B çalışma ağacı). Kullanım: node t7013b.js [genişlik] */
const {open,OUT}=require('./lib');
(async()=>{const W=+process.argv[2]||390;const {b,p,errors}=await open(W,780);let ok=0,n=0;const T=(c,m,x="")=>{n++;if(c)ok++;console.log((c?"OK  ":"HATA")+" "+m+" "+x)};
const ly=()=>p.evaluate(()=>[...document.querySelectorAll('#overlay [data-layer]')].map(x=>x.dataset.layer).join(","));
const cdp=await p.context().newCDPSession(p);
const touch=async(x,y,hold)=>{await cdp.send('Input.dispatchTouchEvent',{type:"touchStart",touchPoints:[{x,y}]});await p.waitForTimeout(hold);await cdp.send('Input.dispatchTouchEvent',{type:"touchEnd",touchPoints:[]})};
const btnC=async()=>{const bb=await p.locator("#sendBtn").boundingBox();return [bb.x+bb.width/2,bb.y+bb.height/2]};
const nSch=()=>p.evaluate(()=>S.msgs.filter(m=>m.sch).length);
/* 1) dokunmatik basılı tut → zamanlama penceresi açık kalır, kendiliğinden zamanlanmaz */
await p.evaluate(()=>openChat("u:u2"));await p.waitForTimeout(700);await p.click("#msgIn");await p.keyboard.type("zamanla beni");await p.waitForTimeout(600);
let [cx,cy]=await btnC();const n0=await p.evaluate(()=>S.msgs.length);
await touch(cx,cy,700);await p.waitForTimeout(500);
T((await ly())==="sch","basılı tutup bırakınca zamanlama penceresi açık kalır",await ly());
T((await p.evaluate(()=>S.msgs.length))===n0&&(await nSch())===0,"mesaj kendiliğinden zamanlanmadı/gönderilmedi");
T((await p.evaluate(()=>$("#msgIn").value))==="zamanla beni","kutudaki yazı duruyor");
/* pencerede seçim ve Zamanla dokunuşla çalışır */
const tapSel=async sel=>{const r=await p.evaluate(s=>{const e=[...document.querySelectorAll('#overlay [data-layer="sch"] button')].find(x=>x.textContent.trim()===s);if(!e)return null;const q=e.getBoundingClientRect();return [q.left+q.width/2,q.top+q.height/2]},sel);if(r)await touch(r[0],r[1],60);return !!r};
await tapSel("Yarın 09:00");await p.waitForTimeout(200);await tapSel("Zamanla");await p.waitForTimeout(700);
T((await nSch())===1&&!(await ly()),"Zamanla'ya dokununca zamanlandı",await nSch());
/* normal dokunuş gönderir, zamanlamaz */
await p.click("#msgIn");await p.keyboard.type("normal gönder");await p.waitForTimeout(600);[cx,cy]=await btnC();const n1=await p.evaluate(()=>S.msgs.length);
await touch(cx,cy,60);await p.waitForTimeout(700);
T((await p.evaluate(()=>S.msgs.length))===n1+1&&(await nSch())===1&&!(await ly()),"kısa dokunuş normal gönderir");
/* hemen ardından bir düğmeye dokunmak yutulmaz */
await p.evaluate(()=>{window.__hit=0;sheet("tst","Deneme",`<button class="opt" id="tstB" onclick="__hit++">Dokun</button>`)});await p.waitForTimeout(400);
const tb=await p.evaluate(()=>{const q=$("#tstB").getBoundingClientRect();return [q.left+q.width/2,q.top+q.height/2]});await touch(tb[0],tb[1],50);await p.waitForTimeout(200);
T((await p.evaluate(()=>__hit))===1,"sonraki dokunuşlar etkilenmez");await p.evaluate(()=>closeAll());
/* fareyle basılı tutma eskisi gibi */
await p.click("#msgIn");await p.keyboard.type("fare");await p.waitForTimeout(600);[cx,cy]=await btnC();await p.mouse.move(cx,cy);await p.mouse.down();await p.waitForTimeout(650);await p.mouse.up();await p.waitForTimeout(400);
T((await ly())==="sch"&&(await nSch())===1,"fareyle basılı tutma penceresi açar");await p.evaluate(()=>closeAll());await p.waitForTimeout(300);
/* 2) Meydan'da düğme adı */
await p.evaluate(()=>openChat("meydan"));await p.waitForTimeout(600);await p.click("#msgIn");await p.keyboard.type("selam");await p.waitForTimeout(200);
T((await p.evaluate(()=>$("#sendBtn").getAttribute("aria-label")))==="Gönder","Meydan'da gönder düğmesi zamanlamadan söz etmiyor");
await p.evaluate(()=>openChat("u:u2"));await p.waitForTimeout(600);await p.click("#msgIn");await p.keyboard.type("x");await p.waitForTimeout(200);
T(/zamanla/.test(await p.evaluate(()=>$("#sendBtn").getAttribute("aria-label"))),"DM'de zamanlama ipucu duruyor");
await p.evaluate(()=>{$("#msgIn").value="";$("#msgIn").dispatchEvent(new Event("input"))});
/* 3) mesaj menüsünde Vazgeç en sonda */
const IMG="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
await p.evaluate(async IMG=>{await DB.set(`chats/${cidFor("u1","u2")}/msgs/i1`,{from:"u2",at:Date.now()-5,img:IMG,text:""})},IMG);await p.evaluate(()=>openChat("u:u2"));await p.waitForTimeout(700);
await p.evaluate(()=>msgMenu("i1"));await p.waitForTimeout(300);
const ord=await p.evaluate(()=>[...document.querySelectorAll('#overlay [data-layer="menu"] .opt')].map(x=>x.id||x.dataset.act||x.textContent.trim()));
T(ord[ord.length-1]==="close"&&ord.includes("mmStk"),"Çıkartma yap Vazgeç'ten önce",ord.slice(-3).join(","));await p.evaluate(()=>closeAll());
/* 4) Bildirimler açıkken dok rozeti */
const badge=()=>p.evaluate(()=>{const e=document.querySelector('#dock [data-tab="activity"] .cnt-badge');return e?e.textContent:""});
await p.evaluate(()=>{LS.set("kadraj_act_"+S.uid,0);tab("feed")});await p.waitForTimeout(500);const b0=await badge();
await p.evaluate(()=>tab("activity"));await p.waitForTimeout(500);const b1=await badge();
T(!!b0&&!b1,"Bildirimler açılınca rozet kalkar",`önce=${b0} sonra=${b1}`);
await p.evaluate(()=>tab("feed"));await p.waitForTimeout(400);T(!(await badge()),"çıkınca rozet geri gelmez");
/* 5) boşluksuz uzun ad yana taşmaz */
await p.evaluate(async()=>{await DB.update("profiles/u2",{name:"Uzunisimliarkadaşımızbuisimçokuzunolduk",username:"cokuzunkullaniciadi_xxxx"});await DB.set(`chats/gr-1/msgs/g9`,{from:"u2",at:Date.now(),text:"merhaba"})});
for(const k of ["u:u2","g:gr-1"]){await p.evaluate(k=>openChat(k),k);await p.waitForTimeout(800);const r=await p.evaluate(()=>{const b=$("#msgs");return [b.scrollWidth,b.clientWidth]});T(r[0]<=r[1],"uzun adla "+k+" yatay taşmıyor",r.join(">"))}
await p.screenshot({path:OUT+"t7013b_"+W+".png"});
T(!errors.length,"sayfa hatası yok",errors.join(" | "));
console.log(ok+"/"+n);await b.close()})();
