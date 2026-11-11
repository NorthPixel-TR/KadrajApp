// 7.1.10 simge üretici: node icons.js <depo klasörü>  → icon-192/512, icon-maskable-512, badge-96
const {chromium}=require('playwright');const D=process.argv[2]||'/home/user/kadrajapp';
const MARK=(k)=>`<g stroke="${k}" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M8 5.2v13.6"/><path d="M8 14.6 16 8"/><path d="M11.3 11.9 16.8 18.8"/></g>`;
const ICON=(rx,sc)=>`<svg xmlns="http://www.w3.org/2000/svg" width="SZ" height="SZ" viewBox="0 0 24 24"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3730A3"/><stop offset="1" stop-color="#7C3AED"/></linearGradient><radialGradient id="o"><stop offset="0" stop-color="#FFB37F" stop-opacity=".9"/><stop offset="1" stop-color="#FF8A4C" stop-opacity="0"/></radialGradient></defs>
<rect width="24" height="24" rx="${rx}" fill="url(#g)"/><g transform="translate(12 12) scale(${sc}) translate(-12 -12)">
<g stroke="#fff" stroke-opacity=".16" stroke-width=".22"><path d="M8 2.5v19M16 2.5v19M2.5 8h19M2.5 16h19"/></g>
<rect x="3.2" y="3.2" width="17.6" height="17.6" rx="3.6" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".35"/>${MARK("#fff")}
<circle cx="16" cy="8" r="3.4" fill="url(#o)"/><circle cx="16" cy="8" r="2.15" fill="#FF8A4C"/></g></svg>`;
const BADGE=`<svg xmlns="http://www.w3.org/2000/svg" width="SZ" height="SZ" viewBox="0 0 24 24">${MARK("#fff")}<circle cx="16" cy="8" r="2.3" fill="#fff"/></svg>`;
(async()=>{const b=await chromium.launch();const p=await b.newPage();
 for(const [f,sz,svg,bg] of [["icon-192.png",192,ICON(0,1),1],["icon-512.png",512,ICON(0,1),1],["icon-maskable-512.png",512,ICON(0,.8),1],["badge-96.png",96,BADGE,0]]){
  await p.setViewportSize({width:sz,height:sz});await p.setContent(`<html><body style="margin:0;background:transparent">${svg.replace(/SZ/g,sz)}</body></html>`);
  await p.screenshot({path:D+'/'+f,omitBackground:!bg,clip:{x:0,y:0,width:sz,height:sz}});console.log(f)}
 await b.close()})();
