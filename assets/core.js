/* =========================================================
   Core: state, helpers, router, frames, shared components
   ========================================================= */
const SV=3, LSK='ecomdemo-proto';
const DAY=864e5, HR=36e5, MIN=6e4;

function rng(seed){let s=0;for(const c of String(seed))s=(s*31+c.charCodeAt(0))>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
function orderId(seed){const r=rng(seed);const d=n=>Array.from({length:n},()=>Math.floor(r()*10)).join('');return `11${1+Math.floor(r()*4)}-${d(7)}-${d(7)}`}

function seed(){
  const now=Date.now();
  const products=P_RAW.map((a,i)=>{const [id,cat,seller,en,vi,price,list,rating,reviews,ph,brand,variants,bought,flag]=a;
    const r=rng(id);
    const p={id,cat,seller,en,vi,price,list,rating,reviews,ph,brand,variants:variants?variants.split(','):[],bought,flag:flag||null,
      stock:id==='k3'?4:id==='y3'?7:30+Math.floor(r()*220),sku:(brand||'GEN').replace(/[^A-Z]/gi,'').slice(0,3).toUpperCase()+'-'+id.toUpperCase()+'-'+(100+i),
      status:'active',created:now-(40+i*3)*DAY,weight:+(0.4+r()*5).toFixed(1),cost:+(price*(0.45+r()*0.15)).toFixed(2),upc:'8'+String(Math.floor(r()*1e11)).padStart(11,'0')};
    p.low30=+(price*(list?0.97:1)).toFixed(2);
    return p});
  const P_=id=>products.find(p=>p.id===id);
  const reviews=[];
  products.forEach(p=>{const r=rng(p.id+'rv');const n=p.flag?3:5;
    for(let i=0;i<n;i++){let st=p.rating>=4.7?(i<3?5:r()<.6?5:4):p.rating>=4.5?(i<2?5:r()<.5?4:3):(r()<.4?1:r()<.5?2:4);
      const T=REVIEW_TPL[st][Math.floor(r()*REVIEW_TPL[st].length)];
      reviews.push({id:p.id+'-r'+i,pid:p.id,name:REVIEWERS[Math.floor(r()*REVIEWERS.length)],stars:st,title:T[0],titleVi:T[1],text:T[2],textVi:T[3],days:2+Math.floor(r()*60),helpful:Math.floor(r()*40),verified:r()<.9,variant:p.variants[0]||'',lang:r()<.3?'vi':'en'})}});
  const me={name:'Linh Nguyen',addrIdx:0};
  const mk=(seedKey,buyer,buyerId,seller,items,status,ago,extra={})=>{
    const o={id:orderId(seedKey),checkout:'C'+seedKey,buyer,buyerId,seller,items:items.map(([pid,q,v])=>({pid,q,v:v??(P_(pid).variants[0]||''),price:P_(pid).price})),
      shipMethod:'standard',shipCost:0,promo:0,created:now-ago,status,carrier:null,tracking:null,log:[],returnReq:null,reviewed:{},pay:'Visa •••• 4242',...extra};
    const sub=o.items.reduce((a,i)=>a+i.price*i.q,0);o.shipCost=sub>=35?0:5.99;o.tax=+(sub*(buyer.tax||8)/100).toFixed(2);
    o.eta=addBiz(o.created,4);
    const L=[{t:o.created,k:'placed'}];
    if(['shipped','delivered','return_requested','refunded'].includes(status)){o.carrier=extra.carrier||'UPS Ground';o.tracking=extra.tracking||('1Z'+String(Math.floor(rng(seedKey+'t')()*1e14)).padStart(14,'0').slice(0,14));L.push({t:o.created+20*HR,k:'shipped'});L.push({t:o.created+44*HR,k:'transit'})}
    if(['delivered','return_requested','refunded'].includes(status)){L.push({t:o.created+70*HR,k:'delivered'});o.delivered=o.created+70*HR}
    if(status==='cancelled')L.push({t:o.created+2*HR,k:'cancelled'});
    o.log=L.reverse();return o};
  const A=ADDRESSES[0],OB=OTHER_BUYERS;
  const orders=[
    mk('m1',A,'me','s1',[['k1',1,'White']],'delivered',6*DAY),
    mk('m2',A,'me','s3',[['c1',2]],'shipped',1.2*DAY),
    mk('m3',A,'me','s2',[['b1',1],['b4',1]],'unshipped',3*HR),
    mk('m4',A,'me','s8',[['e3',1]],'delivered',21*DAY,{reviewed:{e3:true}}),
    mk('s1a',OB[0],null,'s1',[['k2',1]],'unshipped',35*MIN,{isNew:true}),
    mk('s1b',OB[1],null,'s1',[['k5',2]],'unshipped',4*HR),
    mk('s1c',OB[2],null,'s1',[['k1',1,'Black']],'unshipped',9*HR),
    mk('s1d',OB[3],null,'s1',[['k4',1]],'shipped',1.5*DAY,{carrier:'USPS Ground Advantage',tracking:'9400 1112 0228 4410 3381 07'}),
    mk('s1e',OB[4],null,'s1',[['k1',1]],'delivered',5*DAY),
    mk('s1f',OB[5],null,'s1',[['k2',1],['k5',1]],'delivered',9*DAY),
    mk('s1g',OB[2],null,'s1',[['k3',1]],'delivered',12*DAY),
    mk('s1h',OB[0],null,'s1',[['k2',1]],'return_requested',8*DAY),
    mk('s1i',OB[3],null,'s1',[['k5',1]],'cancelled',3*DAY,{cancelReason:'Buyer requested cancellation'}),
    mk('s9a',OB[1],null,'s9',[['x1',1,'9']],'delivered',10*DAY),
  ];
  const ret=orders.find(o=>o.checkout==='Cs1h');ret.returnReq={reason:'defective',comment:'Basket coating started peeling after the third use.',status:'requested',created:now-1.5*DAY,items:['k2'],method:'ups'};
  ret.log.unshift({t:now-1.5*DAY,k:'return_requested'});
  const s9o=orders.find(o=>o.checkout==='Cs9a');
  const claims=[{id:'AZ-20418',order:s9o.id,seller:'s9',buyer:'Emily Carter',reason:'Item not as described',detail:'Sneakers arrived with no box, logo is misspelled. Seller has not responded for 5 days.',amount:19.99,status:'open',created:now-2*DAY,sellerResp:null}];
  const apps=[
    {id:'APP-3307',legal:'Pho Real Foods LLC',store:'Pho Real Foods',entity:'LLC',state:'TX',ein:'**-***0912',rep:'Quang Ho',cat:'pantry',city:'Houston, TX',checks:{ein:'pass',id:'pass',bank:'pass',ofac:'pass',address:'pass'},risk:'Low',status:'pending',submitted:now-5*HR,skus:120},
    {id:'APP-3305',legal:'Kim Beauty Imports Inc.',store:'Kim Beauty',entity:'Corporation',state:'NJ',ein:'**-***4471',rep:'Jenny Kim',cat:'beauty',city:'Fort Lee, NJ',checks:{ein:'fail',id:'pass',bank:'pass',ofac:'pass',address:'review'},risk:'Medium',status:'pending',submitted:now-26*HR,skus:340},
  ];
  const flags=[
    {id:'FL-881',pid:'x1',reason:'Prohibited keyword: "replica"',src:'Automated keyword scan',sev:'High',status:'open',created:now-7*HR},
    {id:'FL-879',pid:'x2',reason:'List price $24.99 was never charged in the last 90 days',src:'Reference-price check',sev:'Medium',status:'open',created:now-20*HR},
  ];
  const questions=[
    {pid:'k1',q:'Does the inner pot have a non-stick coating that is PFOA-free?',a:'Yes, the coating is PFOA-free ceramic. You can also buy a stainless pot separately.',by:'Saigon Kitchen Co.',t:now-6*DAY},
    {pid:'k1',q:'Can it cook brown rice and porridge (cháo)?',a:'Yes, it has dedicated Brown Rice and Porridge programs.',by:'Saigon Kitchen Co.',t:now-12*DAY},
    {pid:'c1',q:'Is this good for a phin filter?',a:'Yes, the grind is medium-coarse, made for phin.',by:'Highland Roasters',t:now-4*DAY},
    {pid:'k2',q:'What is the wattage?',a:null,by:null,t:now-5*HR},
  ];
  const notifs=[
    {role:'seller',text:'New order from <b>Daniel Tran</b>: Air Fryer 5.8 Qt',t:now-35*MIN,read:false,link:['order',{id:orders.find(o=>o.checkout==='Cs1a').id}]},
    {role:'seller',text:'Return requested for order <b>'+ret.id+'</b>. Respond within 48 hours.',t:now-1.5*DAY,read:false,link:['returns',{}]},
    {role:'seller',text:'A customer asked a question about <b>Air Fryer 5.8 Qt</b>',t:now-5*HR,read:false,link:['feedback',{}]},
    {role:'admin',text:'2 seller applications waiting for review',t:now-5*HR,read:false,link:['sellers',{}]},
    {role:'admin',text:'A-to-z claim <b>AZ-20418</b> opened against BestDeal Outlet 88',t:now-2*DAY,read:false,link:['claims',{}]},
    {role:'admin',text:'2 listings flagged by automated checks',t:now-7*HR,read:true,link:['moderation',{}]},
  ];
  return {
    v:SV,lang:'en',theme:null,
    view:{role:'buyer',device:'desktop',ops:'seller'},
    fees:{cats:Object.fromEntries(CATS.map(c=>[c.id,c.fee])),procPct:2.9,procFixed:0.30,plan:29.99,updated:'Oct 1, 2026',freeShipMin:35,stdShip:5.99,expShip:9.99},
    content:{heroEn:'Holiday gifting, made easy',heroVi:'Quà tặng mùa lễ, thật dễ dàng',subEn:'Early deals from verified US businesses. Free shipping on orders over $35 per store.',subVi:'Ưu đãi sớm từ doanh nghiệp đã xác minh tại Mỹ. Miễn phí giao hàng cho đơn từ $35 mỗi cửa hàng.',ctaEn:'Shop early deals',ctaVi:'Xem ưu đãi',eyebrowEn:'Holiday early deals',eyebrowVi:'Ưu đãi lễ sớm'},
    products,reviews,orders,claims,apps,flags,questions,notifs,
    sellerOver:{},
    buyer:{signedIn:true,name:me.name,email:'linh.nguyen@example.com',addresses:ADDRESSES.map(a=>({...a})),addrIdx:0,
      cards:[{id:'c1',brand:'Visa',last4:'4242',exp:'08/28',name:'Linh Nguyen'},{id:'c2',brand:'Mastercard',last4:'5100',exp:'02/27',name:'Linh Nguyen'}],
      pay:'c1',cart:[{pid:'c2',v:'',q:1},{pid:'f1',v:'',q:2}],later:[],list:['b3','y2'],recent:['k1','c1'],promo:null},
    seller:{shop:'s1',onboard:{step:0,data:{},status:null},balance:4218.40,nextPayout:now+3*DAY,payouts:[{d:now-11*DAY,amt:6120.55},{d:now-25*DAY,amt:5480.10},{d:now-39*DAY,amt:4977.83}],
      settings:{handling:1,cutoff:'2:00 PM PT',returns:30,vacation:false,origin:'12552 Western Ave, Garden Grove, CA 92841'}},
    r:{buyer:{n:'home',p:{},h:[]},seller:{n:'dashboard',p:{},h:[]},admin:{n:'dashboard',p:{},h:[]}},
  };
}

let S;
try{S=JSON.parse(localStorage.getItem(LSK)||'null');if(!S||S.v!==SV)S=null}catch(e){S=null}
if(!S)S=seed();
const UI={ov:{},tmp:{},notif:null};
function save(){try{localStorage.setItem(LSK,JSON.stringify(S))}catch(e){}}
function resetDemo(){if(!confirm('Reset all demo data to the starting state?'))return;const v=S.view,lang=S.lang,theme=S.theme;S=seed();S.view=v;S.lang=lang;S.theme=theme;UI.ov={};UI.tmp={};save();mount();toast('Demo data reset')}

/* ---------- helpers ---------- */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const J=o=>esc(JSON.stringify(o));
const L=(en,vi)=>S.lang==='vi'&&vi!=null?vi:en;
const LOC=()=>S.lang==='vi'?'vi-VN':'en-US';
const money=n=>{n=+n||0;return(n<0?'-$':'$')+Math.abs(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})};
const moneyK=n=>n>=1e6?'$'+(n/1e6).toFixed(2)+'M':n>=1e3?'$'+(n/1e3).toFixed(1)+'K':money(n);
const num=n=>(+n||0).toLocaleString('en-US');
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d');
const P=id=>S.products.find(p=>p.id===id);
const SL=id=>{const s=SELLERS.find(x=>x.id===id)||(S.newSellers||[]).find(x=>x.id===id);if(!s)return null;const o=S.sellerOver[id];return o?{...s,...o}:s};
const CAT=id=>CATS.find(c=>c.id===id);
const pn=p=>S.lang==='vi'&&p.vi?p.vi:p.en;
const cn=c=>{const x=typeof c==='string'?CAT(c):c;return x?L(x.en,x.vi):''};
const pct=p=>p.list&&p.list>p.price?Math.round((1-p.price/p.list)*100):0;
const fmtDate=(t,o={weekday:'long',month:'long',day:'numeric'})=>new Date(t).toLocaleDateString(LOC(),o);
const shortDate=t=>new Date(t).toLocaleDateString(LOC(),{month:'short',day:'numeric',year:'numeric'});
const dayShort=t=>new Date(t).toLocaleDateString(LOC(),{weekday:'short',month:'short',day:'numeric'});
const ago=t=>{const m=Math.round((Date.now()-t)/MIN);if(m<1)return L('just now','vừa xong');if(m<60)return L(m+' min ago',m+' phút trước');const h=Math.round(m/60);if(h<24)return L(h+' hr ago',h+' giờ trước');const d=Math.round(h/24);return L(d+(d>1?' days ago':' day ago'),d+' ngày trước')};
function addBiz(t,n){const d=new Date(t);let k=0;while(k<n){d.setDate(d.getDate()+1);const w=d.getDay();if(w!==0&&w!==6)k++}return d.getTime()}
const visible=()=>S.products.filter(p=>p.status==='active'&&!(S.seller.settings.vacation&&p.seller===S.seller.shop));
function curAddr(){return S.buyer.addresses[S.buyer.addrIdx]||S.buyer.addresses[0]}
function cartCount(){return S.buyer.cart.reduce((a,c)=>a+c.q,0)}
function boughtTxt(n){if(!n)return'';const t=n>=1000?Math.floor(n/1000)+'K+':n+'+';return L(`${t} bought in past month`,`${t} lượt mua tháng qua`)}
function sellerName(id){const s=SL(id);return s?s.name:'—'}

