/* sayfalar arası gidip gelince birikme denetimi: node smoke.js 390 */
const {rich,ok,done}=require('./h.js');const W=+process.argv[2]||390;
(async()=>{const A=await rich({width:W});const p=A.page;
 await p.evaluate(()=>{const si=window.setInterval,ci=window.clearInterval;window.__live=new Set();window.setInterval=function(f,t,...a){const id=si(f,t,...a);__live.add(id);return id};window.clearInterval=function(id){__live.delete(id);return ci(id)};
  const ae=EventTarget.prototype.addEventListener,re=EventTarget.prototype.removeEventListener;window.__ls=new Map();const tg=x=>x===window||x===document||x===document.body||x===document.documentElement||x===window.visualViewport;
  EventTarget.prototype.addEventListener=function(t,f,o){if(tg(this))__ls.set(t,(__ls.get(t)||0)+1);return ae.call(this,t,f,o)};EventTarget.prototype.removeEventListener=function(t,f,o){if(tg(this))__ls.set(t,(__ls.get(t)||0)-1);return re.call(this,t,f,o)}});
 const tour=async()=>{for(const s of ['tab("feed")','tab("explore")','go("reels")','tab("profile")','go("profile",{uid:"u2"})','tab("activity")','go("post",{id:"p2"})','openStories("u2")','closeAll()','openComments("p1")','closeAll()','openCreate()','closeAll()','tab("feed")']){await p.evaluate(s);await p.waitForTimeout(350)}};
 await tour();const a=await p.evaluate(()=>({iv:__live.size,ls:Object.fromEntries(__ls)}));
 await tour();await tour();const b=await p.evaluate(()=>({iv:__live.size,ls:Object.fromEntries(__ls)}));
 console.log(JSON.stringify(a));console.log(JSON.stringify(b));
 ok(b.iv<=a.iv,"setInterval birikmiyor "+a.iv+"→"+b.iv);
 const grown=Object.keys(b.ls).filter(k=>(b.ls[k]||0)>(a.ls[k]||0));ok(!grown.length,"window/document dinleyicileri birikmiyor "+grown.map(k=>k+":"+a.ls[k]+"→"+b.ls[k]));
 await done(A)})();
