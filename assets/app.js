/* =========================================================
   EcomDemo base UI
   Two flows only:
     Flow 1  Shopper buys:   Home → Product → Cart → Checkout → Order placed
     Flow 2  Seller lists:   Products → Add product → live in store → Orders → Ship
   ========================================================= */
const LSK='ecomdemo-base', SV=1, DAY=864e5;
const ME='s1'; // the demo seller account (Saigon Kitchen Co.)

function seed(){
  const products=P_RAW.filter(a=>!a[13]).map((a,i)=>({id:a[0],cat:a[1],seller:a[2],name:a[3],price:a[5],list:a[6],rating:a[7],reviews:a[8],ph:a[9],brand:a[10],variants:a[11]?a[11].split(','):[],stock:20+(i*37)%180,created:Date.now()-(60-i)*DAY,status:'active'}));
  const now=Date.now();
  const orders=[
    {id:'113-4471902-2201',buyer:'Daniel Tran',city:'Santa Ana, CA',items:[{pid:'k2',q:1}],total:75.41,created:now-3*36e5,status:'new'},
    {id:'113-4471877-0912',buyer:'Emily Carter',city:'Seattle, WA',items:[{pid:'k5',q:2}],total:66.13,created:now-26*36e5,status:'shipped'},
  ];
  return{v:SV,view:{role:'shop',device:'desktop'},products,cart:[{pid:'c1',q:1},{pid:'f1',q:2}],orders,
    r:{shop:{n:'home',p:{}},seller:{n:'products',p:{}}},hl:null};
}
let S;try{S=JSON.parse(localStorage.getItem(LSK)||'null');if(!S||S.v!==SV)S=null}catch(e){S=null}
if(!S)S=seed();
const UI={busy:false,draft:null};
function save(){try{localStorage.setItem(LSK,JSON.stringify(S))}catch(e){}}
function reset(){if(!confirm('Reset the demo data?'))return;S=seed();UI.draft=null;save();mount();toast('Demo reset')}

/* ---------- helpers ---------- */
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>{n=+n||0;return(n<0?'-$':'$')+Math.abs(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})};
const P=id=>S.products.find(p=>p.id===id);
const SL=id=>SELLERS.find(s=>s.id===id);
const CAT=id=>CATS.find(c=>c.id===id);
const pct=p=>p.list>p.price?Math.round((1-p.price/p.list)*100):0;
const live=()=>S.products.filter(p=>p.status==='active');
const cartCount=()=>S.cart.reduce((a,c)=>a+c.q,0);
const ago=t=>{const m=Math.round((Date.now()-t)/6e4);if(m<60)return Math.max(1,m)+' min ago';const h=Math.round(m/60);return h<24?h+' h ago':Math.round(h/24)+' d ago'};
function addBiz(t,n){const d=new Date(t);let k=0;while(k<n){d.setDate(d.getDate()+1);if(d.getDay()%6)k++}return d}
const eta=()=>addBiz(Date.now(),4).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
const TAX=7.75, FREE=35, SHIP=5.99;
const fee=(price,cat)=>{const ref=price*(CAT(cat)?.fee||10)/100,proc=price?price*.029+.3:0;return{ref,proc,net:price-ref-proc,pct:CAT(cat)?.fee||10}};

const ICONS={cart:'<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.6 12.2a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 7H6"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',chev:'<path d="m9 18 6-6-6-6"/>',back:'<path d="M15 18 9 12l6-6"/>',plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',check:'<path d="M20 6 9 17l-5-5"/>',truck:'<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',shield:'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',return:'<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',box:'<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',store:'<path d="M3 9 5 3h14l2 6M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0zM5 13v8h14v-8"/>',camera:'<path d="M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="4"/>',eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',refresh:'<path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5"/>',phone:'<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',monitor:'<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',badge:'<path d="M12 2 9.5 4.5 6 4l-.5 3.5L3 10l1.8 3L3 16l2.5 1.5L6 21l3.5-.5L12 23l2.5-2.5L18 21l.5-3.5L21 16l-1.8-3L21 10l-2.5-2.5L18 4l-3.5.5z" transform="scale(.9) translate(1.3 0)"/><path d="m9 12 2 2 4-4"/>',card:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',pin:'<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>'};
const ic=(n,c='')=>`<svg class="ic ${c}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]||''}</svg>`;
const uimg=(id,w,h)=>`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h||w}&q=70`;
const img=(id,w=400,h)=>`<span class="img">${id?`<img src="${uimg(id,w,h)}" alt="" loading="lazy" onerror="this.remove()">`:''}</span>`;
const pimg=(p,w=500,k=0)=>{const ph=PH[p.ph]||[];return img(ph[k%Math.max(ph.length,1)],w,Math.round(w*1.25))};
const mono=(s,c='')=>`<span class="mono ${c}" style="--h:${s.hue}">${esc(s.mono)}</span>`;
const stars=v=>`<span class="stars" style="--v:${v}"></span>`;
const price=(n,c='s')=>{const [w,d]=(+n).toFixed(2).split('.');return `<span class="price ${c}"><span class="cur">$</span>${(+w).toLocaleString('en-US')}<span class="cts">.${d}</span></span>`};
function toast(m,i='check'){const el=document.createElement('div');el.className='toast';el.innerHTML=ic(i,'sm')+'<span>'+m+'</span>';$('#toasts').appendChild(el);setTimeout(()=>el.remove(),2600)}

