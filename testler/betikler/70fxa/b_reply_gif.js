/* Hata: bir mesaja "Yanıtla" deyip GIF / çıkartma / şarkı / tek seferlik fotoğraf gönderince gönderilen yanıt olmuyordu,
   yanıt çubuğu açık kalıyor ve sonra yazılan ilgisiz mesaj yanıt sayılıyordu. */
const L=require('./lib.js');const {ok}=L;
(async()=>{const A=await L.open();const p=A.page;await L.seed(p);
 await p.evaluate(()=>go("chat",{key:"u:u2"}));await p.waitForTimeout(700);
 const GIF="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
 for(const [name,pay] of [["gif",{gif:{u:GIF,w:100,h:100}}],["stk",{stk:{u:GIF,w:220,h:220}}],["mus",{mus:{u:"it:5",t:"Şarkı",p:"https://audio.apple.com/a.m4a",a:null,e:0,s:0}}]]){
  await p.evaluate(()=>{S.replyTo={mid:"m1",from:"u2",text:"selam"};drawReply()});
  await p.evaluate(pay=>sendMessage(S.route.params.key,pay),pay);await p.waitForTimeout(400);
  const r=await p.evaluate(n=>{const m=[...S.msgs].reverse().find(x=>x[n]);return{reply:m&&m.reply&&m.reply.mid,bar:!!document.querySelector("#replyBar .replybar"),rt:!!S.replyTo}},name);
  ok(r.reply==="m1"&&!r.bar&&!r.rt,name+" yanıt olarak gitti, yanıt çubuğu kapandı "+JSON.stringify(r))}
 /* tek seferlik fotoğraf */
 await p.evaluate(()=>{S.replyTo={mid:"m1",from:"u2",text:"selam"};drawReply();window.pickImage=async()=>{const c=document.createElement("canvas");c.width=50;c.height=50;c.getContext("2d").fillRect(0,0,50,50);const im=new Image();im.src=c.toDataURL();await im.decode();return{img:im,src:im.src}}});
 await p.evaluate(()=>onceSend());await p.waitForTimeout(500);
 let r=await p.evaluate(()=>{const m=[...S.msgs].reverse().find(x=>x.once);return{reply:m&&m.reply&&m.reply.mid,rt:!!S.replyTo}});ok(r.reply==="m1"&&!r.rt,"tek seferlik fotoğraf da yanıt "+JSON.stringify(r));
 /* yanıt yokken etkilenmez, sistem notu yanıtı çalmaz */
 await p.evaluate(()=>{S.replyTo={mid:"m1",from:"u2",text:"selam"};drawReply()});
 await p.evaluate(()=>sendMessage(S.route.params.key,{text:"tema değişti",sys:"theme"}));await p.waitForTimeout(300);
 r=await p.evaluate(()=>({sys:!!(S.msgs.find(x=>x.sys==="theme")||{}).reply,rt:!!S.replyTo}));ok(!r.sys&&r.rt,"sistem notu yanıtı almaz "+JSON.stringify(r));
 await L.done(A)})();
