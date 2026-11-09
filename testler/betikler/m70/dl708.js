/* 7.0.8: sohbette video/fotoğraf ve paylaşım ⋯ menüsünde İndir */
const {open}=require('./lib');const W=+process.argv[2]||390;
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
(async()=>{const {b,p,errors}=await open(W);
 await p.evaluate(()=>{window._dl=[];const o=HTMLAnchorElement.prototype.click;HTMLAnchorElement.prototype.click=function(){if(this.download){_dl.push(this.download);return}return o.call(this)}});
 const img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
 await p.evaluate(async(img)=>{const cid=cidFor("u1","u2");const T=Date.now();await DB.set(`chats/${cid}/msgs/v1`,{from:"u2",at:T,video:"data:video/mp4;base64,AAAA"});await DB.set(`chats/${cid}/msgs/i1`,{from:"u2",at:T+1,img});
  await DB.set("posts/pp1",{uid:"u2",at:T,kind:"photo",src:img});await DB.set("posts/rr1",{uid:"u2",at:T,kind:"reel",video:"data:video/mp4;base64,AAAA"})},img);
 await p.evaluate(()=>openChat("u:u2"));await p.waitForTimeout(900);
 for(const [mid,want] of [["v1","video"],["i1","foto"]]){await p.evaluate(mid=>msgMenu(mid),mid);await p.waitForTimeout(300);
  const has=await p.evaluate(()=>!!document.querySelector('#overlay #mmDl'));ok(has,"mesaj menüsünde İndir ("+want+")");
  if(has){await p.evaluate(()=>document.querySelector('#overlay #mmDl').click());await p.waitForTimeout(600);if(want==="video"){await p.waitForSelector('#dlSave',{timeout:5000}).catch(()=>{});await p.evaluate(()=>document.querySelector('#dlSave')?.click());await p.waitForTimeout(600)}
   const d=await p.evaluate(()=>_dl[_dl.length-1]||"");ok(d.startsWith("kadraj-"+want),"indirildi "+d)}}
 await p.evaluate(()=>{closeAll();tab("feed")});await p.waitForTimeout(300);await p.waitForTimeout(400);
 for(const [id,want] of [["pp1","foto"],["rr1","video"]]){await p.evaluate(id=>postMenu(id),id);await p.waitForTimeout(300);
  const has=await p.evaluate(()=>!!document.querySelector('#overlay #mDl'));ok(has,"paylaşım menüsünde İndir ("+want+")");
  if(has){await p.evaluate(()=>document.querySelector('#overlay #mDl').click());await p.waitForTimeout(600);if(want==="video"){await p.waitForSelector('#dlSave',{timeout:5000}).catch(()=>{});await p.evaluate(()=>document.querySelector('#dlSave')?.click());await p.waitForTimeout(600)}
   const d=await p.evaluate(()=>_dl[_dl.length-1]||"");ok(d.startsWith("kadraj-"+want),"indirildi "+d)}await p.evaluate(()=>closeAll());await p.waitForTimeout(200)}
 await p.evaluate(()=>msgMenu&&0);ok(errors.length===0,"sayfa hatası yok "+errors.join(" | "));
 console.log(pass+"/"+(pass+fail));await b.close()})();
