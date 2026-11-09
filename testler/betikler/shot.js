/* 6.9 ekran görüntüsü: node shot.js <gen> <yük> <sayfa> <çıktı> [js] */
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const HTML='/home/user/Kadraj/index.html',BASE='http://kadraj.test/';
const [W,Hh,page,out,extra]=[+process.argv[2]||800,+process.argv[3]||1280,process.argv[4]||"feed",process.argv[5]||"/tmp/claude-0/s.png",process.argv[6]||""];
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:W,height:Hh},deviceScaleFactor:1,hasTouch:true,isMobile:W<700});const p=await ctx.newPage();
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE)){const q=decodeURIComponent(new URL(u).pathname);if(q==='/'||q==='/index.html')return r.fulfill({body:fs.readFileSync(HTML),contentType:'text/html; charset=utf-8'});
  const f=path.join(path.dirname(HTML),q);if(fs.existsSync(f)&&fs.statSync(f).isFile())return r.fulfill({body:fs.readFileSync(f)});return r.fulfill({status:404,body:''})}
  if(u.startsWith('data:')||u.startsWith('blob:'))return r.continue();return r.abort()});
 await p.goto(BASE+'index.html');await p.waitForTimeout(1500);
 await p.evaluate(async()=>{if(S.mode!=="local"||!DB)await bootLocal();const T=Date.now();
  for(const [uid,name,un,bio] of [["u1","Bilal Kara","bilal","stupid:@ayse brozilla:@can #kadraj"],["u2","Ayşe Yılmaz","ayse",""],["u3","Can Demir","can",""]])await DB.set("profiles/"+uid,{uid,username:un,name,bio,avatar:null,following:{u1:1,u2:1,u3:1},botFollowers:{},private:false,createdAt:T-1e6});
  await DB.set("posts/p1",{uid:"u2",at:T-5e5,kind:"note",text:"Selam @bilal bugün okul var mı",bg:0,caption:""});
  await DB.set("posts/p2",{uid:"u3",at:T-4e5,kind:"photo",src:"img/kahve.jpg",caption:"Kahve keyfi @ayse #sabah",ar:1});
  const cid=cidFor("u1","u2");await DB.set("chats/"+cid,{members:["u1","u2"],last:{text:"naber",from:"u2",at:T-1000},updatedAt:T-1000,reads:{}});
  await DB.set("chats/"+cid+"/msgs/m1",{from:"u2",at:T-2000,text:"selam @bilal"});await DB.set("chats/"+cid+"/msgs/m2",{from:"u1",at:T-1500,text:"naber @ayse"});await DB.set("chats/"+cid+"/msgs/m3",{from:"u2",at:T-1000,text:"iyidir"});
  S.uid="u1";LS.set("kadraj_session","u1");await enterApp(false)});
 await p.waitForTimeout(800);await p.evaluate(()=>closeAll());
 if(page==="profile")await p.evaluate(()=>go("profile",{uid:"u1"}));else if(page==="chat")await p.evaluate(()=>openChat("u:u2"));else if(page==="reels")await p.evaluate(()=>go("reels"));else if(page!=="feed")await p.evaluate(pg=>go(pg),page);
 await p.waitForTimeout(900);if(extra)await p.evaluate(extra);await p.waitForTimeout(700);
 await p.screenshot({path:out});console.log("hatalar:",errors.join(" | ")||"yok");await b.close()})();