/* ---------- icons ---------- */
const ICONS={
 home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
 cart:'<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.6 12.2a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 7H6"/>',
 bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
 back:'<path d="M15 18 9 12l6-6"/>',chev:'<path d="m9 18 6-6-6-6"/>',down:'<path d="m6 9 6 6 6-6"/>',
 menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
 check:'<path d="M20 6 9 17l-5-5"/>',x:'<path d="M18 6 6 18M6 6l12 12"/>',
 shield:'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
 truck:'<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',
 refresh:'<path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5"/>',
 heart:'<path d="M12 21s-7-4.5-9.3-9A5.3 5.3 0 0 1 12 6a5.3 5.3 0 0 1 9.3 6C19 16.5 12 21 12 21z"/>',
 filter:'<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',
 trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
 settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
 chart:'<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
 box:'<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
 tag:'<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
 wallet:'<path d="M3 7a2 2 0 0 1 2-2h13v4"/><path d="M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2z"/><circle cx="16" cy="14.5" r="1.3"/>',
 file:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
 users:'<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M22 20c0-3-2-5-5-5.4"/>',
 flag:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
 grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
 print:'<path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-2"/><path d="M6 14h12v7H6z"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 store:'<path d="M3 9 5 3h14l2 6M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0zM5 13v8h14v-8"/>',
 id:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2.2"/><path d="M5.5 16c.6-1.6 2-2.4 3.5-2.4s2.9.8 3.5 2.4M15 10h4M15 13h3"/>',
 return:'<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',
 pin:'<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
 bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
 camera:'<path d="M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="4"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
 alert:'<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
 eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
 moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
 map:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
 split:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16"/>',
 phone:'<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
 monitor:'<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
 send:'<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
 star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
 download:'<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
 upload:'<path d="M12 21V9M7 14l5-5 5 5M5 3h14"/>',
 logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
 lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
 scale:'<path d="M12 3v18M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0zM8 21h8"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
 card:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
 gift:'<rect x="3" y="8" width="18" height="13" rx="1"/><path d="M3 12h18M12 8v13M12 8S10 3 7.5 4 9 8 12 8zM12 8s2-5 4.5-4S15 8 12 8z"/>',
 help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01"/>',
 badge:'<path d="M12 2 9.5 4.5 6 4l-.5 3.5L3 10l1.8 3L3 16l2.5 1.5L6 21l3.5-.5L12 23l2.5-2.5L18 21l.5-3.5L21 16l-1.8-3L21 10l-2.5-2.5L18 4l-3.5.5z" transform="scale(.9) translate(1.3 0)"/><path d="m9 12 2 2 4-4"/>',
 list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
 mega:'<path d="M3 11v3l12 5V6L3 11zM15 8h2a4 4 0 0 1 0 8h-2M6 14l1 6h3l-1-5"/>',
 layers:'<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
 play:'<path d="M7 4v16l13-8z"/>',
 chat:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
 ext:'<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
};
const ic=(n,c='')=>`<svg class="ic ${c}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]||''}</svg>`;

