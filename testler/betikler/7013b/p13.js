const {open,OUT}=require('./lib');
(async()=>{const W=+process.argv[2]||360;const {b,p,errors}=await open(W,780);
await p.evaluate(()=>{for(let i=0;i<8;i++)toast("Uyarı numarası "+i+" biraz uzun bir metin ile birlikte geliyor","u2")});await p.waitForTimeout(500);
console.log(await p.evaluate(()=>[...document.querySelectorAll("#toasts > *")].map(t=>{const r=t.getBoundingClientRect();return Math.round(r.top)+"-"+Math.round(r.bottom)}).join(" ")));
await p.screenshot({path:OUT+"p13.png"});
await p.evaluate(()=>{knNotify({title:"Ayşe",body:"selam",key:"u:u2",uid:"u2",kind:"msg"});knNotify({title:"Can",body:"naber",key:"u:u3",uid:"u3",kind:"msg"});knNotify({title:"Ayşe",body:"ikinci",key:"u:u2",uid:"u2",kind:"msg"})});await p.waitForTimeout(600);
console.log(await p.evaluate(()=>[...document.querySelectorAll(".kn")].map(t=>{const r=t.getBoundingClientRect();return t.className+" "+Math.round(r.top)+"-"+Math.round(r.bottom)+" "+t.textContent.slice(0,40)}).join("\n")));
await p.screenshot({path:OUT+"p13b.png"});
console.log(errors);await b.close()})();
