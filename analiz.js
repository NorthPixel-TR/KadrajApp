/* Kadraj Analiz Tahtası (7.1.1). İlk kullanımda yüklenir (app.js bölge 711: anLoad/anGo, ACT.anOpen). window.ANALIZ.open({fen?,moves?:[uci],flip?}).
   İki tarafın taşını da oynatırsın; her konumda motor (engineRun, Web Worker; derinlik 7, en çok 1,5 sn) değerlendirmeyi ve en iyi hamleyi verir:
   üstte değerlendirme çubuğu (beyazın payı), tahtada turuncu ok, altta "En iyi: …". Hamle şeridinden istediğin hamleye dönülür; geçmişte yeni
   hamle yapınca sonrası silinir. Konum penceresi: FEN kopyala / yapıştır / başlangıç. Hamleler PGN olarak kopyalanır (İngilizce harflerle).
   Kadraj'ın genel adlarını kullanır (CC, engineRun, chPimg, CTHEMES, openLayer, sheet, copyText, esc, I, toast). Firebase'e dokunmaz. */
(function(){"use strict";
let L=null,A=null,seq=0;
const DBL=d=>`<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
const TH=()=>{try{return CTHEMES[chThKey()]||["#eeeed2","#769656"]}catch(e){return["#eeeed2","#769656"]}};
const CSS=`.an{position:absolute;inset:0;margin:0 auto;max-width:560px;background:var(--bg);color:var(--fg);pointer-events:auto;display:flex;flex-direction:column;padding-block:env(safe-area-inset-top,0px) env(safe-area-inset-bottom,0px);animation:up .25s ease;user-select:none;-webkit-user-select:none}
.an-h{display:flex;align-items:center;gap:8px;padding:10px 12px}.an-h h1{margin:0;font:800 1.05rem var(--f-display);flex:1;min-width:0}.an-h button{width:40px;height:40px;border-radius:50%;background:var(--surface-2);display:grid;place-items:center;color:var(--fg);flex:none}.an-h button svg{width:20px;height:20px}
.an-b{flex:1;min-height:0;overflow-y:auto;padding:0 12px 14px;display:flex;flex-direction:column;gap:10px;align-items:center}
.an-ev{width:100%;max-width:var(--bw);display:flex;align-items:center;gap:10px}.an-bar{flex:1;height:10px;border-radius:5px;background:#26262d;overflow:hidden;box-shadow:inset 0 0 0 1px var(--line)}.an-bar i{display:block;height:100%;width:50%;background:#f4f4f7;transition:width .35s ease}.an-ev b{font:800 .9rem var(--f-mono);min-width:3.6em;text-align:right}
.an-bd{position:relative;width:var(--bw);height:var(--bw);display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(8,1fr);border-radius:8px;overflow:hidden;box-shadow:0 6px 22px rgba(0,0,0,.22);flex:none;touch-action:manipulation}
.an-s{position:relative;padding:0;border:0;border-radius:0;min-width:0;min-height:0;display:grid;place-items:center;background:var(--c)}.an-s img{width:92%;height:92%;pointer-events:none;display:block}
.an-s.lm{box-shadow:inset 0 0 0 100px rgba(255,214,10,.36)}.an-s.sel{box-shadow:inset 0 0 0 100px rgba(79,70,229,.45)}.an-s.tg::after{content:"";position:absolute;width:30%;height:30%;border-radius:50%;background:rgba(0,0,0,.28)}.an-s.tg.cp::after{width:86%;height:86%;background:none;box-shadow:inset 0 0 0 4px rgba(0,0,0,.3)}.an-s.ck{box-shadow:inset 0 0 0 100px rgba(226,62,87,.55)}
.an-s small{position:absolute;font:700 9px var(--f-mono);opacity:.6;color:#222;pointer-events:none}.an-s small.r{left:2px;top:1px}.an-s small.f{right:2px;bottom:0}
.an-ar{position:absolute;inset:0;pointer-events:none}
.an-pr{position:absolute;inset:0;background:rgba(0,0,0,.55);display:grid;place-items:center;z-index:3}.an-pr div{display:flex;gap:8px;padding:10px;border-radius:14px;background:var(--surface)}.an-pr button{width:56px;height:56px;border-radius:12px;background:var(--surface-2)}.an-pr img{width:100%;height:100%}
.an-in{width:100%;max-width:var(--bw);min-height:2.6em;font-size:.9rem;color:var(--muted);text-align:center}.an-in b{color:var(--fg)}
.an-mv{width:100%;max-width:var(--bw);display:flex;gap:4px;overflow-x:auto;padding:2px 0 6px;scrollbar-width:none}.an-mv::-webkit-scrollbar{display:none}.an-mv i{font:600 .78rem var(--f-mono);color:var(--muted);font-style:normal;align-self:center;flex:none;padding-left:4px}
.an-mv button{flex:none;padding:6px 9px;border-radius:9px;background:var(--surface-2);font:700 .84rem var(--f-body);color:var(--fg)}.an-mv button.on{background:var(--fg);color:var(--bg)}
.an-bt{width:100%;max-width:var(--bw);display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.an-bt button{height:44px;border-radius:12px;background:var(--surface-2);color:var(--fg);display:grid;place-items:center}.an-bt button:disabled{opacity:.35}.an-bt svg{width:20px;height:20px}
.an-ac{width:100%;max-width:var(--bw);display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.an-ac button{padding:11px 6px;text-align:center;line-height:1.2;border-radius:12px;background:var(--surface-2);color:var(--fg);font-weight:700;font-size:.84rem}.an-ac button.pri{background:var(--accent);color:var(--accent-ink)}
.an-fen{display:grid;gap:10px;padding:0 16px 16px}.an-fen textarea{width:100%;min-height:4.2em;font:500 .8rem var(--f-mono);resize:none}
@media (prefers-reduced-motion:reduce){.an,.an-bar i{animation:none;transition:none}}`;
function css(){if(document.getElementById("anCss"))return;const s=document.createElement("style");s.id="anCss";s.textContent=CSS;document.head.appendChild(s)}
function rebuild(){const g=CC.fromFen(A.start);let i=0;for(;i<A.ply;i++){const m=CC.fromUci(g,A.moves[i].u);if(!m)break;CC.make(g,m)}if(i<A.ply){A.ply=i;A.moves.length=i}A.g=g;A.legal=CC.legal(g);A.chk=CC.inCheck(g);A.sel=-1;A.tg=[];A.pr=null}
function over(){if(A.legal.length)return A.g.half>=100?"50 hamle kuralı: berabere":"";return A.chk?"Şah mat. "+(A.g.turn?"Beyaz":"Siyah")+" kazandı":"Pat: berabere"}
function evTxt(){const e=A.ev;if(!e)return"…";const M=CC.MATE;if(Math.abs(e.sc)>M-300){const n=Math.max(1,Math.ceil((M-Math.abs(e.sc))/2));return(e.sc>0?"+":"−")+"M"+n}const v=e.sc/100;return(v>0?"+":v<0?"−":"")+Math.abs(v).toFixed(1).replace(".",",")}
function evPct(){const e=A.ev;if(!e)return 50;if(Math.abs(e.sc)>CC.MATE-300)return e.sc>0?100:0;return Math.max(4,Math.min(96,50+50*Math.tanh(e.sc/600)))}
function sqXY(s){let r=s>>3,f=s&7;if(A.flip){r=7-r;f=7-f}return[(f+.5)*12.5,(r+.5)*12.5]}
function arrow(){const e=A.ev;if(!e||!e.u||over())return"";const f=CC.sqIdx(e.u.slice(0,2)),t=CC.sqIdx(e.u.slice(2,4));const[a,b]=sqXY(f),[c,d]=sqXY(t);const dx=c-a,dy=d-b,len=Math.hypot(dx,dy)||1,ux=dx/len,uy=dy/len,ex=c-ux*3.4,ey=d-uy*3.4;
 return`<svg class="an-ar" viewBox="0 0 100 100" aria-hidden="true"><line x1="${a.toFixed(2)}" y1="${b.toFixed(2)}" x2="${ex.toFixed(2)}" y2="${ey.toFixed(2)}" stroke="#FF8A4C" stroke-opacity=".85" stroke-width="2.4" stroke-linecap="round"/><polygon fill="#FF8A4C" fill-opacity=".9" points="${c.toFixed(2)},${d.toFixed(2)} ${(ex-uy*2.6).toFixed(2)},${(ey+ux*2.6).toFixed(2)} ${(ex+uy*2.6).toFixed(2)},${(ey-ux*2.6).toFixed(2)}"/></svg>`}
function bestSan(){const e=A.ev;if(!e||!e.u)return"";const m=CC.fromUci(A.g,e.u);return m?CC.san(A.g,m,"tr"):""}
function info(){const o=over();if(o)return`<b>${esc(o)}</b>`;if(!A.ev)return"Motor düşünüyor…";const s=bestSan();return`${A.g.turn?"Siyah":"Beyaz"} oynar · En iyi: <b>${esc(s)}</b> · ${esc(evTxt())}`}
function board(){const th=TH(),g=A.g,last=A.ply?A.moves[A.ply-1]:null,lf=last?CC.sqIdx(last.u.slice(0,2)):-1,lt=last?CC.sqIdx(last.u.slice(2,4)):-1,k=A.chk?g.k[g.turn>>3]:-1;let h="";
 for(let i=0;i<64;i++){const s=A.flip?63-i:i,r=s>>3,f=s&7,p=g.b[s],tg=A.tg.find(m=>m.t===s);const cls=["an-s"];if(s===lf||s===lt)cls.push("lm");if(s===A.sel)cls.push("sel");if(tg){cls.push("tg");if(tg.c||p)cls.push("cp")}if(s===k)cls.push("ck");
  const dr=i>>3,df=i&7;h+=`<button type="button" class="${cls.join(" ")}" data-ans="${s}" style="--c:${(r+f)%2?th[1]:th[0]}" aria-label="${CC.sqName(s)}">${p?`<img src="${chPimg(p)}" alt="">`:""}${df===0?`<small class="r">${8-r}</small>`:""}${dr===7?`<small class="f">${"abcdefgh"[f]}</small>`:""}</button>`}
 if(A.pr){const c=g.turn;h+=`<div class="an-pr"><div>${[5,4,3,2].map(t=>`<button type="button" data-anpr="${t}" aria-label="${["","","At","Fil","Kale","Vezir"][t]}"><img src="${chPimg(c|t)}" alt=""></button>`).join("")}</div></div>`}
 return h+arrow()}
function moves(){let h="";for(let i=0;i<A.moves.length;i++){if(i%2===0)h+=`<i>${Math.floor(i/2)+1}.</i>`;h+=`<button type="button" data-anp="${i+1}" class="${A.ply===i+1?"on":""}">${esc(A.moves[i].s)}</button>`}return h||`<i>Bir taşa dokun, sonra gideceği kareye dokun.</i>`}
function paint(part){if(!L||!A)return;const q=s=>L.querySelector(s);if(part!=="ev"){q("#anBd").innerHTML=board();q("#anMv").innerHTML=moves();const on=q("#anMv .on");if(on)on.scrollIntoView({block:"nearest",inline:"center"});
  q('[data-an="first"]').disabled=q('[data-an="prev"]').disabled=A.ply===0;q('[data-an="next"]').disabled=q('[data-an="last"]').disabled=A.ply>=A.moves.length}
 else{const b=q("#anBd"),old=b.querySelector(".an-ar");if(old)old.remove();b.insertAdjacentHTML("beforeend",arrow())}
 q("#anIn").innerHTML=info();q("#anEv").textContent=evTxt();q("#anBar").style.width=evPct().toFixed(1)+"%";q('[data-an="best"]').disabled=!A.ev||!A.ev.u||!!over()}
function think(){const my=++seq;A.ev=null;if(over()){A.ev={u:null,sc:A.legal.length?0:A.chk?(A.g.turn?1:-1)*CC.MATE:0};return paint("ev")}paint("ev");const turn=A.g.turn;
 engineRun(CC.toFen(A.g),{depth:7,time:1500}).then(r=>{if(my!==seq||!A||!L)return;A.ev={u:r.u,sc:turn?-r.score:r.score};paint("ev")}).catch(()=>{})}
function play(m){const s=CC.san(A.g,m,"tr"),e=CC.san(A.g,m,"en");A.moves.length=A.ply;A.moves.push({u:CC.uci(m),s,e});A.ply++;rebuild();paint();think();try{CSND&&CSND.play&&settings.chessSound!==false&&CSND.play(m.c?"capture":"move")}catch(_){}}
function go(p){p=Math.max(0,Math.min(A.moves.length,p));if(p===A.ply)return;A.ply=p;rebuild();paint();think()}
function tap(s){if(A.pr)return;const g=A.g,p=g.b[s];const hit=A.tg.filter(m=>m.t===s);
 if(hit.length){if(hit.length>1){A.pr=hit;return paint()}return play(hit[0])}
 if(p&&((p&8)===g.turn)){A.sel=s;A.tg=A.legal.filter(m=>m.f===s)}else{A.sel=-1;A.tg=[]}paint()}
function pgn(){let t=A.start!==CC.START?`[SetUp "1"]\n[FEN "${A.start}"]\n\n`:"";const g0=CC.fromFen(A.start);let n=g0.full||1,blk=g0.turn===8;for(let i=0;i<A.moves.length;i++){if(!blk)t+=n+". ";else if(i===0)t+=n+"... ";t+=A.moves[i].e+" ";if(blk)n++;blk=!blk}return t.trim()}
function okFen(f){try{const g=CC.fromFen(f);if(g.k[0]<0||g.k[1]<0)return null;let wk=0,bk=0;for(const p of g.b){if(p===6)wk++;if(p===14)bk++}if(wk!==1||bk!==1)return null;const them=g.turn^8;if(CC.attacked(g,g.k[them>>3],g.turn))return null;CC.legal(g);return CC.toFen(g)}catch(e){return null}}
function fenSheet(){const cur=CC.toFen(A.g);const l=sheet("anfen","Konum",`<div class="an-fen"><div><small class="muted">Şu anki konum (FEN)</small><textarea class="in" id="anFc" readonly>${esc(cur)}</textarea></div><button class="btn sm ghost" type="button" id="anFcp">Kopyala</button>
 <div><small class="muted">Başka bir konum kur: FEN yapıştır</small><textarea class="in" id="anFi" placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" autocomplete="off" spellcheck="false"></textarea></div>
 <button class="btn" type="button" id="anFs">Konumu kur</button><button class="btn sm ghost" type="button" id="anF0">Başlangıç konumuna dön</button></div>`);
 l.querySelector("#anFcp").onclick=()=>copyText(cur,"Konum kopyalandı");
 const set=f=>{A.start=f;A.moves=[];A.ply=0;rebuild();closeLayer("anfen");paint();think()};
 l.querySelector("#anFs").onclick=()=>{const f=okFen(l.querySelector("#anFi").value.trim());if(!f)return toast("Bu konum geçersiz. FEN'i kontrol et.");set(f)};
 l.querySelector("#anF0").onclick=()=>set(CC.START)}
function click(e){const b=e.target.closest("button");if(!b||!A)return;const d=b.dataset;
 if(d.ans!=null)return tap(+d.ans);if(d.anpr){const m=A.pr.find(x=>(x.pr&7)===+d.anpr)||A.pr[0];A.pr=null;return play(m)}if(d.anp)return go(+d.anp);
 const a=d.an;if(!a)return;if(a==="x")return closeLayer("analiz");if(a==="flip"){A.flip=!A.flip;return paint()}if(a==="first")return go(0);if(a==="prev")return go(A.ply-1);if(a==="next")return go(A.ply+1);if(a==="last")return go(A.moves.length);
 if(a==="best"){const m=A.ev&&A.ev.u&&CC.fromUci(A.g,A.ev.u);if(m)play(m);return}if(a==="fen")return fenSheet();if(a==="pgn"){if(!A.moves.length)return toast("Henüz hamle yok");return copyText(pgn(),"Hamleler kopyalandı")}}
function key(e){if(!L||!A||e.target.closest("textarea,input"))return;const top=document.querySelector("#overlay>[data-layer]:last-child");if(top&&top!==L)return;if(e.key==="ArrowLeft"){e.preventDefault();go(A.ply-1)}else if(e.key==="ArrowRight"){e.preventDefault();go(A.ply+1)}}
function open(o){o=o||{};css();if(L){const old=L;L=null;seq++;document.removeEventListener("keydown",key);try{closeLayer("analiz")}catch(e){}if(old.isConnected)old.remove()}A={start:CC.START,moves:[],ply:0,flip:!!o.flip,sel:-1,tg:[],ev:null,pr:null};if(o.fen){const f=okFen(o.fen);if(f)A.start=f}
 if(Array.isArray(o.moves)){const g=CC.fromFen(A.start);for(const u of o.moves){const m=CC.fromUci(g,String(u));if(!m)break;A.moves.push({u:CC.uci(m),s:CC.san(g,m,"tr"),e:CC.san(g,m,"en")});CC.make(g,m)}A.ply=A.moves.length}
 rebuild();const bw=Math.floor(Math.min(innerWidth,560)-24),bh=Math.floor(innerHeight-330);const w=Math.max(220,Math.min(bw,bh,520));
 const html=`<div class="an" style="--bw:${w}px" role="dialog" aria-label="Analiz tahtası"><div class="an-h"><button type="button" data-an="x" aria-label="Kapat">${I("back")}</button><h1>Analiz tahtası</h1><button type="button" data-an="flip" aria-label="Tahtayı çevir">${I("rotate")}</button></div>
 <div class="an-b"><div class="an-ev"><div class="an-bar"><i id="anBar"></i></div><b id="anEv">…</b></div><div class="an-bd" id="anBd"></div><div class="an-in" id="anIn" aria-live="polite"></div><div class="an-mv" id="anMv"></div>
 <div class="an-bt"><button type="button" data-an="first" aria-label="Başa dön">${DBL("m12 6-6 6 6 6M18 6l-6 6 6 6")}</button><button type="button" data-an="prev" aria-label="Bir hamle geri">${I("prev")}</button><button type="button" data-an="next" aria-label="Bir hamle ileri">${I("next")}</button><button type="button" data-an="last" aria-label="Sona git">${DBL("m6 6 6 6-6 6M12 6l6 6-6 6")}</button></div>
 <div class="an-ac"><button type="button" class="pri" data-an="best">En iyiyi oyna</button><button type="button" data-an="fen">Konum</button><button type="button" data-an="pgn">Hamleleri kopyala</button></div></div></div>`;
 const me=openLayer("analiz",html,{noScrim:true,onClose:()=>{if(L!==me)return;seq++;A=null;L=null;document.removeEventListener("keydown",key)}});L=me;L.addEventListener("click",click);document.addEventListener("keydown",key);paint();think()}
window.ANALIZ={open,_s:()=>A,_go:go,_tap:tap,_pgn:pgn,_okFen:okFen};
})();
