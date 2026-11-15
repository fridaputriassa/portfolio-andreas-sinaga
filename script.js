const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];

/* ===== i18n (teks dinamis) ===== */
const T={
en:{
  hint_walk:"Andreas is carrying a laptop to the warehouse...",
  hint_scan:"Stock opname time! Click the 3 blinking boxes.",
  hint_prog:"Verified {n}/3",
  hint_done:"All matched! Laptop placed on the shelf. Gate open.",
  enter:"Enter Portfolio", skip:"skip", dl:"Download resume", dling:"Downloading…", dled:"Downloaded", cvt:"Resume downloaded!", cvd:"Check your Downloads folder.",
  pick_t:"Pick a pin", pick_d:"Click any pin on the map to see what happens there.",
  roles:["IT Asset Management","Stock Opname Specialist","Software Engineer","Accessibility Researcher"],
  term:["$ stock-opname --scope all","» scanning branch-network ...","» scanning regional-office ...","» scanning head-office ...","✓ reconcile software 2021–2026","✓ 1,200 assets validated","$ jira --sla-check","✓ all tickets within SLA","$ _"],
  duties:[
    {t:"Stock Opname",d:"Conduct IT asset stock opname across branch network, regional offices, and head office to validate physical assets against inventory records and ensure accurate asset data.",c:"scan: branch / regional / head office"},
    {t:"Inventory & Stock Card",d:"Manage IT asset inventory and stock cards to maintain asset availability, accurate tracking, and orderly record-keeping across multiple organizational locations.",c:"stock card · live status"},
    {t:"Asset Auction",d:"Support and execute IT asset auction processes across branch network and head office, including asset data validation, physical verification, and preparation of supporting administrative documentation.",c:"auction workflow"},
    {t:"Data Integrity",d:"Validate and maintain the accuracy of IT asset datasets to support internal control, financial reporting, audit requirements, and asset management operations.",c:"dataset reconciliation per period"},
    {t:"JIRA & SLA",d:"Handle, monitor, and resolve IT support tickets using JIRA related to IT asset requests, software installations, and hardware replacements in accordance with established SLAs.",c:"ticket board · SLA"}
  ],
  rows:["Laptop · Jakarta branch","Monitor · Regional office","Switch · Head office","Printer · Branch","Server · Head office"],
  pending:"pending", matched:"matched",
  steps:["Validate data","Physical check","Admin docs","Auction"],
  cols:["OPEN","IN PROGRESS","DONE · SLA"], sla:"SLA",
  tk:["Laptop request","Software install","Hardware swap"]
},
id:{
  hint_walk:"Andreas lagi bawa laptop ke gudang...",
  hint_scan:"Waktunya stock opname! Klik 3 box yang berkedip.",
  hint_prog:"Tervalidasi {n}/3",
  hint_done:"Semua cocok! Laptop ditaruh di rak. Pintu gudang terbuka.",
  enter:"Masuk ke Portfolio", skip:"lewati", dl:"Unduh resume", dling:"Mengunduh…", dled:"Terunduh", cvt:"Resume berhasil diunduh!", cvd:"Cek folder Downloads kamu.",
  pick_t:"Pilih satu pin", pick_d:"Klik pin mana pun di peta untuk melihat apa yang terjadi di sana.",
  roles:["Pengelola Aset IT","Spesialis Stock Opname","Software Engineer","Peneliti Aksesibilitas"],
  term:["$ stock-opname --scope all","» memindai jaringan cabang ...","» memindai kantor regional ...","» memindai kantor pusat ...","✓ rekonsiliasi software 2021–2026","✓ 1.200 aset tervalidasi","$ jira --sla-check","✓ semua tiket dalam SLA","$ _"],
  duties:[
    {t:"Stock Opname",d:"Melakukan stock opname aset IT di jaringan cabang, kantor regional, dan kantor pusat untuk memvalidasi aset fisik dengan catatan inventaris dan menjaga akurasi data aset.",c:"scan: cabang / regional / kantor pusat"},
    {t:"Inventaris & Stock Card",d:"Mengelola inventaris aset IT dan stock card agar ketersediaan, pelacakan, dan pencatatan aset tetap rapi di berbagai lokasi organisasi.",c:"stock card · status langsung"},
    {t:"Lelang Aset",d:"Mendukung dan menjalankan proses lelang aset IT di jaringan cabang dan kantor pusat, termasuk validasi data aset, verifikasi fisik, dan penyiapan dokumen administrasi.",c:"alur lelang"},
    {t:"Integritas Data",d:"Memvalidasi dan menjaga akurasi dataset aset IT untuk mendukung kontrol internal, pelaporan keuangan, kebutuhan audit, dan operasional manajemen aset.",c:"rekonsiliasi dataset per periode"},
    {t:"JIRA & SLA",d:"Menangani, memantau, dan menyelesaikan tiket dukungan IT di JIRA terkait permintaan aset, instalasi software, dan penggantian hardware sesuai SLA.",c:"papan tiket · SLA"}
  ],
  rows:["Laptop · Cabang Jakarta","Monitor · Kantor regional","Switch · Kantor pusat","Printer · Cabang","Server · Kantor pusat"],
  pending:"menunggu", matched:"cocok",
  steps:["Validasi data","Cek fisik","Dokumen admin","Lelang"],
  cols:["BUKA","DIPROSES","SELESAI · SLA"], sla:"SLA",
  tk:["Permintaan laptop","Install software","Ganti hardware"]
}
};
let LANG="en";
const tr=k=>T[LANG][k];
const pick=(el,base)=>el.dataset[base+(LANG==="id"?"Id":"En")];