/* ---------- router & frame ---------- */
function go(role,n,p={}){if(n==='product')UI.qty=1;S.r[role]={n,p};if(S.view.role!==role){S.view.role=role;mount();return}render(true)}
function mount(){const v=S.view;const small=innerWidth<=600;const dev=small?'mobile':v.device;
  $('#pbar').innerHTML=`<div class="plogo">ecomdemo<b>.</b></div><div class="ptag"><b>Base UI</b> · 2 flows<br>Demo data only</div>
   <div class="pseg"><button class="${v.role==='shop'?'on':''}" onclick="go('shop',S.r.shop.n,S.r.shop.p)">${ic('cart','sm')}<span class="plbl">Shopper</span></button><button class="${v.role==='seller'?'on':''}" onclick="go('seller',S.r.seller.n,S.r.seller.p)">${ic('store','sm')}<span class="plbl">Seller</span></button></div>
   <div class="pseg dev"><button class="${v.device==='desktop'?'on':''}" onclick="S.view.device='desktop';mount()">${ic('monitor','sm')}<span class="plbl">Desktop</span></button><button class="${v.device==='mobile'?'on':''}" onclick="S.view.device='mobile';mount()">${ic('phone','sm')}<span class="plbl">Mobile</span></button></div>
   <span class="sp"></span>
   <button class="pbtn hl" onclick="go('shop','home')">1 · <span class="plbl">Buy a product</span></button>
   <button class="pbtn hl" onclick="UI.draft=null;go('seller','add')">2 · <span class="plbl">List a product</span></button>
   <button class="pbtn" onclick="reset()" aria-label="Reset demo">${ic('refresh','sm')}</button>`;
  $('#stage').className='stage '+(dev==='desktop'?'solo-desktop':'');
  $('#stage').innerHTML=dev==='mobile'?`<div class="phone"><div class="frame" data-dev="mobile"></div></div>`:`<div class="desk"><div class="frame" data-dev="desktop"></div></div>`;
  render(true)}
function render(top){const fr=$('.frame');if(!fr)return;const vp=fr.querySelector('.vp');const sc=!top&&vp?vp.scrollTop:0;
  const sb=fr.dataset.dev==='mobile'?`<div class="statusbar"><span>9:41</span><span class="xs">5G ▮▮▮ 🔋</span></div>`:'';
  fr.innerHTML=sb+(S.view.role==='shop'?shopView():sellerView())+(UI.busy?`<div class="ov"><div class="modal" style="width:min(340px,100%)"><div class="modal-b col" style="align-items:center;padding:36px;text-align:center"><div class="spinner"></div><b class="md mt12">Processing payment securely…</b></div></div></div>`:'');
  const nv=fr.querySelector('.vp');if(nv)nv.scrollTop=sc;save()}

/* =========================================================
   FLOW 1 · SHOPPER
   ========================================================= */
