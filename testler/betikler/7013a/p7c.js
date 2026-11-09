const {open,OUT}=require('./lib');const W=+process.argv[2]||360;
(async()=>{const {b,p,errors}=await open(W,860);
 await p.evaluate(async()=>{const o={music:{u:"it:123",t:"Çok Uzun Şarkı Adı - Çok Uzun Sanatçı Adı ve Orkestrası (Remastered 2024 Edition)",p:"https://audio-ssl.itunes.apple.com/x.m4a",e:0,s:0,d:30}};await DB.update("profiles/u2",o);S.profiles.u2={...S.profiles.u2,...o}});
 await p.evaluate(()=>go("profile",{uid:"u2"}));await p.waitForTimeout(700);
 console.log(await p.evaluate(()=>{const out=[];let e=document.querySelector("#main .pmus");while(e&&e.id!=="main"){const cs=getComputedStyle(e);out.push((e.className||e.tagName)+" w="+Math.round(e.getBoundingClientRect().width)+" d="+cs.display+" gtc="+cs.gridTemplateColumns.slice(0,40)+" minw="+cs.minWidth);e=e.parentElement}return out.join("\n")}));
 await b.close()})();
