// 7.2.9 Anı defteri: şerit, yazma (renk, çıkartma, önizleme), başkası görür, sahibine yeni rozeti ve uyarı, başa tuttur, sil, sınırlar, gizli hesap, başarım. node t.js <genişlik>
const {open}=require('../m70/lib');const W=+process.argv[2]||390;let pass=0,fail=0;const ok=(c,m)=>{console.log((c?"OK  ":"FAIL")+" "+m);c?pass++:fail++};
const O='/tmp/claude-0/-home-user/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/';
(async()=>{const {b,p,errors}=await open(W,820);
 await p.evaluate(()=>{settings.clawd=false;LS.del("kadraj_gbw_u1");LS.del("kadraj_gbn_u1");closeAll();go("profile",{uid:"u2"})});await p.waitForTimeout(900);
 let r=await p.evaluate(()=>{const g=document.querySelector("#main .gbk"),t=document.querySelector("#main .ptabs");return g&&{t:g.textContent,before:!!(g.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_FOLLOWING),add:!!g.querySelector("[data-gbwrite]")}});
 ok(r&&/Anı defteri/.test(r.t)&&r.add&&r.before,"başkasının profilinde şerit ve Anı bırak, sekmelerden önce");
 await p.click("#main [data-gbwrite]");await p.waitForTimeout(500);
 r=await p.evaluate(()=>{const l=document.querySelector('#overlay [data-layer="gbwrite"]');return l&&{c:l.querySelectorAll(".gbcc").length,g:l.querySelectorAll(".gbgg .ach-i").length,pv:!!l.querySelector(".gbpv .gbn")}});ok(r&&r.c===6&&r.g===10&&r.pv,"yazma penceresi: 6 renk, 10 çıkartma, önizleme");
 await p.click('#overlay .gbcc:nth-child(3)');await p.click('#overlay .gbgg:nth-child(5)');await p.fill("#gbT","Geçen hafta matematik dersinde çok güldük, iyi ki arkadaşımsın!");await p.waitForTimeout(200);
 r=await p.evaluate(()=>{const n=document.querySelector("#gbPv .gbn");return{t:n.textContent,c:n.style.getPropertyValue("--c"),cnt:document.querySelector("#gbN").textContent}});ok(/iyi ki arkadaşımsın/.test(r.t)&&r.c==="#BFDBFE"&&+r.cnt>40,"önizleme yazıyı ve rengi gösteriyor");
 await p.screenshot({path:O+"gb-write-"+W+".png"});
 await p.click("#gbGo");await p.waitForTimeout(800);
 r=await p.evaluate(()=>{const d=S.meta["gb-u2"];const c=d&&Object.values(d.comments||{});return{n:c&&c.length,x:c&&c[0],strip:document.querySelectorAll("#main .gbk .gbn:not(.gbadd)").length}});
 ok(r.n===1&&r.x.uid==="u1"&&r.x.c==="#BFDBFE"&&r.x.g==="crab"&&r.strip===1,"anı meta/gb-u2'ye yazıldı ve şeritte "+JSON.stringify(r.x&&{c:r.x.c,g:r.x.g}));
 await p.click("#main [data-gbwrite]");await p.waitForTimeout(400);ok(await p.evaluate(()=>!document.querySelector('#overlay [data-layer="gbwrite"]')),"aynı deftere 2 dk içinde yeniden yazılamaz");
 // uzun yazı ve küfür süzgeci
 await p.evaluate(()=>LS.del("kadraj_gbw_u1"));await p.click("#main [data-gbwrite]");await p.waitForTimeout(400);r=await p.evaluate(()=>document.querySelector("#gbT").maxLength);ok(r===120,"en çok 120 harf");await p.evaluate(()=>closeAll());
 // başkaları da yazsın (u3, u4), Ayşe kendi profilini açınca
 await p.evaluate(async()=>{const T=Date.now();await setMeta("gb-u1",{gb:1,comments:{a1:{uid:"u3",text:"Kampta beraber çadır kurduk, unutmam",c:"#FDE68A",g:"moon",at:T-6e4},a2:{uid:"u4",text:"En iyi satranççı sensin",c:"#FBCFE8",g:"crown",at:T-3e4},a3:{uid:"u5",text:"<img src=x onerror=alert(1)>",c:"javascript:x",g:"yok",at:T-1e4}}});LS.del("kadraj_gbs_u1");LS.del("kadraj_gbt_u1");GBT=0;closeAll();tab("profile")});
 await p.waitForTimeout(900);
 r=await p.evaluate(()=>{const g=document.querySelector("#main .gbk");return{nw:(g.querySelector(".gbnew")||{}).textContent,n:g.querySelectorAll(".gbn:not(.gbadd)").length,add:!!g.querySelector("[data-gbwrite]"),xss:!!document.querySelector("#main .gbk img[src='x']"),c3:g.querySelector('[data-gbid="a3"]').style.getPropertyValue("--c"),toast:document.querySelector("#toasts").textContent}});
 ok(r.nw==="3 yeni"&&r.n===3&&!r.add,"kendi defterinde 3 yeni rozeti, Anı bırak yok");ok(!r.xss&&r.c3==="#FDE68A","kötü yazı ve geçersiz renk zararsız");ok(/anı defterine bir anı bıraktı/.test(r.toast),"sahibine bir kez uyarı: "+r.toast.slice(0,60));
 await p.screenshot({path:O+"gb-own-"+W+".png"});
 await p.waitForTimeout(2800);ok(await p.evaluate(()=>{render(false);return new Promise(r=>setTimeout(()=>r(!document.querySelector("#main .gbnew")),300))}),"görülünce yeni rozeti kalkar");
 // duvar: başa tuttur ve sil
 await p.click('#main [data-gbwall]');await p.waitForTimeout(500);r=await p.evaluate(()=>document.querySelectorAll('#overlay [data-layer="gbwall"] .gbn.big').length);ok(r===3,"Tümü: 3 anı");
 await p.click('#overlay [data-gbpin="a3"]');await p.waitForTimeout(500);r=await p.evaluate(()=>({pin:S.meta["gb-u1"].pin,first:document.querySelector('#overlay .gbgrid .gbn').dataset.gbid}));ok(r.pin==="a3"&&r.first==="a3","başa tutturulan en başta");
 await p.screenshot({path:O+"gb-wall-"+W+".png"});
 await p.click('#overlay [data-gbdel="a2"]');await p.waitForTimeout(300);await p.click('#overlay .dialog .btn.danger');await p.waitForTimeout(500);
 r=await p.evaluate(()=>({db:!!(S.meta["gb-u1"].comments||{}).a2,n:document.querySelectorAll('#overlay [data-layer="gbwall"] .gbn.big').length}));ok(!r.db&&r.n===2,"sahibi siler");await p.evaluate(()=>closeAll());
 // başkasının defterinde yalnızca kendi anısını silebilir
 await p.evaluate(async()=>{await setMeta("gb-u2",{comments:{z1:{uid:"u3",text:"Can'dan selam",c:"#BBF7D0",g:"star",at:Date.now()}}});go("profile",{uid:"u2"})});await p.waitForTimeout(700);await p.click('#main [data-gbwall]');await p.waitForTimeout(500);
 r=await p.evaluate(()=>{const n=[...document.querySelectorAll('#overlay [data-layer="gbwall"] .gbn.big')];return n.map(x=>x.dataset.gbid+":"+!!x.querySelector("[data-gbdel]")+":"+!!x.querySelector("[data-gbpin]"))});ok(r.length===2&&r.filter(x=>/:true:/.test(x)).length===1&&r.every(x=>/:false$/.test(x)),"başkasının defterinde yalnızca kendi anısında Sil, tutturma yok "+r.join(","));
 await p.evaluate(()=>closeAll());
 // gizli hesap: takip etmiyorsam şerit yok; bot profilinde yok
 r=await p.evaluate(async()=>{await DB.update("profiles/u5",{private:true});const me=JSON.parse(JSON.stringify(P("u1")));me.following={u2:1,u3:1,u4:1};await DB.set("profiles/u1",me);go("profile",{uid:"u5"});await new Promise(r=>setTimeout(r,700));const a=!document.querySelector("#main .gbk");go("profile",{uid:"bot:rota"});await new Promise(r=>setTimeout(r,700));return a&&!document.querySelector("#main .gbk")});ok(r,"gizli hesapta ve botta defter yok");
 // başarım: 3 anı
 r=await p.evaluate(async()=>{LS.set("kadraj_gbn_u1",3);achCheck(true);await new Promise(r=>setTimeout(r,400));return{e:!!achSt().e.ani,n:ACH.length,last:ACH[ACH.length-1][0]}});ok(r.e&&r.n===31&&r.last==="zirve","Anı yazarı başarımı (31, zirve sonda)");
 r=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);ok(r<=0,"taşma yok");
 ok(errors.length===0,"sayfa hatası yok "+errors.join(" | "));console.log(pass+"/"+(pass+fail));await b.close()})();