/* ===== Sprite pixel (launch) ===== */
const PAL={H:'#2a1a12',S:'#e0a97a',E:'#16222e',B:'#c9a45c',P:'#2c4254',K:'#0e1822'};
const TOP=['..HHHHHH..','.HHHHHHHH.','.HHSSSSHH.','HHSESSESHH','.HSSSSSSH.','..SSSSSS..','..BBBBBB..','.BBBBBBBB.','SBBBBBBBBS','..BBBBBB..','..PPPPPP..'];
const LEGS=[['..PP..PP..','..PP..PP..','..KK..KK..'],['...PPPP...','...PPPP...','...KKKK...']];
function sprite(ctx,x,y,s,f){
  TOP.concat(LEGS[f]).forEach((row,r)=>[...row].forEach((c,i)=>{
    if(c!=='.'){ctx.fillStyle=PAL[c];ctx.fillRect(x+i*s,y+r*s,s,s)}
  }));
}
function laptop(ctx,x,y,s){
  ctx.fillStyle='#8fa3b3';ctx.fillRect(x,y,6*s,4*s);
  ctx.fillStyle='#16222e';ctx.fillRect(x+s,y+s,4*s,2*s);
  ctx.fillStyle='#c9a45c';ctx.fillRect(x+2*s,y+s,s,s);
  ctx.fillStyle='#5b6e7e';ctx.fillRect(x-s,y+4*s,8*s,s);
}

/* ===== Launch scene ===== */
const cv=$('#scene'),ctx=cv.getContext('2d');
const hint=$('#hint'),fill=$('#barfill');
const enter=$('#enter'),skip=$('#skip');
const COLORS=['#b8582e','#c9a45c','#8a6a43','#5f7a4a','#a9743f'];
const boxes=[];
for(let r=0;r<3;r++)for(let c=0;c<5;c++)boxes.push({x:160+c*30,y:26+r*34,w:24,h:16,c:COLORS[(r*5+c*2)%5],scan:false,target:false});
[[0,1],[1,3],[2,0]].forEach(([r,c])=>boxes[r*5+c].target=true);
const targets=boxes.filter(b=>b.target);
const S=2,GROUND=124,STAND=GROUND-14*S;
let px=-24,phase='walk',t=0,placed=false;
let hintState={key:'hint_walk',n:0};

