/* MediaRecorder webm'i diske yaz (inceleme için) */
const {open}=require('./lib');const fs=require('fs');const V='/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/7013A/v/';
(async()=>{const {b,p}=await open(390);const ts=+process.argv[2]||0;
 const r=await p.evaluate(async(ts)=>{const c=document.createElement("canvas");c.width=160;c.height=120;const x=c.getContext("2d");const st=c.captureStream(25);const mr=new MediaRecorder(st,{mimeType:"video/webm"});const ch=[];mr.ondataavailable=e=>e.data.size&&ch.push(e.data);
  let k=0;const iv=setInterval(()=>{x.fillStyle=`hsl(${k++*20},80%,50%)`;x.fillRect(0,0,160,120)},40);ts?mr.start(ts):mr.start();await new Promise(r=>setTimeout(r,1600));mr.stop();await new Promise(r=>mr.onstop=r);clearInterval(iv);
  const u8=new Uint8Array(await new Blob(ch).arrayBuffer());const fx=await vidFix(new File([u8],"r.webm",{type:"video/webm"}));
  return{b64:btoa(String.fromCharCode(...u8)),last:webmLastMs(u8),fixed:fx!==undefined&&fx.size!==u8.length}},ts);
 fs.writeFileSync(V+'rec'+ts+'.webm',Buffer.from(r.b64,'base64'));console.log("lastMs",r.last,"fixed",r.fixed);await b.close()})();
