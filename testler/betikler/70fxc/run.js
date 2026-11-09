/* node run.js <test.js> ... : testleri paralel çalıştırır, her birinin son 3 satırını yazar */
const {spawn}=require('child_process');const path=require('path');
const jobs=process.argv.slice(2).map(f=>{const [file,...args]=f.split(' ');return new Promise(res=>{let out='';const p=spawn('node',[path.basename(file),...args],{cwd:path.dirname(file),env:process.env});
 p.stdout.on('data',d=>out+=d);p.stderr.on('data',d=>out+=d);const t=setTimeout(()=>p.kill(),400000);p.on('close',c=>{clearTimeout(t);res({f,c,out})})})});
Promise.all(jobs).then(rs=>{for(const r of rs){const ls=r.out.trim().split('\n');const fails=ls.filter(l=>/^FAIL|Error|FAIL /.test(l));console.log('== '+r.f+' (çıkış '+r.c+')\n'+fails.slice(0,8).join('\n')+(fails.length?'\n':'')+ls.slice(-2).join('\n'))}});
