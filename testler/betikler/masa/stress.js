/* Masa oyunları hızlı dayanıklılık: zamanlayıcılar 25 kat hızlı, her oyundan N el. node stress.js [N] */
const {open}=require('../m70/lib.js');const N=+process.argv[2]||25;
(async()=>{const {b,p,errors}=await open(390,820);
 await p.evaluate(()=>{const st=window.setTimeout;window.setTimeout=(f,ms,...a)=>st(f,(ms||0)/25,...a);msGo(M=>M.open())});await p.waitForFunction(()=>window.MASA&&document.querySelector(".ms-menu"));
 const res={};
 for(const k of ["amiral","pisti","renk","okey"]){res[k]={n:0,won:0,bad:[]};
  for(let g=0;g<N;g++){await p.evaluate(k=>MASA.open(k),k);let steps=0,st="";
   for(;steps<3000;steps++){st=await p.evaluate(k=>{const G=MASA._t.G();if(!G)return"nog";if(G.over)return"over";
     if(k==="amiral"){if(G.turn!==0)return"wait";const bt=[...document.querySelectorAll("[data-ab]")];const c=bt.find(x=>!G.bot.shot[+x.dataset.ab]);if(!c)return"BAD "+JSON.stringify({bt:bt.length,shot:G.bot.shot.filter(Boolean).length,ships:G.bot.ships.map(s=>s.hit+"/"+s.cells.length),left:G.bot.ships.filter(s=>s.hit<s.cells.length).length,end:!!document.querySelector(".ms-end")});c.click();return"play"}
     if(k==="pisti"){if(G.turn!==0)return"wait";const c=document.querySelector("[data-pt]");if(!c)return"BAD el boş "+JSON.stringify({h0:G.p[0].h.length,h1:G.p[1].h.length,deck:G.deck.length});c.click();return"play"}
     if(k==="renk"){if(G.pick!=null){document.querySelector("[data-drc]").click();return"pick"}if(G.turn!==0)return"wait";const c=document.querySelector(".cd-hand .cd.ok");if(c){c.click();return"play"}document.querySelector("[data-drd]").click();return"draw"}
     if(k==="okey"){if(G.turn!==0)return"wait";if(!G.drew){document.querySelector('[data-ok="draw"]').click();return"draw"}const T=MASA._t;const h=G.rack.filter(Boolean);const pk=T.okPick(h,G.ok);const i=G.rack.indexOf(h[pk.i]);G.sel=i;document.querySelector('[data-ok="dis"]').click();return"dis"}},k);
    if(st==="over"||st.startsWith("BAD")||st==="nog")break;if(st==="wait")await p.waitForTimeout(15)}
   const e=await p.evaluate(()=>(document.querySelector(".ms-end h2")||{}).textContent||"");res[k].n++;if(/Kazandın/.test(e))res[k].won++;if(st!=="over")res[k].bad.push(st+" @"+steps)}
  console.log(k,JSON.stringify(res[k]))}
 console.log("hata:",errors.length,errors.slice(0,3).join(" | "));await b.close()})().catch(e=>{console.error(e);process.exit(1)});
