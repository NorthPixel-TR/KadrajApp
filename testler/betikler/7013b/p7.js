const {open,OUT}=require('./lib');
(async()=>{const W=+process.argv[2]||360;const dark=process.argv[3]==="dark",ui=process.argv[4]||"vizor";const {b,p,errors}=await open(W,780,{dark,ui});
await p.evaluate(async()=>{const L="Uzunisimliarkadaşımızbuisimçokuzunoldugundantaşabilir";const T=Date.now();
 await DB.update("profiles/u2",{name:L+" "+L,username:"cokuzunkullaniciadi_"+"x".repeat(20),note:{text:"N".repeat(60),at:T-1000}});
 const c=cidFor("u1","u2");await DB.set(`chats/${c}/msgs/zz1`,{from:"u2",at:T-500,text:"https://example.com/"+"a".repeat(300)});
 await DB.set(`chats/${c}/msgs/zz2`,{from:"u2",at:T-400,text:"b".repeat(400)});
 await DB.update("chats/"+c,{last:{text:"c".repeat(300),from:"u2",at:T-400},updatedAt:T-400});
 await DB.update("chats/gr-1",{name:"G".repeat(80)});await DB.set(`chats/gr-1/msgs/g2`,{from:"u2",at:T-300,text:"d".repeat(300)});
});
await p.waitForTimeout(800);
const ov=async(tag)=>{const r=await p.evaluate(()=>{const vw=innerWidth;const out=[];const se=document.scrollingElement;
 for(const sc of [se,document.querySelector('#main'),document.querySelector('#overlay'),document.querySelector('#msgs')]){if(sc&&sc.scrollWidth>sc.clientWidth+1)out.push("SCROLL "+(sc.id||sc.tagName)+" sw="+sc.scrollWidth+">"+sc.clientWidth)}
 for(const e of document.querySelectorAll('#shell *,#overlay *,#toasts *')){const r=e.getBoundingClientRect();if(r.width&&(r.right>vw+1||r.left<-1)){let hid=false;for(let a=e.parentElement;a;a=a.parentElement){const s=getComputedStyle(a);if(/hidden|clip|auto|scroll/.test(s.overflowX)&&a.getBoundingClientRect().right<=vw+1&&a.getBoundingClientRect().left>=-1){hid=true;break}}if(!hid)out.push((e.id?"#"+e.id:(typeof e.className==="string"&&e.className)?"."+e.className.split(" ").join("."):e.tagName)+" ["+Math.round(r.left)+","+Math.round(r.right)+"]")}}
 return [...new Set(out)].slice(0,8)});console.log(tag,r.length?r.join(" | "):"ok")};
const go=async(js,tag,w=700)=>{await p.evaluate(js);await p.waitForTimeout(w);await ov(tag)};
await go(()=>tab("chats"),"chats");await p.screenshot({path:OUT+"p7chats.png"});
await go(()=>openChat("u:u2"),"dm");await p.screenshot({path:OUT+"p7dm.png"});
await go(()=>chatInfo("u:u2"),"cinfo",900);await p.evaluate(()=>closeAll());
await go(()=>openChat("g:gr-1"),"grp");await p.screenshot({path:OUT+"p7gr.png"});
await go(()=>chatInfo("g:gr-1"),"ginfo",900);await p.evaluate(()=>closeAll());
await go(()=>toast("Ç".repeat(200),"u2"),"toast",300);
await go(()=>knNotify({title:"T".repeat(100),body:"B".repeat(300),key:"u:u2",uid:"u2"}),"kn",600);await p.screenshot({path:OUT+"p7kn.png"});
await go(()=>tab("activity"),"act");
await go(()=>prof("u2"),"prof");
console.log(errors);await b.close()})();
