/* 7.0.13 ikinci tur: silinmiş Klaket, toast sınırı, özet, animasyon ayarı, pencere kenarları, 360 tepki satırı, Klaket kip kilidi, storeVideoFs vidFix */
const {open}=require('../m70/lib');const W=+process.argv[2]||390;
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
(async()=>{const {b,p,errors}=await open(W);
 // silinmiş parçalı Klaket
 await p.evaluate(async()=>{await DB.set("posts/gone1",{uid:"u2",at:Date.now()+5000,kind:"reel",video:"chunk:yokvid:2"})});
 await p.evaluate(()=>go("reels",{start:"gone1"}));await p.waitForTimeout(2000);
 const g=await p.evaluate(()=>{const r=document.querySelector('.reel [data-vref="chunk:yokvid:2"]');const re=r&&r.closest('.reel');const x=re&&re.querySelector('.k7013-gone');if(!x)return null;const a=x.getBoundingClientRect(),c=re.getBoundingClientRect();return {t:x.textContent,inside:a.width<=c.width+1&&a.height<=c.height+1}});
 ok(g&&g.t==="Bu video artık yok"&&g.inside,"silinmiş Klaket uyarısı "+JSON.stringify(g));
 // toast sınırı
 await p.evaluate(()=>{tab("feed");for(let i=0;i<8;i++)toast("Uyarı "+i)});await p.waitForTimeout(200);
 const n=await p.evaluate(()=>document.querySelector('#toasts').children.length);ok(n<=3,"en çok 3 uyarı ("+n+")");
 // özet: beğenisiz paylaşım
 await p.evaluate(async()=>{await DB.set("posts/my0",{uid:"u1",at:Date.now(),kind:"note",text:"x",bg:0})});await p.waitForTimeout(400);
 await p.evaluate(()=>{for(const k in S.meta)if(S.posts&&S.posts[k]&&S.posts[k].uid==="u1")S.meta[k]={likes:{}};ozetSheet()});await p.waitForTimeout(400);
 const oz=await p.evaluate(()=>document.querySelector('#overlay [data-layer="ozet"]').textContent);ok(!/En çok beğenilen/.test(oz)||!/ 0 beğeni/.test(oz),"özette 0 beğeni yok");
 await p.evaluate(()=>closeAll());
 // pencere kenarları
 await p.evaluate(()=>openChat("u:u2"));await p.waitForTimeout(700);await p.evaluate(()=>schOpen());await p.waitForTimeout(500);
 const sc=await p.evaluate(()=>{const a=document.querySelector('#schT').getBoundingClientRect();return [a.left,innerWidth-a.right]});ok(sc[0]>=12&&sc[1]>=12,"zamanlama kutusu kenar boşluğu "+sc);
 await p.evaluate(()=>closeAll());await p.evaluate(()=>zrLetter());await p.waitForTimeout(800);
 const zr=await p.evaluate(()=>{const t=document.querySelector('#overlay [data-layer="zirve"] textarea');if(!t)return null;const a=t.getBoundingClientRect();return [a.left,innerWidth-a.right]});ok(zr&&zr[0]>=12&&zr[1]>=12,"Zirve mektubu kenar boşluğu "+zr);
 await p.evaluate(()=>closeAll());
 // tepki satırı tek satır
 await p.evaluate(()=>{tab("settings")});await p.waitForTimeout(500);
 const rx=await p.evaluate(()=>{const bs=[...document.querySelectorAll('.k69-rx button')];return bs.length?new Set(bs.map(b=>Math.round(b.offsetTop))).size:-1});ok(rx===1,"tepki satırı tek satır ("+rx+")");
 // hareketi azalt: Kapalı görünür
 await p.emulateMedia({reducedMotion:'reduce'});await p.evaluate(()=>{settings.anim="akici";settings.reduceMotion=false;render(true)});await p.waitForTimeout(500);
 const an=await p.evaluate(()=>{const s=[...document.querySelectorAll('[data-k] .seg')].find(x=>x.getAttribute('aria-label')==="Animasyonlar");const on=s&&s.querySelector('[aria-pressed="true"]');return {on:on&&on.textContent,note:!!document.querySelector('.k7013-rm')}});ok(an.on==="Kapalı"&&an.note,"hareketi azaltılmışken Kapalı "+JSON.stringify(an));
 await p.emulateMedia({reducedMotion:'no-preference'});
 // storeVideoFs vidFix'ten geçer
 const sv=await p.evaluate(async()=>{let got=null;const o=vidFix;vidFix=async f=>{got=f;return f};try{await storeVideoFs(new File([new Uint8Array([1,2,3])],"a.webm",{type:"video/webm"}),()=>{})}catch(e){}vidFix=o;return !!got});ok(sv,"storeVideoFs vidFix çağırıyor");
 const ov=await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);ok(ov,"taşma yok");
 ok(errors.length===0,"sayfa hatası yok "+errors.join(" | "));console.log(pass+"/"+(pass+fail));await b.close()})();
