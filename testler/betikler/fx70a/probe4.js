const {open,OUT}=require('./lib');const W=+process.argv[2]||390;const dark=process.argv[3]==="dark";
(async()=>{const {b,p,errors}=await open(W,760,{dark});const log=(...a)=>console.log(...a);const shot=n=>p.screenshot({path:OUT+n+"_"+W+(dark?"d":"")+".png"});
 await p.evaluate(()=>{Object.defineProperty(navigator,"mediaDevices",{configurable:true,value:{getUserMedia:async()=>{const ac=new AudioContext();const o=ac.createOscillator();const d=ac.createMediaStreamDestination();o.connect(d);o.start();return d.stream}}})});
 await p.evaluate(()=>openChat("u:u2"));await p.waitForTimeout(900);
 // record
 await p.click("#sendBtn");await p.waitForTimeout(1500);await shot("rec");
 log("rec:",await p.evaluate(()=>({cls:$("#composer").className,html:$("#composer").innerHTML.slice(0,80)})));
 await p.click('[data-act="recsend"]');await p.waitForTimeout(1500);
 log("after rec:",await p.evaluate(()=>({cls:$("#composer").className,k70:$("#sendBtn")&&$("#sendBtn").dataset.k70,tools:$$("#composer .k693-tools").length,last:!!S.msgs.slice(-1)[0].audio})));
 await shot("afterrec");
 // rec cancel
 await p.click("#sendBtn");await p.waitForTimeout(800);await p.click('[data-act="reccancel"]');await p.waitForTimeout(1200);
 log("after cancel:",await p.evaluate(()=>({cls:$("#composer").className,tools:$$("#composer .k693-tools").length,k70:$("#sendBtn")&&$("#sendBtn").dataset.k70})));
 // msg menu
 await p.evaluate(()=>msgMenu("m5"));await p.waitForTimeout(400);await shot("menu");
 await p.evaluate(()=>{const r=document.querySelector("#mmR");r&&r.click()});await p.waitForTimeout(300);
 log("reply:",await p.evaluate(()=>({rb:!!$("#replyBar .replybar"),f:document.activeElement&&document.activeElement.id})));
 await p.keyboard.type("yanıt");await p.keyboard.press("Enter");await p.waitForTimeout(600);
 log("reply sent:",await p.evaluate(()=>S.msgs.slice(-1)[0].reply));
 // plus menu
 await p.evaluate(()=>plusMenu());await p.waitForTimeout(400);await shot("plus");
 log("plus items:",await p.evaluate(()=>[...document.querySelectorAll('#overlay [data-layer="plus"] .src')].map(x=>x.id+":"+x.textContent.trim().slice(0,20))));
 await p.evaluate(()=>closeAll());
 // gif pick
 await p.evaluate(()=>gifPick("u:u2","gif"));await p.waitForTimeout(500);await shot("gif");await p.evaluate(()=>closeAll());
 // group poll
 await p.evaluate(()=>openChat("g:gr-1"));await p.waitForTimeout(800);
 await p.evaluate(async()=>{await sendMessage("g:gr-1",{gpoll:{q:"Nereye?",o:["Sinema","Park"]}});await sendMessage("g:gr-1",{img:GALLERY?R(GALLERY[0].src||GALLERY[0]):"",text:"",once:1})});await p.waitForTimeout(800);await shot("group");
 // knNotify card
 await p.evaluate(()=>openChat("u:u3"));await p.waitForTimeout(600);
 await p.evaluate(()=>{try{knNotify({title:"Ayşe Yılmaz",body:"selam nasılsın",key:"u:u2",uid:"u2",kind:"msg"})}catch(e){console.log("kn err "+e.message)}});await p.waitForTimeout(500);await shot("kn");
 log("kn:",await p.evaluate(()=>!!document.querySelector(".kn")));
 // tool button sizes at width
 log("composer:",await p.evaluate(()=>{const c=$("#composer").getBoundingClientRect();const kids=[...$("#composer").children].map(x=>{const r=x.getBoundingClientRect();return x.className.split(" ")[0]+":"+Math.round(r.left)+"-"+Math.round(r.right)});return{w:Math.round(c.width),l:Math.round(c.left),r:Math.round(c.right),kids,ov:document.documentElement.scrollWidth-innerWidth}}));
 log("errors",errors);await b.close()})();
