/* =========================================================
   Mock data. Everything here is fictional demo content.
   Product photos: Unsplash (free licence), hot-linked.
   ========================================================= */
const BRAND={name:'EcomDemo',sub:'',support:'support@ecomdemo.example'};

const CATS=[
  {id:'pantry',en:'Vietnamese Pantry',vi:'Thực phẩm Việt',fee:8},
  {id:'coffee',en:'Coffee & Tea',vi:'Cà phê & Trà',fee:8},
  {id:'kitchen',en:'Kitchen & Dining',vi:'Nhà bếp',fee:12},
  {id:'beauty',en:'Beauty & Personal Care',vi:'Làm đẹp',fee:10},
  {id:'fashion',en:'Clothing & Accessories',vi:'Thời trang',fee:15},
  {id:'baby',en:'Baby',vi:'Mẹ & bé',fee:10},
  {id:'electronics',en:'Electronics',vi:'Điện tử',fee:8},
  {id:'home',en:'Home & Living',vi:'Nhà cửa',fee:12},
];

const SELLERS=[
  {id:'s1',name:'Saigon Kitchen Co.',legal:'Saigon Kitchen Company LLC',city:'Garden Grove, CA',state:'CA',rating:4.8,count:2184,since:2024,mono:'SK',hue:12,verified:true,ein:'**-***4821',
   about:'Family-run importer of rice cookers, pho pots and everyday kitchen appliances. Warehouse in Garden Grove, ships same day before 2 PM PT.',aboutVi:'Doanh nghiệp gia đình nhập khẩu nồi cơm điện, nồi phở và đồ gia dụng. Kho tại Garden Grove, giao trong ngày nếu đặt trước 2 giờ chiều.'},
  {id:'s2',name:'Lumière Beauty',legal:'Lumiere Beauty Inc.',city:'San Jose, CA',state:'CA',rating:4.9,count:5310,since:2023,mono:'LB',hue:340,verified:true,ein:'**-***1170',
   about:'Clean skincare formulated for sensitive skin. FDA-registered facility, cruelty-free.',aboutVi:'Mỹ phẩm sạch cho da nhạy cảm. Nhà máy đăng ký FDA, không thử nghiệm trên động vật.'},
  {id:'s3',name:'Highland Roasters',legal:'Highland Roasters LLC',city:'Houston, TX',state:'TX',rating:4.9,count:3902,since:2024,mono:'HR',hue:28,verified:true,ein:'**-***6604',
   about:'Small-batch Vietnamese robusta and arabica roasted in Houston every week.',aboutVi:'Cà phê robusta và arabica Việt Nam rang mẻ nhỏ mỗi tuần tại Houston.'},
  {id:'s4',name:'Mekong Pantry',legal:'Mekong Pantry Corp.',city:'Westminster, CA',state:'CA',rating:4.8,count:1745,since:2024,mono:'MP',hue:95,verified:true,ein:'**-***3392',
   about:'Imported Vietnamese snacks, honey, nuts and gift baskets. FDA food facility registered.',aboutVi:'Đặc sản Việt nhập khẩu: hạt, mật ong, giỏ quà. Cơ sở thực phẩm đã đăng ký FDA.'},
  {id:'s5',name:'Little EcomDemo Baby',legal:'Little EcomDemo Baby Co.',city:'Seattle, WA',state:'WA',rating:4.9,count:1210,since:2025,mono:'LL',hue:200,verified:true,ein:'**-***9015',
   about:'Safety-tested baby essentials. Every product meets CPSC requirements.',aboutVi:'Đồ dùng cho bé đạt kiểm định an toàn CPSC.'},
  {id:'s6',name:'Nhà Home Goods',legal:'Nha Home Goods LLC',city:'Falls Church, VA',state:'VA',rating:4.7,count:860,since:2025,mono:'NH',hue:170,verified:true,ein:'**-***2287',
   about:'Minimal home décor and bedding, designed in Virginia.',aboutVi:'Đồ trang trí và chăn ga tối giản, thiết kế tại Virginia.'},
  {id:'s7',name:'Áo Dài House',legal:'Ao Dai House Inc.',city:'Santa Ana, CA',state:'CA',rating:4.8,count:990,since:2024,mono:'AD',hue:300,verified:true,ein:'**-***5530',
   about:'Modern Vietnamese-inspired apparel and accessories. Free exchanges within 30 days.',aboutVi:'Thời trang cảm hứng Việt hiện đại. Đổi miễn phí trong 30 ngày.'},
  {id:'s8',name:'TechNest Supply',legal:'TechNest Supply LLC',city:'Dallas, TX',state:'TX',rating:4.7,count:4420,since:2023,mono:'TN',hue:220,verified:true,ein:'**-***7741',
   about:'Authorized reseller of audio and charging accessories. 1-year warranty on every item.',aboutVi:'Đại lý ủy quyền phụ kiện âm thanh và sạc. Bảo hành 1 năm.'},
  {id:'s9',name:'BestDeal Outlet 88',legal:'—',city:'Unknown',state:'—',rating:3.6,count:142,since:2026,mono:'88',hue:0,verified:false,ein:'—',
   about:'Discount fashion and accessories.',aboutVi:'Thời trang và phụ kiện giá rẻ.'},
];