/* ---------- images ---------- */
const uimg=(id,w=400,h)=>id?`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h||w}&q=70`:'';
function photos(p){return PH[p.ph]||[]}
function img(id,w=400,cls='',alt='',h){return `<span class="img ${cls}">${id?`<img src="${uimg(id,w,h)}" alt="${esc(alt)}" loading="lazy" decoding="async" onerror="this.remove()">`:''}</span>`}
function pimg(p,w=400,cls='',k=0){const ph=photos(p);return img(ph[k%Math.max(ph.length,1)],w,cls,pn(p))}
const mono=(s,cls='')=>`<span class="mono ${cls}" style="--h:${s.hue}">${esc(s.mono)}</span>`;

/* ---------- shared bits ---------- */
function stars(v,cls=''){return `<span class="stars ${cls}" style="--v:${v}" aria-label="${v} out of 5 stars"></span>`}
function priceHTML(n,cls='s'){const [w,c]=(+n).toFixed(2).split('.');return `<span class="price ${cls}" aria-label="${money(n)}"><span class="cur">$</span><span class="whole">${(+w).toLocaleString('en-US')}</span><span class="cts">.${c}</span></span>`}
function rateRow(p,short){return `<span class="rate">${short?`<b>${p.rating}</b>`:''}${stars(p.rating)}<span class="n">${num(p.reviews)}</span></span>`}
const STATUS={
 unshipped:['Not yet shipped','Chưa giao','warn'],shipped:['Shipped','Đang giao','info'],delivered:['Delivered','Đã giao','ok'],
 cancelled:['Cancelled','Đã hủy','gray'],return_requested:['Return requested','Đã yêu cầu trả hàng','warn'],refunded:['Refunded','Đã hoàn tiền','gray']};
