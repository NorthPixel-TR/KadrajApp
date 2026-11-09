const {open,OUT}=require('./lib');const fs=require('fs');const V='/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/7013A/v/';
const W=+process.argv[2]||390;const dark=process.argv[3]==="dark",ui=process.argv[4]||"vizor";
(async()=>{const {b,p,errors}=await open(W,860,{dark,ui});const webm=fs.readFileSync(V+'d3.webm').toString('base64');
 await p.evaluate((w)=>{const u=Uint8Array.from(atob(w),c=>c.charCodeAt(0));window.nativePick=async()=>new File([u],"v.webm",{type:"video/webm"})},webm);
 await p.evaluate(()=>openComposer("reel"));await p.waitForTimeout(500);await p.click("#vPick");await p.waitForTimeout(1200);await p.click("#vKed");await p.waitForTimeout(2500);
 const tools=await p.evaluate(()=>[...document.querySelectorAll(".ked [data-kt]")].map(x=>x.dataset.kt));console.log(tools);
 for(const t of tools){const el=(await p.$(`.ked [data-kt="${t}"]`));if(!el)continue;await el.click();await p.waitForTimeout(400);await p.screenshot({path:OUT+`kdt_${t}_${W}_${dark?"d":"l"}.png`,clip:{x:0,y:600,width:W,height:260}})}
 console.log("errors",errors);await b.close()})();
