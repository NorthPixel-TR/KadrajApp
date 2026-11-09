const {open,OUT}=require('./lib');const W=+process.argv[2]||360;
(async()=>{const {b,p,errors}=await open(W,700,{ui:"klasik",dark:true});const log=(...a)=>console.log(...a);
 await p.evaluate(()=>openChat("u:u2"));await p.waitForTimeout(900);
 await p.evaluate(()=>chatInfo());const ws=[];for(let i=0;i<8;i++){ws.push(await p.evaluate(()=>[document.documentElement.scrollWidth-innerWidth,document.querySelector("#overlay").scrollWidth-innerWidth,Math.round(document.querySelector(".cinfo").getBoundingClientRect().right)]));await p.waitForTimeout(60)}
 log("cinfo ov",JSON.stringify(ws));
 // switch tab inside quickly
 await p.evaluate(()=>{const b=document.querySelector('[data-cit="links"]');b&&b.click()});await p.waitForTimeout(100);
 log("anim after tab:",await p.evaluate(()=>getComputedStyle(document.querySelector("#ciB>*")).animationName));
 await p.screenshot({path:OUT+"cinfo_"+W+".png"});
 await p.evaluate(()=>closeAll());await p.waitForTimeout(400);
 await p.click("#msgIn");await p.keyboard.type("merhaba");await p.waitForTimeout(400);
 await p.screenshot({path:OUT+"comp_klasik_"+W+".png"});
 // double-tap own message quickly twice -> reactions
 const box=await p.locator('#msgs .mrow[data-k="m7"] .msg').boundingBox();
 for(let i=0;i<2;i++){await p.mouse.click(box.x+20,box.y+10);await p.waitForTimeout(60);await p.mouse.click(box.x+20,box.y+10);await p.waitForTimeout(250)}
 await p.waitForTimeout(500);log("react m7:",await p.evaluate(()=>JSON.stringify((S.msgs.find(m=>m.id==="m7")||{}).reacts)),await p.evaluate(()=>document.querySelectorAll(".k70-burst").length));
 log("errors",errors);await b.close()})();
