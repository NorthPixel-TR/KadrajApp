/* CSS temizliği denetimi: KADRAJ_HTML ile verilen kopyada sayfaları açar, her öğenin hesaplanmış stilini yazar.
   node snap.js <çıktı.json> <genişlik> [koyu]  (iki kopyanın çıktısı cmp.js ile karşılaştırılır) */
const {open}=require('../m70/lib');const fs=require('fs');const OUT=process.argv[2],W=+process.argv[3]||390,dark=process.argv.includes("koyu");
(async()=>{const {b,p}=await open(W,820,{dark,anim:"off"});await p.emulateMedia({reducedMotion:"reduce"});
 await p.evaluate(()=>{settings.clawd=false;try{window.CLAWD&&CLAWD.stop()}catch{}});
 const res={};
 const snap=async(name)=>{await p.waitForTimeout(500);res[name]=await p.evaluate(()=>{const out=[];const root=[...document.querySelectorAll("#top,#main,#dock,#overlay")];
  for(const r of root)for(const e of [r,...r.querySelectorAll("*")]){if(e.closest("svg")&&e.tagName!=="svg")continue;const cs=getComputedStyle(e);let s="";for(let i=0;i<cs.length;i++){const k=cs[i];if(/^(transition|animation)/.test(k))continue;s+=k+":"+cs.getPropertyValue(k)+";"}
   let path=e.tagName.toLowerCase()+(e.id?"#"+e.id:"")+"."+String(e.className&&e.className.baseVal!==undefined?e.className.baseVal:e.className).trim().split(/\s+/).slice(0,3).join(".");out.push([path,s])}return out})};
 const T=async(name,fn)=>{await p.evaluate(fn);await snap(name)};
 await T("akis",()=>{closeAll();tab("feed")});await T("kesfet",()=>{closeAll();tab("explore")});await T("sohbetler",()=>{closeAll();tab("chats")});
 await T("dm",()=>{closeAll();openChat("u:u2")});await T("grup",()=>{closeAll();openChat("g:gr-1")});await T("arti",()=>plusMenu(S.route.params.key));
 await T("ayrinti",()=>{closeAll();chatInfo(S.route.params.key)});await T("profil",()=>{closeAll();tab("profile")});await T("profil2",()=>{closeAll();go("profile",{uid:"u2"})});
 await T("profmenu",()=>profMenu("u2"));await T("ayarlar",()=>{closeAll();go("settings")});await T("bildirim",()=>{closeAll();tab("activity")});
 await T("satranc",()=>{closeAll();go("chess")});await T("olustur",()=>{closeAll();tab("feed");openCreate()});
 await T("oyunlar",()=>{closeAll();gmHub()});await T("duzenle",()=>{closeAll();go("edit")});
 fs.writeFileSync(OUT,JSON.stringify(res));console.log("sayfa",Object.keys(res).length);await b.close()})();
