/* 6.9.1 otomatik kırpma: node stk.js <resim> <çıktı.png> */
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const HTML='/home/user/Kadraj/index.html',BASE='http://kadraj.test/',MP='/home/user/kadraj-test/mp/';
const IMG=process.argv[2]||'img/kedi.jpg',OUT=process.argv[3]||'/tmp/claude-0/stk.png';
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(/kırp|Error|error|warn/i.test(m.type()+m.text()))console.log('CON',m.type(),m.text().slice(0,300))});p.on('requestfailed',r=>console.log('RF',r.url().slice(0,120)));
 await p.route('**/*',r=>{const u=r.request().url();
  if(u.startsWith('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/')){const f=u.split('@0.10.14/')[1].split('?')[0];const t=f.endsWith('.wasm')?'application/wasm':'application/javascript';return r.fulfill({body:fs.readFileSync(MP+'package/'+f),contentType:t,headers:{'access-control-allow-origin':'*'}})}
  if(u.startsWith('https://storage.googleapis.com/mediapipe-models/'))return r.fulfill({body:fs.readFileSync(MP+'deeplab_v3.tflite'),contentType:'application/octet-stream',headers:{'access-control-allow-origin':'*'}});
  if(u.startsWith(BASE)){const q=decodeURIComponent(new URL(u).pathname);if(q==='/'||q==='/index.html')return r.fulfill({body:fs.readFileSync(HTML),contentType:'text/html; charset=utf-8'});
  if(q==='/test/kedi_bg.jpg')return r.fulfill({body:fs.readFileSync(MP+'kedi_bg.jpg'),contentType:'image/jpeg'});const f=path.join(path.dirname(HTML),q);if(fs.existsSync(f)&&fs.statSync(f).isFile())return r.fulfill({body:fs.readFileSync(f)});return r.fulfill({status:404,body:''})}
  if(u.startsWith('data:')||u.startsWith('blob:'))return r.continue();return r.abort()});
 await p.goto(BASE+'index.html');await p.waitForTimeout(1500);
 await p.evaluate(async()=>{if(S.mode!=="local"||!DB)await bootLocal();await DB.set("profiles/u1",{uid:"u1",username:"bilal",name:"Bilal",bio:"",avatar:null,following:{},botFollowers:{},private:false,createdAt:Date.now()});S.uid="u1";LS.set("kadraj_session","u1");await enterApp(false)});
 await p.waitForTimeout(600);
 await p.evaluate(src=>{closeAll();window.pickImage=async()=>{const im=new Image();im.src=src;await im.decode();return{img:im,src}};stkMake(null)},IMG);
 await p.waitForTimeout(300);ok(await p.evaluate(()=>document.querySelector('[data-sh="auto"]').getAttribute("aria-pressed")==="true"),"varsayılan şekil Otomatik");
 const t0=Date.now();let done=false;for(let i=0;i<60&&!done;i++){await p.waitForTimeout(500);done=await p.evaluate(()=>{const c=document.getElementById("k69Cv");if(!c)return false;const d=c.getContext("2d").getImageData(0,0,320,320).data;let tr=0;for(let i=3;i<d.length;i+=4)if(d[i]===0)tr++;window.__tr=tr/(d.length/4);return!/bulunamadı/.test(document.getElementById("k69Hint").textContent)&&window.__tr>.05})}
 const r=await p.evaluate(()=>({tr:window.__tr,hint:document.getElementById("k69Hint").textContent}));
 ok(done,`otomatik kırpıldı (${Date.now()-t0} ms, saydam %${Math.round(r.tr*100)})`);
 await p.locator('.k69s-wrap').screenshot({path:OUT});
 await p.evaluate(()=>document.getElementById("k69Sv").click());await p.waitForTimeout(800);
 ok(await p.evaluate(async()=>{const d=await DB.get("data/users/u1/stk");return d&&d.list&&d.list.length===1}),"kaydedildi");
 ok(!errors.length,"sayfa hatası yok "+errors.join("|"));console.log(pass+"/"+(pass+fail));await b.close();process.exit(fail?1:0)})();
