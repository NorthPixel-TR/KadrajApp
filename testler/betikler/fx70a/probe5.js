const {open,OUT}=require('./lib');const W=+process.argv[2]||360;
(async()=>{const {b,p,errors}=await open(W,700,{ui:process.argv[3]||"vizor"});const log=(...a)=>console.log(...a);
 await p.evaluate(async()=>{await DB.update("profiles/u1",{username:"bilal_kara_cok_uzun_ad20"});S.profiles.u1&&(S.profiles.u1.username="bilal_kara_cok_uzun_ad20");go("chats")});await p.waitForTimeout(800);
 log(await p.evaluate(()=>{const t=$("#top"),h=t.querySelector("h1");const r=h.getBoundingClientRect();const a=t.querySelector(".acts").getBoundingClientRect();return{h1:[Math.round(r.left),Math.round(r.right),h.scrollWidth,h.clientWidth],acts:[Math.round(a.left),Math.round(a.right)],ov:document.documentElement.scrollWidth-innerWidth}}));
 log(await p.evaluate(()=>{const h=$('#top h1');const s=getComputedStyle(h);return [h.outerHTML.slice(0,120),s.display,s.textOverflow,s.overflow,s.whiteSpace,h.parentElement.className,h.parentElement.outerHTML.slice(0,80)]}));
 await p.screenshot({path:OUT+"top_"+W+".png",clip:{x:0,y:0,width:W,height:260}});
 log("errors",errors);await b.close()})();
