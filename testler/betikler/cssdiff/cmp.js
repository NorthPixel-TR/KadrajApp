/* iki snap.js çıktısını karşılaştırır: özellikler sıradan bağımsız, çok küçük sayısal farklar (süren geçişler) yok sayılır */
const fs=require('fs');const [A,B]=process.argv.slice(2).map(f=>JSON.parse(fs.readFileSync(f,'utf8')));let diff=0,tot=0;
const IGN=/^--(cf-tp)$/; /* JS zamanla yazar */ const SKIP=/^div\.stamp/; /* saat yazısı dakikaya göre değişir */
const map=s=>{const o={};let k="",v="",dep=0,inK=true;for(const ch of s){if(inK){if(ch===":"){inK=false;continue}k+=ch;continue}if(ch==="("){dep++}else if(ch===")"){dep--}if(ch===";"&&dep===0){o[k]=v;k="";v="";inK=true;continue}v+=ch}return o};
const near=(x,y)=>{const nx=x.match(/-?[\d.]+(e-?\d+)?/g),ny=y.match(/-?[\d.]+(e-?\d+)?/g);if(!nx||!ny||nx.length!==ny.length)return false;if(x.replace(/-?[\d.]+(e-?\d+)?/g,"#")!==y.replace(/-?[\d.]+(e-?\d+)?/g,"#"))return false;return nx.every((n,i)=>Math.abs(+n-+ny[i])<0.02)};
for(const k of Object.keys(A)){const a=A[k],b=B[k]||[];if(a.length!==b.length){console.log("FARK",k,"öğe sayısı",a.length,b.length);diff++;continue}
 for(let i=0;i<a.length;i++){tot++;if(a[i][1]===b[i][1]||SKIP.test(a[i][0]))continue;const pa=map(a[i][1]),pb=map(b[i][1]);const d=Object.keys({...pa,...pb}).filter(x=>!IGN.test(x)&&pa[x]!==pb[x]&&!(pa[x]!=null&&pb[x]!=null&&near(pa[x],pb[x])));
  if(d.length){diff++;if(diff<15)console.log("FARK",k,a[i][0],d.slice(0,4).map(x=>x+": "+pa[x]+" → "+pb[x]).join(" | "))}}}
console.log(tot+" öğe, "+diff+" fark");console.log("SORUN SAYISI "+diff)
