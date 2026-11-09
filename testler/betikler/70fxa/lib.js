/* 70FXA hata avı test yardımcısı: yerel mod (LocalDB), ağ kapalı */
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const HTML=process.env.KADRAJ_HTML||'/home/user/Kadraj/.claude/worktrees/agent-ab664686c3f847d34/index.html';const BASE=process.env.KHTTP?'http://kadraj.test/':'https://kadraj.test/';
const SHOT='/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/70fxa/';
async function open({w=390,h=844,dark=false,touch=true,init,rm=false,ctx:ctx0,browser:b0}={}){
 const browser=b0||await chromium.launch();const ctx=ctx0||await browser.newContext({viewport:{width:w,height:h},hasTouch:touch,colorScheme:dark?'dark':'light',reducedMotion:rm?'reduce':'no-preference',deviceScaleFactor:1});
 const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message+" @"+(e.stack||"").split("\n")[1]));
 if(!ctx0)await ctx.route('**/*',r=>{const u=r.request().url();
  if(u.startsWith(BASE)){const q=decodeURIComponent(new URL(u).pathname);if(q==='/'||q==='/index.html')return r.fulfill({body:fs.readFileSync(HTML),contentType:'text/html; charset=utf-8'});
   const f=path.join(path.dirname(HTML),q);if(fs.existsSync(f)&&fs.statSync(f).isFile())return r.fulfill({body:fs.readFileSync(f)});return r.fulfill({status:404,body:''})}
  if(u.startsWith('data:')||u.startsWith('blob:'))return r.continue();return r.abort()});
 if(init)await page.addInitScript(init);
 await page.goto(BASE+'index.html');await page.waitForTimeout(1300);
 return {browser,ctx,page,errors,close:()=>browser.close()}}
/* u1 Bilal, u2 Ayşe, u3 Can; u1-u2 DM, grup g1 (u1,u2,u3) */
async function seed(page,{as="u1",enter=true}={}){await page.evaluate(async({as,enter})=>{if(S.mode!=="local"||!DB)await bootLocal();const T=Date.now();
  for(const [uid,name,un] of [["u1","Bilal Kara","bilal"],["u2","Ayşe Yılmaz","ayse"],["u3","Can Demir","can"]])if(!await DB.get("profiles/"+uid))await DB.set("profiles/"+uid,{uid,username:un,name,bio:"",avatar:null,following:{u1:T,u2:T,u3:T,"bot:rota":T},botFollowers:{},private:false,createdAt:T-1e6});
  const cid=cidFor("u1","u2");if(!await DB.get("chats/"+cid)){await DB.set("chats/"+cid,{members:["u1","u2"],last:{text:"naber",from:"u2",at:T-1000},updatedAt:T-1000,reads:{}});
  await DB.set("chats/"+cid+"/msgs/m1",{from:"u2",at:T-2000,text:"selam"});
  await DB.set("chats/gr-g1",{group:true,name:"Sınıf",members:["u1","u2","u3"],createdBy:"u1",last:{text:"grup",from:"u3",at:T-500},updatedAt:T-500,reads:{}});
  await DB.set("chats/gr-g1/msgs/g1m1",{from:"u3",at:T-600,text:"grup"})}
  if(enter){S.uid=as;LS.set("kadraj_session",as);await enterApp(false)}},{as,enter});await page.waitForTimeout(800);await page.evaluate(()=>closeAll())}
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m);return c};
const done=async A=>{ok(!A.errors.length,"sayfa hatası yok "+A.errors.join(" | "));console.log(pass+"/"+(pass+fail));await A.close();process.exit(fail?1:0)};
module.exports={open,seed,HTML,BASE,SHOT,ok,done};