const SV_={};
function shopView(){const r=S.r.shop;const v=(SV_[r.n]||SV_.home)(r.p);
  if(v.bare)return `<div class="vp">${v.body}</div>${v.sticky?`<div class="m-sticky m-only">${v.sticky}</div>`:''}`;
  const cc=cartCount();
  return `<div class="vp"><div class="announce"><div class="wrapx"><span>Free shipping on $35+ from each store</span><span class="d-only">${ic('pin','sm')} Deliver to Westminster 92683</span></div></div>
  <header class="hdr"><div class="wrapx"><div class="hdr-row">
   <button class="wordmark" onclick="go('shop','home')">ecomdemo<b>.</b></button>
   <form class="sbar d-only" style="margin:0 auto" onsubmit="event.preventDefault();go('shop','home',{q:this.q.value.trim()})">${ic('search','sm')}<input name="q" value="${esc(r.p.q||'')}" placeholder="Search products and stores"><button class="go" aria-label="Search">${ic('chev','sm')}</button></form>
   <div class="hicons"><button class="hicon d-only" onclick="toast('Signed in as Linh Nguyen','user')">${ic('user')}<span>Linh</span></button><button class="hicon" onclick="go('shop','cart')" aria-label="Cart">${ic('cart')}${cc?`<span class="cnt">${cc}</span>`:''}<span class="d-only">Cart</span></button></div>
  </div></div><div class="m-only m-search"><form class="sbar" onsubmit="event.preventDefault();go('shop','home',{q:this.q.value.trim()})">${ic('search','sm')}<input name="q" value="${esc(r.p.q||'')}" placeholder="Search products and stores"><button class="go" aria-label="Search">${ic('chev','sm')}</button></form></div></header>
  <div class="bmain">${v.body}</div>
  <footer class="bfoot" style="margin-top:72px"><div class="wrapx"><div class="base" style="border:0"><span><b class="serif" style="font-size:20px">ecomdemo<b style="color:var(--lacquer)">.</b></b> · A marketplace of verified US businesses</span><span>© 2026 · Prototype</span></div></div></footer></div>${v.sticky?`<div class="m-sticky m-only">${v.sticky}</div>`:''}`}

function card(p){const s=SL(p.seller);const d=pct(p);const isNew=Date.now()-p.created<DAY;
  return `<div class="pc"><div class="media" onclick="go('shop','product',{id:'${p.id}'})">${pimg(p)}${d?`<span class="tag bdg deal">−${d}%</span>`:isNew?'<span class="tag bdg dark">New</span>':''}<button class="quick" onclick="event.stopPropagation();addToCart('${p.id}')">${ic('plus','sm')}<span>Add to cart</span></button></div>
   <div class="b"><div class="seller">${esc(s.name)} ${ic('badge')}</div><div class="t clamp2" onclick="go('shop','product',{id:'${p.id}'})">${esc(p.name)}</div><div class="pr">${price(p.price)}${d?`<span class="list-price"><s>${money(p.list)}</s></span>`:''}</div><div class="meta">${p.reviews?`${stars(p.rating)} ${p.rating} (${p.reviews.toLocaleString()})`:'New listing'}</div></div></div>`}
function addToCart(pid,q=1){const c=S.cart.find(x=>x.pid===pid);if(c)c.q+=q;else S.cart.push({pid,q});toast(`Added to cart · ${cartCount()} items`,'cart');render()}

SV_.home=p=>{const cat=p.cat||'';const q=(p.q||'').toLowerCase();
  const list=live().filter(x=>(!cat||x.cat===cat)&&(!q||(x.name+' '+x.brand+' '+SL(x.seller).name).toLowerCase().includes(q))).sort((a,b)=>b.created-a.created);
  const hero=[P('c1'),P('k1'),P('b1')].filter(Boolean);
  return{body:`${!q&&!cat?`<div class="wrapx"><section class="hero">
   <div><span class="eyebrow">Verified US businesses</span><h1>Everyday goods, <em>from people who make them</em></h1><p class="lead">Kitchen, pantry and beauty products from verified US businesses. Free shipping on $35+ from each store.</p>
    <div class="ctas"><button class="btn ink lg" onclick="$('.vp').scrollTo({top:$('#shop').offsetTop-80,behavior:'smooth'})">Start shopping</button><button class="btn lg" onclick="UI.draft=null;go('seller','add')">Sell with us</button></div></div>
   <div class="collage">${hero.map(x=>`<button onclick="go('shop','product',{id:'${x.id}'})">${pimg(x,800)}<span class="tagpill">${mono(SL(x.seller))}<span class="ell"><b>${money(x.price)}</b> · ${esc(x.name.split(',')[0])}</span></span></button>`).join('')}</div>
  </section></div>`:''}
  <section class="sec" id="shop" style="${q||cat?'padding-top:36px':''}"><div class="wrapx">
   <div class="sec-h"><div><span class="eyebrow">${q?'Search results':'Shop'}</span><h2>${q?`“<em>${esc(p.q)}</em>”`:cat?esc(CAT(cat).en):'New <em>arrivals</em>'}</h2></div><span class="sm muted">${list.length} products</span></div>
   <div class="chips mb16" style="margin-bottom:28px"><button class="chip ${!cat?'on':''}" onclick="go('shop','home',{q:'${esc(p.q||'')}'})">All</button>${CATS.map(c=>`<button class="chip ${cat===c.id?'on':''}" onclick="go('shop','home',{cat:'${c.id}',q:'${esc(p.q||'')}'})">${c.en}</button>`).join('')}</div>
   ${list.length?`<div class="pgrid">${list.map(card).join('')}</div>`:`<div class="empty"><div class="art">${ic('search','xl')}</div>No products found.<button class="btn ink" onclick="go('shop','home')">Clear search</button></div>`}
  </div></section>`}};

