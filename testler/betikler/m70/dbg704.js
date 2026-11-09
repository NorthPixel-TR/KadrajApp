const {open}=require('./lib');
(async()=>{const {b,p,errors}=await open(390);
 await p.evaluate(async()=>{const a="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%2F%3E";S.profiles.u2={...S.profiles.u2,avs:[a+"1"]}});
 await p.evaluate(()=>go("profile",{uid:"u2"}));await p.waitForTimeout(700);
 const bb=await p.locator("#main .prof-top > .av").boundingBox();console.log(bb);
 console.log(await p.evaluate(([x,y])=>{const e=document.elementFromPoint(x,y);const av=document.querySelector("#main .prof-top > .av");window._ev=[];for(const t of["pointerdown","pointerup","click","pointercancel"])document.addEventListener(t,e=>_ev.push(t+":"+(e.target.className||e.target.tagName)),true);return [e.tagName,e.className,av._k704,av.tagName]},[bb.x+bb.width/2,bb.y+bb.height/2]));
 await p.mouse.move(bb.x+bb.width*.8,bb.y+bb.height/2);await p.mouse.down();await p.mouse.move(bb.x+bb.width*.1,bb.y+bb.height/2,{steps:5});await p.mouse.up();await p.waitForTimeout(700);
 console.log(await p.evaluate(()=>[_ev,typeof AVI!=="undefined"&&AVI]));
 await b.close()})();
