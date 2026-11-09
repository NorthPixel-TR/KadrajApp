/* vidFix kenar durumları + sohbet/Toplu Klaket yüklemesi (kvStore) de süreyi düzeltiyor mu;
   indirmede silinmiş video doğru mesajı veriyor mu */
const {open,OUT}=require('./lib');const fs=require('fs');const V='/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/7013A/v/';
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
(async()=>{const {b,p,errors}=await open(390);const webm=fs.readFileSync(V+'d3.webm').toString('base64');
 const r=await p.evaluate(async(webm)=>{const out={};const dur=async(src)=>{const v=document.createElement("video");v.muted=true;v.src=src;await new Promise(r=>{v.onloadedmetadata=r;v.onerror=r;setTimeout(r,4000)});return v.duration};
  /* MediaRecorder webm (başlıkta süre yok) */
  const c=document.createElement("canvas");c.width=160;c.height=120;const x=c.getContext("2d");const st=c.captureStream(25);const mr=new MediaRecorder(st,{mimeType:"video/webm"});const ch=[];mr.ondataavailable=e=>e.data.size&&ch.push(e.data);
  let k=0;const iv=setInterval(()=>{x.fillStyle=`hsl(${k++*20},80%,50%)`;x.fillRect(0,0,160,120)},40);mr.start(200);await new Promise(r=>setTimeout(r,1600));mr.stop();await new Promise(r=>mr.onstop=r);clearInterval(iv);
  const raw=new File(ch,"rec.webm",{type:"video/webm"});out.rawDur=await dur(URL.createObjectURL(raw));
  const ref=await kvStore(raw,()=>{},{aborted:false});delete vcache[ref];const u=await resolveVideo(ref);out.kvDur=await dur(u);
  /* süresi zaten olan webm (ffmpeg) değiştirilmemeli */
  const W=Uint8Array.from(atob(webm),c=>c.charCodeAt(0));const f=new File([W],"x.webm",{type:"video/webm"});const o=await vidFix(f);out.keep=o===f;
  /* boş / bozuk */
  out.empty=(await vidFix(new File([],"e.webm")))instanceof File;
  return out},webm);
 ok(r.rawDur===Infinity||!isFinite(r.rawDur),"MediaRecorder webm başlığında süre yok ("+r.rawDur+")");
 ok(isFinite(r.kvDur)&&r.kvDur>1,"sohbet/Toplu Klaket yüklemesinden (kvStore) dönen videonun süresi var ("+r.kvDur+")");
 ok(r.keep,"süresi zaten yazılı webm'e dokunulmuyor");ok(r.empty,"boş dosya hatasız");
 /* silinmiş parçalı videoyu indirme */
 const req=[];p.on('request',q=>req.push(q.url()));
 await p.evaluate(()=>dlMedia("chunk:yok123:2","video"));await p.waitForTimeout(1200);
 const t=await p.evaluate(()=>document.querySelector("#dlSt")?.textContent||"");
 ok(/artık yok|silinmiş/i.test(t),"silinmiş video: doğru mesaj ("+t+")");ok(!req.some(u=>/\/null$/.test(u)),"silinmiş videoda 'null' adresi istenmiyor");
 await p.evaluate(()=>closeAll());await p.waitForTimeout(300);
 const du='data:video/webm;base64,'+webm;await p.evaluate(du=>dlMedia(du,"video"),du);await p.waitForTimeout(1200);
 const t2=await p.evaluate(()=>document.querySelector("#dlSt")?.textContent||"");ok(/Video hazır \(0,1 MB\)/.test(t2),"data: video indirilebilir, MB virgüllü ("+t2+")");
 ok(!errors.length,"sayfa hatası yok "+errors.join(";"));console.log(pass+"/"+(pass+fail));await b.close()})();
