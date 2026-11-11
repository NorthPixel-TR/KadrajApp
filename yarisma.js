/* Kadraj Bilgi Yarışması (7.1.12). İlk kullanımda yüklenir (app.js bölge 7112: qzLoad/qzGo, Oyunlar penceresinde data-gm="qz", sohbette m.qz davet düğmesi).
   window.YARISMA = {open(), join(kod), _t}. Kadraj'ın genel adlarını doğrudan kullanır (openLayer, closeLayer, esc, I, toast, LS, S, DB, write, dialog, copyText).
   İki kip:
   - Rota'ya karşı: yalnızca cihazda, Rota ve Clawd (bot) ile 10 soru. Firebase'e hiçbir şey yazılmaz.
   - Arkadaşlarla: oda games/qz-<KOD> = {qz:1,host,seats:[uid…≤8],names:{uid:ad},st:lobby|play|over,s:JSON,an:{uid:{g,q,a,ms}},gone:{uid:1},at}.
     s (yalnızca kurucu yazar) = {g: oyun no, qs:[[soru, sıra]…10], qi: soru no, ph: "q" soru | "r" cevap, sc:{uid:puan}, last:{uid:{a,p}}}.
     Herkes kendi cevabını an.<uid> alanına yazar (soru başına bir yazma); kurucu herkes cevaplayınca ya da süre bitince cevabı açar (ph "r"),
     4 sn sonra sonraki soruya geçer. Süre her cihazda soru o cihaza geldiği andan sayılır (saat farkı önemsiz), kurucu 1,5 sn pay bırakır.
     Tek canlı dinleyici yalnızca odadayken (watchDoc), çıkınca kapanır. players alanı yok: satranç dinleyicisine düşmez. Kural değişikliği yok.
   Puan: doğru cevap 500 + hıza göre en çok 500 (10 sn'de 0'a iner). Yanlış ya da boş 0. En iyi skor ve galibiyet LS kadraj_qz_<uid>. */
