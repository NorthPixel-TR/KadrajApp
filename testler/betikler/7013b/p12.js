const {open,OUT}=require('./lib');
(async()=>{const W=+process.argv[2]||390;const ui=process.argv[3]||"vizor";const {b,p,errors}=await open(W,780,{ui});
const dock=()=>p.evaluate(()=>[...document.querySelectorAll("#dock nav > *, #dock > :not(nav)")].map(e=>(e.dataset.tab||e.dataset.go||e.dataset.act||e.tagName)+(e.classList.contains("on")||e.getAttribute("aria-current")?"*":"")+(e.querySelector(".cnt-badge,.badge,.dot,.cnt")?"("+(e.querySelector(".cnt-badge,.badge,.dot,.cnt").textContent||"•")+")":"")).join(" "));
for(const t of ["feed","explore","chats","activity","me"]){await p.evaluate(t=>t==="me"?tab("profile"):tab(t),t).catch(e=>console.log(e.message));await p.waitForTimeout(400);console.log(t,await dock())}
await p.evaluate(()=>go("reels"));await p.waitForTimeout(600);console.log("reels",await dock());
await p.evaluate(()=>openChat("u:u2"));await p.waitForTimeout(600);console.log("chat",await dock());
await p.evaluate(()=>go("settings"));await p.waitForTimeout(600);console.log("settings",await dock());
console.log(errors);await b.close()})();
