/* Navegación y home — se carga antes de app.js */
const TOOL_META=[
{id:'filtraciones',cat:'seguridad',title:'Filtraciones de correo',desc:'Dónde, qué y cuántos registros',icon:'mail'},
{id:'passwords',cat:'seguridad',title:'Contraseñas',desc:'Generar y estimar rotura',icon:'lock'},
{id:'pwdleak',cat:'seguridad',title:'¿Contraseña filtrada?',desc:'Comprobación k-anónima',icon:'shield'},
{id:'passphrases',cat:'seguridad',title:'Frases de paso',desc:'Memorables y resistentes',icon:'pen'},
{id:'cifrado',cat:'seguridad',title:'Cifrado y Base64',desc:'AES-GCM y codificación',icon:'key'},
{id:'hashes',cat:'seguridad',title:'Hashes',desc:'Integridad de archivos',icon:'hash'},
{id:'invisible',cat:'seguridad',title:'Caracteres invisibles',desc:'Zero-width en el portapapeles',icon:'clipboard'},
{id:'nombres',cat:'identidad',title:'Nombres / alias',desc:'Identidades operativas',icon:'user'},
{id:'huella',cat:'identidad',title:'Huella del navegador',desc:'Qué ven los sitios de ti',icon:'eye'},
{id:'storage',cat:'identidad',title:'Almacenamiento local',desc:'localStorage de este origen',icon:'database'},
{id:'permisos',cat:'identidad',title:'Permisos del navegador',desc:'Qué puede usar este sitio',icon:'check'},
{id:'metadatos',cat:'archivos',title:'Limpiar metadatos',desc:'GPS y EXIF fuera',icon:'image'},
{id:'metalectura',cat:'archivos',title:'Leer metadatos',desc:'Inspeccionar EXIF',icon:'search'},
{id:'pdf',cat:'archivos',title:'Herramientas PDF',desc:'Combinar, rotar, marca…',icon:'file'},
{id:'compresor',cat:'archivos',title:'Compresor',desc:'Menos peso, más control',icon:'box'},
{id:'convertidor',cat:'archivos',title:'Convertidor multimedia',desc:'PNG · JPEG · WebP',icon:'swap'},
{id:'stego',cat:'archivos',title:'Esteganografía',desc:'Texto oculto en imagen',icon:'spark'},
{id:'urls',cat:'red',title:'Limpiar URLs',desc:'Sin utm ni trackers',icon:'link'},
{id:'acortador',cat:'red',title:'IDs cortos',desc:'Códigos locales offline',icon:'tag'},
{id:'ip',cat:'red',title:'IP y VPN',desc:'IP pública, red y señales VPN',icon:'globe'},
{id:'qr',cat:'red',title:'Generador QR',desc:'Código QR 100% local',icon:'qr'}
];
const CAT_LABEL={seguridad:'Seguridad',identidad:'Identidad',archivos:'Archivos y media',red:'Enlaces'};
const ICONS={
mail:'<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
pen:'<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
key:'<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>',
hash:'<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>',
user:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
eye:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
search:'<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>',
file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
box:'<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>',
swap:'<polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/>',
spark:'<path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/>',
link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
tag:'<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',
globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
clipboard:'<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>',
qr:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3"/>',
database:'<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
check:'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
};
const ICON_COLOR={seguridad:'text-emerald-400',identidad:'text-violet-400',archivos:'text-amber-400',red:'text-cyan-400'};

let currentCat='all',currentQ='';

function showTool(id){
  document.querySelectorAll('.tool-panel').forEach(p=>p.classList.remove('active'));
  const p=document.getElementById('panel-'+id);
  if(p)p.classList.add('active');
  document.getElementById('mobileTools')?.classList.add('hidden');
  const bar=document.getElementById('toolBar');
  if(bar){
    if(id==='home'||id==='principios'){bar.classList.add('hidden')}
    else{
      bar.classList.remove('hidden');
      const meta=TOOL_META.find(t=>t.id===id);
      document.getElementById('toolBarTitle').textContent=meta?meta.title:(id==='principios'?'Principios':'Herramienta');
    }
  }
  window.scrollTo({top:0,behavior:'smooth'});
  try{history.replaceState(null,'','#'+id)}catch(e){}
  if(id==='storage')try{refreshStorageView()}catch(e){}
}

