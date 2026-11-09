/* 7.0 sohbet testleri için ortak düzenek. KADRAJ_HTML ile index.html yolu verilebilir. */
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const HTML=process.env.KADRAJ_HTML||'/home/user/Kadraj/.claude/worktrees/agent-a6d5b3bca914906d1/index.html',BASE='http://kadraj.test/';
const OUT='/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/7013B/';
async function open(W,H,{dark=false,ui="vizor",touch=true,anim="akici"}={}){const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:W,height:H||860},hasTouch:touch,deviceScaleFactor:1,colorScheme:dark?"dark":"light"});const p=await ctx.newPage();
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.route('**/*',r=>{const u=r.request().url();
  if(u.startsWith(BASE)){const q=decodeURIComponent(new URL(u).pathname);if(q==='/'||q==='/index.html')return r.fulfill({body:fs.readFileSync(HTML),contentType:'text/html; charset=utf-8'});
   const f=path.join(path.dirname(HTML),q);if(fs.existsSync(f)&&fs.statSync(f).isFile())return r.fulfill({body:fs.readFileSync(f)});return r.fulfill({status:404,body:''})}
  if(u.startsWith('data:')||u.startsWith('blob:'))return r.continue();return r.abort()});
 await p.goto(BASE+'index.html');await p.waitForTimeout(1500);
 await p.evaluate(async({dark,ui,anim})=>{if(S.mode!=="local"||!DB)await bootLocal();const T=Date.now();settings.theme=dark?"dark":"light";settings.ui=ui;settings.anim=anim;try{saveSettings()}catch{}
  for(const [uid,name,un] of [["u1","Bilal Kara","bilal"],["u2","Ayşe Yılmaz","ayse"],["u3","Can Demir","can"],["u4","Zeynep Ak","zeynep"],["u5","Mert Şahin","mert"]])await DB.set("profiles/"+uid,{uid,username:un,name,bio:"",avatar:null,following:{u1:1,u2:1,u3:1,u4:1,u5:1},botFollowers:{},private:false,createdAt:T-1e6,...(uid==="u2"?{note:{text:"Kahve içen var mı?",at:T-6e5}}:{})});
  const c12=cidFor("u1","u2");await DB.set("chats/"+c12,{members:["u1","u2"],last:{text:"yarın görüşürüz",from:"u2",at:T-60000},updatedAt:T-60000,reads:{u1:T-3e6,u2:T-120000}});
  const ms=[["u2",-4e6,"selam! naber"],["u2",-3.99e6,"bugün okul nasıldı?"],["u1",-3.9e6,"iyiydi, matematik sınavı vardı"],["u1",-3.89e6,"sen?"],["u2",-3.8e6,"bende de fizik vardı ama kolaydı"],["u1",-2e5,"akşam çıkıyor muyuz"],["u2",-60000,"yarın görüşürüz"]];
  let i=0;for(const [f,d,t] of ms)await DB.set(`chats/${c12}/msgs/m${++i}`,{from:f,at:T+d,text:t,...(i===3?{reacts:{u2:"heart"}}:{}),...(i===5?{reply:{mid:"m4",from:"u1",text:"sen?"}}:{})});
  const c13=cidFor("u1","u3");await DB.set("chats/"+c13,{members:["u1","u3"],last:{text:"tamamdır",from:"u1",at:T-3.6e6},updatedAt:T-3.6e6,reads:{u1:T,u3:T}});
  await DB.set(`chats/${c13}/msgs/a1`,{from:"u1",at:T-3.6e6,text:"tamamdır"});
  const c14=cidFor("u1","u4");await DB.set("chats/"+c14,{members:["u1","u4"],last:{text:"Fotoğraf",from:"u4",at:T-8.64e7},updatedAt:T-8.64e7,reads:{u1:T,u4:T}});
  await DB.set("chats/gr-1",{group:true,name:"Sınıf 8-B",members:["u1","u2","u3","u5"],createdBy:"u1",last:{text:"yarın erken gelin",from:"u5",at:T-3e5},updatedAt:T-3e5,reads:{u1:T-4e5}});
  await DB.set(`chats/gr-1/msgs/g1`,{from:"u5",at:T-3e5,text:"yarın erken gelin"});
  S.uid="u1";LS.set("kadraj_session","u1");await enterApp(false);try{applyTheme&&applyTheme()}catch{}},{dark,ui,anim});
 await p.waitForTimeout(800);await p.evaluate(()=>{try{closeAll()}catch{}});
 return {b,ctx,p,errors}}
module.exports={open,OUT,HTML};
