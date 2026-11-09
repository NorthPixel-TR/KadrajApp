/* profil taşması: hangi alan taşırıyor (uzun bağlantı bio, uzun ad, uzun şarkı adı) */
const {open,OUT}=require('./lib');const {px}=require('./seed');const W=+process.argv[2]||360;const dark=process.argv[3]==="dark",ui=process.argv[4]||"vizor";
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"OK  ":"FAIL")+" "+m)};
(async()=>{const {b,p,errors}=await open(W,860,{dark,ui});
 const cases={
  bio:{bio:"Bağlantım https://ornek.com/cok/uzun/bir/baglanti/adresi/burada/devam/ediyor/ve/ediyor"},
  name:{name:"Ayşegül Yılmazoğlu Karadenizli Uzunadlı Soyadlı"},
  user:{username:"aysegul_yilmazoglu_karadenizli_uzun"},
  music:{music:{u:"it:123",t:"Çok Uzun Şarkı Adı - Çok Uzun Sanatçı Adı ve Orkestrası (Remastered 2024 Edition)",p:"https://audio-ssl.itunes.apple.com/x.m4a",a:null,e:0,s:0,d:30}},
  word:{bio:"Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}};
 for(const [k,o] of Object.entries(cases)){
  const orig=await p.evaluate(()=>JSON.stringify(S.profiles.u2));
  await p.evaluate(async(o)=>{await DB.update("profiles/u2",o);S.profiles.u2={...S.profiles.u2,...o}},o);
  for(const who of ["u2"]){await p.evaluate(()=>tab("feed"));await p.waitForTimeout(200);await p.evaluate(w=>go("profile",{uid:w}),who);await p.waitForTimeout(700);
   const r=await p.evaluate(()=>{const m=document.querySelector("#main");return{m:m.scrollWidth-m.clientWidth,sw:document.documentElement.scrollWidth-innerWidth}});
   ok(r.m<=0&&r.sw<=0,`${W} ${k}: #main yatay taşma ${r.m}px, sayfa ${r.sw}px`);
   await p.screenshot({path:OUT+`p7b_${k}_${W}_${dark?"d":"l"}_${ui}.png`,clip:{x:0,y:0,width:W,height:560}})}
  await p.evaluate(async(s)=>{const o=JSON.parse(s);await DB.set("profiles/u2",o);S.profiles.u2=o},orig)}
 /* kendi profilim (uzun bağlantı) */
 await p.evaluate(async()=>{const o={bio:"https://ornek.com/cok/uzun/bir/baglanti/adresi/burada/devam/ediyor/ve/ediyor"};await DB.update("profiles/u1",o);S.profiles.u1={...S.profiles.u1,...o}});
 await p.evaluate(()=>tab("profile"));await p.waitForTimeout(700);
 {const r=await p.evaluate(()=>{const m=document.querySelector("#main");return m.scrollWidth-m.clientWidth});ok(r<=0,`${W} kendi profilim bio bağlantısı taşma ${r}px`)}
 ok(!errors.length,"sayfa hatası yok "+errors.join(";"));console.log(pass+"/"+(pass+fail));await b.close()})();