SV_.product=p=>{const x=P(p.id);if(!x)return SV_.home({});const s=SL(x.seller);const ph=PH[x.ph]||[];const d=pct(x);UI.qty=UI.qty||1;const free=x.price*UI.qty>=FREE;
  const v=p.v||x.variants[0]||'';
  return{body:`<div class="wrapx"><div class="crumbs"><a onclick="go('shop','home')">Home</a>/<a onclick="go('shop','home',{cat:'${x.cat}'})">${CAT(x.cat).en}</a></div>
  <div class="pdp"><div><div class="gal d-only" style="display:grid">${ph.map((id,i)=>img(id,i?700:1200,i?875:960)).join('')||'<span class="img" style="aspect-ratio:5/4;border-radius:14px"></span>'}</div><div class="m-gal m-only" style="display:flex">${ph.map(id=>img(id,700,875)).join('')||'<span class="img"></span>'}</div></div>
   <div class="pinfo"><span class="sellerchip">${mono(s,'sm')}${esc(s.name)} ${ic('badge')}</span>
    <h1>${esc(x.name)}</h1>
    <div class="row g8 mt12 sm muted">${x.reviews?`${stars(x.rating)} <b style="color:var(--ink)">${x.rating}</b> · ${x.reviews.toLocaleString()} ratings`:'New listing'}</div>
    <div class="pricebox">${price(x.price,'l')}${d?`<span class="list-price md"><s>${money(x.list)}</s></span><span class="bdg deal">−${d}%</span>`:''}</div>
    ${x.variants.length?`<div class="mt24"><div class="sm mb8">Option: <b>${esc(v)}</b></div><div class="vsel">${x.variants.map(o=>`<button class="${o===v?'on':''}" onclick="S.r.shop.p.v='${esc(o)}';render()">${esc(o)}</button>`).join('')}</div></div>`:''}
    <div class="buy-row"><span class="stepper"><button onclick="UI.qty=Math.max(1,UI.qty-1);render()" aria-label="Decrease">${ic('minus','sm')}</button><span>${UI.qty}</span><button onclick="UI.qty=Math.min(10,UI.qty+1);render()" aria-label="Increase">${ic('plus','sm')}</button></span><button class="btn ink lg" onclick="addToCart('${x.id}',UI.qty)">Add to cart</button></div>
    <button class="btn buy lg block mt8" onclick="addToCart('${x.id}',UI.qty);go('shop','checkout')">Buy now</button>
    <div class="deliv"><div>${ic('truck')}<span><b>${free?'Free delivery':money(SHIP)+' delivery'} ${eta()}</b><br><span class="muted">Ships from ${esc(s.city)} · ${x.stock>5?'<span class="okc">In stock</span>':`<span class="dealc">Only ${x.stock} left</span>`}</span></span></div></div>
    <div class="assure">${[['return','Free 30-day returns'],['badge','Verified business'],['shield','Money-back guarantee'],['lock','Secure checkout']].map(([i,t])=>`<span>${ic(i)}${t}</span>`).join('')}</div>
    <div class="acc"><details open><summary>About this item</summary><div class="in"><ul class="bul">${(BULLETS[x.cat]||[]).map(b=>`<li>${esc(b[0])}</li>`).join('')}</ul></div></details><details><summary>About the seller</summary><div class="in sm muted">${esc(s.about)}</div></details></div>
   </div></div>
  <section class="below"><h2>More from ${esc(s.name)}</h2><div class="pgrid">${live().filter(y=>y.seller===x.seller&&y.id!==x.id).slice(0,4).map(card).join('')}</div></section></div>`,
  sticky:`<div class="grow">${price(x.price)}<div class="xs muted">${free?'Free delivery':'+ '+money(SHIP)+' delivery'}</div></div><button class="btn ink" onclick="addToCart('${x.id}',UI.qty)">Add to cart</button>`}};

