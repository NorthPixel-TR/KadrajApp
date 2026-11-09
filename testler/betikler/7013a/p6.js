/* Klaket oluştur: video seç, Kurgu aç, taşma */
const {open,OUT}=require('./lib');const fs=require('fs');const V='/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/7013A/v/';
const W=+process.argv[2]||390;const dark=process.argv[3]==="dark",ui=process.argv[4]||"vizor";
(async()=>{const {b,p,errors}=await open(W,860,{dark,ui});const webm=fs.readFileSync(V+'d3.webm').toString('base64');
 const ov=async(t)=>{const r=await p.evaluate(()=>{const bad=[];for(const el of document.querySelectorAll("#overlay *")){const r=el.getBoundingClientRect();if(r.width&&r.right>innerWidth+1&&!el.closest(".seg,.slides-pick,.kd-tl,.kdTl,[style*='overflow']"))bad.push((typeof el.className==="string"?el.className:el.tagName)+"#"+el.id+":"+Math.round(r.right))}return{sw:document.documentElement.scrollWidth,ov:document.querySelector("#overlay").scrollWidth,bad:bad.slice(0,8)}});console.log(t,JSON.stringify(r))};
 await p.evaluate((w)=>{const u=Uint8Array.from(atob(w),c=>c.charCodeAt(0));window.nativePick=async()=>new File([u],"v.webm",{type:"video/webm"})},webm);
 await p.evaluate(()=>openComposer("reel"));await p.waitForTimeout(600);await ov("reel empty");await p.screenshot({path:OUT+`p6_a_${W}_${dark?"d":"l"}_${ui}.png`});
 await p.click("#vPick");await p.waitForTimeout(1500);await ov("reel video");await p.screenshot({path:OUT+`p6_b_${W}_${dark?"d":"l"}_${ui}.png`});
 console.log("vKed",await p.evaluate(()=>!!document.querySelector("#vKed")+" rSong:"+!!document.querySelector("#rSong")));
 await p.click('[data-rm="slides"]');await p.waitForTimeout(400);await ov("slides");await p.screenshot({path:OUT+`p6_c_${W}_${dark?"d":"l"}_${ui}.png`});
 await p.click('[data-rm="video"]');await p.waitForTimeout(400);
 if(await p.$("#vKed")){await p.click("#vKed");await p.waitForTimeout(3000);await ov("kurgu");await p.screenshot({path:OUT+`p6_d_${W}_${dark?"d":"l"}_${ui}.png`})}
 console.log("errors",errors);await b.close()})();
