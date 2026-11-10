/* 7.0.24 kurucuya tek dokunuşla yönetici paneli: yalnızca bilolotr görür, profil ve Ayarlar'dan açılır */
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const HTML='/home/user/kadrajapp/index.html',BASE='http://kadraj.test/';let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
const W=+process.argv[2]||390;
(async()=>{const b=await chromium.launch();
 for(const un of ["bilolotr","ayse"]){const p=await b.newPage({viewport:{width:W,height:860}});const err=[];p.on('pageerror',e=>err.push(e.message));
  await p.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE)){const q=decodeURIComponent(new URL(u).pathname);if(q==='/'||q==='/index.html')return r.fulfill({body:fs.readFileSync(HTML),contentType:'text/html; charset=utf-8'});const f=path.join(path.dirname(HTML),q);if(fs.existsSync(f)&&fs.statSync(f).isFile())return r.fulfill({body:fs.readFileSync(f)});return r.fulfill({status:404,body:''})}if(u.startsWith('data:')||u.startsWith('blob:'))return r.continue();return r.abort()});
  await p.goto(BASE+'index.html');await p.waitForTimeout(1500);
  await p.evaluate(async un=>{if(S.mode!=="local"||!DB)await bootLocal();S.uid="u_"+un;await saveNewProfile("Test",un,null)},un);await p.waitForTimeout(1200);
  await p.evaluate(()=>{closeAll();tab("profile")});await p.waitForTimeout(800);
  const pr=await p.evaluate(()=>!!document.querySelector('#main .prof .btns [data-act="k724adm"]'));
  await p.evaluate(()=>{closeAll();go("settings")});await p.waitForTimeout(800);
  const st=await p.evaluate(()=>{const e=document.querySelector('#k724S');return e?{top:e.getBoundingClientRect().top}:null});
  if(un==="bilolotr"){ok(pr,"kurucu: profilde anahtar düğmesi");ok(st&&st.top<300,"kurucu: Ayarlar'ın üstünde "+JSON.stringify(st));
   await p.screenshot({path:'/tmp/claude-0/-home-user/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/arch/k724-set.png'});
   await p.click('#k724S [data-act="k724adm"]');await p.waitForTimeout(800);ok(await p.evaluate(()=>S.admin&&S.route.name==="admin"),"Ayarlar'dan tek dokunuşla panel açıldı");
   await p.evaluate(()=>{S.admin=false;closeAll();tab("profile")});await p.waitForTimeout(800);await p.screenshot({path:'/tmp/claude-0/-home-user/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/arch/k724-prof.png'});
   await p.click('#main .prof .btns [data-act="k724adm"]');await p.waitForTimeout(800);ok(await p.evaluate(()=>S.admin&&S.route.name==="admin"),"profilden tek dokunuşla panel açıldı");
   for(let i=0;i<3;i++){await p.evaluate(()=>{tab("profile")});await p.waitForTimeout(300);await p.evaluate(()=>render(false));await p.waitForTimeout(200)}
   ok(await p.evaluate(()=>document.querySelectorAll('#main [data-act="k724adm"]').length===1),"yeniden çizimde tek düğme");
   ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),"taşma yok")}
  else{ok(!pr&&!st,"başkası: düğme yok");await p.evaluate(()=>ACT.k724adm());ok(await p.evaluate(()=>!S.admin),"başkası: ACT ile de açılmaz")}
  ok(err.length===0,un+": sayfa hatası yok "+err.join("|"));await p.close()}
 console.log(pass+"/"+(pass+fail));await b.close()})();