/* Unsplash photo ids */
const PH={
 rice:['1599182345361-9542815e73f6','1544233726-9f1d2b27be8b','1569641092045-f6ec23879aef'],
 fry5:['1774074645537-f72f70d40d12','1627670381055-487000952cb0','1598998834483-8b02cd0d3bdf'],
 fry7:['1781737857663-f1f14a60ba46','1774074645537-f72f70d40d12','1730405068968-d01e87fc29ce'],
 blend:['1622818426197-d54f85b88690','1512203864638-f6cbb3cca374','1570222094114-d054a817e56b'],
 kettle:['1594213114663-d94db9b17125','1685514128186-c5d8d7e90e1a','1643114786355-ff9e52736eab'],
 spice:['1741521311950-fe32245b1e5d','1771128264855-1c032332cbc8','1781018727258-4a70d500e4ee'],
 glass:['1774442501862-eeaeaad491ee','1631447661435-b86ae5ecd564','1774569037314-7a4353f6ae04'],
 coffee:['1598198192305-46b0805890d3','1685798830559-c116586a0d33','1605711599412-775918dbe770'],
 tea:['1760074057731-83e375873eb5','1763617702099-d956f3fd8324','1766482280244-afd07a7028fc'],
 cashew:['1641718087616-859c6754efb9','1509912760195-4f6cfd8cce2c','1626697556426-8a55a8af4999'],
 honey:['1587049352851-8d4e89133924','1558642452-9d2a7deb7f62','1613548058193-1cd24c1bebcf'],
 sun:['1698912198250-fb0c5ecccc6e','1623676714504-edd78728155e','1594055103006-7871176f1a7e'],
 clean:['1745141063798-7fa04698ea80','1748639320154-6ba118bccc74','1732861612232-50cbe19c1ae5'],
 serum:['1713768704571-6aeb0d0e5105','1679394270597-e90694d70350','1627811015433-368c148f6c3c'],
 micel:['1600518088325-6a124128922e','1600518088359-0184dd513b95','1724085339140-531fe39625f7'],
 cream:['1764694071508-e4b1efcd39bc','1765964492963-b0aa8c172431','1643123158391-8543727c85f5'],
 lip:['1760860992755-c432351d47e9','1512496015851-a90fb38ba796'],
 tee:['1620799139652-715e4d5b232d','1603113730470-780cbb2f32ca','1620799139507-2a76f79a2f4d'],
 jeans:['1624378439575-d8705ad7ae80','1714143136372-ddaf8b606da7','1637069585336-827b298fe84a'],
 linen:['1740711152088-88a009e877bb','1713881649391-a1c8ddaf83cd','1713881587420-113c1c43e28a'],
 tote:['1544816155-12df9643f363','1548863227-3af567fc3b27','1574365569389-a10d488ca3fb'],
 sneaker:['1544441892-794166f1e3be','1600269452121-4f2416e55c28'],
 bottle:['1623707430616-d9f956bcac2b','1635258559918-ed56f88004de'],
 stroller:['1611223355350-5be15e624fdf','1559135141-2bea6465fccf','1528121108018-743eef2e4a7a'],
 muslin:['1768693602418-260d828b878d','1709626142596-f99fda8e68f1'],
 diaper:['1584839404042-8bc21d240e91','1695998575483-b215c8b2f619','1573662012516-5cb4399006e7'],
 phones:['1505740420928-5e560c06d30e','1618366712010-f4ae9c647dcb','1590658268037-6bf12165a8df'],
 power:['1566554738544-d962991c3fee','1706275399494-fb26bbc5da63'],
 cable:['1595756630452-736bc8ef3693','1619459072761-496c0812331b','1572721546624-05bf65ad7679'],
 watch:['1624096104992-9b4fa3a279dd','1579586337278-3befd40fd17a','1660844817855-3ecc7ef21f12'],
 speaker:['1547052178-7f2c5a20c332','1589003077984-894e133dabab','1582978571763-2d039e56f0c3'],
 case:['1771142061210-95e97225641e','1697008230027-5c6ebaf24801'],
 lamp:['1608890558220-527ef33e932a','1761083042094-988fd3a3ae69','1779022469383-01877a89caf6'],
 rug:['1549295265-b0c1f7fb6147','1589153954896-0ce7eac58156','1615927998810-ca467ad48c5f'],
 blanket:['1637819976869-928427bd7380','1638431110087-80c185015f94','1714919022564-9d4d4a906482'],
 desk:['1582356630861-61bb9b41f541','1523380262778-076eb862d38f','1579326882518-21eaa7893b02'],
 note:['1654542645651-5196f4931cd6','1677064061401-f77f966ff8a1','1550517355-375c103a6a81'],
 hero:['1745846664210-756817e1b19c'],
};

