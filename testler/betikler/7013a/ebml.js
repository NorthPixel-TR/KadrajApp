/* webmLastMs'yi Node'da diskteki webm üzerinde dene */
const fs=require('fs');const src=fs.readFileSync(process.env.APPJS||'/home/user/Kadraj/.claude/worktrees/agent-a0942c59d363ea730/app.js','utf8');
const pick=n=>{const i=src.indexOf('function '+n+'(');let d=0,j=src.indexOf('{',i);for(let k=j;k<src.length;k++){if(src[k]==='{')d++;else if(src[k]==='}'){d--;if(!d)return src.slice(i,k+1)}}};
eval(['ebmlVint','ebmlId','ebmlSize','webmLastMs','webmDur'].map(pick).join('\n'));
const u8=new Uint8Array(fs.readFileSync(process.argv[2]));
let p=Buffer.from(u8).indexOf(Buffer.from([0x1f,0x43,0xb6,0x75]))+4;const sz=ebmlVint(u8,p);p+=sz.l;const out=[];
for(let n=0;n<8&&p<u8.length;n++){const id=ebmlId(u8,p);const s=ebmlVint(u8,p+id.l);out.push(id.v.toString(16)+":"+s.v+(s.unk?"U":""));p=p+id.l+s.l+s.v}
console.log(out.join(" "));console.log("last",webmLastMs(u8));const o=webmDur(u8);console.log("dur out",o&&o.length,u8.length);
