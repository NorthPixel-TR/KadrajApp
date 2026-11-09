/* profil: hikâyeli kişide tur, pencere açıkken bekleme, hızlı geçişte zamanlayıcı, yerel modda Ben'e çift dokunma */
const {open,OUT}=require('./lib');const {px}=require('./seed');const W=+process.argv[2]||390;
(async()=>{const {b,p,errors}=await open(W,860);
 await p.evaluate(async(c)=>{const T=Date.now();const set=async(u,o)=>{await DB.update("profiles/"+u,o);S.profiles[u]={...S.profiles[u],...o}};
  await set("u2",{avatar:c[0],avs:[c[1],c[2]]});await set("u1",{avatar:c[3],avs:[c[1]]});
  await DB.set("stories/s1",{uid:"u2",at:T-6e4,img:c[0],views:{}})},[px("red"),px("blue"),px("green"),px("gold")]);
 await p.evaluate(()=>{window._seq=[];const f=avsShow;avsShow=function(u,i){_seq.push(u+i);return f.apply(this,arguments)}});
 await p.evaluate(()=>go("profile",{uid:"u2"}));await p.waitForTimeout(1800);
 console.log("story-prof seq",await p.evaluate(()=>_seq.join(",")),await p.evaluate(()=>document.querySelector("#main .prof-top > .av")?.outerHTML.slice(0,120)));
 // pencere açıkken bekler
 await p.evaluate(()=>{_seq.length=0;go("profile",{uid:"u1"})});await p.waitForTimeout(150);await p.evaluate(()=>profMenu("u1"));await p.waitForTimeout(1500);
 console.log("while sheet",await p.evaluate(()=>_seq.join(",")));await p.evaluate(()=>closeAll());await p.waitForTimeout(1500);console.log("after close",await p.evaluate(()=>_seq.join(",")));
 // hızlı geçiş
 await p.evaluate(()=>{_seq.length=0});for(let k=0;k<6;k++){await p.evaluate(k=>go("profile",{uid:k%2?"u1":"u2"}),k);await p.waitForTimeout(120)}
 await p.evaluate(()=>tab("feed"));await p.waitForTimeout(1500);console.log("after rapid + feed",await p.evaluate(()=>_seq.join(",")+" t="+AVR.t));
 // yerel modda Ben'e çift dokunma
 const q=await p.locator('#dock [data-tab="profile"]').boundingBox();await p.mouse.click(q.x+q.width/2,q.y+q.height/2);await p.waitForTimeout(120);await p.mouse.click(q.x+q.width/2,q.y+q.height/2);await p.waitForTimeout(600);
 console.log("local dbl",await p.evaluate(()=>S.route.name+" "+S.uid));
 console.log("errors",errors);await b.close()})();