function setHint(){
  hint.textContent=hintState.key==='hint_prog'?tr('hint_prog').replace('{n}',hintState.n):tr(hintState.key);
}
function bg(){
  ctx.fillStyle='#27394a';ctx.fillRect(0,0,320,140);
  ctx.fillStyle='#1d2d3b';for(let i=0;i<320;i+=40)ctx.fillRect(i,0,2,GROUND);
  ctx.fillStyle='#c9a45c';ctx.fillRect(10,12,60,8);ctx.fillStyle='#16222e';ctx.fillRect(14,14,52,4);
  ctx.fillStyle='#4a3a2a';ctx.fillRect(0,GROUND,320,16);
  ctx.fillStyle='#3a2d20';for(let i=0;i<320;i+=16)ctx.fillRect(i,GROUND+6,8,2);
  for(let r=0;r<3;r++){ctx.fillStyle='#5b6e7e';ctx.fillRect(152,42+r*34,158,3);}
  ctx.fillStyle='#5b6e7e';ctx.fillRect(152,26,3,98);ctx.fillRect(307,26,3,98);
  boxes.forEach(b=>{
    ctx.fillStyle=b.c;ctx.fillRect(b.x,b.y,b.w,b.h);
    ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(b.x,b.y+b.h-3,b.w,3);
    ctx.fillStyle='#ece3cf';ctx.fillRect(b.x+8,b.y+4,8,5);
    if(b.scan){ctx.fillStyle='#6f8a55';ctx.fillRect(b.x,b.y,b.w,b.h);ctx.fillStyle='#ece3cf';ctx.fillRect(b.x+6,b.y+8,3,3);ctx.fillRect(b.x+9,b.y+10,3,3);ctx.fillRect(b.x+12,b.y+6,3,5);}
    else if(b.target&&phase==='scan'&&Math.floor(t/20)%2){ctx.fillStyle='#ece3cf';ctx.fillRect(b.x+10,b.y-12,4,7);ctx.fillRect(b.x+10,b.y-3,4,3);}
  });
}
function frame(){
  t++;bg();
  const walking=phase==='walk';
  const f=walking?Math.floor(t/8)%2:0;
  const bob=walking&&f?-1:0;
  sprite(ctx,px,STAND+bob,S,f);
  if(!placed)laptop(ctx,px+6,STAND+17+bob,S);
  else laptop(ctx,268,28,2);
  if(walking){px+=0.8;if(px>=100){px=100;phase='scan';hintState={key:'hint_scan'};setHint();}}
  requestAnimationFrame(frame);
}
cv.addEventListener('click',e=>{
  if(phase!=='scan')return;
  const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*320,y=(e.clientY-r.top)/r.height*140;
  const b=targets.find(b=>!b.scan&&x>b.x&&x<b.x+b.w&&y>b.y-12&&y<b.y+b.h);
  if(!b)return;
  b.scan=true;
  const n=targets.filter(b=>b.scan).length;
  fill.style.width=(n/3*100)+'%';
  if(n===3){
    phase='done';placed=true;
    hintState={key:'hint_done'};setHint();
    enter.hidden=false;enter.focus();
  }else{hintState={key:'hint_prog',n};setHint();}
});
frame();

/* ===== Masuk ke situs ===== */
let siteOpen=false,termTimer=null,selectedPin=null;
function openSite(restore){
  siteOpen=true;
  try{sessionStorage.setItem('siteOpened','1')}catch(e){}
  $('#launch').classList.add('hide');
  $('#site').classList.add('on');
  document.body.classList.remove('locked');
  if(restore!==true)window.scrollTo(0,0);
  countUp();
  runTerminal();
}
enter.addEventListener('click',()=>openSite());
skip.addEventListener('click',()=>openSite());

/* ===== Hero: ketik peran ===== */
let roleR=0,roleI=0,roleDel=false;
function typeStep(){
  const el=$('#typed');const roles=tr('roles');
  const w=roles[roleR%roles.length];
  if(!roleDel){el.textContent=w.slice(0,++roleI);if(roleI===w.length){roleDel=true;return setTimeout(typeStep,1600)}}
  else{el.textContent=w.slice(0,--roleI);if(roleI===0){roleDel=false;roleR=(roleR+1)%roles.length}}
  setTimeout(typeStep,roleDel?35:70);
}
typeStep();

/* ===== Terminal ===== */
function runTerminal(){
  clearTimeout(termTimer);
  const body=$('#termbody');
  const lines=tr('term').map(l=>l.replace(/^\$/,'<span class="hl">$</span>').replace(/^✓/,'<span class="ok">✓</span>'));
  body.innerHTML=lines.map(l=>`<div class="tline">${l}</div>`).join('');
  const els=$$('.tline',body);
  let i=0;
  const next=()=>{
    if(i<els.length){els[i++].classList.add('show');termTimer=setTimeout(next,520)}
    else termTimer=setTimeout(()=>{els.forEach(e=>e.classList.remove('show'));i=0;next()},3200);
  };
  next();
}

