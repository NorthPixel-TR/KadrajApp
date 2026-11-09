const {rich,ok,done}=require('./h.js');
(async()=>{const A=await rich({width:360});const p=A.page;const L="Çokuzunkelimeboşluksuzbirsatır".repeat(6);
 await p.evaluate(async(L)=>{const T=Date.now();await DB.set("profiles/u9",{uid:"u9",username:"muhammedalikarakaya_2008",name:"MuhammedAliKarakayaOgluBuyukDedeTorunu40".slice(0,40),bio:"kısa",avatar:null,following:{u1:T},botFollowers:{},private:false,createdAt:T,note:{text:L.slice(0,60),at:T}});
  await DB.set("posts/L1",{uid:"u9",at:T-1000,kind:"photo",src:"img/kahve.jpg",caption:"x"});},L);await p.waitForTimeout(400);
 for(const s of ['go("profile",{uid:"u9"})','tab("explore")','go("post",{id:"L1"})','tab("feed")']){await p.evaluate(s);await p.waitForTimeout(400);
 console.log(s,await p.evaluate(()=>{const m=document.getElementById("main");const vw=m.clientWidth;const o=[];for(const e of m.querySelectorAll("*")){const b=e.getBoundingClientRect();if(b.right>vw+2&&!e.closest(".hrow,.chips,.k6-cover,.ptabs,.sr-tabs,.stories"))o.push(e.tagName+"."+String(e.className.baseVal??e.className).slice(0,30)+" "+Math.round(b.right)+" p="+String(e.parentElement.className).slice(0,30))}return{sw:m.scrollWidth,o:o.slice(0,8)}}))}
 await done(A)})();
