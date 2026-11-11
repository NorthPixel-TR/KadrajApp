// 7.1.14: ses/istiklal.mp3 varken: Dinle'ye basınca kayıt çalar, telefonun okuması ve üretilen müzik devreye girmez, dizeler kaydın süresine yayılır
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const HTML='/home/user/kadrajapp/index.html',BASE='http://kadraj.test/';let pass=0,fail=0;const ok=(c,m)=>{console.log((c?"OK  ":"FAIL")+" "+m);c?pass++:fail++};
(async()=>{ok(fs.existsSync(path.join(path.dirname(HTML),"ses/istiklal.mp3")),"ses/istiklal.mp3 depoda");
 const b=await chromium.launch({args:["--autoplay-policy=user-gesture-required"]});const ctx=await b.newContext({viewport:{width:390,height:820},hasTouch:true});const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE)){const q=decodeURIComponent(new URL(u).pathname);if(q==='/'||q==='/index.html')return r.fulfill({body:fs.readFileSync(HTML),contentType:'text/html; charset=utf-8'});const f=path.join(path.dirname(HTML),q);
  if(fs.existsSync(f)&&fs.statSync(f).isFile())return r.fulfill({body:fs.readFileSync(f),contentType:q.endsWith(".mp3")?"audio/mpeg":undefined});return r.fulfill({status:404,body:''})}if(u.startsWith('data:')||u.startsWith('blob:'))return r.continue();return r.abort()});
 await p.goto(BASE+'index.html');await p.waitForTimeout(1200);
 await p.evaluate(async()=>{if(S.mode!=="local"||!DB)await bootLocal();await DB.set("profiles/u1",{uid:"u1",username:"bilal",name:"Bilal",following:{},createdAt:Date.now()});S.uid="u1";settings.clawd=false;await enterApp(false);
  window.__said=[];if(window.speechSynthesis){const o=speechSynthesis.speak.bind(speechSynthesis);speechSynthesis.speak=u=>{__said.push(u.text);try{o(u)}catch(e){}}}go("settings")});
 await p.waitForTimeout(800);await p.click('#main [data-act="k719im"]',{force:true});
 await p.waitForTimeout(6500);
 const r=await p.evaluate(()=>{const c=MARSI._cur();return{open:!!document.querySelector(".imc"),au:!!(c&&c.au),play:!!(c&&c.au&&!c.au.paused),t:c&&c.au?c.au.currentTime:0,dur:c&&c.au?c.au.duration:0,syn:!!(c&&c.syn),per:c&&c.per,tot:c&&c.tot,said:__said.filter(x=>x.trim()).length,line:document.getElementById("imLine").textContent}});
 ok(r.open&&r.au&&r.play,"tören açıldı, kayıt çalıyor ("+r.t.toFixed(1)+" sn)");ok(Math.abs(r.dur-62)<2,"kaydın süresi ~62 sn ("+(r.dur||0).toFixed(1)+")");
 ok(!r.syn&&r.said===0,"telefonun okuması ve üretilen müzik devrede değil");ok(r.per>7000&&r.per<8000&&r.tot<73000,"dizeler kayda göre: satır "+Math.round(r.per)+" ms, toplam "+Math.round(r.tot)+" ms");
 ok(/^Korkma/.test(r.line),"ilk dize ekranda: "+r.line);
 ok(errors.length===0,"sayfa hatası yok "+errors.join("|"));console.log(pass+"/"+(pass+fail));await b.close()})();
