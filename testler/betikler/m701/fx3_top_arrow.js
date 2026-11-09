/* 7.0 hata avı A: uzun kullanıcı adında sohbet üst çubuğundaki hesap oku görünür kalır. node fx3_top_arrow.js <genişlik> */
const {open}=require('./lib');const W=+process.argv[2]||360;
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
(async()=>{const {b,p,errors}=await open(W,700,{});
 await p.evaluate(async()=>{await DB.update("profiles/u1",{username:"bilal_kara_cok_uzun_ad20"});go("chats")});await p.waitForTimeout(800);
 const r=await p.evaluate(()=>{const h=$("#top h1"),a=h.querySelector(".k70-dn").getBoundingClientRect(),hr=h.getBoundingClientRect();return{arrowIn:a.right<=hr.right+1&&a.width>0,txt:h.querySelector(".k70-unt")?.textContent,act:h.dataset.act,ov:document.documentElement.scrollWidth-innerWidth}});
 ok(r.arrowIn&&r.txt==="bilal_kara_cok_uzun_ad20"&&r.act==="k69acc","ok görünür, ad tam metin "+JSON.stringify(r));ok(r.ov<=0,"taşma yok");
 await p.evaluate(()=>{render(false)});await p.waitForTimeout(200);ok(await p.evaluate(()=>$$("#top h1 .k70-unt").length===1),"yeniden çizimde tek kutu");
 ok(!errors.length,"sayfa hatası yok "+errors.join("|"));console.log(pass+"/"+(pass+fail));await b.close();process.exit(fail?1:0)})();