function cartCalc(){const items=S.cart.filter(c=>P(c.pid));const sub=items.reduce((a,c)=>a+P(c.pid).price*c.q,0);
  const sellers=[...new Set(items.map(c=>P(c.pid).seller))];const ship=sellers.reduce((a,sid)=>{const s=items.filter(c=>P(c.pid).seller===sid).reduce((x,c)=>x+P(c.pid).price*c.q,0);return a+(s>=FREE?0:SHIP)},0);
  const tax=+(sub*TAX/100).toFixed(2);return{items,sub,ship,tax,total:sub+ship+tax}}
function qty(pid,d){const c=S.cart.find(x=>x.pid===pid);c.q+=d;if(c.q<=0)S.cart.splice(S.cart.indexOf(c),1);render()}
SV_.cart=()=>{const c=cartCalc();
  if(!c.items.length)return{body:`<div class="wrapx"><div class="empty" style="padding:96px 20px"><div class="art">${ic('cart','xl')}</div><h1 class="serif" style="font-size:38px">Your cart is empty</h1><button class="btn ink lg" onclick="go('shop','home')">Start shopping</button></div></div>`};
  return{body:`<div class="wrapx"><h1 class="pagetitle">Your cart <span class="faint" style="font-size:.5em">${cartCount()} items</span></h1><div class="cartgrid">
   <div class="cgroup">${c.items.map(i=>{const p=P(i.pid);return `<div class="citem"><button onclick="go('shop','product',{id:'${p.id}'})">${pimg(p,300)}</button><div><div class="xs faint" style="letter-spacing:.06em;text-transform:uppercase">${esc(SL(p.seller).name)}</div><div class="md clamp2 mt4">${esc(p.name)}</div><div class="row g12 mt12"><span class="qty"><button onclick="qty('${p.id}',-1)" aria-label="Decrease">${i.q===1?ic('trash','sm'):ic('minus','sm')}</button><span>${i.q}</span><button onclick="qty('${p.id}',1)" aria-label="Increase">${ic('plus','sm')}</button></span></div></div><div class="cprice right">${price(p.price*i.q)}</div></div>`}).join('')}</div>
   <div class="sumbox"><h3>Summary</h3><div class="sum-row"><span>Subtotal</span><span>${money(c.sub)}</span></div><div class="sum-row"><span>Shipping</span><span>${c.ship?money(c.ship):'Free'}</span></div><div class="sum-row"><span>Estimated tax</span><span>${money(c.tax)}</span></div><div class="sum-total"><span>Total</span><span>${money(c.total)}</span></div><button class="btn ink lg block mt16" onclick="go('shop','checkout')">Checkout ${ic('chev','sm')}</button></div>
  </div></div>`,sticky:`<div class="grow"><div class="xs muted">Total</div><b class="md">${money(c.total)}</b></div><button class="btn ink lg" onclick="go('shop','checkout')">Checkout</button>`}};

SV_.checkout=()=>{const c=cartCalc();if(!c.items.length)return SV_.cart();
  return{bare:true,body:`<div class="co-head"><button class="wordmark" onclick="go('shop','cart')">ecomdemo<b>.</b></button><span class="row g4 sm muted">${ic('lock','sm')} Secure checkout</span></div>
  <div class="co-grid"><div>
   <div class="co-step"><div class="row between"><h3><span class="n">1</span>Ship to</h3><a class="lnk sm" onclick="toast('Address book is out of scope for the base UI','pin')">Change</a></div><div class="md mt12" style="padding-left:40px"><b>Linh Nguyen</b><br><span class="muted">9200 Bolsa Ave, Apt 12, Westminster, CA 92683</span></div></div>
   <div class="co-step"><h3><span class="n">2</span>Payment</h3><div class="mt16"><div class="opt on"><span class="rad on"></span>${ic('card')}<span class="sm grow"><b>Visa •••• 4242</b><br><span class="muted">Expires 08/28</span></span></div></div></div>
   <div class="co-step"><h3><span class="n">3</span>Review</h3><div class="pkg"><h4>Arrives ${eta()}</h4>${c.items.map(i=>{const p=P(i.pid);return `<div class="row g12 mt12"><span style="width:52px">${pimg(p,120)}</span><span class="sm grow clamp2">${esc(p.name)}</span><span class="sm">${i.q} × ${money(p.price)}</span></div>`}).join('')}</div></div>
  </div><div class="sumbox"><h3>Order summary</h3><div class="sum-row"><span>Items</span><span>${money(c.sub)}</span></div><div class="sum-row"><span>Shipping</span><span>${c.ship?money(c.ship):'Free'}</span></div><div class="sum-row"><span>Tax (CA ${TAX}%)</span><span>${money(c.tax)}</span></div><div class="sum-total"><span>Total</span><span>${money(c.total)}</span></div><button class="btn ink lg block mt16" onclick="placeOrder()">${ic('lock','sm')} Place order</button></div></div>`,
  sticky:`<div class="grow"><div class="xs muted">Total</div><b class="md">${money(c.total)}</b></div><button class="btn ink lg" onclick="placeOrder()">Place order</button>`}};
