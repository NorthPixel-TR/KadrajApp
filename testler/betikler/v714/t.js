// 7.1.4: Ayarlar'da simge satırı + İstiklal Marşı sesli okuma/müzik (ses dosyası yokken)
process.env.KBLOCK="/ses/istiklal.mp3"; /* dosyasız (yapay ses) yolu dener */
const {open}=require('/home/user/kadraj-test/m70/lib.js');let pass=0,fail=0;const ok=(c,m)=>{console.log((c?"OK  ":"FAIL")+" "+m);c?pass++:fail++};
(async()=>{const {b,p,errors}=await open(390);
 await p.evaluate(()=>{window.__said=[];const ss=window.speechSynthesis;if(ss){ss.speak=u=>__said.push(u.text);ss.cancel=()=>{}}go("settings")});await p.waitForTimeout(900);
 ok(await p.$("#k714I"),"Ayarlar'da simge satırı var");
 await p.click('#k714I [data-act="k714"]');await p.waitForTimeout(500);
 ok(await p.evaluate(()=>!!document.querySelector('[data-layer="k714"] ol')),"simge penceresi adımları gösteriyor");
 await p.evaluate(()=>closeAll());
 await p.evaluate(()=>new Promise(r=>{const s=document.createElement("script");s.src="marsi.js?v="+APP_V;s.onload=r;document.head.appendChild(s)}));
 await p.evaluate(()=>{const t0=Date.now();window.__t0=t0;MARSI.run(t0-3500,()=>Date.now()+0)});
 await p.waitForTimeout(5000);
 const st=await p.evaluate(()=>{const c=MARSI._cur();return{syn:!!(c&&c.syn),ac:!!(c&&c.syn&&c.syn.ac),on:!!(c&&c.syn&&c.syn.on),said:__said.slice()}});
 ok(st.syn&&st.ac,"ses dosyası yokken yapay ses ve müzik devreye girdi");
 ok(st.on,"müzik başladı");
 ok(st.said.length>=1&&/Korkma/.test(st.said[0]),"ilk dize sesli okundu: "+st.said[0]);
 await p.evaluate(()=>MARSI.stop());await p.waitForTimeout(300);
 ok(await p.evaluate(()=>!MARSI._cur()),"Kapat ile durdu");
 ok(errors.length===0,"sayfa hatası yok "+errors.join(" | "));
 console.log(pass+"/"+(pass+fail));await b.close();process.exit(fail?1:0)})();
