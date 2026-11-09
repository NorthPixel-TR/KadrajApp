/* vidFix kenar durumları */
const {open,OUT}=require('./lib');const fs=require('fs');const V='/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/7013A/v/';
(async()=>{const {b,p,errors}=await open(390);
 const webm=fs.readFileSync(V+'d3.webm').toString('base64'),frag=fs.readFileSync(V+'frag.mp4').toString('base64');
 const r=await p.evaluate(async({webm,frag})=>{const u=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));const W=u(webm),F=u(frag);const out={};
  const dur=async(bl)=>{const v=document.createElement("video");v.muted=true;v.src=URL.createObjectURL(bl);await new Promise(r=>{v.onloadedmetadata=r;v.onerror=r;setTimeout(r,3000)});return v.duration};
  const run=async(k,bytes,type)=>{try{const f=new File([bytes],"x",{type});const o=await vidFix(f);out[k]={same:o===f,size:o.size,in:bytes.length,dur:await dur(o)}}catch(e){out[k]={err:String(e)}}};
  await run("webmWithDur",W,"video/webm");
  await run("empty",new Uint8Array(0),"video/mp4");
  await run("garbage",new Uint8Array(5000).map((_,i)=>i*7&255),"video/mp4");
  const g2=new Uint8Array(40);g2.set([0,0,0,20,102,116,121,112],0);await run("ftypOnly",g2,"video/mp4");
  await run("fragFull",F,"video/mp4");await run("fragHalf",F.slice(0,F.length>>1),"video/mp4");
  await run("webmHead",W.slice(0,300),"video/webm");
  out.webmOrigDur=await dur(new Blob([W],{type:"video/webm"}));
  return out},{webm,frag});
 console.log(JSON.stringify(r,null,1));console.log("errors",errors);await b.close()})();