function filterTools(){
  const q=currentQ.trim().toLowerCase();
  const grid=document.getElementById('toolsGrid');
  if(!grid)return;
  let html='';
  const groups=currentCat==='all'?['seguridad','identidad','archivos','red']:[currentCat];
  groups.forEach(cat=>{
    const items=TOOL_META.filter(t=>t.cat===cat&&(!q||t.title.toLowerCase().includes(q)||t.desc.toLowerCase().includes(q)||cat.includes(q)));
    if(!items.length)return;
    html+=`<div class="col-span-full mt-2 first:mt-0"><p class="text-xs uppercase tracking-wider text-steel/80 mb-2 font-medium">${CAT_LABEL[cat]}</p></div>`;
    items.forEach(t=>{
      const ic=ICONS[t.icon]||ICONS.file;
      const col=ICON_COLOR[t.cat]||'text-neon';
      html+=`<button onclick="showTool('${t.id}')" class="tool-card group text-left p-4 rounded-2xl bg-panel border border-white/5 hover:border-neon/35 hover:glow-blue transition flex items-start justify-between gap-3">
        <div class="min-w-0"><h2 class="font-semibold text-white">${t.title}</h2><p class="text-sm text-steel mt-0.5 leading-snug">${t.desc}</p></div>
        <svg class="w-5 h-5 ${col} shrink-0 mt-0.5 opacity-90" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">${ic}</svg>
      </button>`;
    });
  });
  if(!html)html='<p class="col-span-full text-steel text-sm py-8 text-center">Ninguna herramienta coincide con la búsqueda.</p>';
  grid.innerHTML=html;
}

function setCat(cat){
  currentCat=cat;
  document.querySelectorAll('[data-cat]').forEach(b=>{
    const on=b.getAttribute('data-cat')===cat;
    b.classList.toggle('bg-neon/15',on);
    b.classList.toggle('text-neon',on);
    b.classList.toggle('border-neon/30',on);
    b.classList.toggle('text-steel',!on);
    b.classList.toggle('border-white/10',!on);
  });
  filterTools();
}

function onSearch(v){currentQ=v;filterTools()}

document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('mobileToolsBtn')?.addEventListener('click',()=>document.getElementById('mobileTools').classList.toggle('hidden'));
  filterTools();
  const hash=(location.hash||'').slice(1);
  if(hash&&document.getElementById('panel-'+hash))showTool(hash);
  else showTool('home');
});

function fpEsc(s){return String(s??'—').replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>')}
function fpSleep(ms){return new Promise(r=>setTimeout(r,ms))}
async function fpHash(str){
  const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}
function fpSection(title,items){
  return `<div class="p-4 rounded-2xl bg-void border border-white/10 space-y-2">
    <p class="text-[11px] uppercase tracking-wider text-neon/80 font-medium">${title}</p>
    ${items.map(([k,v])=>`<div class="flex flex-col sm:flex-row sm:gap-3 py-1.5 border-b border-white/5 last:border-0"><span class="text-xs text-steel w-40 shrink-0">${fpEsc(k)}</span><span class="text-sm text-white break-all">${fpEsc(v)}</span></div>`).join('')}
  </div>`;
}
async function probeWebRTC(){
  return new Promise(resolve=>{
    const ips=new Set();
    let done=false;
    const finish=()=>{if(done)return;done=true;try{pc.close()}catch(e){}resolve([...ips])};
    let pc;
    try{
      pc=new RTCPeerConnection({iceServers:[{urls:'stun:stun.l.google.com:19302'}]});
      pc.createDataChannel('');
      pc.onicecandidate=e=>{
        if(!e.candidate){finish();return}
        const c=e.candidate.candidate||'';
        const m=/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9:]{3,})/i.exec(c);
        if(m)ips.add(m[1]);
      };
      pc.createOffer().then(o=>pc.setLocalDescription(o)).catch(()=>finish());
      setTimeout(finish,1800);
    }catch(e){resolve([])}
  });
}
async function probeAudio(){
  try{
    const ctx=new (window.OfflineAudioContext||window.webkitOfflineAudioContext)(1,44100,44100);
    const osc=ctx.createOscillator();const comp=ctx.createDynamicsCompressor();
    osc.type='triangle';osc.frequency.value=10000;comp.threshold.value=-50;comp.knee.value=40;
    osc.connect(comp);comp.connect(ctx.destination);osc.start(0);
    const buf=await ctx.startRendering();
    let sum=0;const data=buf.getChannelData(0);
    for(let i=4500;i<5000;i++)sum+=Math.abs(data[i]);
    return (await fpHash('audio:'+sum.toFixed(8))).slice(0,16)+'…';
  }catch(e){return 'no disponible'}
}
async function probeCanvas(){
  try{
    const c=document.createElement('canvas');c.width=320;c.height=120;
    const ctx=c.getContext('2d');
    ctx.textBaseline='alphabetic';ctx.font='18px "Arial"';
    ctx.fillStyle='#0a84ff';ctx.fillRect(0,0,320,120);
    ctx.fillStyle='#fff';ctx.fillText('privacidad·tools 🌟',12,40);
    ctx.fillStyle='rgba(255,0,120,0.5)';ctx.fillRect(40,50,180,40);
    ctx.font='14px "Times New Roman"';ctx.fillStyle='#0f0';ctx.fillText('AaBbCc 0123',12,100);
    const data=c.toDataURL();
    return (await fpHash(data)).slice(0,20)+'…';
  }catch(e){return 'no disponible'}
}
function probeWebGL(){
  try{
    const gl=document.createElement('canvas').getContext('webgl')||document.createElement('canvas').getContext('experimental-webgl');
    if(!gl)return {vendor:'—',renderer:'—',ok:false};
    const dbg=gl.getExtension('WEBGL_debug_renderer_info');
    return{
      vendor:dbg?gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL):gl.getParameter(gl.VENDOR),
      renderer:dbg?gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),
      ok:true
    };
  }catch(e){return{vendor:'error',renderer:'error',ok:false}}
}

