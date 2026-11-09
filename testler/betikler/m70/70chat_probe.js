/* hızlı yoklama: balon köşeleri ve yazma çubuğu durumu */
const {open,OUT}=require('./lib');
(async()=>{const {b,p,errors}=await open(390,860,{});
 await p.evaluate(()=>openChat("u:u2"));await p.waitForTimeout(1200);
 const r=await p.evaluate(()=>[...document.querySelectorAll("#msgs .mrow[data-k]")].map(x=>{const m=x.querySelector(".msg");const s=getComputedStyle(m);return x.dataset.k+" "+(x.classList.contains("me")?"ME ":"   ")+[s.borderTopLeftRadius,s.borderTopRightRadius,s.borderBottomRightRadius,s.borderBottomLeftRadius].join("/")+" mt="+getComputedStyle(x).marginTop+" "+m.textContent.slice(0,20)}));
 console.log(r.join("\n"));
 await p.screenshot({path:OUT+"probe_chat.png",clip:{x:0,y:150,width:390,height:480}});
 console.log(JSON.stringify(errors));await b.close()})();