function placeOrder(){const c=cartCalc();UI.busy=true;render();setTimeout(()=>{const id='113-'+String(Date.now()).slice(-7)+'-'+String(Math.random()).slice(2,6);
  [...new Set(c.items.map(i=>P(i.pid).seller))].forEach(sid=>{const its=c.items.filter(i=>P(i.pid).seller===sid);const sub=its.reduce((a,i)=>a+P(i.pid).price*i.q,0);
    S.orders.unshift({id:sid===ME?id:id+'-'+sid,buyer:'Linh Nguyen',city:'Westminster, CA',items:its.map(i=>({pid:i.pid,q:i.q})),total:+(sub*(1+TAX/100)+(sub>=FREE?0:SHIP)).toFixed(2),created:Date.now(),status:'new'})});
  S.lastOrder={id,total:c.total,items:c.items.map(i=>({...i})),toMe:c.items.some(i=>P(i.pid).seller===ME)};S.cart=[];UI.busy=false;go('shop','done')},900)}
SV_.done=()=>{const o=S.lastOrder;if(!o)return SV_.home({});
  return{body:`<div class="wrapx" style="max-width:900px"><div class="panel bd" style="margin-top:48px;padding:40px"><div class="ok-hero">${ic('check')}<div><h1>Thank you, Linh. Your order is in.</h1><p class="md muted mt12">Order <b style="color:var(--ink)">#${o.id}</b> · ${money(o.total)} · arrives ${eta()}</p></div></div>
   <div class="row g8 mt24">${o.items.map(i=>`<span style="width:76px">${pimg(P(i.pid),160)}</span>`).join('')}</div>
   <div class="row g8 wrap mt32"><button class="btn ink lg" onclick="go('shop','home')">Keep shopping</button>${o.toMe?`<button class="btn lg" onclick="go('seller','orders')">${ic('store','sm')} See it in Seller Central</button>`:''}</div></div></div>`}};

/* =========================================================
   FLOW 2 · SELLER
   ========================================================= */
const SE={};
function sellerView(){const r=S.r.seller;const v=SE[r.n](r.p);const s=SL(ME);const nw=S.orders.filter(o=>o.status==='new'&&o.items.some(i=>P(i.pid)?.seller===ME)).length;
  const nav=(n,i,l,c)=>`<button class="nav ${r.n===n?'on':''}" onclick="${n==='add'?'UI.draft=null;':''}go('seller','${n}')">${ic(i)}<span>${l}</span>${c?`<span class="cnt">${c}</span>`:''}</button>`;
  return `<div class="op"><nav class="side"><div class="brand"><span class="wordmark">ecomdemo<b>.</b></span><small>Seller</small></div>
   <div class="sw" style="cursor:default">${mono(s,'sm')}<span class="grow"><b class="sm" style="display:block">${esc(s.name)}</b><span class="xs faint">${esc(s.city)}</span></span></div>
   ${nav('products','list','Products')}${nav('add','plus','Add product')}${nav('orders','box','Orders',nw)}
   <div class="me"><span class="avatar">HN</span><span class="sm"><b>Hung Nguyen</b><br><span class="xs faint">Owner</span></span></div></nav>
   <div class="op-main"><header class="op-top"><span class="grow"></span><button class="btn sm" onclick="go('shop','home')">${ic('eye','sm')} View store</button></header>
   <div class="vp"><div class="op-ph"><h1>${v.title}${v.sub?`<span class="sub">${v.sub}</span>`:''}</h1>${v.actions||''}</div>${v.body}</div></div></div>`}