async function analyzeFingerprint(){
  const out=document.getElementById('fpOut');
  const wrap=document.getElementById('fpProgressWrap');
  const bar=document.getElementById('fpProgress');
  const status=document.getElementById('fpStatus');
  const btn=document.getElementById('fpBtn');
  if(!out)return;
  if(btn)btn.disabled=true;
  if(wrap)wrap.classList.remove('hidden');
  out.innerHTML='';
  const setP=(p,msg)=>{if(bar)bar.style.width=p+'%';if(status)status.textContent=msg};

  setP(8,'Leyendo entorno del sistema…');
  await fpSleep(180);
  const sys=[
    ['Idioma',navigator.language||'—'],
    ['Idiomas',(navigator.languages||[]).join(', ')||'—'],
    ['Zona horaria',Intl.DateTimeFormat().resolvedOptions().timeZone||'—'],
    ['Plataforma',navigator.platform||'—'],
    ['Núcleos CPU',String(navigator.hardwareConcurrency??'—')],
    ['Memoria (approx.)',navigator.deviceMemory?navigator.deviceMemory+' GB':'no expuesta'],
    ['Cookies',navigator.cookieEnabled?'habilitadas':'deshabilitadas'],
    ['Do Not Track',navigator.doNotTrack||'no indicado']
  ];

  setP(22,'Midiendo pantalla y viewport…');
  await fpSleep(160);
  const screenRows=[
    ['Resolución',`${screen.width}×${screen.height}`],
    ['Disponible',`${screen.availWidth}×${screen.availHeight}`],
    ['DPR',String(window.devicePixelRatio||1)],
    ['Profundidad de color',String(screen.colorDepth||'—')],
    ['Ventana',`${window.innerWidth}×${window.innerHeight}`]
  ];

  setP(38,'Calculando huella de canvas…');
  await fpSleep(120);
  const canvasHash=await probeCanvas();

  setP(52,'Consultando WebGL…');
  await fpSleep(140);
  const gl=probeWebGL();

  setP(65,'Muestreando audio offline…');
  const audioHash=await probeAudio();
  await fpSleep(80);

  setP(78,'Comprobando candidatos WebRTC (STUN)…');
  if(status)status.textContent='Comprobando candidatos WebRTC…';
  const ips=await probeWebRTC();
  setP(92,'Organizando resultados…');
  await fpSleep(120);

  const ua=navigator.userAgent||'—';
  let risk=35;
  if(gl.ok)risk+=15;
  if(canvasHash!=='no disponible')risk+=15;
  if(audioHash!=='no disponible')risk+=10;
  if(ips.length)risk+=20;
  if(navigator.deviceMemory)risk+=5;
  risk=Math.min(95,risk);
  const riskLabel=risk>=70?'Alta superficie':risk>=45?'Media':'Más contenida';
  const riskColor=risk>=70?'text-red-300 border-red-500/30 bg-red-500/10':risk>=45?'text-amber-300 border-amber-500/30 bg-amber-500/10':'text-emerald-300 border-emerald-500/30 bg-emerald-500/10';

  setP(100,'Listo');
  if(status)status.textContent='Análisis local completado';

  const webrtcRows=ips.length
    ?[['Candidatos detectados',ips.join(', ')],['Nota','WebRTC puede filtrar IPs locales/públicas aunque uses VPN en algunos casos']]
    :[['Candidatos','ninguno en esta prueba'],['Nota','Bloqueo de WebRTC o red sin STUN visible']];

  out.innerHTML=`
    <div class="p-5 rounded-2xl border ${riskColor} mb-4">
      <p class="text-xs uppercase tracking-wider opacity-80 mb-1">Superficie de rastreo (orientativa)</p>
      <p class="text-2xl font-bold text-white">${risk}<span class="text-base font-medium text-steel">/100</span></p>
      <p class="text-sm mt-1 ${riskColor.split(' ')[0]}">${riskLabel}</p>
      <p class="text-xs text-steel mt-2 leading-relaxed">No es un ranking de privacidad absoluto: combina señales típicas (canvas, WebGL, audio, WebRTC). Extensiones anti-huella y contenedores reducen parte de esto.</p>
    </div>
    <div class="grid gap-3">
      ${fpSection('Sistema',sys)}
      ${fpSection('Pantalla',screenRows)}
      ${fpSection('Huellas de renderizado',[
        ['Canvas (SHA-256)',canvasHash],
        ['Audio (SHA-256)',audioHash],
        ['WebGL vendor',gl.vendor],
        ['WebGL renderer',gl.renderer]
      ])}
      ${fpSection('WebRTC',webrtcRows)}
      ${fpSection('User-Agent',[['Cadena completa',ua]])}
    </div>
    <p class="text-xs text-steel mt-4 leading-relaxed">Todo el análisis se ha hecho en tu navegador. No se ha subido ningún dato a un servidor nuestro.</p>`;
  if(btn)btn.disabled=false;
}
