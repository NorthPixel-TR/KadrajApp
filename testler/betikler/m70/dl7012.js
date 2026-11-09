/* 7.0.12: tarayıcıda video indirme penceresi (Cloudinary gibi uzak adres, parçalı MP4 → düzeltilmiş indirme) */
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const HTML='/home/user/Kadraj/index.html',BASE='http://kadraj.test/';const MP4=fs.readFileSync('/home/user/kadraj-test/vf/chrome.mp4');
const CLD='https://res.cloudinary.com/jw9koecu/video/upload/v1700000000/abc.mp4';
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:true,acceptDownloads:true});const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 let fail404=false;
 await p.route('**/*',r=>{const u=r.request().url();
  if(u.startsWith('https://res.cloudinary.com/')){if(fail404)return r.fulfill({status:404,body:''});return r.fulfill({status:200,body:MP4,headers:{'content-type':'video/mp4','access-control-allow-origin':'*','content-length':String(MP4.length)}})}
  if(u.startsWith(BASE)){const q=decodeURIComponent(new URL(u).pathname);if(q==='/'||q==='/index.html')return r.fulfill({body:fs.readFileSync(HTML),contentType:'text/html; charset=utf-8'});const f=path.join(path.dirname(HTML),q);if(fs.existsSync(f)&&fs.statSync(f).isFile())return r.fulfill({body:fs.readFileSync(f)});return r.fulfill({status:404,body:''})}
  if(u.startsWith('data:')||u.startsWith('blob:'))return r.continue();return r.abort()});
 await p.goto(BASE+'index.html');await p.waitForTimeout(1500);
 await p.evaluate(async(CLD)=>{await bootLocal();for(const [uid,un] of [["u1","bilal"],["u2","ayse"]])await DB.set("profiles/"+uid,{uid,username:un,name:un,bio:"",avatar:null,following:{u1:1,u2:1},botFollowers:{},createdAt:Date.now()});
  const c=cidFor("u1","u2");await DB.set("chats/"+c,{members:["u1","u2"],last:{text:"Video",from:"u2",at:Date.now()},updatedAt:Date.now(),reads:{}});
  await DB.set(`chats/${c}/msgs/v1`,{from:"u2",at:Date.now(),video:CLD});S.uid="u1";LS.set("kadraj_session","u1");await enterApp(false)},CLD);
 await p.waitForTimeout(800);await p.evaluate(()=>{closeAll();openChat("u:u2")});await p.waitForTimeout(900);
 await p.evaluate(()=>msgMenu("v1"));await p.waitForTimeout(300);
 ok(await p.evaluate(()=>!!document.querySelector('#overlay #mmDl')),"İndir menüde");
 await p.evaluate(()=>document.querySelector('#overlay #mmDl').click());
 await p.waitForSelector('#dlSave',{timeout:8000}).catch(()=>{});
 const st=await p.evaluate(()=>document.querySelector('#dlSt')?.textContent);ok(/Video hazır/.test(st||""),"pencere: "+st);
 const dlP=p.waitForEvent('download',{timeout:5000});await p.click('#dlSave');const dl=await dlP.catch(()=>null);
 ok(!!dl,"Telefona kaydet indirmeyi başlattı "+(dl&&dl.suggestedFilename()));
 if(dl){const fp='/home/user/kadraj-test/vf/dl_out.mp4';await dl.saveAs(fp);const u8=fs.readFileSync(fp);const top=[];let q=0;while(q+8<=u8.length){const sz=u8.readUInt32BE(q);top.push(u8.toString('latin1',q+4,q+8));if(sz<8)break;q+=sz}ok(top.join(",")==="ftyp,moov,mdat","indirilen dosya tek parça MP4 "+top.join(","))}
 await p.waitForTimeout(600);ok(await p.evaluate(()=>!document.querySelector('#overlay [data-layer="dl7012"]')),"pencere kapandı");
 /* uzak adres hata verince doğrudan indir bağlantısı */
 fail404=true;await p.evaluate(()=>{closeAll();msgMenu("v1")});await p.waitForTimeout(300);await p.evaluate(()=>document.querySelector('#overlay #mmDl').click());await p.waitForTimeout(1200);
 const r=await p.evaluate(()=>({st:document.querySelector('#dlSt')?.textContent,href:document.querySelector('#dlDir2')?.getAttribute('href')}));
 ok(/Doğrudan/.test(r.st||"")&&/fl_attachment/.test(r.href||"")&&/f_mp4/.test(r.href||""),"hata olunca Doğrudan indir "+JSON.stringify(r));
 ok(await p.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),"taşma yok");
 ok(errors.length===0,"sayfa hatası yok "+errors.join(" | "));console.log(pass+"/"+(pass+fail));await b.close()})();
