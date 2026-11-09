const {open,seed,ok,done,SP}=require('./h');
(async()=>{const W=+process.argv[2]||360;const {b,p,errors}=await open(W,{dark:process.argv[3]==="dark"});await seed(p);
 const pages=["feed","explore","chats","activity","profile","settings","reels","chess","invite","people"];
 for(const n of pages){await p.evaluate(n=>{if(n==="profile")go("profile",{uid:"u1"});else if(n==="people")go("people",{uid:"u1",t:"followers"});else go(n)},n);await p.waitForTimeout(600);
  const r=await p.evaluate(()=>{const W=document.documentElement.clientWidth;const bad=[...document.querySelectorAll("#shell *")].filter(e=>{const r=e.getBoundingClientRect();if(!r.width||r.right<=W+1)return false;let a=e.parentElement;while(a&&a.id!=="shell"){const s=getComputedStyle(a);if(/auto|scroll|hidden|clip/.test(s.overflowX))return false;a=a.parentElement}return true}).slice(0,4).map(e=>e.tagName+"."+e.className+" "+Math.round(e.getBoundingClientRect().right));return{sw:document.scrollingElement.scrollWidth,mw:document.getElementById("main").scrollWidth,W,bad}});
  console.log(n,JSON.stringify(r));await p.screenshot({path:SP+"p_"+n+"_"+W+".png"})}
 await p.evaluate(()=>{S.admin=true;go("admin")});await p.waitForTimeout(800);await p.screenshot({path:SP+"p_admin_"+W+".png",fullPage:true});
 done(errors);await b.close()})();