/* ===== Angka naik ===== */
function countUp(){
  $$('[data-n]').forEach(el=>{
    const end=+el.dataset.n;let n=0;
    const id=setInterval(()=>{n=Math.min(end,n+Math.ceil(end/30));el.textContent=n.toLocaleString(LANG==='id'?'id-ID':'en-US')+(end>=1000?'+':'');if(n>=end)clearInterval(id)},40);
  });
}

/* ===== Tanggung jawab: tab + visual ===== */
const DUTY_V=['cells','rows','pipe','bars','kan'];
let cur=0,tick=0;
const tabs=$$('.tab');
const viz=$('#viz');
let tickets=[{id:'IT-1041',k:0,col:0},{id:'IT-1042',k:1,col:1},{id:'IT-1043',k:2,col:0}];

function build(v){
  if(v==='cells')return `<div class="cells">${Array.from({length:50},(_,i)=>`<div class="cell"></div>`).join('')}</div><p class="vlabel">${T[LANG].duties[cur].c}</p>`;
  if(v==='rows')return `<div class="rows">${tr('rows').map((r,i)=>`<div class="row" data-r="${i}"><span>${r}</span><span class="q">qty <b>0</b></span><span class="s">${tr('pending')}</span></div>`).join('')}</div><p class="vlabel">${T[LANG].duties[cur].c}</p>`;
  if(v==='pipe')return `<div class="pipe">${tr('steps').map((s,i)=>`<div class="step" data-s="${i}">${s}</div>`).join('')}</div><p class="vlabel">${T[LANG].duties[cur].c}</p>`;
  if(v==='bars')return `<div class="bars">${Array.from({length:12},()=>`<div class="bcol"></div>`).join('')}</div><p class="vlabel">${T[LANG].duties[cur].c}</p>`;
  if(v==='kan'){const c=tr('cols');return `<div class="kan"><div class="kcol"><h5>${c[0]}</h5><div data-c="0"></div></div><div class="kcol"><h5>${c[1]}</h5><div data-c="1"></div></div><div class="kcol"><h5>${c[2]}</h5><div data-c="2"></div></div></div><div class="sla"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" stroke="#2c4254"/><circle id="ring" cx="22" cy="22" r="18" stroke="#6f8a55" stroke-dasharray="113" stroke-dashoffset="0"/></svg><span id="slatxt">${tr('sla')} 100%</span></div>`;}
}

function tickViz(){
  tick++;
  const v=DUTY_V[cur];
  if(v==='cells'){
    const cells=$$('.cell',viz);if(!cells.length)return;
    const hot=tick%cells.length;
    cells.forEach((c,i)=>{c.classList.toggle('hot',i===hot);if(i===hot)c.classList.add('ok')});
    if(tick%cells.length===0)cells.forEach(c=>c.classList.remove('ok'));
  }
  if(v==='rows'){
    const rows=$$('.row',viz);if(!rows.length)return;
    const r=rows[tick%rows.length];
    const q=r.querySelector('.q b');q.textContent=+q.textContent+Math.ceil(Math.random()*9);
    r.classList.add('ok');r.querySelector('.s').textContent=tr('matched');
    if(tick%rows.length===0)rows.forEach(x=>{x.classList.remove('ok');x.querySelector('.q b').textContent=0;x.querySelector('.s').textContent=tr('pending')});
  }
  if(v==='pipe'){
    const steps=$$('.step',viz);if(!steps.length)return;
    const on=tick%5;
    steps.forEach((s,i)=>{s.classList.toggle('on',i===on);s.classList.toggle('done',i<on)});
    if(on===4)steps.forEach(s=>s.classList.remove('done'));
  }
  if(v==='bars'){
    $$('.bcol',viz).forEach(b=>{const h=25+Math.random()*75;b.style.height=h+'%';b.classList.toggle('hi',h>70);b.classList.toggle('lo',h<40)});
  }
  if(v==='kan'){
    tickets.forEach((tk,i)=>{if((tick+i)%3===0)tk.col=(tk.col+1)%3});
    [0,1,2].forEach(c=>{
      const box=viz.querySelector(`[data-c="${c}"]`);if(!box)return;
      box.innerHTML=tickets.filter(t=>t.col===c).map(t=>`<div class="tk"><b class="mono">${t.id}</b><br>${tr('tk')[t.k]}</div>`).join('');
    });
    const left=(tick*7)%100;
    const ring=$('#ring',viz);if(ring)ring.setAttribute('stroke-dashoffset',113*(left/100));
    const st=$('#slatxt',viz);if(st)st.textContent=`${tr('sla')} ${100-Math.round(left/2)}%`;
  }
}

