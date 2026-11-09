/* 7.0.11: parçalı MP4 → normal MP4 ve WebM süre düzeltmesi (vidFix bölgesinden) */
const fs=require('fs'),{execSync}=require('child_process');
const src=fs.readFileSync('/home/user/Kadraj/.claude/worktrees/agent-a0942c59d363ea730/app.js','utf8');const a=src.indexOf('/*@js:7011{*/'),b=src.indexOf('/*}@js:7011*/');
let code=src.slice(a,b);code=code.replace(/\{const f=storeVideo;[\s\S]*$/,"");
const ctx={};new Function('ctx',code+";ctx.mp4Defrag=mp4Defrag;ctx.mp4IsFrag=mp4IsFrag;ctx.mp4Boxes=mp4Boxes;ctx.webmDur=webmDur;ctx.webmLastMs=webmLastMs;")(ctx);
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
const pr=f=>JSON.parse(execSync(`ffprobe -v error -show_entries format=duration:stream=codec_type,nb_read_frames,duration -count_frames -of json ${f}`).toString());
for(const f of ["frag.mp4","frag3.mp4"].concat(fs.existsSync("chrome.mp4")?["chrome.mp4"]:[])){const u8=new Uint8Array(fs.readFileSync(f));
 ok(ctx.mp4IsFrag(u8),f+" parçalı");const o=ctx.mp4Defrag(u8);const out=f.replace(".mp4","_fix.mp4");fs.writeFileSync(out,o);
 ok(!ctx.mp4IsFrag(o),out+" artık parçalı değil");const top=ctx.mp4Boxes(o,0,o.length).map(x=>x.t);ok(top.join(",")==="ftyp,moov,mdat","sıra ftyp,moov,mdat "+top);
 const dv=new DataView(o.buffer);const moov=ctx.mp4Boxes(o,0,o.length)[1];const mvhd=moov.k.find(x=>x.t==="mvhd");const v1=o[mvhd.d]===1;const ts=dv.getUint32(mvhd.d+(v1?20:12)),du=v1?Number(dv.getBigUint64(mvhd.d+24)):dv.getUint32(mvhd.d+16);
 const a1=pr(f),b1=pr(out);ok(Math.abs(du/ts-(+a1.format.duration))<0.15,`mvhd süresi ${(du/ts).toFixed(2)} sn (asıl ${a1.format.duration})`);
 for(const s of b1.streams){const s0=a1.streams.find(x=>x.codec_type===s.codec_type);ok(s.nb_read_frames===s0.nb_read_frames,`${s.codec_type} kare ${s.nb_read_frames}/${s0.nb_read_frames}`)}
 let err="";try{execSync(`ffmpeg -v error -i ${out} -f null - 2>&1`).toString()}catch(e){err=String(e.stdout||e)}ok(!err.trim(),out+" hatasız çözülüyor "+err.slice(0,200))}
for(const f of fs.existsSync("chrome.webm")?["chrome.webm"]:[]){const u8=new Uint8Array(fs.readFileSync(f));const ms=ctx.webmLastMs(u8);ok(ms>2000,"webm son zaman "+ms);const o=ctx.webmDur(u8,0);ok(!!o,"webm süre eklendi");if(o){fs.writeFileSync("chrome_fix.webm",o);const d=execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 chrome_fix.webm`).toString().trim();const d0=execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 ${f}`).toString().trim();ok(+d>2,`webm süresi ${d} (önce ${d0})`)}}
console.log(pass+"/"+(pass+fail));
