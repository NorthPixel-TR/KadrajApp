/* çıkış yaptıktan sonra geri tuşu */
const {open,seed,ok,done,SP}=require('./h');
(async()=>{const W=+process.argv[2]||390;const {b,p,errors}=await open(W);await seed(p);
 await p.evaluate(()=>{go("profile",{uid:"u2"})});await p.waitForTimeout(300);await p.evaluate(()=>go("settings"));await p.waitForTimeout(300);
 await p.evaluate(()=>{logout()});await p.waitForTimeout(300);await p.evaluate(()=>{const b=[...document.querySelectorAll("#overlay button")].find(x=>/Çıkış yap/.test(x.textContent));b.click()});await p.waitForTimeout(500);
 console.log("çıkış sonrası",await p.evaluate(()=>({auth:!!document.querySelector("#main .auth"),stack:S.stack.length,r:S.route.name})));
 await p.goBack();await p.waitForTimeout(600);
 const r=await p.evaluate(()=>({auth:!!document.querySelector("#main .auth"),txt:document.getElementById("main").innerText.slice(0,80).replace(/\n/g," "),authed:S.authed,r:S.route.name}));console.log("geri sonrası",JSON.stringify(r));
 await p.screenshot({path:SP+"back_logout.png"});
 const k=await p.evaluate(()=>window.kBack());console.log("kBack",k,await p.evaluate(()=>document.getElementById("main").innerText.slice(0,60)));
 done(errors);await b.close()})();