/* [id, cat, seller, en, vi, price, list, rating, reviews, photos, brand, variants, boughtPerMonth, flags] */
const P_RAW=[
 ['k1','kitchen','s1','Digital Rice Cooker 10-Cup with Fuzzy Logic & Keep Warm, Non-Stick Inner Pot','Nồi cơm điện tử 10 cốc Fuzzy Logic, giữ ấm tự động, lòng chống dính',89.99,109.99,4.8,2184,'rice','Saigon Kitchen','White,Black',2000],
 ['k2','kitchen','s1','Air Fryer 5.8 Qt Touchscreen, 8 Presets, Dishwasher-Safe Basket','Nồi chiên không dầu 5.8 Qt cảm ứng, 8 chế độ, giỏ rửa máy được',69.99,79.99,4.7,1532,'fry5','Saigon Kitchen','Black,White',1000],
 ['k3','kitchen','s1','Air Fryer 7 Qt with Viewing Window and Shake Reminder','Nồi chiên không dầu 7 Qt có cửa kính quan sát',99.99,0,4.6,612,'fry7','Saigon Kitchen','Black',400],
 ['k4','kitchen','s1','High-Speed Countertop Blender 1.5 L, Crushes Ice','Máy xay sinh tố tốc độ cao 1.5 L, xay được đá',49.99,64.99,4.6,920,'blend','Saigon Kitchen','Silver,Black',600],
 ['k5','kitchen','s1','Stainless Steel Electric Kettle 1.7 L, Auto Shut-Off','Ấm siêu tốc inox 1.7 L, tự ngắt',29.99,0,4.7,2840,'kettle','Saigon Kitchen','Silver',1000],
 ['k6','kitchen','s6','2-Tier Stainless Spice Rack Organizer','Kệ gia vị 2 tầng inox',24.99,29.99,4.6,388,'spice','Nhà Home','',200],
 ['k7','kitchen','s6','Glass Meal Prep Containers with Locking Lids, Set of 3','Bộ 3 hộp thủy tinh trữ thực phẩm nắp khóa',27.99,0,4.8,1104,'glass','Nhà Home','',500],
 ['c1','coffee','s3','Vietnamese Robusta Ground Coffee, Dark Roast, 1 lb','Cà phê robusta Việt Nam rang xay, rang đậm, 1 lb',14.99,0,4.9,3902,'coffee','Highland Roasters','Ground,Whole Bean',3000],
 ['c2','coffee','s3','Thai Nguyen Green Tea, Premium Loose Leaf, 8 oz','Trà xanh Thái Nguyên thượng hạng, 8 oz',16.99,19.99,4.9,1288,'tea','Highland Roasters','',900],
 ['c3','coffee','s3','Phin Coffee Filter Set (2) + 1 lb Robusta Gift Box','Bộ quà 2 phin cà phê + 1 lb robusta',29.99,36.99,4.8,744,'coffee','Highland Roasters','',500],
 ['f1','pantry','s4','Roasted Salted Cashews from Binh Phuoc, 1 lb Resealable Bag','Hạt điều rang muối Bình Phước, túi zip 1 lb',12.99,15.99,4.8,1745,'cashew','Mekong Pantry','',2000],
 ['f2','pantry','s4','Raw Coffee Blossom Honey, 17 oz','Mật ong hoa cà phê nguyên chất, 17 oz',15.99,0,4.9,690,'honey','Mekong Pantry','',300],
 ['f3','pantry','s4','Lunar New Year Gift Basket: Tea, Honey & Cashews','Giỏ quà Tết: trà, mật ong và hạt điều',59.99,69.99,4.9,312,'tea','Mekong Pantry','',200],
 ['b1','beauty','s2','Daily Mineral Sunscreen SPF 50, Lightweight, 1.7 fl oz','Kem chống nắng khoáng SPF 50, mỏng nhẹ, 50 ml',18.50,22.00,4.9,5310,'sun','Lumière','',5000],
 ['b2','beauty','s2','Gentle pH 5.5 Foaming Cleanser, 5 fl oz','Sữa rửa mặt tạo bọt dịu nhẹ pH 5.5, 150 ml',14.00,0,4.8,2210,'clean','Lumière','',1000],
 ['b3','beauty','s2','10% Vitamin C Brightening Serum, 1 fl oz','Serum Vitamin C 10% sáng da, 30 ml',24.00,30.00,4.7,1640,'serum','Lumière','',1000],
 ['b4','beauty','s2','Micellar Cleansing Water, 13.5 fl oz','Nước tẩy trang micellar, 400 ml',12.00,0,4.8,980,'micel','Lumière','',600],
 ['b5','beauty','s2','B5 Barrier Repair Moisturizer, 1.7 oz','Kem dưỡng phục hồi B5, 50 ml',26.00,0,4.8,744,'cream','Lumière','',400],
 ['a1','fashion','s7','Men\'s Linen Short-Sleeve Button-Down Shirt','Áo sơ mi linen nam tay ngắn',34.99,44.99,4.7,512,'linen','Áo Dài House','S,M,L,XL',300],
 ['a2','fashion','s7','Oversized Cotton T-Shirt, Unisex','Áo thun cotton form rộng unisex',19.99,0,4.6,820,'tee','Áo Dài House','S,M,L,XL',600],
 ['a3','fashion','s7','Hand-Painted Canvas Tote Bag','Túi tote canvas vẽ tay',22.00,0,4.8,301,'tote','Áo Dài House','',200],
 ['a4','fashion','s7','Women\'s High-Rise Wide-Leg Jeans','Quần jean nữ ống rộng lưng cao',39.99,49.99,4.5,433,'jeans','Áo Dài House','24,26,28,30',200],
 ['y1','baby','s5','Anti-Colic PPSU Baby Bottle 8 oz, 2-Pack','Bình sữa PPSU chống sặc 240 ml, bộ 2',16.99,0,4.9,1210,'bottle','Little EcomDemo','',700],
 ['y2','baby','s5','Bamboo Muslin Swaddle Blankets, 4-Pack','Khăn quấn sợi tre, bộ 4',19.99,24.99,4.9,980,'muslin','Little EcomDemo','',500],
 ['y3','baby','s5','Lightweight One-Hand Fold Stroller','Xe đẩy gấp gọn một tay',189.99,229.99,4.8,214,'stroller','Little EcomDemo','Gray,Navy',100],
 ['e1','electronics','s8','Wireless Noise-Cancelling Headphones, 40-Hour Battery','Tai nghe chống ồn không dây, pin 40 giờ',79.99,99.99,4.6,2780,'phones','TechNest','Black,Silver',1000],
 ['e2','electronics','s8','20,000 mAh Power Bank, 22.5 W Fast Charging','Sạc dự phòng 20.000 mAh, sạc nhanh 22.5 W',34.99,0,4.7,4420,'power','TechNest','',2000],
 ['e3','electronics','s8','USB-C to USB-C Braided Cable 6 ft, 2-Pack','Cáp sạc USB-C bọc dù 1.8 m, bộ 2',9.99,12.99,4.8,6120,'cable','TechNest','',4000],
 ['e4','electronics','s8','Fitness Smartwatch with Heart-Rate & Sleep Tracking','Đồng hồ thông minh theo dõi nhịp tim và giấc ngủ',99.99,129.99,4.5,890,'watch','TechNest','Black,Rose',300],
 ['e5','electronics','s8','Portable Waterproof Bluetooth Speaker','Loa bluetooth chống nước di động',39.99,0,4.7,1290,'speaker','TechNest','Blue,Black',500],
 ['h1','home','s6','Wooden Touch Night Lamp, 3 Brightness Levels','Đèn ngủ gỗ cảm ứng, 3 mức sáng',21.99,0,4.7,640,'lamp','Nhà Home','',300],
 ['h2','home','s6','Breathable Cotton Summer Quilt, Queen','Chăn hè cotton thoáng mát, size Queen',44.99,54.99,4.8,412,'blanket','Nhà Home','Queen,King',200],
 ['h3','home','s6','Absorbent Cotton Door Mat','Thảm chùi chân cotton thấm hút',15.99,0,4.6,530,'rug','Nhà Home','',200],
 ['h4','home','s6','LED Desk Lamp with Eye-Care Mode','Đèn bàn LED chống mỏi mắt',32.99,39.99,4.7,780,'desk','Nhà Home','White,Black',300],
 ['x1','fashion','s9','Designer Inspired Sneakers 1:1 Replica Quality','Giày sneaker hàng hiệu replica 1:1',19.99,129.00,3.7,96,'sneaker','—','7,8,9,10',0,'flag'],
 ['x2','electronics','s9','Clear Shockproof Phone Case','Ốp lưng trong suốt chống sốc',6.99,24.99,3.9,46,'case','—','',0,'flag2'],
];

