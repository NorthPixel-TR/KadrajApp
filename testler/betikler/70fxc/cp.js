/* testlerin çalışma ağacına yönlenmiş kopyaları */
const fs=require('fs');const WT='/home/user/kadrajapp/.claude/worktrees/agent-a3b2f14b534c80de8/';const SP='/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/';
const fix=s=>s.split('/home/user/kadrajapp/').join(WT);
for(const f of process.argv.slice(2)){const src=f.startsWith('/')?f:SP+f;const dst=src.replace(/\.js$/,'_w70.js');fs.writeFileSync(dst,fix(fs.readFileSync(src,'utf8')));console.log(dst)}
