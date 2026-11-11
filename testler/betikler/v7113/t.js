// 7.1.13: İstiklal Marşı'nı dinle: telefon gibi "dokunuş olmadan ses yok" kuralıyla ses bağlamı açılıyor mu, okuma sesi çağrılıyor mu
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const HTML='/home/user/kadrajapp/index.html',BASE='http://kadraj.test/';let pass=0,fail=0;const ok=(c,m)=>{console.log((c?"OK  ":"FAIL")+" "+m);c?pass++:fail++};
(async()=>{const b=await chromium.launch({args:["--autoplay-policy=user-gesture-required"]});const ctx=await b.newContext({viewport:{width:390,height:820},hasTouch:true});const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE)){const q=decodeURIComponent(new URL(u).pathname);if(q==='/'||q==='/index.html')return r.fulfill({body:fs.readFileSync(HTML),contentType:'text/html; charset=utf-8'});if(q==='/ses/istiklal.mp3')return r.fulfill({status:404,body:''});const f=path.join(path.dirname(HTML),q);if(fs.existsSync(f)&&fs.statSync(f).isFile())return r.fulfill({body:fs.readFileSync(f)});return r.fulfill({status:404,body:''})}if(u.startsWith('data:')||u.startsWith('blob:'))return r.continue();return r.abort()});
 await p.goto(BASE+'index.html');await p.waitForTimeout(1200);
 await p.evaluate(async()=>{if(S.mode!=="local"||!DB)await bootLocal();await DB.set("profiles/u1",{uid:"u1",username:"bilal",name:"Bilal",following:{},createdAt:Date.now()});S.uid="u1";settings.clawd=false;await enterApp(false);
  window.__said=[];const o=window.speechSynthesis&&speechSynthesis.speak.bind(speechSynthesis);if(window.speechSynthesis)speechSynthesis.speak=u=>{__said.push(u.text);try{o(u)}catch(e){}};go("settings")});
 await p.waitForTimeout(800);
 await p.evaluate(()=>{const b=[...document.querySelectorAll("#main [data-act]")].find(x=>x.dataset.act==="k719im");b.scrollIntoView();});
 await p.click('#main [data-act="k719im"]',{force:true});
 await p.waitForTimeout(7500);
 const r=await p.evaluate(()=>{const c=MARSI._cur();const S=c&&c.syn;return{open:!!document.querySelector(".imc"),syn:!!S,st:S&&S.ac&&S.ac.state,on:S&&S.on,btn:!(document.getElementById("imSnd")||{}).hidden,said:__said.filter(x=>x.trim()).length,note:(document.getElementById("imNote")||{}).textContent}});
 ok(r.open&&r.syn,"tören açıldı, ses dosyası yokken üretilen müzik devrede");
 ok(r.st==="running"&&r.on,"ses bağlamı dokunuşla açıldı ve müzik çalıyor ("+r.st+")");ok(!r.btn,"Sesi aç düğmesine gerek kalmadı");
 ok(r.said>=1,"okuma sesi dize okudu ("+r.said+")");ok(!r.note,"okuma sesi olan cihazda not yok");
 /* Sesi aç: dokunuşsuz başlatılan tören (pazartesi) askıda kalırsa ekrana dokununca açılır */
 await p.evaluate(()=>{MARSI.stop();window.kImAC=null;MARSI.run(Date.now()-5000)});await p.waitForTimeout(3500);
 const r2=await p.evaluate(()=>{const S=MARSI._cur().syn;return{st:S.ac.state,btn:!document.getElementById("imSnd").hidden}});
 await p.mouse.click(200,400);await p.waitForTimeout(800);
 const r3=await p.evaluate(()=>{const S=MARSI._cur().syn;return{st:S.ac.state,btn:!document.getElementById("imSnd").hidden}});
 ok(r3.st==="running"&&!r3.btn,"ekrana dokununca ses açıldı");
 ok(errors.length===0,"sayfa hatası yok "+errors.join("|"));console.log(pass+"/"+(pass+fail));await b.close()})();