const BULLETS={
 kitchen:[['Built for everyday family cooking with a durable, food-safe construction.','Thiết kế cho bữa ăn gia đình hằng ngày, vật liệu an toàn thực phẩm.'],['Easy to clean: removable parts are dishwasher-safe.','Dễ vệ sinh, các bộ phận tháo rời rửa máy được.'],['UL-listed for the US market, 120 V plug.','Đạt chứng nhận UL, phích cắm 120 V chuẩn Mỹ.'],['1-year warranty handled directly by the US-based seller.','Bảo hành 1 năm, xử lý trực tiếp bởi người bán tại Mỹ.']],
 coffee:[['Single-origin beans sourced from Vietnamese highland farms.','Hạt đơn nguồn từ nông trại Tây Nguyên.'],['Roasted in small batches in the US for freshness.','Rang mẻ nhỏ tại Mỹ để giữ độ tươi.'],['Perfect for cà phê sữa đá with a phin filter.','Hợp pha cà phê sữa đá bằng phin.'],['Nitrogen-flushed bag with one-way valve.','Túi bơm nitơ có van một chiều.']],
 pantry:[['Imported directly from Vietnam, FDA-registered facility.','Nhập khẩu trực tiếp, cơ sở đã đăng ký FDA.'],['No artificial preservatives.','Không chất bảo quản nhân tạo.'],['Resealable packaging keeps it fresh.','Bao bì zip giữ độ tươi.'],['Great as a gift for family and friends.','Thích hợp làm quà biếu.']],
 beauty:[['Dermatologist-tested, suitable for sensitive skin.','Đã kiểm nghiệm da liễu, phù hợp da nhạy cảm.'],['Fragrance-free and cruelty-free.','Không hương liệu, không thử nghiệm trên động vật.'],['Made in an FDA-registered facility.','Sản xuất tại cơ sở đăng ký FDA.'],['Lightweight texture, no white cast.','Kết cấu mỏng nhẹ, không vệt trắng.']],
 fashion:[['Breathable natural fabric for warm days.','Chất liệu tự nhiên thoáng mát.'],['Relaxed fit, true to US sizing.','Form rộng, size chuẩn Mỹ.'],['Machine wash cold, tumble dry low.','Giặt máy nước lạnh, sấy nhẹ.'],['Free exchanges within 30 days.','Đổi miễn phí trong 30 ngày.']],
 baby:[['BPA-free, meets CPSC safety standards.','Không BPA, đạt chuẩn an toàn CPSC.'],['Soft, gentle materials for newborn skin.','Chất liệu mềm, dịu nhẹ cho da sơ sinh.'],['Easy to clean and sterilize.','Dễ vệ sinh và tiệt trùng.'],['Backed by a 1-year seller warranty.','Bảo hành 1 năm từ người bán.']],
 electronics:[['Fast, stable connection with the latest Bluetooth.','Kết nối nhanh, ổn định với Bluetooth mới nhất.'],['FCC certified for use in the US.','Đạt chứng nhận FCC.'],['Long battery life for all-day use.','Pin dùng cả ngày.'],['1-year warranty from an authorized reseller.','Bảo hành 1 năm từ đại lý ủy quyền.']],
 home:[['Minimal design that fits any room.','Thiết kế tối giản, hợp mọi không gian.'],['Easy to clean and maintain.','Dễ vệ sinh, bảo quản.'],['Responsibly sourced materials.','Vật liệu có nguồn gốc bền vững.'],['30-day free returns.','Đổi trả miễn phí 30 ngày.']],
};

