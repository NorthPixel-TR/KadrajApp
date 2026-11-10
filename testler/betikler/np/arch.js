/* 7.0.22 sürüm arşivi: 0.0-2.5 tahmini (sitenin kendisinden) ve 3.0-7.0.18 eski sürümler (NorthPixel-TR/KadrajApp arsiv dalı, gerçek GitHub) */
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const HTML='/home/user/kadrajapp/index.html',BASE='http://kadraj.test/';let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:860}});const p=await ctx.newPage();const err=[];p.on('pageerror',e=>err.push(e.message));
 await ctx.route('**/*',r=>{const u=r.request().url();
  if(u.startsWith(BASE)){const q=decodeURIComponent(new URL(u).pathname);if(q==='/'||q==='/index.html')return r.fulfill({body:fs.readFileSync(HTML),contentType:'text/html; charset=utf-8'});
   const f=path.join(path.dirname(HTML),q);if(fs.existsSync(f)&&fs.statSync(f).isFile())return r.fulfill({body:fs.readFileSync(f),contentType:q.endsWith('.html')?'text/html; charset=utf-8':undefined});return r.fulfill({status:404,body:''})}
  if(/^https:\/\/(raw\.githubusercontent\.com|api\.github\.com)\//.test(u))return r.continue();
  if(u.startsWith('data:')||u.startsWith('blob:'))return r.continue();return r.abort()});
 await p.goto(BASE+'index.html');await p.waitForTimeout(1500);
 await p.evaluate(async()=>{if(S.mode!=="local"||!DB)await bootLocal();S.uid="u_ar";await saveNewProfile("Test","test",null)});await p.waitForTimeout(1200);
 const L=await p.evaluate(()=>archList().map(a=>a[0]));
 ok(L[L.length-1]==="0.0"&&L.includes("2.5")&&L.includes("3.0")&&L.includes("7.0.18"),"liste 0.0'dan "+L[0]+"'e, "+L.length+" sürüm");
 ok(L.indexOf("2.5")>L.indexOf("3.0")&&L.indexOf("7.0.10")<L.indexOf("7.0.9")&&L.indexOf("4.4.2")<L.indexOf("4.4.1"),"sıra doğru (7.0.10 > 7.0.9, 3.0 > 2.5)");
 await p.evaluate(()=>{closeAll();S.admin=true;go("admin")});await p.waitForTimeout(800);
 await p.evaluate(()=>{const h=document.querySelector("#admH-arsiv")||[...document.querySelectorAll("#main [id^=admH-]")].find(x=>/arşiv/i.test(x.textContent));h&&h.click()});await p.waitForTimeout(4000);
 const ui=await p.evaluate(()=>{const sec=document.getElementById("admS-arsiv");const bt=sec?[...sec.querySelectorAll("[data-arch]")]:[];return{n:bt.length,est:bt.filter(x=>/tahmini/.test(x.textContent)).map(x=>x.dataset.v),st:(document.getElementById("adm5ArSt")||{}).textContent||"",note:(sec&&sec.querySelector(".adm5-note")||{}).textContent||"",groups:sec?[...sec.querySelectorAll(".adm5-sub")].map(x=>x.textContent):[]}});
 ok(ui.n>=160,"panelde "+ui.n+" sürüm düğmesi; "+ui.st);ok(ui.est.join()==="2.5,2.0,1.5,1.0,0.5,0.0","tahmini etiketi: "+ui.est.join());
 ok(/tahmini yeniden yapım/.test(ui.note),"not: "+ui.note.slice(0,90));ok(ui.groups.some(g=>/Kadraj 0\.x/.test(g))&&ui.groups.some(g=>/Kadraj 7\.x/.test(g)),"gruplar: "+ui.groups.join(" | "));
 for(const v of ["1.5","2.5","3.0","6.4.8","7.0.18"]){
  await p.evaluate(v=>{closeAll();const bt=document.querySelector(`#admS-arsiv [data-v="${v}"]`);bt.click()},v);
  let r=null;for(let i=0;i<40&&!r;i++){await p.waitForTimeout(500);r=await p.evaluate(()=>{const f=document.querySelector('[data-layer="arch"] iframe');const e=document.querySelector('[data-layer="arch"] .empty');return f?"iframe":e?"hata: "+e.textContent:null})}
  let inner="";if(r==="iframe"){await p.waitForTimeout(v.startsWith("3")||v.startsWith("6")||v.startsWith("7")?5000:800);const fr=p.frames().find(f=>f.url().startsWith("blob:"));inner=fr?await fr.evaluate(()=>document.body.innerText.replace(/\s+/g," ").slice(0,80)).catch(e=>"ERR "+e.message):"çerçeve yok"}
  ok(r==="iframe"&&inner.length>10&&!/^ERR|çerçeve yok/.test(inner),`${v} açıldı: ${r} · ${inner}`);
  await p.screenshot({path:`/tmp/claude-0/-home-user/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/arch/ar-${v}.png`})}
 ok(err.length===0,"sayfa hatası yok "+err.join(" | "));console.log(pass+"/"+(pass+fail));await b.close()})();
