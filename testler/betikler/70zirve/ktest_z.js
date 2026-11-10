// Yönetici › Kadraj testi: bölüm görünür, Hızlı test sandbox'ta çalışır ve sonuç listesi gelir, Test Kadraj'ı açılır (Bilal Kara, demo veri)
const kt=require('../k40/kt.js');
(async()=>{const {page,errors,close}=await kt.openApp('/home/user/kadrajapp/.claude/worktrees/agent-a814d3297f0c28720/index.html',{width:390,height:844});
page.on('response',r=>{if(r.status()>=400)console.log('R',r.status(),r.url().slice(0,120))});page.on('requestfailed',r=>console.log('F',r.url().slice(0,120)));
await kt.login(page,{uid:'u9',name:'Sahip',un:'sahip'});
await page.evaluate(()=>{S.admin=true;go("admin")});await page.waitForTimeout(800);
console.log('section',await page.evaluate(()=>!!ADM_EXTRA.find(x=>x.id==="ktest")));
await page.evaluate(()=>{const b=document.createElement("div");b.id="ktRes";document.body.appendChild(b);ACT.ktRun()});
await page.waitForFunction(()=>{const b=$("#ktRes");return b&&b.querySelector(".kt-sum")},null,{timeout:100000});
console.log(await page.evaluate(()=>$("#ktRes").innerText.replace(/\n+/g,' | ')));
await page.evaluate(()=>ACT.ktOpen());await page.waitForTimeout(4000);
const fr=page.frames().find(f=>f.url().startsWith('blob:'));console.log('frame',!!fr);
if(fr){console.log('inside',await fr.evaluate(()=>({uid:S.uid,name:P(S.uid).name,route:S.route.name,cards:document.querySelectorAll('#main .card').length})));}
await kt.shot(page,__dirname+'/ktest.png');
console.log('errors',errors);await close()})();
