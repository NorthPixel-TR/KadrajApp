const {open}=require('./lib');const fs=require('fs');
(async()=>{const {b,p,errors}=await open(390);const mp4=fs.readFileSync('/home/user/kadraj-test/vf/chrome.mp4').toString('base64');const wb=fs.readFileSync('/home/user/kadraj-test/vf/chrome.webm').toString('base64');
 const r=await p.evaluate(async({mp4,wb})=>{const f=(b64,t,n)=>new File([Uint8Array.from(atob(b64),c=>c.charCodeAt(0))],n,{type:t});
  const a=await vidFix(f(mp4,"video/mp4","flick.mp4"));const w=await vidFix(f(wb,"video/webm","flick.webm"));
  const dur=file=>new Promise(r=>{const v=document.createElement("video");v.preload="metadata";v.onloadedmetadata=()=>r(v.duration);v.onerror=()=>r(-1);v.src=URL.createObjectURL(file)});
  let up=null;const o=cldUpload;window.cldOn0=1;
  return {mp4:!!a._fixed,webm:!!w._fixed,wdur:await dur(w),w0:await dur(f(wb,"video/webm","x.webm"))}},{mp4,wb});
 console.log(JSON.stringify(r),errors.length?errors:"hata yok");await b.close()})();
