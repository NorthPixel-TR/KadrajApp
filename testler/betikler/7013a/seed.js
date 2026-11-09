/* ortak içerik tohumu (profil/medya probları) */
const px=(c,w=10,h=10)=>`data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${c}"/></svg>`)}`;
async function seed(p){await p.evaluate(async(c)=>{const T=Date.now();
  await DB.set("posts/pm1",{uid:"u2",at:T-6e4,kind:"photo",caption:"üç fotoğraf #deneme @bilal",loc:"Çok uzun bir konum adı burada yazıyor, Kadıköy, İstanbul, Türkiye",src:c[0],more:[c[1],c[2]],ar:"1/1",css:""});
  await DB.set("posts/pn1",{uid:"u3",at:T-12e4,kind:"note",text:"Bir not",bg:0});
  await DB.set("posts/pp1",{uid:"u1",at:T-18e4,kind:"photo",caption:"benim",src:c[3],ar:"4/5"});
  await DB.set("posts/pc1",{uid:"u4",at:T-24e4,kind:"photo",caption:"kapsül",src:c[4],cap:T+864e5*3});
  await DB.set("meta/pm1",{likes:{u1:T-1000,u3:T-2000,u4:T-3000},comments:{c1:{uid:"u3",text:"güzel",at:T-5e4,likes:{}},c2:{uid:"u2",text:"@can sağol",at:T-4e4,re:"c1",likes:{}},c3:{uid:"u4",text:"harika",at:T-3e4,likes:{}}},votes:{},pin:"c3"});
 },[px("red",30,30),px("blue",30,30),px("green",30,30),px("gold",30,30),px("purple",30,30)]);await p.waitForTimeout(500)}
module.exports={seed,px};