const stTxt=s=>L(STATUS[s][0],STATUS[s][1]);
const stBdg=s=>`<span class="bdg ${STATUS[s][2]}">${stTxt(s)}</span>`;
const LOGTXT={placed:['Order placed','Đã đặt hàng'],shipped:['Shipped. Package handed to carrier','Đã giao cho đơn vị vận chuyển'],transit:['In transit','Đang vận chuyển'],out:['Out for delivery','Đang giao đến bạn'],delivered:['Delivered','Đã giao hàng'],cancelled:['Order cancelled','Đơn đã hủy'],return_requested:['Return requested','Đã yêu cầu trả hàng'],return_approved:['Return approved. Prepaid label issued','Đã duyệt trả hàng, đã cấp nhãn gửi miễn phí'],return_rejected:['Return declined by seller','Người bán từ chối trả hàng'],refunded:['Refund issued to original payment method','Đã hoàn tiền về phương thức thanh toán ban đầu'],claim:['A-to-z Guarantee claim filed','Đã gửi khiếu nại Bảo đảm A-Z']};
const subOf=o=>o.items.reduce((a,i)=>a+i.price*i.q,0);
const totalOf=o=>Math.max(0,subOf(o)+o.shipCost-(o.promo||0)+(o.tax||0));
function feeCalc(price,cat,qty=1){const f=S.fees;const gross=price*qty;const ref=gross*(f.cats[cat]??10)/100;const proc=gross?gross*f.procPct/100+f.procFixed:0;const total=ref+proc;return{gross,ref,proc,total,net:gross-total,pct:gross?total/gross*100:0,refPct:f.cats[cat]??10}}
function orderNet(o){const f=feeCalc(subOf(o)-(o.promo||0)+o.shipCost,P(o.items[0].pid).cat);return{net:f.net-(o.label||0),fee:f.total}}
function notify(role,text,link){S.notifs.unshift({role,text,t:Date.now(),read:false,link})}
function unread(role){return S.notifs.filter(n=>n.role===role&&!n.read).length}

