const {open}=require('../m70/lib');
(async()=>{const {b,p,errors}=await open(390);
 await p.evaluate(()=>{closeAll();tab("settings")});await p.waitForTimeout(800);
 const a=await p.evaluate(()=>{const e=document.querySelector("#k718C");return !!e&&e.getBoundingClientRect().width>0});
 await p.evaluate(()=>document.querySelector('[data-act="k718clear"]').click());await p.waitForTimeout(400);
 const d=await p.evaluate(()=>!!document.querySelector("#overlay .dialog, #overlay [data-layer]"));await p.evaluate(()=>closeAll());
 const adm=await p.evaluate(()=>{const x=ADM_EXTRA.find(e=>e.id==="site");if(!x)return null;const el=document.createElement("div");el.innerHTML=x.html();x.wire(el);return el.textContent.includes("kadraj-4cz.pages.dev/kadraj.apk")});
 const ov=await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);
 console.log(JSON.stringify({ayarSatiri:a,onayPenceresi:d,yonetici:adm,tasmaYok:ov,hata:errors}));await b.close()})();
