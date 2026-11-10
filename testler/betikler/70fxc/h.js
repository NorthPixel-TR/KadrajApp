/* 70FXC ortak düzenek */
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const HTML=process.env.KADRAJ_HTML||'/home/user/kadrajapp/.claude/worktrees/agent-a3b2f14b534c80de8/index.html',BASE='http://kadraj.test/';
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m);return c};
async function open(W=390,o={}){const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:W,height:o.h||860},hasTouch:true,colorScheme:o.dark?'dark':'light',deviceScaleFactor:1});const p=await ctx.newPage();
 const errors=[];p.on('pageerror',e=>errors.push(e.message));if(o.log)p.on('console',m=>console.log("[c]",m.text()));
 await p.route('**/*',r=>{const u=r.request().url();if(o.route){const x=o.route(r,u);if(x)return x}
  if(u.startsWith(BASE)){const q=decodeURIComponent(new URL(u).pathname);if(q==='/'||q==='/index.html')return r.fulfill({body:o.html||fs.readFileSync(HTML),contentType:'text/html; charset=utf-8'});
  const f=path.join(path.dirname(HTML),q);if(fs.existsSync(f)&&fs.statSync(f).isFile())return r.fulfill({body:fs.readFileSync(f)});return r.fulfill({status:404,body:''})}
  if(u.startsWith('data:')||u.startsWith('blob:'))return r.continue();return r.abort()});
 if(o.init)await p.addInitScript(o.init);
 await p.goto(BASE+'index.html');await p.waitForTimeout(o.wait||1500);return {b,ctx,p,errors}}
async function seed(p){await p.evaluate(async()=>{if(S.mode!=="local"||!DB)await bootLocal();const T=Date.now();
  for(const [uid,name,un] of [["u1","Bilal Kara","bilal"],["u2","Ayşe Yılmaz","ayse"],["u3","Can Demir","can"]])await DB.set("profiles/"+uid,{uid,username:un,name,bio:"",avatar:null,following:{u1:1,u2:1,u3:1},botFollowers:{},private:false,createdAt:T-1e6});
  await DB.set("posts/p2",{uid:"u3",at:T-4e5,kind:"note",text:"Selam",bg:0,caption:"Kahve"});
  const cid=cidFor("u1","u2");await DB.set("chats/"+cid,{members:["u1","u2"],last:{text:"naber",from:"u2",at:T-1000},updatedAt:T-1000,reads:{}});
  await DB.set("chats/"+cid+"/msgs/m1",{from:"u2",at:T-2000,text:"selam"});
  S.uid="u1";LS.set("kadraj_session","u1");await enterApp(false)});await p.waitForTimeout(700);await p.evaluate(()=>closeAll())}
function done(errors){ok(!errors.length,"sayfa hatası yok "+errors.join(" | "));console.log(pass+"/"+(pass+fail));process.exitCode=fail?1:0}
module.exports={open,seed,ok,done,HTML,BASE,SP:'/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/70fxc/'};
