const {open,OUT}=require('./lib');const {seed}=require('./seed');const W=+process.argv[2]||390;const dark=process.argv[3]==="dark",ui=process.argv[4]||"vizor";
(async()=>{const {b,p,errors}=await open(W,860,{dark,ui});await seed(p);
 const ov=async(t)=>{const r=await p.evaluate(()=>{const de=document.documentElement;const bad=[];for(const el of document.querySelectorAll("#main *,#overlay *")){const r=el.getBoundingClientRect();if(r.width&&r.right>innerWidth+1&&getComputedStyle(el).position!=="fixed"&&!el.closest(".phc-tr,.stories,.chips,.k6-ind,.hl-row,.hls,.sr-tabs"))bad.push((el.className&&el.className.baseVal===undefined?el.className:el.tagName)+":"+Math.round(r.right))}return{sw:de.scrollWidth,cw:de.clientWidth,bad:bad.slice(0,6)}});console.log(t,JSON.stringify(r))};
 await p.evaluate(()=>tab("feed"));await p.waitForTimeout(600);await ov("feed");await p.screenshot({path:OUT+`p2_feed_${W}_${dark?"d":"l"}_${ui}.png`,fullPage:true});
 // carousel to 3rd
 await p.evaluate(()=>{const tr=document.querySelector('#main [data-phc="pm1"]');tr.scrollLeft=tr.clientWidth*2});await p.waitForTimeout(300);
 console.log("PHI",await p.evaluate(()=>PHI.pm1));
 await p.evaluate(()=>render(false));await p.waitForTimeout(300);console.log("after render scrollLeft idx",await p.evaluate(()=>{const tr=document.querySelector('#main [data-phc="pm1"]');return Math.round(tr.scrollLeft/tr.clientWidth)+" "+document.querySelector('#main [data-pid="pm1"] .phc-n')?.textContent}));
 // likers
 await p.click('#main [data-k70lk="pm1"]');await p.waitForTimeout(500);console.log("likers",await p.evaluate(()=>document.querySelectorAll('#overlay [data-layer="k70lk"] .row').length));await ov("likers");await p.evaluate(()=>closeAll());await p.waitForTimeout(300);
 // comments
 await p.evaluate(()=>openComments("pm1"));await p.waitForTimeout(500);console.log("cmts",await p.evaluate(()=>[...document.querySelectorAll("#cmtList .cmt")].map(x=>x.dataset.cid+(x.classList.contains("rep")?"r":"")+(x.classList.contains("pinned")?"p":"")).join(",")));await ov("comments");
 await p.screenshot({path:OUT+`p2_cmt_${W}_${dark?"d":"l"}_${ui}.png`});await p.evaluate(()=>closeAll());await p.waitForTimeout(300);
 // menu download
 await p.evaluate(()=>postMenu("pm1"));await p.waitForTimeout(300);console.log("mDl",await p.evaluate(()=>!!document.querySelector("#mDl")));
 await p.evaluate(()=>{window._dl=[];const f=dlMedia;dlMedia=(r,k)=>{_dl.push([decodeURIComponent(r).slice(-30),k])}});await p.click("#mDl");await p.waitForTimeout(200);console.log("dl",await p.evaluate(()=>JSON.stringify(_dl)));
 // capsule menu
 await p.evaluate(()=>postMenu("pc1"));await p.waitForTimeout(300);console.log("cap mDl",await p.evaluate(()=>!!document.querySelector("#mDl")));await p.evaluate(()=>closeAll());
 console.log("errors",errors);await b.close()})();
