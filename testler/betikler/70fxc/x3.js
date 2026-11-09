/* erişilebilirlik taraması: adı olmayan düğmeler, etiketsiz girişler */
const {open,seed,ok,done,SP}=require('./h');
(async()=>{const W=+process.argv[2]||390;const {b,p,errors}=await open(W);await seed(p);
 const scan=()=>p.evaluate(()=>{const nm=e=>(e.getAttribute("aria-label")||e.getAttribute("title")||e.textContent||"").trim()||(e.querySelector("img[alt]")||{}).alt||"";
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0};
  const bad=[...document.querySelectorAll("button,a[href],[role=button]")].filter(e=>vis(e)&&!nm(e)&&!e.getAttribute("aria-labelledby")).map(e=>(e.id?"#"+e.id:"")+"."+String(e.className).split(" ")[0]+"["+[...e.attributes].filter(a=>/^data-|^id$/.test(a.name)).map(a=>a.name+"="+a.value).join(",")+"]");
  const inp=[...document.querySelectorAll("input:not([type=hidden]),textarea,select")].filter(e=>vis(e)&&!e.getAttribute("aria-label")&&!(e.id&&document.querySelector(`label[for="${e.id}"]`))&&!e.closest("label")&&!e.placeholder).map(e=>e.id||e.className);
  return{bad:[...new Set(bad)],inp}});
 const pages=[["feed"],["explore"],["chats"],["activity"],["profile",{uid:"u1"}],["profile",{uid:"u2"}],["settings"],["reels"],["chess"],["chat",{key:"u:u2"}],["edit"]];
 for(const [n,pa] of pages){await p.evaluate(([n,pa])=>{if(n==="chat")openChat(pa.key);else go(n,pa||{})},[n,pa]);await p.waitForTimeout(700);
  const r=await scan();console.log(n,JSON.stringify(r))}
 await p.evaluate(()=>{S.admin=true;go("admin")});await p.waitForTimeout(700);console.log("admin",JSON.stringify(await scan()));
 await p.evaluate(()=>{go("chess");});await p.waitForTimeout(300);
 await p.evaluate(()=>{try{openCreate()}catch(e){}});await p.waitForTimeout(500);console.log("create",JSON.stringify(await scan()));
 done(errors);await b.close()})();