(function(){"use strict";
/* Sorular: "Kategori|Soru", doğru, yanlış, yanlış, yanlış. Seçenek sırası her soruda karışır. */
const Q=[
["Türkiye|Türkiye'nin başkenti neresidir?","Ankara","İstanbul","İzmir","Bursa"],
["Türkiye|Türkiye'nin en yüksek dağı hangisidir?","Ağrı Dağı","Erciyes","Uludağ","Kaçkar"],
["Türkiye|Türkiye'nin en büyük gölü hangisidir?","Van Gölü","Tuz Gölü","Beyşehir Gölü","Eğirdir Gölü"],
["Türkiye|Kaynağı ve döküldüğü yer Türkiye'de olan en uzun nehir hangisidir?","Kızılırmak","Sakarya","Yeşilırmak","Büyük Menderes"],
["Türkiye|Türkiye kaç coğrafi bölgeye ayrılır?","7","5","6","8"],
["Türkiye|Türkiye'de kaç il vardır?","81","79","80","82"],
["Türkiye|Peri bacalarıyla ünlü bölge hangisidir?","Kapadokya","Pamukkale","Efes","Nemrut"],
["Türkiye|Pamukkale travertenleri hangi ildedir?","Denizli","Muğla","Aydın","Antalya"],
["Türkiye|İstanbul Boğazı hangi iki denizi birbirine bağlar?","Karadeniz ve Marmara","Ege ve Akdeniz","Marmara ve Ege","Karadeniz ve Ege"],
["Türkiye|Nemrut Dağı'ndaki dev heykeller hangi ildedir?","Adıyaman","Malatya","Şanlıurfa","Diyarbakır"],
["Türkiye|Göbeklitepe hangi ildedir?","Şanlıurfa","Mardin","Gaziantep","Konya"],
["Türkiye|Sümela Manastırı hangi ildedir?","Trabzon","Rize","Artvin","Giresun"],
["Türkiye|Plaka kodu 35 olan il hangisidir?","İzmir","Bursa","Antalya","Adana"],
["Türkiye|Plaka kodu 06 olan il hangisidir?","Ankara","Antalya","Artvin","Aydın"],
["Türkiye|Yüzölçümü en büyük ilimiz hangisidir?","Konya","Sivas","Ankara","Erzurum"],
["Türkiye|Fındık üretimiyle en çok tanınan bölgemiz hangisidir?","Karadeniz","Ege","Akdeniz","İç Anadolu"],
["Türkiye|Kırkpınar Yağlı Güreşleri hangi ilde yapılır?","Edirne","Kırklareli","Tekirdağ","Bursa"],
["Türkiye|Selimiye Camii hangi ildedir?","Edirne","İstanbul","Konya","Bursa"],
["Türkiye|Türkiye'nin para birimi nedir?","Türk lirası","Kuruş","Mecidiye","Akçe"],
["Türkiye|Mevlana Müzesi hangi ildedir?","Konya","Karaman","Aksaray","Kayseri"],
["Türkiye|Efes Antik Kenti hangi ildedir?","İzmir","Aydın","Muğla","Manisa"],
["Türkiye|Türkiye'nin en kalabalık şehri hangisidir?","İstanbul","Ankara","İzmir","Bursa"],
["Türkiye|Hangi il Ege Denizi kıyısındadır?","İzmir","Konya","Samsun","Mersin"],
["Türkiye|Türk bayrağındaki ay ve yıldız ne renktir?","Beyaz","Sarı","Kırmızı","Mavi"],
["Tarih|Türkiye Cumhuriyeti hangi yıl ilan edildi?","1923","1920","1919","1938"],
["Tarih|TBMM hangi tarihte açıldı?","23 Nisan 1920","29 Ekim 1923","19 Mayıs 1919","30 Ağustos 1922"],
["Tarih|Mustafa Kemal Samsun'a hangi tarihte çıktı?","19 Mayıs 1919","23 Nisan 1920","29 Ekim 1923","9 Eylül 1922"],
["Tarih|İstanbul hangi yıl fethedildi?","1453","1071","1299","1517"],
["Tarih|İstanbul'u fetheden padişah kimdir?","Fatih Sultan Mehmet","Yavuz Sultan Selim","Kanuni Sultan Süleyman","Orhan Bey"],
["Tarih|Malazgirt Savaşı hangi yıl yapıldı?","1071","1453","1176","1299"],
["Tarih|Osmanlı Devleti'nin kurucusu kimdir?","Osman Bey","Orhan Bey","Ertuğrul Gazi","I. Murat"],
["Tarih|İstiklal Marşı'nın şairi kimdir?","Mehmet Akif Ersoy","Namık Kemal","Ziya Gökalp","Tevfik Fikret"],
["Tarih|İstiklal Marşı'nın bestecisi kimdir?","Osman Zeki Üngör","Itri","Cemal Reşit Rey","Ahmet Adnan Saygun"],
["Tarih|Türkiye Cumhuriyeti'nin ilk cumhurbaşkanı kimdir?","Mustafa Kemal Atatürk","İsmet İnönü","Celal Bayar","Fevzi Çakmak"],
["Tarih|Harf Devrimi hangi yıl yapıldı?","1928","1923","1934","1938"],
["Tarih|Soyadı Kanunu hangi yıl kabul edildi?","1934","1923","1928","1940"],
["Tarih|30 Ağustos hangi bayramdır?","Zafer Bayramı","Cumhuriyet Bayramı","Gençlik ve Spor Bayramı","Ulusal Egemenlik ve Çocuk Bayramı"],
["Tarih|Çanakkale Kara Savaşları hangi yıl yapıldı?","1915","1912","1919","1922"],
["Tarih|Mimar Sinan'ın \"ustalık eserim\" dediği cami hangisidir?","Selimiye Camii","Süleymaniye Camii","Şehzade Camii","Sultanahmet Camii"],
["Tarih|Lozan Antlaşması hangi yıl imzalandı?","1923","1920","1918","1926"],
["Tarih|Atatürk hangi şehirde doğdu?","Selanik","İstanbul","Manastır","Sofya"],
["Tarih|En uzun süre tahtta kalan Osmanlı padişahı kimdir?","Kanuni Sultan Süleyman","Fatih Sultan Mehmet","II. Abdülhamit","IV. Mehmet"],
["Tarih|Türkiye'nin ilk kadın savaş pilotu kimdir?","Sabiha Gökçen","Halide Edib","Nene Hatun","Afet İnan"],
["Tarih|Türkiye'de kadınlara milletvekili seçme ve seçilme hakkı hangi yıl verildi?","1934","1923","1946","1950"],
["Bilim|Suyun kimyasal formülü nedir?","H2O","CO2","O2","NaCl"],
["Bilim|Deniz seviyesinde su kaç derecede kaynar?","100 °C","90 °C","80 °C","120 °C"],
["Bilim|Güneş Sistemi'ndeki en büyük gezegen hangisidir?","Jüpiter","Satürn","Dünya","Neptün"],
["Bilim|Güneş'e en yakın gezegen hangisidir?","Merkür","Venüs","Mars","Dünya"],
["Bilim|\"Kızıl gezegen\" diye bilinen gezegen hangisidir?","Mars","Venüs","Jüpiter","Merkür"],
["Bilim|Görkemli halkalarıyla ünlü gezegen hangisidir?","Satürn","Mars","Merkür","Venüs"],
["Bilim|İnsan vücudunun en büyük organı hangisidir?","Deri","Karaciğer","Akciğer","Beyin"],
["Bilim|Yetişkin bir insanda kaç kemik vardır?","206","186","226","256"],
["Bilim|Bitkiler fotosentez yaparken havadan hangi gazı alır?","Karbondioksit","Oksijen","Azot","Helyum"],
["Bilim|Havanın büyük kısmını hangi gaz oluşturur?","Azot","Oksijen","Karbondioksit","Hidrojen"],
["Bilim|Işığın boşluktaki hızı saniyede yaklaşık kaç kilometredir?","300.000","30.000","3.000","3.000.000"],
["Bilim|İnsan kalbi kaç odacıklıdır?","4","2","3","5"],
["Bilim|Altının kimyasal simgesi nedir?","Au","Ag","Al","At"],
["Bilim|Demirin kimyasal simgesi nedir?","Fe","De","Ir","Dm"],
["Bilim|Ses hangi ortamda yayılamaz?","Boşlukta","Suda","Havada","Demirde"],
["Bilim|İzafiyet (görelilik) kuramıyla tanınan bilim insanı kimdir?","Albert Einstein","Isaac Newton","Galileo Galilei","Nikola Tesla"],
["Bilim|pH değeri 7 olan madde nasıldır?","Nötr","Asidik","Bazik","Tuzlu"],
["Bilim|Dünya kendi ekseni etrafında bir turunu yaklaşık kaç saatte tamamlar?","24","12","48","365"],
["Bilim|Ay'a ayak basan ilk insan kimdir?","Neil Armstrong","Yuri Gagarin","Buzz Aldrin","Michael Collins"],
["Bilim|Periyodik tablonun ilk elementi hangisidir?","Hidrojen","Helyum","Oksijen","Karbon"],
["Bilim|Bilinen en sert doğal madde hangisidir?","Elmas","Granit","Demir","Kuvars"],
["Bilim|Mıknatıs hangisini çekmez?","Bakır","Demir","Nikel","Kobalt"],
["Bilim|Gökkuşağında kaç renk vardır?","7","5","6","9"],
["Bilim|Dünya'nın doğal uydusu hangisidir?","Ay","Phobos","Titan","Europa"],
["Bilim|Aziz Sancar Nobel Ödülü'nü hangi alanda aldı?","Kimya","Fizik","Tıp","Barış"],
["Bilim|Su kaç derecede donar?","0 °C","10 °C","-10 °C","4 °C"],
["Bilim|Kanı vücuda pompalayan organ hangisidir?","Kalp","Akciğer","Böbrek","Mide"],
["Matematik|Bir üçgenin iç açılarının toplamı kaç derecedir?","180","90","270","360"],
["Matematik|7 × 8 kaçtır?","56","54","48","64"],
["Matematik|Bir düzine kaç tanedir?","12","10","6","20"],
["Matematik|Hangisi asal sayıdır?","13","9","15","21"],
["Matematik|2'nin 10. kuvveti kaçtır?","1024","512","2048","100"],
["Matematik|Pi sayısı yaklaşık kaçtır?","3,14","2,71","1,61","3,41"],
["Matematik|144'ün karekökü kaçtır?","12","14","11","16"],
["Matematik|Bir saatte kaç saniye vardır?","3600","600","360","6000"],
["Matematik|Romen rakamıyla X kaçtır?","10","5","50","100"],
["Matematik|Altıgenin kaç kenarı vardır?","6","5","7","8"],
["Matematik|60'ın %25'i kaçtır?","15","25","20","12"],
["Matematik|Bir karenin kaç simetri ekseni vardır?","4","2","1","8"],
["Matematik|Bir yüzyıl kaç yıldır?","100","10","1000","50"],
["Matematik|9 × 9 kaçtır?","81","72","99","89"],
["Dünya|Dünyanın en büyük okyanusu hangisidir?","Büyük Okyanus (Pasifik)","Atlas Okyanusu","Hint Okyanusu","Arktik Okyanusu"],
["Dünya|Dünyanın en yüksek dağı hangisidir?","Everest","K2","Kilimanjaro","Mont Blanc"],
["Dünya|Dünyanın en büyük sıcak çölü hangisidir?","Sahra","Gobi","Kalahari","Atacama"],
["Dünya|Japonya'nın başkenti neresidir?","Tokyo","Kyoto","Osaka","Seul"],
["Dünya|Kanada'nın başkenti neresidir?","Ottawa","Toronto","Vancouver","Montreal"],
["Dünya|Avustralya'nın başkenti neresidir?","Kanberra","Sidney","Melbourne","Perth"],
["Dünya|Büyük piramitler hangi ülkededir?","Mısır","Meksika","Irak","Sudan"],
["Dünya|Yüzölçümü en büyük ülke hangisidir?","Rusya","Kanada","Çin","ABD"],
["Dünya|Dünyada kaç kıta vardır?","7","5","6","8"],
["Dünya|Big Ben saat kulesi hangi şehirdedir?","Londra","Paris","Dublin","Edinburg"],
["Dünya|Brezilya'nın resmi dili nedir?","Portekizce","İspanyolca","Brezilyaca","Fransızca"],
["Dünya|Venedik hangi ülkededir?","İtalya","Yunanistan","Hırvatistan","İspanya"],
["Dünya|Almanya'nın başkenti neresidir?","Berlin","Münih","Frankfurt","Hamburg"],
["Dünya|Eyfel Kulesi hangi şehirdedir?","Paris","Lyon","Brüksel","Roma"],
["Dünya|İspanya'nın başkenti neresidir?","Madrid","Barselona","Sevilla","Lizbon"],
["Dünya|Azerbaycan'ın başkenti neresidir?","Bakü","Gence","Tiflis","Erivan"],
["Dünya|Kangurusuyla ünlü ülke hangisidir?","Avustralya","Yeni Zelanda","Güney Afrika","Arjantin"],
["Spor|Bir futbol takımı sahada kaç oyuncuyla oynar?","11","10","9","12"],
["Spor|Basketbolda bir takım sahada kaç oyuncuyla oynar?","5","6","7","4"],
["Spor|Voleybolda bir takım sahada kaç oyuncuyla oynar?","6","5","7","8"],
["Spor|Olimpiyat bayrağında kaç halka vardır?","5","4","6","7"],
["Spor|Satrançta her oyuncu oyuna kaç taşla başlar?","16","12","18","20"],
["Spor|Satrançta yalnızca çapraz giden taş hangisidir?","Fil","Kale","At","Vezir"],
["Spor|Wimbledon tenis turnuvası hangi ülkede yapılır?","İngiltere","Fransa","ABD","Avustralya"],
["Spor|Maraton koşusu yaklaşık kaç kilometredir?","42","21","50","30"],
["Spor|Bir futbol maçının normal süresi kaç dakikadır?","90","80","100","60"],
["Spor|Türkiye 2002 Dünya Kupası'nı kaçıncı sırada bitirdi?","Üçüncü","İkinci","Dördüncü","Birinci"],
["Spor|Satrançta \"L\" biçiminde hareket eden taş hangisidir?","At","Fil","Kale","Piyon"],
["Spor|Basketbolda çizginin dışından atılan başarılı atış kaç sayıdır?","3","2","4","1"],
["Sanat|Mona Lisa tablosunun ressamı kimdir?","Leonardo da Vinci","Michelangelo","Raffaello","Picasso"],
["Sanat|\"Yıldızlı Gece\" tablosunun ressamı kimdir?","Vincent van Gogh","Claude Monet","Salvador Dali","Rembrandt"],
["Sanat|Nasreddin Hoca'nın bindiği hayvan hangisidir?","Eşek","At","Deve","Katır"],
["Sanat|\"Çalıkuşu\" romanının yazarı kimdir?","Reşat Nuri Güntekin","Halide Edib Adıvar","Ömer Seyfettin","Yakup Kadri"],
["Sanat|\"Kuyucaklı Yusuf\" romanının yazarı kimdir?","Sabahattin Ali","Orhan Kemal","Yaşar Kemal","Kemal Tahir"],
["Sanat|\"İnce Memed\" romanının yazarı kimdir?","Yaşar Kemal","Orhan Pamuk","Aziz Nesin","Sait Faik"],
["Sanat|Gölge oyununda Karagöz'ün arkadaşı kimdir?","Hacivat","Kavuklu","Pişekar","Keloğlan"],
["Sanat|Standart bir piyanoda kaç tuş vardır?","88","66","76","100"],
["Sanat|Do, re, mi notalarından sonra hangi nota gelir?","Fa","Sol","La","Si"],
["Sanat|\"Hamlet\" oyununun yazarı kimdir?","William Shakespeare","Molière","Goethe","Dante"],
["Sanat|\"Sefiller\" romanının yazarı kimdir?","Victor Hugo","Charles Dickens","Lev Tolstoy","Balzac"],
["Sanat|\"Don Kişot\" romanının yazarı kimdir?","Cervantes","Dante","Homeros","Kafka"],
["Sanat|Orhan Pamuk Nobel Ödülü'nü hangi alanda aldı?","Edebiyat","Barış","Fizik","Ekonomi"],
["Sanat|Ressam Osman Hamdi Bey'in ünlü tablosu hangisidir?","Kaplumbağa Terbiyecisi","Çığlık","İnci Küpeli Kız","Son Akşam Yemeği"],
["Dil|Türk alfabesinde kaç harf vardır?","29","26","28","31"],
["Dil|Hangisi bir ünlü (sesli) harftir?","Ö","Ş","Ğ","Ç"],
["Dil|\"Siyah\" kelimesinin eş anlamlısı hangisidir?","Kara","Ak","Boz","Al"],
["Dil|\"Ak\" kelimesinin zıt anlamlısı hangisidir?","Kara","Beyaz","Temiz","Açık"],
["Dil|\"Etekleri zil çalmak\" deyimi ne anlama gelir?","Çok sevinmek","Çok korkmak","Telaşlanmak","Utanmak"],
["Dil|\"Göz atmak\" deyimi ne anlama gelir?","Kısaca bakmak","Uyumak","Kızmak","Ağlamak"],
["Dil|\"Kulak misafiri olmak\" ne demektir?","İstemeden duymak","Konuk gitmek","Sağır olmak","Şarkı dinlemek"],
["Dil|\"Hızlı\" kelimesinin zıt anlamlısı hangisidir?","Yavaş","Çabuk","Seri","Tez"],
["Teknoloji|1 bayt kaç bittir?","8","4","16","10"],
["Teknoloji|Bilgisayarın beyni olarak bilinen parça hangisidir?","İşlemci","Ekran","Klavye","Fare"],
["Teknoloji|Klavyedeki en uzun tuş hangisidir?","Boşluk tuşu","Enter","Shift","Sil"],
["Teknoloji|\"www\" kısaltmasının açılımı nedir?","World Wide Web","World Web Wide","Wide World Web","Web World Wide"],
["Teknoloji|Wi-Fi ne işe yarar?","Kablosuz internet bağlantısı","Telefon şarjı","Fotoğraf düzenleme","Ses kaydı"],
["Teknoloji|Fotoğraf makinesinde içeri giren ışığın açıklığını ayarlayan parçaya ne denir?","Diyafram","Deklanşör","Vizör","Flaş"],
["Doğa|Dünyanın en büyük hayvanı hangisidir?","Mavi balina","Fil","Zürafa","Köpek balığı"],
["Doğa|En hızlı kara hayvanı hangisidir?","Çita","Aslan","At","Ceylan"],
["Doğa|Örümceklerin kaç bacağı vardır?","8","6","10","12"],
["Doğa|Böceklerin kaç bacağı vardır?","6","4","8","10"],
["Doğa|Kurbağanın yavrusuna ne denir?","İribaş","Tırtıl","Larva","Kozacık"],
["Doğa|Uçabilen tek memeli hayvan hangisidir?","Yarasa","Uçan sincap","Penguen","Kartal"],
["Doğa|Arılar çiçeklerden topladıklarıyla ne üretir?","Bal","Süt","İpek","Reçine"],
["Doğa|Penguenlerin en çok yaşadığı kıta hangisidir?","Antarktika","Avrupa","Asya","Kuzey Amerika"],
["Doğa|İpek böceği hangi ağacın yaprağıyla beslenir?","Dut","Çam","Meşe","Kavak"],
["Doğa|Zürafanın en dikkat çeken özelliği nedir?","Uzun boynu","Hortumu","Kabuğu","Yelesi"],
["Genel|Artık yılda şubat ayı kaç gündür?","29","28","30","31"],
["Genel|Artık olmayan bir yıl kaç gündür?","365","366","360","364"],
["Genel|Bir haftada kaç saat vardır?","168","144","148","172"],
["Genel|Trafik ışığında \"geç\" anlamındaki renk hangisidir?","Yeşil","Sarı","Kırmızı","Mavi"],
["Genel|Acil durumlarda Türkiye'de hangi numara aranır?","112","155","110","177"],
["Genel|Satranç tahtasında kaç kare vardır?","64","49","81","100"],
["Genel|Kırmızı ve sarı karıştırılınca hangi renk olur?","Turuncu","Yeşil","Mor","Kahverengi"],
["Genel|Mavi ve sarı karıştırılınca hangi renk olur?","Yeşil","Turuncu","Mor","Gri"],
];
let TQ=10000,TR=4200;const N=10,MAXP=8,CAT={Türkiye:"#DC2626",Tarih:"#B45309",Bilim:"#0891B2",Matematik:"#7C3AED",Dünya:"#2563EB",Spor:"#16A34A",Sanat:"#DB2777",Dil:"#EA580C",Teknoloji:"#4F46E5",Doğa:"#15803D",Genel:"#475569"};
const LET=["A","B","C","D"],OPC=["#E11D48","#2563EB","#D97706","#059669"];
const rnd=n=>Math.floor(Math.random()*n),shuf=a=>{for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
const rp=c=>"games/qz-"+c,myNm=()=>{const p=(S.profiles||{})[S.uid]||{};return String(p.name||p.username||"Oyuncu").slice(0,20)};
const stK=()=>"kadraj_qz_"+(S.uid||"x"),st=()=>LS.get(stK(),{})||{};
function pick(){/* son oyunlarda çıkan soruları bir süre tekrar sorma (cihazda) */const o=st(),seen=new Set(o.seen||[]);let pool=Q.map((_,i)=>i).filter(i=>!seen.has(i));if(pool.length<N)pool=Q.map((_,i)=>i);
 const qs=shuf(pool).slice(0,N).map(i=>[i,shuf([0,1,2,3])]);o.seen=(o.seen||[]).concat(qs.map(x=>x[0])).slice(-Math.min(90,Q.length-N));LS.set(stK(),o);return qs}
const qOf=x=>{const q=Q[x[0]],[cat,txt]=q[0].split("|");return{cat,txt,opts:x[1].map(k=>q[1+k]),ok:x[1].indexOf(0)}};
const ptsOf=(ok,ms)=>ok?500+Math.round(500*Math.max(0,1-(ms||0)/TQ)):0;

let L=null,R=null,run=0;/* L katman, R oda durumu {c (null = Rota'ya karşı), d, un, solo, shown, t0, mine, hk, ht:[]} */
const CSS=`.qz{position:absolute;inset:0;margin:0 auto;max-width:560px;background:#14123A;color:#F4F3FF;pointer-events:auto;display:flex;flex-direction:column;padding-block:env(safe-area-inset-top,0px) env(safe-area-inset-bottom,0px);font-family:var(--f-body);animation:up .25s ease;user-select:none;-webkit-user-select:none}
.qz.qz-re{animation:none}.qz-h{display:flex;align-items:center;gap:8px;padding:10px 12px}.qz-h h1{margin:0;font:800 1.05rem var(--f-display);flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.qz-h button{width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.1);display:grid;place-items:center;color:#fff;flex:none}.qz-h button svg{width:20px;height:20px}
.qz-b{flex:1;min-height:0;overflow-y:auto;padding:4px 14px 18px;display:flex;flex-direction:column;gap:12px}
.qz-hero{display:grid;justify-items:center;gap:6px;padding:18px 8px 6px;text-align:center}.qz-hero svg{width:64px;height:64px}.qz-hero h2{margin:0;font:900 1.5rem var(--f-display)}.qz-hero p{margin:0;color:#B9B6E8;font-size:.9rem}
.qz-m{display:grid;grid-template-columns:52px 1fr;gap:2px 12px;align-items:center;text-align:left;padding:14px;border-radius:18px;background:rgba(255,255,255,.07);color:#fff;width:100%}.qz-m i{grid-row:span 2;width:52px;height:52px;border-radius:14px;display:grid;place-items:center;background:var(--c);font:900 1.3rem var(--f-display);font-style:normal}.qz-m i svg{width:26px;height:26px}.qz-m b{font:800 1rem var(--f-display)}.qz-m small{color:#B9B6E8;font-size:.82rem}
.qz-join{grid-template-columns:52px minmax(0,1fr) auto}.qz-in{min-width:0;width:100%;font:800 1.1rem var(--f-mono);letter-spacing:.2em;text-transform:uppercase;background:rgba(255,255,255,.1);color:#fff;border:0;border-radius:10px;padding:8px 10px;resize:none}
.qz-btn{padding:11px 18px;border-radius:14px;background:#FF8A4C;color:#2A1305;font-weight:800;font-size:.95rem}.qz-btn.sec{background:rgba(255,255,255,.12);color:#fff}.qz-btn:disabled{opacity:.4}
.qz-row{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}.qz-st{font-size:.86rem;color:#B9B6E8;text-align:center;min-height:1.3em;margin:0}.qz-st b{color:#fff}
.qz-code{display:grid;justify-items:center;gap:6px;padding:16px;border-radius:18px;background:rgba(255,255,255,.07)}.qz-code small{color:#B9B6E8}.qz-code b{font:900 2.2rem var(--f-mono);letter-spacing:.18em}
.qz-pl{display:grid;grid-template-columns:1fr 1fr;gap:8px}.qz-p{min-width:0;padding:8px 10px;border-radius:12px;background:rgba(255,255,255,.06);font-size:.78rem;color:#B9B6E8}.qz-p b{display:block;color:#fff;font-size:.88rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.qz-p.on{background:rgba(255,138,76,.2)}
.qz-top{display:flex;align-items:center;gap:8px;font-size:.82rem;color:#B9B6E8}.qz-cat{padding:3px 9px;border-radius:99px;background:var(--c);color:#fff;font-weight:800;font-size:.74rem}.qz-top .qz-n{margin-left:auto;font-weight:800;color:#fff}
.qz-bar{height:8px;border-radius:99px;background:rgba(255,255,255,.12);overflow:hidden}.qz-bar i{display:block;height:100%;width:100%;background:#FF8A4C;border-radius:inherit;transform-origin:left;transform:scaleX(var(--s,1));transition:transform var(--d,0s) linear}
.qz-q{margin:4px 0;font:800 1.22rem/1.35 var(--f-display);text-align:center;min-height:3.4em;display:grid;place-items:center;overflow-wrap:anywhere}
.qz-o{display:grid;grid-template-columns:1fr 1fr;gap:10px}.qz-o button{min-height:84px;padding:10px 10px 10px 40px;border-radius:16px;background:var(--c);color:#fff;font-weight:800;font-size:.95rem;line-height:1.25;text-align:left;position:relative;overflow-wrap:anywhere;box-shadow:0 4px 0 rgba(0,0,0,.25);transition:transform .12s,opacity .2s,box-shadow .2s}
.qz-o button:active{transform:translateY(2px)}.qz-o button em{position:absolute;left:10px;top:10px;width:22px;height:22px;border-radius:7px;background:rgba(255,255,255,.25);display:grid;place-items:center;font:900 .78rem var(--f-display);font-style:normal}
.qz-o button.me{box-shadow:0 0 0 3px #fff,0 4px 0 rgba(0,0,0,.25)}.qz-o button.dim{opacity:.35}.qz-o button.ok{box-shadow:0 0 0 3px #FDE68A,0 4px 0 rgba(0,0,0,.25)}.qz-o button.ok::after{content:"";position:absolute;right:10px;top:10px;width:18px;height:18px;border-radius:50%;background:#FDE68A url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2314123A' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12.5l4.5 4.5L19 7.5'/%3E%3C/svg%3E") center/12px no-repeat}
.qz-o button:disabled{cursor:default}.qz-who{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;font-size:.76rem}.qz-who span{padding:3px 9px;border-radius:99px;background:rgba(255,255,255,.08);color:#B9B6E8}.qz-who span.d{background:rgba(52,211,153,.22);color:#fff}
.qz-res{text-align:center;font:900 1.35rem var(--f-display);margin:2px 0}.qz-res.ok{color:#FDE68A}.qz-res.no{color:#FCA5A5}.qz-res small{display:block;font:600 .82rem var(--f-body);color:#B9B6E8;margin-top:2px}
.qz-sb{display:grid;gap:6px}.qz-sr{display:grid;grid-template-columns:28px minmax(0,1fr) auto auto;align-items:center;gap:8px;padding:8px 12px;border-radius:12px;background:rgba(255,255,255,.06)}.qz-sr.me{background:rgba(255,138,76,.2)}.qz-sr .r{font:900 .95rem var(--f-display);color:#B9B6E8}.qz-sr b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.qz-sr .s{font:800 .95rem var(--f-mono)}.qz-sr .g{font:800 .78rem var(--f-mono);color:#6EE7B7;min-width:3.2em;text-align:right}
.qz-pod{display:flex;align-items:flex-end;justify-content:center;gap:8px;padding:12px 0 2px}.qz-pod>div{flex:1;max-width:120px;min-width:0;display:grid;justify-items:center;gap:4px;text-align:center}.qz-pod b{font-size:.86rem;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.qz-pod small{font:800 .78rem var(--f-mono);color:#B9B6E8}
.qz-pod i{display:grid;place-items:end center;width:100%;border-radius:12px 12px 4px 4px;background:var(--c);font:900 1.4rem var(--f-display);font-style:normal;padding-bottom:6px;transform-origin:bottom;animation:qzUp .6s cubic-bezier(.2,.9,.3,1.2) both}.qz-pod svg{width:26px;height:26px;color:#FDE68A}
@keyframes qzUp{from{transform:scaleY(.1);opacity:0}}
@keyframes qzIn{from{transform:translateY(12px);opacity:0}}.qz-anim{animation:qzIn .35s ease both}.qz-anim2{animation:qzIn .35s .08s ease both}
@media (max-width:360px){.qz-o button{min-height:74px;font-size:.88rem}.qz-q{font-size:1.08rem}}
@media (prefers-reduced-motion:reduce){.qz,.qz-anim,.qz-anim2,.qz-pod i{animation:none}.qz-bar i,.qz-o button{transition:none}}`;
const ICO={bulb:'<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="27" r="17" fill="#FF8A4C"/><path d="M24 44h16v6a4 4 0 0 1-4 4h-8a4 4 0 0 1-4-4z" fill="#B9B6E8"/><path d="M26 27a6 6 0 0 1 6-6" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/><path d="M32 2v4M10 10l3 3M54 10l-3 3M4 27h4M56 27h4" stroke="#FDE68A" stroke-width="3" stroke-linecap="round"/></svg>',
 crown:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/></svg>',bot:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="7" width="16" height="12" rx="4"/><path d="M12 3v4M9 13h.01M15 13h.01"/></svg>',
 users:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6"/></svg>'};
function css(){if(document.getElementById("qzCss"))return;const s=document.createElement("style");s.id="qzCss";s.textContent=CSS;document.head.appendChild(s)}
function shell(title,body,top){const h=`<div class="qz${L&&L.isConnected?" qz-re":""}" role="dialog" aria-label="${esc(title)}"><div class="qz-h"><button type="button" data-qz="${top?"x":"menu"}" aria-label="Geri">${I("back")}</button><h1>${esc(title)}</h1></div><div class="qz-b" id="qzB">${body}</div></div>`;
 if(!L||!L.isConnected){L=openLayer("yarisma",h,{noScrim:true,onClose:()=>{leave();L=null}});
  L._guard=()=>{if(R&&R.d&&R.d.st==="play"){dialog("Yarışmadan çıkılsın mı?",R.solo?"Bu yarışma yarıda kalır.":"Odadan çıkarsın, puanın kalır ama yarışamazsın.",[{label:"Vazgeç",cls:"sec"},{label:"Çık",cls:"danger",fn:()=>menu()}]);return true}if(R){menu();return true}return false};
  L.addEventListener("click",onClick)}else L.innerHTML=h}
function onClick(e){const b=e.target.closest("[data-qz]");if(!b||b.disabled)return;const a=b.dataset.qz;
 if(a==="x")return closeLayer("yarisma");if(a==="menu"){if(L._guard())return;return closeLayer("yarisma")}
 if(a==="solo")return solo();if(a==="make")return make();if(a==="join")return join();if(a==="go")return start();if(a==="copy")return share();if(a==="chat")return chatInvite();if(a==="again")return R&&R.solo?solo():start();if(a==="leave")return menu();
 if(a.startsWith("a:"))return answer(+a.slice(2))}
function menu(){leave();const o=st();
 shell("Bilgi Yarışması",`<div class="qz-hero qz-anim">${ICO.bulb}<h2>Bilgi Yarışması</h2><p>10 soru, her biri 10 saniye. Doğru ve hızlı olan kazanır.</p></div>
 <button class="qz-m qz-anim" type="button" data-qz="solo" style="--c:#4F46E5"><i>${ICO.bot}</i><b>Rota'ya karşı</b><small>Rota ve Clawd ile hemen başla</small></button>
 <button class="qz-m qz-anim2" type="button" data-qz="make" style="--c:#FF8A4C"><i>+</i><b>Oda kur</b><small>Kodu arkadaşlarına gönder, en çok ${MAXP} kişi</small></button>
 <div class="qz-m qz-join qz-anim2" style="--c:#2563EB"><i>#</i><b>Kodla katıl</b><button class="qz-btn" type="button" data-qz="join" style="grid-row:span 2">Katıl</button><textarea class="qz-in k1l" id="qzCode" rows="1" maxlength="5" placeholder="KOD" autocomplete="off" spellcheck="false"></textarea></div>
 <p class="qz-st">${o.best?`En iyi puanın <b>${o.best}</b> · ${o.games||0} yarışma, ${o.wins||0} birincilik`:`Toplam ${Q.length} soru: Türkiye, tarih, bilim, spor, sanat ve daha fazlası.`}</p>`,1);
 const t=L.querySelector("#qzCode");if(t)t.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();join()}})}
/* ---------- oda ---------- */
function code(){const A="ABCDEFGHJKLMNPRSTUVYZ23456789";let c="";for(let i=0;i<5;i++)c+=A[rnd(A.length)];return c}
function clearT(){if(R&&R.ht){for(const t of R.ht)clearTimeout(t);R.ht=[]}}
function leave(){run++;if(!R)return;clearT();const r=R;R=null;if(r.un)try{r.un()}catch(e){}if(r.solo||!r.c)return;const d=r.d;
 try{if(d&&d.host===S.uid)write(()=>DB.update(rp(r.c),{st:"over",s:"",at:Date.now()}),{quiet:true});else if(d)write(()=>DB.update(rp(r.c),{gone:{[S.uid]:1},...(d.st==="lobby"?{seats:(d.seats||[]).filter(u=>u!==S.uid)}:{})}),{quiet:true})}catch(e){}}
function put(patch){if(!R)return;if(R.solo){const d=R.d;for(const k in patch){if(k==="an"){d.an=d.an||{};Object.assign(d.an,patch.an)}else d[k]=patch[k]}const my=run;setTimeout(()=>{if(my===run&&R&&R.solo)onDoc(JSON.parse(JSON.stringify(d)))},0);return}
 const c=R.c;write(()=>DB.update(rp(c),patch),{quiet:true})}
async function make(){if(!S.uid||S.guest)return toast("Arkadaşlarla yarışmak için giriş yap.");if(typeof guard==="function"&&!guard())return;leave();const c=code(),d={qz:1,host:S.uid,seats:[S.uid],names:{[S.uid]:myNm()},st:"lobby",s:"",an:{},gone:{},at:Date.now()};
 if(!await write(()=>DB.set(rp(c),d)))return;watch(c)}
async function join(c0){if(!S.uid||S.guest)return toast("Arkadaşlarla yarışmak için giriş yap.");const el=L&&L.querySelector("#qzCode"),c=String(c0||el&&el.value||"").toUpperCase().replace(/[^A-Z0-9]/g,"");if(c.length!==5)return toast("Kod 5 harf olmalı.");
 for(let t=0;t<3;t++){let d=null;try{d=await DB.get(rp(c))}catch(e){}if(!d||!d.qz)return toast("Bu kodla yarışma odası yok.");
  if((d.seats||[]).includes(S.uid)&&!(d.gone||{})[S.uid])return watch(c);if(d.st==="over"&&!d.s)return toast("Bu oda kapanmış.");if(d.st!=="lobby")return toast("Bu odada yarışma başlamış, bitince yeniden dene.");if((d.seats||[]).length>=MAXP)return toast("Oda dolu.");
  if(!await write(()=>DB.update(rp(c),{seats:[...(d.seats||[]).filter(u=>u!==S.uid),S.uid],names:{[S.uid]:myNm()},gone:{[S.uid]:0}})))return;
  try{const e=await DB.get(rp(c));if(e&&(e.seats||[]).includes(S.uid))return watch(c)}catch(e){}}
 toast("Odaya girilemedi, yeniden dene.")}
function watch(c){leave();const my=++run;R={c,d:null,un:null,solo:false,ht:[]};R.un=DB.watchDoc(rp(c),d=>{if(my===run&&R&&R.c===c)onDoc(d)})}
function solo(){leave();const me=S.uid||"me",d={qz:1,host:me,seats:[me,"bot:rota","bot:clawd"],names:{[me]:myNm(),"bot:rota":"Rota","bot:clawd":"Clawd"},st:"lobby",s:"",an:{},gone:{},at:Date.now()};
 ++run;R={c:null,d,solo:true,ht:[]};start()}
function start(){if(!R||!R.d)return;const d=R.d,me=S.uid||"me";if(d.host!==me)return;const seats=(d.seats||[]).filter(u=>!(d.gone||{})[u]);if(!R.solo&&seats.length<2)return toast("En az bir arkadaşın katılınca başlatabilirsin.");
 let old={};try{old=JSON.parse(d.s||"{}")||{}}catch(e){}const sc={};for(const u of seats)sc[u]=0;
 put({st:"play",s:JSON.stringify({g:(old.g||0)+1,qs:pick(),qi:0,ph:"q",sc,last:{}}),at:Date.now()})}
function share(){const t="Kadraj'da Bilgi Yarışması! Oyunlar › Bilgi Yarışması › Kodla katıl: "+(R&&R.c||"");try{if(navigator.share)return navigator.share({text:t}).catch(()=>{})}catch(e){}copyText(t,"Kod kopyalandı")}
function chatInvite(){if(!R||!R.c)return;const c=R.c;const ch=Object.entries(S.chats||{}).filter(([id,x])=>x&&(x.members||[]).includes(S.uid)&&id!=="meydan").sort((a,b)=>(b[1].updatedAt||0)-(a[1].updatedAt||0)).slice(0,20);
 const rows=ch.map(([id,x])=>{let key,nm;if(x.group){key="g:"+id;nm=x.name||"Grup"}else{const o=(x.members||[]).find(u=>u!==S.uid);if(!o)return"";key="u:"+o;const p=(S.profiles||{})[o]||{};nm=p.name||p.username||"Kişi"}return`<button class="opt" type="button" data-qzk="${esc(key)}">${esc(nm)}</button>`}).join("");
 const l=sheet("qzinv","Sohbette davet et",rows||`<p class="muted" style="padding:8px 4px">Henüz sohbetin yok. Kodu paylaşabilirsin.</p>`);
 l.addEventListener("click",async e=>{const b=e.target.closest("[data-qzk]");if(!b)return;closeLayer("qzinv");const ok=await sendMessage(b.dataset.qzk,{text:"Bilgi yarışmasına gel! Kod: "+c,qz:c});if(ok)toast("Davet gönderildi")})}
/* ---------- çizim ---------- */
function stOf(d){try{return JSON.parse(d.s||"null")}catch(e){return null}}
function onDoc(d){if(!R)return;const me=S.uid||"me";R.d=d;
 if(!d||(d.st==="over"&&!d.s)){toast(R.solo?"Yarışma bitti.":"Oda kapandı.");return menu()}
 if(!(d.seats||[]).includes(me)||(d.gone||{})[me]){toast("Bu odada yerin yok.");return menu()}
 if(d.st==="lobby")return lobby(d);const s=stOf(d);if(!s||!s.qs)return;
 const key=s.g+":"+s.qi+":"+s.ph+":"+d.st;
 if(key!==R.shown){R.shown=key;clearT();if(d.st==="over")over(d,s);else if(s.ph==="q"){R.t0=performance.now();R.late=0;const a=(d.an||{})[me];R.mine=a&&a.g===s.g&&a.q===s.qi?a.a:null;question(d,s)}else reveal(d,s)}
 else if(s.ph==="q"&&d.st==="play")whoPaint(d,s);
 if(d.host===me)hostTick(d,s)}
function players(d){const g=d.gone||{};return(d.seats||[]).filter(u=>!g[u])}
function lobby(d){const me=S.uid,host=d.host===me,seats=d.seats||[],g=d.gone||{};R.shown="lobby";
 shell("Bilgi Yarışması · Oda",`<div class="qz-code"><small>Oda kodu</small><b>${esc(R.c||"")}</b><div class="qz-row"><button class="qz-btn sec" type="button" data-qz="copy">Kodu paylaş</button><button class="qz-btn sec" type="button" data-qz="chat">Sohbette davet et</button></div></div>
 <div class="qz-pl">${seats.filter(u=>!g[u]).map(u=>`<div class="qz-p ${u===me?"on":""}"><b>${esc((d.names||{})[u]||"Oyuncu")}</b>${u===d.host?"kurucu":u===me?"sen":"hazır"}</div>`).join("")}</div>
 ${host?`<div class="qz-row"><button class="qz-btn" type="button" data-qz="go" ${players(d).length<2?"disabled":""}>Yarışmayı başlat</button></div><p class="qz-st">${players(d).length<2?"Arkadaşların koda katılınca başlatabilirsin.":"Herkes hazırsa başlat."}</p>`:`<p class="qz-st">Kurucunun başlatması bekleniyor…</p>`}`)}
function head(s,q){return`<div class="qz-top"><span class="qz-cat" style="--c:${CAT[q.cat]||"#475569"}">${esc(q.cat)}</span><span class="qz-n">Soru ${s.qi+1}/${s.qs.length}</span></div>`}
function opts(q,mark){return`<div class="qz-o">${q.opts.map((t,i)=>`<button type="button" data-qz="a:${i}" style="--c:${OPC[i]}" class="${mark?mark(i):""}" ${mark?"disabled":""}><em>${LET[i]}</em>${esc(t)}</button>`).join("")}</div>`}
function question(d,s){const q=qOf(s.qs[s.qi]),done=R.mine!=null;
 shell(R.solo?"Rota'ya karşı":"Bilgi Yarışması",`${head(s,q)}<div class="qz-bar"><i id="qzBar"></i></div><div class="qz-q qz-anim">${esc(q.txt)}</div>
 ${opts(q,done?i=>i===R.mine?"me":"dim":null)}<p class="qz-st" id="qzMsg">${done?"Cevabın alındı. Diğerleri bekleniyor…":""}</p><div class="qz-who" id="qzWho"></div>`);
 const bar=L.querySelector("#qzBar");if(bar){bar.style.setProperty("--s","1");void bar.offsetWidth;requestAnimationFrame(()=>{bar.style.setProperty("--d",TQ/1000+"s");bar.style.setProperty("--s","0")})}
 whoPaint(d,s);const my=run;R.ht.push(setTimeout(()=>{if(my!==run||!R||R.mine!=null)return;R.late=1;for(const b of L.querySelectorAll(".qz-o button")){b.disabled=true;b.classList.add("dim")}const m=L.querySelector("#qzMsg");if(m)m.textContent="Süre doldu."},TQ))}
function whoPaint(d,s){const el=L&&L.querySelector("#qzWho");if(!el)return;const an=d.an||{};
 el.innerHTML=players(d).map(u=>{const a=an[u],dn=a&&a.g===s.g&&a.q===s.qi;return`<span class="${dn?"d":""}">${esc((d.names||{})[u]||"Oyuncu")}</span>`}).join("")}
function answer(i){if(!R||!R.d||R.d.st!=="play"||R.mine!=null||R.late)return;const s=stOf(R.d);if(!s||s.ph!=="q")return;const ms=Math.round(performance.now()-R.t0);if(ms>TQ)return;
 R.mine=i;const me=S.uid||"me";try{vib&&vib(12)}catch(e){}
 for(const b of L.querySelectorAll(".qz-o button")){const k=+b.dataset.qz.slice(2);b.disabled=true;b.classList.add(k===i?"me":"dim")}const m=L.querySelector("#qzMsg");if(m)m.textContent="Cevabın alındı. Diğerleri bekleniyor…";
 put({an:{[me]:{g:s.g,q:s.qi,a:i,ms}}})}
function board(d,s,gain){const me=S.uid||"me",ps=players(d).slice().sort((a,b)=>((s.sc||{})[b]||0)-((s.sc||{})[a]||0));
 return`<div class="qz-sb">${ps.map((u,k)=>`<div class="qz-sr ${u===me?"me":""} qz-anim" style="animation-delay:${Math.min(k,6)*40}ms"><span class="r">${k+1}</span><b>${esc((d.names||{})[u]||"Oyuncu")}</b>${gain?`<span class="g">${((s.last||{})[u]||{}).p?"+"+s.last[u].p:""}</span>`:"<span></span>"}<span class="s">${(s.sc||{})[u]||0}</span></div>`).join("")}</div>`}
function reveal(d,s){const me=S.uid||"me",q=qOf(s.qs[s.qi]),l=(s.last||{})[me]||{},mine=l.a==null?(R.mine==null?-1:R.mine):l.a,ok=mine===q.ok;
 shell(R.solo?"Rota'ya karşı":"Bilgi Yarışması",`${head(s,q)}<div class="qz-q">${esc(q.txt)}</div>${opts(q,i=>(i===q.ok?"ok ":"dim ")+(i===mine?"me":""))}
 <div class="qz-res ${ok?"ok":"no"} qz-anim">${ok?"Doğru! +"+(l.p||0):mine<0?"Cevap vermedin":"Yanlış"}<small>${ok?"":"Doğru cevap: "+esc(q.opts[q.ok])}</small></div>${board(d,s,1)}`)}
function over(d,s){const me=S.uid||"me",ps=players(d).slice().sort((a,b)=>((s.sc||{})[b]||0)-((s.sc||{})[a]||0)),host=d.host===me;
 const k=R.saved===s.g;if(!k){R.saved=s.g;const o=st(),my=(s.sc||{})[me]||0;o.games=(o.games||0)+1;if(ps[0]===me&&my>0)o.wins=(o.wins||0)+1;if(my>(o.best||0))o.best=my;LS.set(stK(),o)}
 const pod=[ps[1],ps[0],ps[2]].map((u,j)=>u?`<div><b>${esc((d.names||{})[u]||"Oyuncu")}</b><small>${(s.sc||{})[u]||0}</small><i style="--c:${["#94A3B8","#FF8A4C","#B45309"][j]};height:${[70,100,52][j]}px;animation-delay:${[200,0,350][j]}ms">${j===1?ICO.crown:[2,1,3][j]}</i></div>`:"").join("");
 const w=ps[0]===me;shell("Sonuçlar",`<div class="qz-hero qz-anim"><h2>${w?"Birinci oldun!":esc((d.names||{})[ps[0]]||"Oyuncu")+" kazandı"}</h2><p>Puanın ${(s.sc||{})[me]||0}${st().best?" · en iyi "+st().best:""}</p></div><div class="qz-pod">${pod}</div>${board(d,s,0)}
 <div class="qz-row">${R.solo||host?`<button class="qz-btn" type="button" data-qz="again">Yeniden oyna</button>`:""}<button class="qz-btn sec" type="button" data-qz="leave">Çık</button></div>${!R.solo&&!host?`<p class="qz-st">Yeni yarışmayı odayı kuran başlatır.</p>`:""}`);
 if(w&&typeof gunConfetti==="function"&&!(typeof kbReduce==="function"&&kbReduce()))try{gunConfetti()}catch(e){}}
/* ---------- kurucu ---------- */
function hostTick(d,s){if(d.st!=="play"||!R)return;const hk=s.g+":"+s.qi+":"+s.ph;const my=run;
 if(s.ph==="q"){const an=d.an||{},all=players(d).every(u=>{const a=an[u];return a&&a.g===s.g&&a.q===s.qi});
  if(R.solo&&R.hk!==hk){/* botlar: Rota daha bilgili, Clawd daha hızlı */for(const [u,acc,lo,hi] of [["bot:rota",.72,2600,8200],["bot:clawd",.55,1500,6000]]){if(!(d.seats||[]).includes(u))continue;const ms=Math.round((lo+rnd(hi-lo))*TQ/10000),q=qOf(s.qs[s.qi]),a=Math.random()<acc?q.ok:(q.ok+1+rnd(3))%4;
    R.ht.push(setTimeout(()=>{if(my===run&&R&&R.shown===s.g+":"+s.qi+":q:play")put({an:{[u]:{g:s.g,q:s.qi,a,ms}}})},ms))}}
  if(R.hk!==hk){R.hk=hk;R.hq=performance.now();R.ht.push(setTimeout(()=>{if(my===run&&R)doReveal(s.g,s.qi)},TQ+(R.solo?300:1500)))}
  if(all)R.ht.push(setTimeout(()=>{if(my===run&&R)doReveal(s.g,s.qi)},R.solo?700:400))}
 else if(s.ph==="r"&&R.hk!==hk){R.hk=hk;R.ht.push(setTimeout(()=>{if(my===run&&R)doNext(s.g,s.qi)},TR))}}
function doReveal(g,qi){const d=R&&R.d,s=d&&stOf(d);if(!s||s.g!==g||s.qi!==qi||s.ph!=="q"||d.st!=="play")return;const q=qOf(s.qs[qi]),an=d.an||{},sc=Object.assign({},s.sc),last={};
 for(const u of players(d)){const a=an[u],ok=a&&a.g===g&&a.q===qi;const p=ok?ptsOf(a.a===q.ok,a.ms):0;sc[u]=(sc[u]||0)+p;last[u]={a:ok?a.a:-1,p}}
 put({s:JSON.stringify(Object.assign({},s,{ph:"r",sc,last})),at:Date.now()})}
function doNext(g,qi){const d=R&&R.d,s=d&&stOf(d);if(!s||s.g!==g||s.qi!==qi||s.ph!=="r")return;
 if(qi+1>=s.qs.length)return put({st:"over",s:JSON.stringify(Object.assign({},s,{ph:"end"})),at:Date.now()});
 put({s:JSON.stringify(Object.assign({},s,{qi:qi+1,ph:"q",last:{}})),at:Date.now()})}
window.YARISMA={open(){css();menu()},join(c){css();if(!L||!L.isConnected)menu();join(c)},_t:{Q,qOf,ptsOf,pick,R:()=>R,N,set(o){if(o.TQ)TQ=o.TQ;if(o.TR)TR=o.TR}}};
})();