function showDuty(i){
  cur=i;tick=0;
  tabs.forEach((b,k)=>b.setAttribute('aria-selected',k===i));
  const panel=$('.panel');panel.classList.remove('swap');void panel.offsetWidth;panel.classList.add('swap');
  $('#ptitle').textContent=T[LANG].duties[i].t;
  $('#pdesc').textContent=T[LANG].duties[i].d;
  viz.innerHTML=build(DUTY_V[i]);
  if(DUTY_V[i]==='kan')tickets.forEach(t=>t.col=0);
  tickViz();
}
tabs.forEach((b,i)=>{
  b.addEventListener('click',()=>showDuty(i));
  b.addEventListener('keydown',e=>{
    if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();const j=(i+1)%tabs.length;tabs[j].focus();tabs[j].click()}
    if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();const j=(i-1+tabs.length)%tabs.length;tabs[j].focus();tabs[j].click()}
  });
});
showDuty(0);
setInterval(tickViz,700);

/* ===== Peta pin ===== */
function renderPin(){
  const info=$('#pinfo');
  if(!selectedPin){info.innerHTML=`<b>${tr('pick_t')}</b><span>${tr('pick_d')}</span>`;return}
  info.innerHTML=`<b>${pick(selectedPin,'t')}</b><span>${pick(selectedPin,'d')}</span>`;
}
$$('.pin').forEach(p=>{
  const hit=document.createElementNS('http://www.w3.org/2000/svg','rect');
  hit.setAttribute('x',-10);hit.setAttribute('y',-22);hit.setAttribute('width',20);hit.setAttribute('height',26);hit.setAttribute('fill','transparent');
  p.appendChild(hit);p.setAttribute('tabindex',0);p.setAttribute('role','button');
  const select=()=>{
    $$('.pin').forEach(q=>q.classList.remove('sel'));p.classList.add('sel');
    selectedPin=p;renderPin();
  };
  p.addEventListener('click',select);
  p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select()}});
});
renderPin();

/* ===== Unduh resume ===== */
let dlTimers=[],popTimer=null,popFrame=null;
const CV_URL='CV_Andreas_Hasiholan_Sinaga.pdf';
function saveFile(){
  const name=CV_URL;
  const trigger=href=>{const l=document.createElement('a');l.href=href;l.download=name;l.rel='noopener';l.style.display='none';document.body.appendChild(l);l.click();l.remove()};
  if(window.CV_B64){
    try{
      const bin=atob(window.CV_B64),u8=new Uint8Array(bin.length);
      for(let k=0;k<bin.length;k++)u8[k]=bin.charCodeAt(k);
      const url=URL.createObjectURL(new Blob([u8],{type:'application/octet-stream'}));
      trigger(url);setTimeout(()=>URL.revokeObjectURL(url),10000);return;
    }catch(err){}
  }
  trigger(CV_URL);
}
function drawCvChar(f){
  const c=$('#cvchar'),g=c.getContext('2d');g.clearRect(0,0,64,64);
  const s=3,bob=f?-s:0;
  sprite(g,4,6+bob,s,f);
  /* CV kertas di tangan kanan */
  g.fillStyle='#ece3cf';g.fillRect(38,18+bob,18,24);
  g.fillStyle='#c9a45c';g.fillRect(41,22+bob,12,3);
  g.fillStyle='#8fa3b3';g.fillRect(41,28+bob,12,2);g.fillRect(41,32+bob,12,2);g.fillRect(41,36+bob,8,2);
  g.fillStyle='#6f8a55';g.fillRect(50,8+bob,3,3);g.fillRect(53,5+bob,3,3);g.fillRect(56,2+bob,3,3);g.fillRect(47,5+bob,3,3);
}
function showCvPop(){
  const p=$('#cvpop');
  $('#cvpop-t').textContent=tr('cvt');$('#cvpop-d').textContent=tr('cvd');
  clearTimeout(popTimer);clearInterval(popFrame);
  p.hidden=false;p.classList.remove('out');void p.offsetWidth;p.classList.add('in');
  let f=0;drawCvChar(0);popFrame=setInterval(()=>{f^=1;drawCvChar(f)},350);
  popTimer=setTimeout(hideCvPop,4200);
}
function hideCvPop(){
  const p=$('#cvpop');clearTimeout(popTimer);
  p.classList.remove('in');p.classList.add('out');
  setTimeout(()=>{if(p.classList.contains('out')){p.hidden=true;clearInterval(popFrame)}},400);
}
$('#cvpop-x').addEventListener('click',hideCvPop);
$('#dl').addEventListener('click',e=>{
  e.preventDefault();
  const b=e.currentTarget;
  if(b.dataset.state==='busy')return;
  saveFile(b);
  dlTimers.forEach(clearTimeout);dlTimers=[];
  b.dataset.state='busy';$('#dl-label').textContent=tr('dling');
  dlTimers.push(setTimeout(()=>{b.dataset.state='done';$('#dl-label').textContent=tr('dled');showCvPop()},1100));
  dlTimers.push(setTimeout(()=>{delete b.dataset.state;$('#dl-label').textContent=tr('dl')},3400));
});

