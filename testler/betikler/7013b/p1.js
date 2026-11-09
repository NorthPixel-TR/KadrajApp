const {open,OUT}=require('./lib');
(async()=>{const W=+process.argv[2]||360;const dark=process.argv[3]==="dark",ui=process.argv[4]||"vizor";
const {b,p,errors}=await open(W,780,{dark,ui});
const ov=async(tag)=>{const r=await p.evaluate(()=>{const vw=innerWidth;const out=[];const se=document.scrollingElement;
 for(const sc of [se,document.querySelector('#main'),document.querySelector('#overlay')]){if(sc&&sc.scrollWidth>sc.clientWidth+1)out.push((sc.id||sc.tagName)+" sw="+sc.scrollWidth+">"+sc.clientWidth)}
 for(const e of document.querySelectorAll('#shell *,#overlay *')){const r=e.getBoundingClientRect();if(r.width&&r.right>vw+1&&getComputedStyle(e).position!=="fixed"){let hid=false;for(let a=e.parentElement;a;a=a.parentElement){const s=getComputedStyle(a);if(/hidden|clip|auto|scroll/.test(s.overflowX)&&a.getBoundingClientRect().right<=vw+1){hid=true;break}}if(!hid)out.push((e.id?"#"+e.id:(typeof e.className==="string"&&e.className)?"."+e.className.split(" ")[0]:e.tagName)+" r="+Math.round(r.right))}}
 return [...new Set(out)].slice(0,8)});console.log(tag,r.length?r.join(" | "):"ok")};
const go=async(js,tag,w=700)=>{await p.evaluate(js);await p.waitForTimeout(w);await ov(tag)};
await go(()=>tab("feed"),"feed");
await go(()=>tab("explore"),"explore");
await go(()=>tab("chats"),"chats");
await go(()=>tab("activity"),"activity");
await go(()=>go("settings"),"settings");
await go(()=>openChat("u:u2"),"dm");
await go(()=>openChat("g:gr-1"),"group");
await go(()=>openChat("meydan"),"meydan");
await go(()=>{openChat("u:u2")},"dm2");
await go(()=>plusMenu(),"plus");await p.evaluate(()=>closeAll());
await go(()=>chatInfo("u:u2"),"chatinfo");await p.evaluate(()=>closeAll());
await go(()=>msgMenu("m3"),"msgmenu");await p.screenshot({path:OUT+"mm"+W+".png"});await p.evaluate(()=>closeAll());
await go(()=>gifPick("u:u2","gif"),"gif");await p.evaluate(()=>closeAll());
console.log("errors",errors);await b.close()})();