const mini=(p,sub)=>`<div class="mini">${pimg(p,120)}<div style="min-width:0"><div class="sm ell" style="max-width:320px">${esc(p.name)}</div><div class="xs faint">${sub}</div></div></div>`;
const kpi=(k,v,d)=>`<div class="kpi"><div class="k">${k}</div><div class="v">${v}</div>${d?`<div class="d">${d}</div>`:''}</div>`;

SE.products=()=>{const mine=S.products.filter(p=>p.seller===ME).sort((a,b)=>b.created-a.created);const os=S.orders.filter(o=>o.items.some(i=>P(i.pid)?.seller===ME));
  return{title:'Products',sub:`${mine.length} listings live on EcomDemo`,actions:`<button class="btn pri" onclick="UI.draft=null;go('seller','add')">${ic('plus','sm')} Add product</button>`,
  body:`<div class="grid c3 mb16">${kpi('Live listings',mine.length)}${kpi('Orders to ship',os.filter(o=>o.status==='new').length,'Ship within 1 business day')}${kpi('Sales, 30 days',money(17198.96+os.filter(o=>Date.now()-o.created<DAY).reduce((a,o)=>a+o.total,0)))}</div>
  <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Product</th><th class="num">Price</th><th class="num">You receive</th><th class="num">Stock</th><th>Status</th><th></th></tr></thead><tbody>
  ${mine.map(p=>`<tr class="${S.hl===p.id?'hl':''}"><td>${mini(p,CAT(p.cat).en)}</td><td class="num">${money(p.price)}</td><td class="num"><b>${money(fee(p.price,p.cat).net)}</b></td><td class="num">${p.stock}</td><td><span class="bdg ok">Live</span>${S.hl===p.id?' <span class="bdg dark">Just published</span>':''}</td><td class="num"><button class="btn sm" onclick="go('shop','product',{id:'${p.id}'})">${ic('eye','sm')} View in store</button></td></tr>`).join('')}</tbody></table></div>`}};

SE.add=()=>{const d=UI.draft=UI.draft||{name:'',cat:'kitchen',price:'',stock:'',desc:'',imgs:0};
  const f=(l,k,ph,extra='')=>`<div class="field"><label class="label">${l}</label><input class="input" value="${esc(d[k])}" placeholder="${ph}" oninput="UI.draft.${k}=this.value;side()" ${extra}></div>`;
  return{title:'Add a product',sub:'Fill in four things. Your fee and payout update as you type.',actions:`<button class="btn" onclick="go('seller','products')">Cancel</button><button class="btn pri" onclick="publish()">Publish</button>`,
  body:`<div class="grid c-main" style="align-items:start"><div class="col" style="gap:16px">
   <div class="ocrd"><div class="ocrd-h"><h3>1. Photos</h3><span class="xs muted">${d.imgs}/6</span></div><div class="row wrap">${Array.from({length:d.imgs},(_,i)=>`<span style="width:92px;height:92px;display:block;border-radius:10px;overflow:hidden">${img((PH[{kitchen:'rice',coffee:'coffee',pantry:'cashew',beauty:'serum',fashion:'tee',baby:'bottle',electronics:'phones',home:'lamp'}[d.cat]]||[])[i%3],200).replace('class="img"','class="img" style="width:92px;height:92px"')}</span>`).join('')}${d.imgs<6?`<button class="drop" style="width:92px;height:92px;padding:0;justify-content:center;font-size:11px" onclick="UI.draft.imgs++;render()">${ic('camera')}Add photo</button>`:''}</div></div>
   <div class="ocrd"><div class="ocrd-h"><h3>2. Details</h3></div>${f('Product name','name','e.g. Stainless Steel Pho Stock Pot, 20 Qt')}
    <div class="field"><label class="label">Category</label><select class="select" onchange="UI.draft.cat=this.value;render()">${CATS.map(c=>`<option value="${c.id}" ${d.cat===c.id?'selected':''}>${c.en} · ${c.fee}% fee</option>`).join('')}</select></div>
    <div class="field"><label class="label">Description</label><textarea class="textarea" oninput="UI.draft.desc=this.value" placeholder="What makes it great? Size, material, warranty.">${esc(d.desc)}</textarea></div></div>
   <div class="ocrd"><div class="ocrd-h"><h3>3. Price & stock</h3></div><div class="grid c2" style="gap:12px">${f('Price (USD)','price','0.00',"inputmode='decimal'")}${f('Quantity in stock','stock','0',"inputmode='numeric'")}</div></div>
  </div><div id="side" style="position:sticky;top:0">${sideHTML()}</div></div>`}};
