const {open,OUT}=require('./lib');
(async()=>{const W=+process.argv[2]||360;const {b,p,errors}=await open(W,780);
await p.evaluate(async()=>{const T=Date.now();const c=cidFor("u1","u2");
 await DB.update("profiles/u2",{name:"Uzunisimliarkadaşımızbuisimçokuzunoldugundantaşabilir Uzunisimliarkadaşımızbuisimçokuzunoldugundantaşabilir",username:"cokuzunkullaniciadi_xxxxxxxxxxxxxxxxxxxxxx"});await DB.set(`chats/${c}/msgs/zz1`,{from:"u2",at:T-500,text:"https://example.com/"+"a".repeat(300)});
 await DB.set(`chats/${c}/msgs/zz2`,{from:"u2",at:T-400,text:"b".repeat(400)});
 await DB.set(`chats/${c}/msgs/zz3`,{from:"u1",at:T-300,text:"e".repeat(400)});
 await DB.set(`chats/gr-1/msgs/g2`,{from:"u2",at:T-300,text:"d".repeat(300)});
});
for(const k of ["u:u2","g:gr-1"]){await p.evaluate(k=>openChat(k),k);await p.waitForTimeout(900);
console.log(k,await p.evaluate(()=>{const box=$("#msgs");const vw=box.getBoundingClientRect().right;const out=[];for(const e of box.querySelectorAll("*")){const r=e.getBoundingClientRect();if(r.right>vw+1)out.push((e.parentElement.className+">")+(e.id||String(e.className.baseVal??e.className).slice(0,40)||e.tagName)+" w="+Math.round(r.width)+" r="+Math.round(r.right))}return {sw:box.scrollWidth,out:out.slice(0,12)}}));
await p.evaluate(()=>{const b=$("#msgs");b.scrollTop=b.scrollHeight});await p.screenshot({path:OUT+"p8"+k.replace(/:/g,"")+".png"})}
console.log(errors);await b.close()})();
