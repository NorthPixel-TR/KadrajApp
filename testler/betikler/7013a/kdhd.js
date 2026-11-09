/* Kurgu başlığı: açık temada arka plan/yazı rengi */
const {open,OUT}=require('./lib');const fs=require('fs');const V='/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/7013A/v/';
const W=+process.argv[2]||390;const dark=process.argv[3]==="dark",ui=process.argv[4]||"vizor";
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
(async()=>{const {b,p,errors}=await open(W,860,{dark,ui});const webm=fs.readFileSync(V+'d3.webm').toString('base64');
 await p.evaluate((w)=>{const u=Uint8Array.from(atob(w),c=>c.charCodeAt(0));window.nativePick=async()=>new File([u],"v.webm",{type:"video/webm"})},webm);
 await p.evaluate(()=>openComposer("reel"));await p.waitForTimeout(500);await p.click("#vPick");await p.waitForTimeout(1200);await p.click("#vKed");await p.waitForTimeout(2500);
 const r=await p.evaluate(()=>{const hd=document.querySelector(".ked .hd");const cs=getComputedStyle(hd);const h1=getComputedStyle(hd.querySelector("h1"));
  const rules=[];for(const ss of document.styleSheets){let cr;try{cr=ss.cssRules}catch{continue}for(const r of cr){const walk=r=>{if(r.selectorText&&hd.matches(r.selectorText)&&/background/.test(r.cssText))rules.push(r.cssText.slice(0,160));if(r.cssRules)for(const x of r.cssRules)walk(x)};walk(r)}}
  return{bg:cs.backgroundColor,bgi:cs.backgroundImage.slice(0,60),col:h1.color,rules}});
 console.log(JSON.stringify(r,null,1));
 const lum=s=>{const m=s.match(/[\d.]+/g);if(!m)return 0;const [r,g,b2,a=1]=m.map(Number);return a<.2?0.02:(0.2126*r+0.7152*g+0.0722*b2)/255};
 ok(lum(r.bg)<.5,`Kurgu başlığı koyu (${r.bg}), yazı ${r.col}`);
 await p.locator(".ked .hd").screenshot({path:OUT+`kdhd_${W}_${dark?"d":"l"}_${ui}.png`});
 ok(!errors.length,"sayfa hatası yok "+errors.join(";"));console.log(pass+"/"+(pass+fail));await b.close()})();