function sideHTML(){const d=UI.draft;const pr=+d.price||0;const f=fee(pr,d.cat);
  const fake={id:'pv',cat:d.cat,seller:ME,name:d.name||'Your product name',price:pr,list:0,rating:0,reviews:0,ph:{kitchen:'rice',coffee:'coffee',pantry:'cashew',beauty:'serum',fashion:'tee',baby:'bottle',electronics:'phones',home:'lamp'}[d.cat],created:Date.now()};
  return `<div class="ocrd"><div class="ocrd-h"><h3>4. Your payout</h3></div><div class="fee-row"><span>Price</span><b>${money(pr)}</b></div><div class="fee-row"><span>Referral fee (${f.pct}%)</span><span>−${money(f.ref)}</span></div><div class="fee-row"><span>Payment processing</span><span>−${money(f.proc)}</span></div><div class="fee-row tot"><span>You receive</span><span class="okc">${money(f.net)}</span></div><p class="xs faint mt8">No listing fees. Sales tax is handled by EcomDemo.</p></div>
  <div class="ocrd mt16"><div class="ocrd-h"><h3>Preview</h3><span class="xs muted">How shoppers see it</span></div><div style="width:220px;margin:0 auto;pointer-events:none">${card(fake)}</div></div>`}
function side(){const el=$('#side');if(el)el.innerHTML=sideHTML();save()}
function publish(){const d=UI.draft;const miss=[!d.imgs&&'a photo',!d.name.trim()&&'a name',!(+d.price>0)&&'a price',!(+d.stock>0)&&'stock'].filter(Boolean);
  if(miss.length){toast('Add '+miss.join(', '),'camera');return}
  const id='n'+Date.now().toString(36);S.products.push({id,cat:d.cat,seller:ME,name:d.name.trim(),price:+(+d.price).toFixed(2),list:0,rating:0,reviews:0,ph:{kitchen:'rice',coffee:'coffee',pantry:'cashew',beauty:'serum',fashion:'tee',baby:'bottle',electronics:'phones',home:'lamp'}[d.cat],brand:'Saigon Kitchen',variants:[],stock:Math.round(+d.stock),created:Date.now(),status:'active'});
  S.hl=id;UI.draft=null;toast('Published. Your product is live in the store.');go('seller','products')}

SE.orders=()=>{const os=S.orders.filter(o=>o.items.some(i=>P(i.pid)?.seller===ME));
  return{title:'Orders',sub:'Ship new orders within 1 business day',body:`<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Order</th><th>Product</th><th>Buyer</th><th class="num">Total</th><th>Status</th><th></th></tr></thead><tbody>
  ${os.map(o=>{const p=P(o.items.find(i=>P(i.pid)?.seller===ME).pid);return `<tr class="${o.status==='new'&&Date.now()-o.created<36e5?'hl':''}"><td><b class="tnum">${o.id}</b><div class="xs faint">${ago(o.created)}</div></td><td>${mini(p,`Qty ${o.items[0].q}${o.items.length>1?` · +${o.items.length-1} more`:''}`)}</td><td class="sm">${esc(o.buyer)}<div class="xs faint">${esc(o.city)}</div></td><td class="num">${money(o.total)}</td><td><span class="bdg ${o.status==='new'?'warn':'ok'}">${o.status==='new'?'To ship':'Shipped'}</span></td><td class="num">${o.status==='new'?`<button class="btn pri sm" onclick="ship('${o.id}')">${ic('truck','sm')} Mark as shipped</button>`:''}</td></tr>`}).join('')||`<tr><td colspan="6"><div class="empty">No orders yet</div></td></tr>`}</tbody></table></div>`}};
function ship(id){const o=S.orders.find(x=>x.id===id);o.status='shipped';toast('Marked as shipped. Tracking sent to the buyer.','truck');render()}

function boot(){mount();let w=innerWidth;addEventListener('resize',()=>{if((innerWidth<=600)!==(w<=600))mount();w=innerWidth})}
