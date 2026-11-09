const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('about:blank');
 for(const mt of ["video/mp4","video/webm;codecs=vp8,opus"]){const r=await p.evaluate(async mt=>{if(!MediaRecorder.isTypeSupported(mt))return null;const c=document.createElement("canvas");c.width=320;c.height=240;const g=c.getContext("2d");let i=0;const iv=setInterval(()=>{g.fillStyle=`hsl(${i++*7},80%,50%)`;g.fillRect(0,0,320,240);g.fillStyle="#fff";g.fillText(i,10,20)},33);
  const st=c.captureStream(30);const ac=new AudioContext();const o=ac.createOscillator();const d=ac.createMediaStreamDestination();o.connect(d);o.start();st.addTrack(d.stream.getAudioTracks()[0]);
  const mr=new MediaRecorder(st,{mimeType:mt});const ch=[];mr.ondataavailable=e=>e.data.size&&ch.push(e.data);mr.start(1000);await new Promise(r=>setTimeout(r,5000));mr.stop();await new Promise(r=>mr.onstop=r);clearInterval(iv);
  const bl=new Blob(ch);const buf=new Uint8Array(await bl.arrayBuffer());let s="";for(let k=0;k<buf.length;k+=32768)s+=String.fromCharCode.apply(null,buf.subarray(k,k+32768));return btoa(s)},mt);
  console.log(mt,r?"ok":"desteklenmiyor");if(r)fs.writeFileSync(mt.includes("mp4")?"chrome.mp4":"chrome.webm",Buffer.from(r,"base64"))}
 await b.close()})();
