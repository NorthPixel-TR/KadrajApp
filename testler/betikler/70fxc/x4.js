/* sayfalar arası gidip gelince biriken dinleyici / zamanlayıcı / gözlemci */
const {open,seed,ok,done,SP}=require('./h');
const INIT=`(()=>{const C=window.__cnt={iv:0,ivLive:new Set(),to:0,mo:0,moLive:0,ev:{},raf:0,io:0,ro:0};
 const si=setInterval,ci=clearInterval;window.setInterval=function(f,t,...a){const id=si.call(this,f,t,...a);C.iv++;C.ivLive.add(id);try{C.ivSrc=C.ivSrc||{};const s=(new Error().stack||"").split("\\n")[2]||"";C.ivSrc[id]=s.trim().slice(0,140)}catch{}return id};
 window.clearInterval=function(id){C.ivLive.delete(id);return ci.call(this,id)};
 const MO=window.MutationObserver;window.MutationObserver=class extends MO{constructor(cb){super(cb);C.mo++;try{C.moSrc=C.moSrc||[];C.moSrc.push((new Error().stack||"").split("\\n")[2].trim().slice(0,140))}catch{}}};
 const IO=window.IntersectionObserver;window.IntersectionObserver=class extends IO{constructor(a,b){super(a,b);C.io++}};
 const RO=window.ResizeObserver;window.ResizeObserver=class extends RO{constructor(a){super(a);C.ro++;try{C.roSrc=C.roSrc||[];C.roSrc.push((new Error().stack||"").split("\\n")[2].trim().slice(0,140))}catch{}}};
 for(const T of [EventTarget.prototype]){const ae=T.addEventListener,re=T.removeEventListener;T.addEventListener=function(t,f,o){if(this===window||this===document||this===document.documentElement||this===document.body||(window.visualViewport&&this===visualViewport)){const k=(this===window?"w:":this===document?"d:":"o:")+t;C.ev[k]=(C.ev[k]||0)+1;try{C.evSrc=C.evSrc||{};(C.evSrc[k]=C.evSrc[k]||[]).push((new Error().stack||"").split("\\n")[2].trim().slice(0,140))}catch{}}return ae.call(this,t,f,o)};
  T.removeEventListener=function(t,f,o){if(this===window||this===document||this===document.documentElement||this===document.body||(window.visualViewport&&this===visualViewport)){const k=(this===window?"w:":this===document?"d:":"o:")+t;C.ev[k]=(C.ev[k]||0)-1}return re.call(this,t,f,o)}}})()`;
(async()=>{const W=+process.argv[2]||390;const {b,p,errors}=await open(W,{init:INIT});await seed(p);
 const snap=()=>p.evaluate(()=>{const C=window.__cnt;return{iv:C.ivLive.size,mo:C.mo,io:C.io,ro:C.ro,ev:{...C.ev}}});
 const tour=async()=>{for(const n of ["feed","explore","chats","activity","settings","reels","chess"]){await p.evaluate(n=>go(n),n);await p.waitForTimeout(150)}
  await p.evaluate(()=>go("profile",{uid:"u2"}));await p.waitForTimeout(150);await p.evaluate(()=>openChat("u:u2"));await p.waitForTimeout(300);await p.evaluate(()=>go("feed"));await p.waitForTimeout(150);
  await p.evaluate(()=>{S.admin=true;go("admin")});await p.waitForTimeout(200);await p.evaluate(()=>go("feed"));await p.waitForTimeout(150)};
 await tour();const a=await snap();for(let i=0;i<5;i++)await tour();const c=await snap();
 console.log("1 tur",JSON.stringify(a));console.log("6 tur",JSON.stringify(c));
 const grow={};for(const k in c.ev)if((c.ev[k]||0)-(a.ev[k]||0)>0)grow[k]=c.ev[k]-a.ev[k];console.log("büyüyen",JSON.stringify(grow),"iv",c.iv-a.iv,"mo",c.mo-a.mo,"ro",c.ro-a.ro,"io",c.io-a.io);
 const src=await p.evaluate(g=>{const C=window.__cnt;const o={};for(const k in g){const l=C.evSrc[k]||[];const m={};for(const s of l.slice(-60))m[s]=(m[s]||0)+1;o[k]=Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,3)}
  const ivs={};for(const id of C.ivLive){const s=C.ivSrc[id];ivs[s]=(ivs[s]||0)+1}const mo={};for(const s of (C.moSrc||[]).slice(-80))mo[s]=(mo[s]||0)+1;const ro={};for(const s of (C.roSrc||[]).slice(-80))ro[s]=(ro[s]||0)+1;return{o,ivs:Object.entries(ivs).sort((a,b)=>b[1]-a[1]).slice(0,6),mo:Object.entries(mo).sort((a,b)=>b[1]-a[1]).slice(0,5),ro:Object.entries(ro).sort((a,b)=>b[1]-a[1]).slice(0,5)}},grow);
 console.log(JSON.stringify(src,null,1));
 done(errors);await b.close()})();
