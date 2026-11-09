/* Ayarlar araması ve görünüm ayarları keşif */
const {open,seed,ok,done,SP}=require('./h');
(async()=>{const W=+process.argv[2]||390;const {b,p,errors}=await open(W);await seed(p);
 await p.evaluate(()=>go("settings"));await p.waitForTimeout(600);
 const q=async s=>{await p.evaluate(s=>{const i=document.getElementById("setQ");i.value=s;i.dispatchEvent(new Event("input"))},s);await p.waitForTimeout(200);
  return p.evaluate(()=>({vis:[...document.querySelectorAll("#main [data-k]")].filter(e=>e.offsetParent).map(e=>(e.querySelector(".t")||e).textContent.trim().slice(0,30)).slice(0,12),empty:!document.getElementById("setEmpty").hidden,groups:[...document.querySelectorAll("#main .sg")].filter(g=>g.offsetParent).map(g=>g.dataset.g)}))};
 for(const s of ["tema","bildirim","sifre","şifre","süre","arşiv","engellenen","yakın","zzzq","çıkış","hesaplar","animasyon","GÖRÜNÜM","İzin"]){console.log(s,JSON.stringify(await q(s)))}
 await q("");const r=await p.evaluate(()=>({groups:[...document.querySelectorAll("#main .sg")].map(g=>g.dataset.g+":"+(g.offsetParent?1:0)+":"+g.classList.contains("open")),extra:["k64","k62Entry","cfEntry","blkEntry","k67Acc","k67Qm","appInfo","appEntry"].map(id=>{const e=document.getElementById(id);return id+":"+(e?(e.offsetParent?"g":"h"):"-")})}));console.log(JSON.stringify(r));
 await p.screenshot({path:SP+"set_q.png"});
 // yazı boyutu + tema
 await p.evaluate(()=>{const g=document.querySelector('.sg[data-g="gorunum"] .sg-h');g&&g.click()});await p.waitForTimeout(200);
 await p.evaluate(()=>document.querySelector('[data-scale="1.2"]').click());await p.waitForTimeout(200);
 console.log("scale",await p.evaluate(()=>[settings.scale,getComputedStyle(document.documentElement).getPropertyValue("--scale"),document.querySelector('[data-scale="1.2"]').getAttribute("aria-pressed"),!!document.querySelector('.sg[data-g="gorunum"].open')]));
 await p.evaluate(()=>document.querySelector('[data-theme-set="dark"]').click());await p.waitForTimeout(300);
 console.log("theme",await p.evaluate(()=>[settings.theme,document.documentElement.getAttribute("data-app-theme"),getComputedStyle(document.body).backgroundColor,!!document.querySelector('.sg[data-g="gorunum"].open')]));
 await p.evaluate(()=>document.querySelector('[data-act="accent"][data-v]:nth-child(3)').click());await p.waitForTimeout(300);
 console.log("accent",await p.evaluate(()=>[settings.accent,getComputedStyle(document.documentElement).getPropertyValue("--accent")]));
 await p.screenshot({path:SP+"set_dark.png",fullPage:true});
 done(errors);await b.close()})();
