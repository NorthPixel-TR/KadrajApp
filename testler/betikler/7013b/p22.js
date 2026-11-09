const {open,OUT}=require('./lib');
(async()=>{const W=+process.argv[2]||360;const {b,p,errors}=await open(W,780);
await p.evaluate(async()=>{const T=Date.now();const c=cidFor("u1","u2");
 await DB.set(`chats/${c}/msgs/L1`,{from:"u2",at:T-50,text:"Çokuzunbirmesaj".repeat(20)});
 await DB.set(`chats/${c}/msgs/L2`,{from:"u2",at:T-40,mus:{u:"it:1",t:"Çok uzun bir şarkı adı ".repeat(6)+"Sanatçı",p:"https://audio-ssl.itunes.apple.com/x.m4a",a:null,e:0,s:0}});
 await DB.set(`chats/gr-1/msgs/P1`,{from:"u2",at:T-30,gpoll:{q:"Uzun soru ".repeat(12),o:["Seçenek bir çok uzun yazı ".repeat(3),"iki"]}});
 await DB.update("chats/"+c,{pins:["L1","m3"]});await DB.update("chats/gr-1",{pins:["P1"]});
});
const ov=async tag=>console.log(tag,await p.evaluate(()=>{const vw=innerWidth;const out=[];for(const e of document.querySelectorAll("#main *")){const r=e.getBoundingClientRect();if(r.width&&r.right>vw+0.5&&e.offsetParent){let hid=false;for(let a=e.parentElement;a;a=a.parentElement){const s=getComputedStyle(a);if(/hidden|clip/.test(s.overflowX)&&a.getBoundingClientRect().right<=vw+1){hid=true;break}}if(!hid)out.push((e.parentElement.className+">")+(e.id||String(e.className.baseVal??e.className).slice(0,30)||e.tagName)+"["+Math.round(r.right)+"]")}}return [...new Set(out)].slice(0,6).join(" | ")||"ok"}));
await p.evaluate(()=>openChat("u:u2"));await p.waitForTimeout(900);await ov("dm");await p.screenshot({path:OUT+"p22a.png"});console.log(await p.evaluate(()=>{const b=$("#msgs");const l=[...b.querySelectorAll(".mrow")].slice(-2).map(r=>r.outerHTML.slice(0,300));return {st:b.scrollTop,sh:b.scrollHeight,ch:b.clientHeight,l}}));
await p.evaluate(()=>openChat("g:gr-1"));await p.waitForTimeout(900);await ov("grp");await p.screenshot({path:OUT+"p22b.png"});
// vote
await p.evaluate(()=>{const b=document.querySelector('#msgs [data-gpv],#msgs .gp-o,#msgs [data-gpo]');b&&b.click()});await p.waitForTimeout(500);
console.log(await p.evaluate(()=>JSON.stringify((S.msgs.find(m=>m.id==="P1")||{}).pv)));
console.log(errors);await b.close()})();