const REVIEW_TPL={
 5:[['Exactly as described','Đúng như mô tả','Arrived two days early and well packed. Works perfectly, will buy from this seller again.','Giao sớm 2 ngày, đóng gói kỹ. Dùng rất ổn, sẽ ủng hộ shop tiếp.'],
    ['Reminds me of home','Đúng vị quê nhà','Finally found the real thing in the US. My parents love it.','Cuối cùng cũng tìm được hàng chuẩn ở Mỹ. Ba mẹ mình rất thích.'],
    ['Great quality for the price','Chất lượng tốt so với giá','Solid build, the seller answered my question within an hour.','Chắc chắn, người bán trả lời câu hỏi trong vòng 1 giờ.']],
 4:[['Good, small issue','Tốt, có chút vấn đề nhỏ','Works well. Box was a little dented but the product was fine.','Dùng tốt. Hộp hơi móp nhưng sản phẩm không sao.'],
    ['Solid choice','Lựa chọn ổn','Does the job. Instructions could be clearer.','Dùng được. Hướng dẫn nên rõ hơn.']],
 3:[['It\'s okay','Tạm được','Color is slightly different from the photos.','Màu hơi khác so với ảnh.']],
 2:[['Not what I expected','Không như kỳ vọng','Quality is below what I expected for the price.','Chất lượng thấp hơn mong đợi.']],
 1:[['Returned it','Đã trả hàng','Stopped working after a week. Return process was easy though.','Hỏng sau một tuần. Nhưng trả hàng khá dễ.']],
};
const REVIEWERS=['Linh T.','Michael B.','Thu H.','Jessica P.','Kevin N.','Mai A.','David L.','Hannah V.','Brian T.','Vy N.','Sarah K.','Tuan P.'];
const REVIEW_PLACES=['the United States'];

