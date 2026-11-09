/* 70FXB: hikâye halkasına hızlı çift dokunma. node dbltap.js <w> [vizor|klasik] */
const sd=require('/tmp/claude-0/-home-user-Kadraj/de2b9ee9-f1cc-5362-a195-b9aefa1af271/scratchpad/a60ui/seed.js');
const HTML=process.env.KADRAJ_HTML||'/home/user/Kadraj/.claude/worktrees/agent-a493c6425937c90fc/index.html';
const [,,W='390',UI='vizor']=process.argv;let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
(async()=>{const {page:p,errors,close}=await sd.open(HTML,{width:+W,height:844,ui:UI});
 await p.evaluate(async()=>{const T=Date.now();await DB.set("stories/s1b",{uid:"u2",at:T-36e5,img:"img/kahve.jpg",views:{}});localStorage.removeItem("kadraj_seen");tab("feed");window.__cl=[];window.addEventListener("click",e=>{const l=document.querySelector(`#overlay [data-layer="story"]`);window.__cl.push((e.target.id||e.target.className)+"@"+(l&&l._fxT?Math.round(performance.now()-l._fxT):"-"))},true);window.addEventListener("pointerdown",e=>window.__cl.push("pd:"+(e.target.id||e.target.className)),true)});await p.waitForTimeout(1200);
 for(const who of ["u2","u3"]){
  const r=await p.evaluate(w=>{const b=document.querySelector(`.stories [data-story="${w}"]`);const q=b.getBoundingClientRect();return{x:q.x+q.width/2,y:q.y+q.height/2}},who);
  await p.mouse.click(r.x,r.y);await p.waitForTimeout(90);await p.mouse.click(r.x,r.y);await p.waitForTimeout(700);
  const s=await p.evaluate(()=>{const l=document.querySelector('#overlay [data-layer="story"]');if(!l)return{open:false};const bs=[...l.querySelectorAll(".bars b")];return{cl:window.__cl.join(" "),seen:JSON.stringify(LS.get("kadraj_seen")),w:bs.map(b=>b.style.width).join(),open:true,who:l.querySelector(".shd .n").firstChild.textContent,idx:bs.findIndex(b=>b.style.width!=="100%"),n:bs.length}});
  ok(s.open&&s.who===sd&&false||s.open&&s.idx===0,`${who}: çift dokunmada ilk hikâyede kalır ${JSON.stringify(s)}`);
  await p.evaluate(()=>{closeAll();localStorage.removeItem("kadraj_seen")});await p.waitForTimeout(600)}
 ok(!errors.length,"sayfa hatası yok "+errors.slice(0,2));console.log(pass+"/"+(pass+fail));await close();process.exit(fail?1:0)})();