/* ---------- router ---------- */
function go(role,n,p={},replace){const r=S.r[role];
  if(!replace&&!(r.n===n&&JSON.stringify(r.p)===JSON.stringify(p))){r.h.push({n:r.n,p:r.p});if(r.h.length>40)r.h.shift()}
  r.n=n;r.p=p;UI.ov[role]=null;UI.notif=null;
  if(!onStage(role)){if(role==='buyer')S.view.role='buyer';else if(S.view.device==='split')S.view.ops=role;else S.view.role=role;mount();return}
  render(role,true)}
function back(role){const r=S.r[role];const h=r.h.pop()||{n:role==='buyer'?'home':'dashboard',p:{}};r.n=h.n;r.p=h.p;UI.ov[role]=null;render(role,true)}
function setP(role,patch,top){Object.assign(S.r[role].p,patch);render(role,top)}
function framesOf(){const v=S.view;if(v.device==='split'&&!isSmall())return[{role:'buyer',dev:'mobile'},{role:v.ops,dev:'desktop'}];return[{role:v.role,dev:isSmall()?'mobile':v.device==='split'?'desktop':v.device}]}
function onStage(role){return framesOf().some(f=>f.role===role)}
const isSmall=()=>innerWidth<=600;

/* ---------- frames ---------- */
const VIEWS={};
function mount(){
  document.documentElement.dataset.theme=S.theme||'';
  document.documentElement.lang=S.lang==='vi'?'vi':'en';
  renderBar();
  const fr=framesOf();const st=$('#stage');
  st.className='stage '+(fr.length===1&&fr[0].dev==='desktop'?'solo-desktop':'');
  st.innerHTML=fr.map(f=>f.dev==='mobile'?`<div class="phone"><div class="frame" data-role="${f.role}" data-dev="mobile"></div></div>`:`<div class="desk ${fr.length>1?'side-by':''}"><div class="frame" data-role="${f.role}" data-dev="desktop"></div></div>`).join('');
  fr.forEach(f=>render(f.role,true));
}
function render(role,top){
  $$(`.frame[data-role="${role}"]`).forEach(el=>{
    const r=S.r[role];const key=r.n+JSON.stringify(r.p);const vp=el.querySelector('.vp');
    const keep=!top&&vp&&el.dataset.key===key;const sc=keep?vp.scrollTop:0;
    el.innerHTML=VIEWS[role](el.dataset.dev);
    el.dataset.key=key;const nv=el.querySelector('.vp');if(nv)nv.scrollTop=sc;
  });
  save();
}
function renderAll(){['buyer','seller','admin'].forEach(r=>{if(onStage(r))render(r)})}
function rerenderAllFrames(){['buyer','seller','admin'].forEach(r=>{if(onStage(r))render(r)});renderBar()}

