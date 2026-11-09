/* 70FXB hata avı test yardımcısı (yerel demo modu) */
const kt=require('/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/k40/kt.js');
const sd=require('/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/a60ui/seed.js');
const IDX=process.env.KADRAJ_HTML||'/home/user/Kadraj/.claude/worktrees/agent-a54a8b15b1d5bd340/index.html';
async function app({width=390,height=844,ui='vizor',dark=false,extra={},reducedMotion}={}){
 const A=await kt.openApp(IDX,{width,height,dark,reducedMotion,init:`try{const s=JSON.parse(localStorage.getItem("kadraj_settings")||"{}");s.ui=${JSON.stringify(ui)};Object.assign(s,${JSON.stringify(extra)});localStorage.setItem("kadraj_settings",JSON.stringify(s))}catch(e){}`});
 await kt.login(A.page,{uid:'u1',name:'Bilal Kara',un:'bilal'});await A.page.evaluate(()=>closeAll());return A}
async function rich(o={}){const A=await app(o);await sd.seed(A.page);await A.page.evaluate(()=>{closeAll();render(true)});await A.page.waitForTimeout(300);return A}
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
const done=(A)=>{console.log(`\n${pass} geçti, ${fail} kaldı; hatalar: ${JSON.stringify(A.errors)}`);process.exitCode=fail||A.errors.length?1:0;return A.close()};
module.exports={app,rich,kt,ok,done,IDX};
