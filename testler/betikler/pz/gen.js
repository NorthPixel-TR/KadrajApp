/* Bulmaca üretici: motorla kendi kendine oyun, tek çözümlü mat-1 ve mat-2 konumları. node gen.js <mat1> <mat2> <tohum> */
const fs=require('fs');const src=fs.readFileSync('/home/user/Kadraj/app.js','utf8');
const i=src.indexOf('function ChessCore(){');const j=src.indexOf('\nfunction pieceSvgs(){',i);const C=eval('('+src.slice(i,j).trim()+')')();
let seed=+process.argv[4]||7;const rnd=()=>{seed=(seed*1103515245+12345)&0x7fffffff;return seed/0x7fffffff};
const W1=+process.argv[2]||20,W2=+process.argv[3]||40;
const isMate=g=>C.inCheck(g)&&!C.legal(g).length;
const m1s=g=>{const r=[];for(const m of C.legal(g)){C.make(g,m);if(isMate(g))r.push(m);C.unmake(g)}return r};
const forced=g=>{const ds=C.legal(g);if(!ds.length)return false;for(const d of ds){C.make(g,d);const ok=m1s(g).length>0;C.unmake(g);if(!ok)return false}return true};
const cnt=g=>{let n=0,w=0,b=0;for(const p of g.b){if(p&&(p&7)!==6){n++;if(p&8)b++;else w++}}return{n,w,b}};
const NM={1:"Piyon",2:"At",3:"Fil",4:"Kale",5:"Vezir",6:"Şah"};
const out1=[],out2=[],seen=new Set();let games=0;const t0=Date.now();
while((out1.length<W1||out2.length<W2)&&Date.now()-t0<540000){games++;const g=C.fromFen(C.START);const strong=rnd()<.5?0:8;
 for(let ply=0;ply<140;ply++){const ls=C.legal(g);if(!ls.length||g.half>=100)break;
  if(ply>=14){const fen=C.toFen(g);const key=fen.split(" ").slice(0,2).join(" ");const c=cnt(g);const us=g.turn,def=us?c.w:c.b;
   if(!seen.has(key)&&c.n>=7&&def>=3){const ms=m1s(g);
    if(ms.length===1&&ls.length>=12&&out1.length<W1&&rnd()<.5){seen.add(key);const m=ms[0];out1.push({n:1,fen,sol:[C.uci(m)],t:NM[m.p&7]+" matı",d:(us?"Siyah":"Beyaz")+" oynar. Tek hamlede mat."})}
    else if(!ms.length&&out2.length<W2&&ls.length>=10){const keys=[];for(const k of ls){C.make(g,k);if(forced(g))keys.push(k);C.unmake(g);if(keys.length>1)break}
     if(keys.length===1){seen.add(key);const k=keys[0];C.make(g,k);const ds=C.legal(g);const chk=C.inCheck(g);let cap=false;for(const d of ds)if(d.t===k.t&&d.c)cap=true;
      /* savunma: en çok seçenek bırakan değil, taşı alan varsa onu göster */
      let d=ds.find(x=>x.t===k.t&&x.c)||ds[Math.floor(rnd()*ds.length)];C.make(g,d);const mm=m1s(g)[0];C.unmake(g);C.unmake(g);
      const t=cap?NM[k.p&7]+" fedası":!chk?"Sessiz hamle":k.c?"Al ve bitir":NM[k.p&7]+" ile başla";
      out2.push({n:2,fen,sol:[C.uci(k),C.uci(d),C.uci(mm)],t,d:(us?"Siyah":"Beyaz")+" oynar. İki hamlede mat."+(!chk?" İlk hamle şah değil.":"")})}}}}
  /* hamle seç: güçlü taraf derinlik 2'nin en iyilerinden, zayıf taraf sık sık rastgele */
  let mv;if(g.turn===strong){const r=C.search(g,{all:true,depth:2});const top=r.all.slice(0,3);mv=top[Math.floor(rnd()*Math.min(top.length,rnd()<.7?1:3))].m}
  else{if(rnd()<.45)mv=ls[Math.floor(rnd()*ls.length)];else{const r=C.search(g,{all:true,depth:1});mv=r.all[Math.floor(rnd()*Math.min(4,r.all.length))].m}}
  C.make(g,mv)}
 if(games%50===0)console.error(games,out1.length,out2.length,Math.round((Date.now()-t0)/1000)+"s")}
/* son doğrulama: her bulmacayı baştan denetle */
let bad=0;const all=out1.concat(out2);for(const z of all){const g=C.fromFen(z.fen);if(z.n===1){const ms=m1s(g);if(ms.length!==1||C.uci(ms[0])!==z.sol[0])bad++}else{if(m1s(g).length)bad++;let k=0;for(const m of C.legal(g)){C.make(g,m);if(forced(g))k++;C.unmake(g)}if(k!==1)bad++;const a=C.fromUci(g,z.sol[0]);C.make(g,a);const d=C.fromUci(g,z.sol[1]);if(!d){bad++;continue}C.make(g,d);const m=C.fromUci(g,z.sol[2]);if(!m){bad++;continue}C.make(g,m);if(!isMate(g))bad++}}
all.forEach((z,k)=>{z.id="g"+String(k+1).padStart(2,"0")});
fs.writeFileSync('pz.json',JSON.stringify(all));console.log("oyun",games,"mat1",out1.length,"mat2",out2.length,"hatalı",bad,Math.round((Date.now()-t0)/1000)+"s")