/* ---------- overlays (rendered inside the frame) ---------- */
function overlay(role){const o=UI.ov[role];if(!o)return'';const html=typeof o.html==='function'?o.html():o.html;
  return `<div class="ov ${o.left?'left':''}" onclick="if(event.target===this)closeOv('${role}')">${html}</div>`}
function openOv(role,html,opt={}){UI.ov[role]={html,...opt};render(role)}
function closeOv(role){UI.ov[role]=null;render(role)}
function mHead(role,t){return `<div class="modal-h"><h3>${t}</h3><button class="iconbtn" onclick="closeOv('${role}')" aria-label="Close">${ic('x')}</button></div>`}
function toast(msg,icon='check'){const host=$('#toasts');const el=document.createElement('div');el.className='toast';el.innerHTML=ic(icon,'sm')+'<span>'+msg+'</span>';host.appendChild(el);setTimeout(()=>el.remove(),2800)}

/* ---------- prototype bar ---------- */
function renderBar(){const v=S.view;const small=isSmall();
  const role=(k,i,l)=>`<button class="${(v.device==='split'?(k==='buyer'||k===v.ops):v.role===k)?'on':''}" onclick="setRole('${k}')">${ic(i,'sm')}<span class="plbl">${l}</span></button>`;
  const dev=(k,i,l)=>`<button class="${v.device===k?'on':''}" onclick="setDevice('${k}')" title="${l}">${ic(i,'sm')}<span class="plbl">${l}</span></button>`;
  $('#pbar').innerHTML=`<div class="plogo">${BRAND.name.toLowerCase()}<b>.</b></div><div class="ptag"><b>Clickable prototype</b> · US multi-vendor marketplace<br>Demo data only · 38 screens</div>
  <div class="pseg" role="tablist" aria-label="Role">${role('buyer','cart','Shopper')}${role('seller','store','Seller Central')}${role('admin','shield','Admin')}</div>
  <div class="pseg dev" aria-label="Device">${dev('desktop','monitor','Desktop')}${dev('mobile','phone','Mobile')}${dev('split','split','Shopper + Ops')}</div>
  <div class="sp"></div>
  <button class="pbtn hl" onclick="showTour()">${ic('play','sm')}<span class="plbl">Demo tour</span></button>
  <button class="pbtn" onclick="showSitemap()">${ic('map','sm')}<span class="plbl">Screens</span></button>
  <button class="pbtn" onclick="toggleTheme()" aria-label="Toggle dark mode">${ic(isDark()?'sun':'moon','sm')}</button>
  <button class="pbtn" onclick="resetDemo()" title="Reset demo data" aria-label="Reset demo data">${ic('refresh','sm')}</button>`}
