/* profil: uzun ad/bio, şarkı ve doğum günü çipleri, başkasının profili; taşma */
const {open,OUT}=require('./lib');const {px,seed}=require('./seed');const W=+process.argv[2]||390;const dark=process.argv[3]==="dark",ui=process.argv[4]||"vizor";
(async()=>{const {b,p,errors}=await open(W,860,{dark,ui});await seed(p);
 const t=new Date();const bd=String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0");
 await p.evaluate(async({c,bd})=>{const set=async(u,o)=>{await DB.update("profiles/"+u,o);S.profiles[u]={...S.profiles[u],...o}};
  await set("u2",{name:"Ayşegül Yılmazoğlu Karadenizli Uzunadlı",username:"aysegul_yilmazoglu_karadeniz",bio:"Çok uzun bir biyografi satırı https://ornek.com/cok/uzun/bir/baglanti/adresi/burada/devam/ediyor #etiket @bilal ".repeat(2),avatar:c[0],avs:[c[1]],bday:bd,music:{u:"it:123",t:"Çok Uzun Şarkı Adı - Çok Uzun Sanatçı Adı ve Orkestrası (Remastered 2024 Edition)",p:"https://audio-ssl.itunes.apple.com/x.m4a",a:null,e:0,s:0,d:30}})},{c:[px("red"),px("blue")],bd});
 const ov=async(t)=>{const r=await p.evaluate(()=>{const bad=[];for(const el of document.querySelectorAll("#main *")){const r=el.getBoundingClientRect();if(r.width&&r.right>innerWidth+1&&!el.closest(".phc-tr,.stories,.chips,.hls,.hl-row,.ptabs,.grid"))bad.push((typeof el.className==="string"?el.className:el.tagName)+":"+Math.round(r.right))}return{sw:document.documentElement.scrollWidth,m:document.querySelector("#main").scrollWidth-document.querySelector("#main").clientWidth,bad:bad.slice(0,8)}});console.log(t,JSON.stringify(r))};
 await p.evaluate(()=>go("profile",{uid:"u2"}));await p.waitForTimeout(1500);await ov("u2");await p.screenshot({path:OUT+`p7_${W}_${dark?"d":"l"}_${ui}.png`});
 for(const tb of ["rp","tag","reels","saved"]){}
 console.log("errors",errors);await b.close()})();
