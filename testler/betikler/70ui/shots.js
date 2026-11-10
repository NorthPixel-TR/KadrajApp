/* 70UI ekran görüntüleri: node shots.js <outdir> <w> <light|dark> <vizor|klasik> [ekranlar] */
const sd=require('/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/a60ui/seed.js');
const HTML=process.env.KADRAJ_HTML||'/home/user/kadrajapp/.claude/worktrees/agent-a9f158a676dc2d78c/index.html';
const [,,OUT,W,TH,UI,ONLY]=process.argv;const H=+W>600?1000:844;
(async()=>{const {page,errors,close}=await sd.open(HTML,{width:+W,height:H,dark:TH==="dark",ui:UI});
 const tag=`${W}${TH[0]}${UI[0]}`;const res={};
 for(const [n,f] of sd.SCREENS){if(ONLY&&!ONLY.split(",").includes(n))continue;
  try{await page.evaluate(f)}catch(e){res[n]="ERR "+e.message}
  await page.waitForTimeout(1100);await page.screenshot({path:`${OUT}/${n}_${tag}.png`});
  res[n]=res[n]||await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth||$("#main").scrollWidth>$("#main").clientWidth+1?"TAŞMA":"ok")}
 if(!ONLY||ONLY.includes("sheet")){await page.evaluate(()=>{tab("feed")});await page.waitForTimeout(600);await page.evaluate(()=>postMenu("p1"));await page.waitForTimeout(700);await page.screenshot({path:`${OUT}/sheet_${tag}.png`});await page.evaluate(()=>closeAll());}
 console.log(tag,JSON.stringify(res));console.log("errors",errors.slice(0,5));await close()})();