function setRole(r){const v=S.view;if(v.device==='split'){if(r==='buyer'){v.role='buyer'}else v.ops=r}else v.role=r;UI.notif=null;mount()}
function setDevice(d){S.view.device=d;if(d==='split'&&S.view.role!=='buyer')S.view.ops=S.view.role;mount()}
function isDark(){return S.theme==='dark'||(!S.theme&&matchMedia('(prefers-color-scheme: dark)').matches)}
function toggleTheme(){S.theme=isDark()?'light':'dark';document.documentElement.dataset.theme=S.theme;save();renderBar()}
function setLang(l){S.lang=l;document.documentElement.lang=l;rerenderAllFrames();toast(l==='vi'?'Đã chuyển sang Tiếng Việt':'Switched to English','globe')}

/* ---------- sitemap ---------- */
const SITEMAP={
 buyer:[['home','Home',{}],['categories','All categories (mobile menu)',{}],['search','Search results & filters',{q:'rice cooker'}],['deals',"Today's Deals",{}],['product','Product detail',{id:'k1'}],['store','Seller storefront',{id:'s1'}],['cart','Cart',{}],['signin','Sign in',{}],['register','Create account',{}],['checkout','Checkout',{}],['success','Order placed',{}],['orders','Your Orders',{}],['order','Order details & tracking',{}],['return','Return items',{}],['review','Write a review',{id:'k1'}],['account','Your Account',{}],['addresses','Addresses',{}],['payments','Payment methods',{}],['lists','Your Lists',{}]],
 seller:[['onboard','Register a business (KYB)',{}],['dashboard','Dashboard',{}],['listings','Manage listings',{}],['add','Add a product',{}],['bulk','Bulk upload (CSV)',{}],['orders','Manage orders',{}],['order','Order details & shipping label',{}],['returns','Returns',{}],['payments','Payments & payouts',{}],['feedback','Customer questions',{}],['settings','Store settings',{}]],
 admin:[['dashboard','Marketplace overview',{}],['sellers','Seller applications (KYB)',{}],['moderation','Listing moderation',{}],['claims','A-to-z claims',{}],['orders','Orders lookup',{}],['catalog','Categories & fees',{}],['content','Homepage content',{}],['team','Team & roles',{}]],
};
function showSitemap(){const role=S.view.device==='split'?'buyer':S.view.role;
  const col=(t,sub,k)=>`<div class="c"><h4>${t} <span class="faint">(${SITEMAP[k].length})</span></h4><div class="xs muted mb8">${sub}</div>${SITEMAP[k].map(([n,l,p])=>`<button onclick="jump('${k}','${n}',${J(p)})">${ic('chev','sm')}${l}</button>`).join('')}</div>`;
  openOv(role,`<div class="modal wide">${mHead(role,'All screens')}<div class="modal-b"><div class="smap">${col('Shopper','Responsive: desktop + mobile, EN / VI','buyer')}${col('Seller Central','Business sellers, desktop-first','seller')}${col('Marketplace Admin','Operations team','admin')}</div>
  <div class="alert info mt16">${ic('info','sm')}<div>Try the full loop with <b>Shopper + Ops</b>: place an order on the phone, then ship it from Seller Central and watch the tracking update.</div></div></div></div>`)}
