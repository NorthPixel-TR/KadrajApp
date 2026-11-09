const {open,OUT}=require('./lib');const W=+process.argv[2]||390;
const px=c=>`data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="${c}"/></svg>`)}`;
(async()=>{const {b,p,errors}=await open(W,860);
 await p.evaluate(async(c)=>{const set=async(u,o)=>{await DB.update("profiles/"+u,o);S.profiles[u]={...S.profiles[u],...o}};
  await set("u3",{avatar:null,avs:[c[1],c[2]]})},["red","blue","green"].map(px));
 console.log(await p.evaluate(()=>({P:String(P("u3").avatar).slice(0,40),raw:String(S.profiles.u3.avatar),L:avsOf("u3").map(x=>decodeURIComponent(x).slice(-22))})));
 await p.evaluate(()=>go("profile",{uid:"u3"}));const seq=[];const t0=Date.now();
 while(Date.now()-t0<2500){const v=await p.evaluate(()=>decodeURIComponent(document.querySelector("#main .prof-top > .av img")?.src||"").slice(-22));if(seq[seq.length-1]!==v)seq.push(v);await p.waitForTimeout(30)}
 console.log(seq);console.log("errors",errors);await b.close()})();