/* ===== Jam footer (WIB) ===== */
function clockTick(){
  $('#clock').textContent=new Date().toLocaleTimeString(LANG==='id'?'id-ID':'en-GB',{timeZone:'Asia/Jakarta',hour:'2-digit',minute:'2-digit'})+' WIB';
}
clockTick();setInterval(clockTick,15000);

/* ===== Bahasa ===== */
function setLang(l){
  LANG=l;
  document.documentElement.dataset.lang=l;
  document.documentElement.lang=l;
  $$('.lang-btn').forEach(b=>{const on=b.dataset.set===l;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});
  $('#enter').textContent=tr('enter');
  $('#skip').textContent=tr('skip');
  const d=$('#dl'),st=d.dataset.state;$('#dl-label').textContent=tr(st==='busy'?'dling':st==='done'?'dled':'dl');
  setHint();
  renderPin();
  clockTick();
  if(siteOpen){showDuty(cur);runTerminal();}
  try{localStorage}catch(e){}
}
$$('.lang-btn').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.set)));
setLang('en');

/* ===== Reveal, spotlight, nav aktif ===== */
const rvObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rvObs.unobserve(e.target)}}),{threshold:.12});
$$('.rv').forEach(el=>rvObs.observe(el));

$$('.card,.stats div,.tab').forEach(el=>el.addEventListener('pointermove',e=>{
  const r=el.getBoundingClientRect();
  el.style.setProperty('--mx',(e.clientX-r.left)+'px');
  el.style.setProperty('--my',(e.clientY-r.top)+'px');
}));

const navObs=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){$$('.links a').forEach(a=>a.classList.toggle('act',a.getAttribute('href')==='#'+e.target.id))}
}),{rootMargin:'-45% 0px -50% 0px'});
['tentang','ops','kerja','peta','riset','kontak'].forEach(id=>{const s=document.getElementById(id);if(s)navObs.observe(s)});

/* ===== lemari: buka satu laci dalam satu waktu ===== */
$$('.drawer').forEach(dr=>{
  const head=dr.querySelector('.drawer-head');
  head.addEventListener('click',()=>{
    const willOpen=!dr.classList.contains('open');
    $$('.drawer').forEach(d=>{d.classList.remove('open');d.querySelector('.drawer-head').setAttribute('aria-expanded','false')});
    if(willOpen){dr.classList.add('open');head.setAttribute('aria-expanded','true')}
  });
});

/* ===== Kembali dari halaman lain: lewati launch page =====
   Launch page hanya muncul saat pertama buka / refresh. */
(function(){
  let reload=false,opened=false,y=0;
  try{
    const nav=performance.getEntriesByType('navigation')[0];
    reload=!!nav&&nav.type==='reload';
    opened=sessionStorage.getItem('siteOpened')==='1';
    y=parseInt(sessionStorage.getItem('siteScroll')||'0',10)||0;
    if(reload){sessionStorage.removeItem('siteOpened');sessionStorage.removeItem('siteScroll');opened=false}
  }catch(e){}
  addEventListener('pagehide',()=>{
    try{if(siteOpen)sessionStorage.setItem('siteScroll',String(Math.round(scrollY)))}catch(e){}
  });
  if(opened&&!reload){
    openSite(true);
    requestAnimationFrame(()=>{
      if(location.hash){const t=document.querySelector(location.hash);if(t){t.scrollIntoView();return}}
      window.scrollTo(0,y);
    });
  }
})();
