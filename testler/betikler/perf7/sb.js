const {open}=require('../m70/lib');
(async()=>{const {b,p,errors}=await open(390);
 const r=await p.evaluate(async()=>{const calls=[];const of=window.fetch;window.fetch=async(u,o)=>{if(String(u).includes("rpc/ping")){calls.push([u,o.headers.apikey?1:0]);return new Response("null",{status:200})}return of(u,o)};
  const om=S.mode;S.mode="cloud";window.SUPA=undefined;LS.del("kadraj_sbping");const ot=window.setTimeout;window.setTimeout=(f,ms)=>ot(f,ms===8000?10:ms);
  sbKeepAlive();await new Promise(r=>ot(r,1500));const first=calls.length;sbKeepAlive();await new Promise(r=>ot(r,500));S.mode=om;window.setTimeout=ot;return {first,after:calls.length,u:calls[0]&&calls[0][0],key:calls[0]&&calls[0][1],ls:!!LS.get("kadraj_sbping")}});
 console.log(JSON.stringify(r),"errors",errors.length);await b.close()})();
