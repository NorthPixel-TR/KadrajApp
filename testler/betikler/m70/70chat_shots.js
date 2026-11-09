/* node shots.js <etiket> [genişlikler virgüllü] : açık/koyu ekran görüntüleri (liste, sohbet, ayrıntılar, yazarken) */
const {open,OUT}=require('./lib');const tag=process.argv[2]||"x";
const sets=process.argv[3]==="all"?[[390,false,"vizor"],[390,true,"vizor"],[800,false,"vizor"],[800,true,"klasik"],[360,false,"klasik"]]:[[390,false,"vizor"],[390,true,"vizor"],[800,false,"vizor"]];
(async()=>{for(const [W,dark,ui] of sets){const {b,p,errors}=await open(W,860,{dark,ui});const s=`${tag}_${W}${dark?"_dk":""}${ui==="klasik"?"_kl":""}`;
 await p.evaluate(()=>go("chats"));await p.waitForTimeout(900);await p.screenshot({path:OUT+s+"_list.png"});
 const ov=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
 await p.evaluate(()=>openChat("u:u2"));await p.waitForTimeout(1200);await p.screenshot({path:OUT+s+"_chat.png"});
 await p.evaluate(()=>chatInfo());await p.waitForTimeout(900);await p.screenshot({path:OUT+s+"_info.png"});
 await p.evaluate(()=>closeAll());await p.waitForTimeout(400);
 await p.evaluate(()=>{const i=document.getElementById("msgIn");i.value="merhaba";i.dispatchEvent(new Event("input"))});await p.waitForTimeout(700);await p.screenshot({path:OUT+s+"_typing.png"});
 await p.evaluate(()=>openChat("g:gr-1"));await p.waitForTimeout(1000);await p.screenshot({path:OUT+s+"_group.png"});
 console.log(s,"overflow",ov,"errors",JSON.stringify(errors));await b.close()}})();