function jump(role,n,p){UI.ov={};
  if(role==='buyer'){if(n==='order'){p={id:S.orders.find(o=>o.buyerId==='me').id}}if(n==='success'){const o=S.orders.find(o=>o.buyerId==='me');p={checkout:o.checkout}}if(n==='return'){p={id:(S.orders.find(o=>o.buyerId==='me'&&o.status==='delivered')||S.orders[0]).id}}if(n==='checkout'&&!S.buyer.cart.length)S.buyer.cart.push({pid:'k1',v:'White',q:1})}
  if(role==='seller'&&n==='order')p={id:S.orders.find(o=>o.seller===S.seller.shop&&o.status==='unshipped')?.id||S.orders.find(o=>o.seller===S.seller.shop).id};
  if(role==='seller'&&n==='add')UI.tmp.ep=null;
  go(role,n,p);renderAll()}

/* ---------- demo tour (for client meetings) ---------- */
const TOUR=[
 ['The storefront','Editorial home, verified sellers, deals checked against 90-day prices.',()=>{S.lang='en';S.view={...S.view,role:'buyer',device:'desktop'};S.r.buyer={n:'home',p:{},h:[]}}],
 ['Built for Vietnamese-American shoppers','One tap switches the whole store, reviews and support to Tiếng Việt.',()=>{S.lang='vi';S.view={...S.view,role:'buyer',device:'desktop'};S.r.buyer={n:'home',p:{},h:[]}}],
 ['Product page on mobile','Same code, phone layout. Delivery date, price history note, trust signals.',()=>{S.lang='en';S.view={...S.view,role:'buyer',device:'mobile'};S.r.buyer={n:'product',p:{id:'k1'},h:[{n:'home',p:{}}]}}],
 ['Checkout, split by seller','One checkout, one package per business, sales tax by state.',()=>{S.lang='en';if(!S.buyer.cart.length)S.buyer.cart.push({pid:'k1',v:'White',q:1});S.buyer.signedIn=true;S.view={role:'buyer',device:'split',ops:'seller'};S.r.buyer={n:'checkout',p:{},h:[{n:'cart',p:{}}]};S.r.seller={n:'orders',p:{tab:'unshipped'},h:[]}}],
 ['Seller ships the order','Place the order on the phone, then buy a label in Seller Central. Tracking updates live.',()=>{S.lang='en';S.view={role:'buyer',device:'split',ops:'seller'};S.r.seller={n:'orders',p:{tab:'unshipped'},h:[]};S.r.buyer={n:'orders',p:{},h:[]}}],
 ['Listing a product','Fees, profit and listing quality update as the business types. Vietnamese title built in.',()=>{UI.tmp.ep=null;S.view={...S.view,role:'seller',device:'desktop'};S.r.seller={n:'add',p:{},h:[{n:'dashboard',p:{}}]}}],
 ['Onboarding a new business','KYB in five steps: EIN, owner ID, bank, W-9, store.',()=>{S.view={...S.view,role:'seller',device:'desktop'};S.r.seller={n:'onboard',p:{},h:[]}}],
 ['Trust & safety','Admin approves businesses, removes risky listings and settles A-to-z claims.',()=>{S.view={...S.view,role:'admin',device:'desktop'};S.r.admin={n:'dashboard',p:{},h:[]}}],
 ['Marketplace controls','Change a referral fee or the homepage banner and see it everywhere.',()=>{S.view={...S.view,role:'admin',device:'desktop'};S.r.admin={n:'catalog',p:{},h:[]}}],
];
function showTour(){const role=S.view.device==='split'?'buyer':S.view.role;
  openOv(role,`<div class="modal wide">${mHead(role,'Demo tour · about 10 minutes')}<div class="modal-b"><p class="sm muted mb16">Follow the story in order. Each step opens the right screen and view. Reset demo data first for a clean run.</p><div class="tour">${TOUR.map(([t,d],i)=>`<div class="st"><i>${i+1}</i><div><b>${t}</b><span>${d}</span></div><button class="btn sm ink" onclick="tourGo(${i})">Open</button></div>`).join('')}</div></div></div>`)}
function tourGo(i){UI.ov={};UI.notif=null;TOUR[i][2]();save();mount();toast(`Step ${i+1}: ${TOUR[i][0]}`,'play')}

/* ---------- boot ---------- */
function boot(){mount();let w=innerWidth;addEventListener('resize',()=>{const s=innerWidth<=600;if(s!==(w<=600)){w=innerWidth;mount()}else w=innerWidth})}