const ADDRESSES=[
 {name:'Linh Nguyen',line1:'9200 Bolsa Ave, Apt 12',city:'Westminster',state:'CA',zip:'92683',phone:'(714) 555-0142',tax:7.75},
 {name:'Linh Nguyen',line1:'1200 Main St, Floor 8',city:'Houston',state:'TX',zip:'77002',phone:'(713) 555-0188',tax:8.25},
];
const OTHER_BUYERS=[
 {name:'Daniel Tran',line1:'418 W 1st St',city:'Santa Ana',state:'CA',zip:'92701',tax:9.25},
 {name:'Emily Carter',line1:'77 Pine St',city:'Seattle',state:'WA',zip:'98101',tax:10.25},
 {name:'Huong Le',line1:'5201 Bellaire Blvd',city:'Houston',state:'TX',zip:'77401',tax:8.25},
 {name:'Robert Kim',line1:'31 Grove Ave',city:'Falls Church',state:'VA',zip:'22046',tax:6.0},
 {name:'An Pham',line1:'2088 Story Rd',city:'San Jose',state:'CA',zip:'95122',tax:9.375},
 {name:'Olivia Brooks',line1:'908 Elm St',city:'Dallas',state:'TX',zip:'75202',tax:8.25},
];

const PROMOS={
 ECOM10:{en:'10% off your first order (max $20)',vi:'Giảm 10% đơn đầu tiên (tối đa $20)',type:'pct',val:10,cap:20},
 TET2027:{en:'$5 off orders over $50',vi:'Giảm $5 cho đơn từ $50',type:'amt',val:5,min:50},
};

const CARRIERS=[
 {id:'usps',name:'USPS Ground Advantage',days:'2–5 business days',base:4.85,perLb:0.55},
 {id:'ups',name:'UPS Ground',days:'1–5 business days',base:7.40,perLb:0.70},
 {id:'fedex',name:'FedEx 2Day',days:'2 business days',base:13.20,perLb:1.10},
];
