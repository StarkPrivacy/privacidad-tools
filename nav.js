/* Navegación y home — se carga antes de app.js */
const TOOL_META=[
{id:'filtraciones',cat:'seguridad',title:'Filtraciones de correo',desc:'Dónde, qué y cuántos registros',icon:'mail'},
{id:'passwords',cat:'seguridad',title:'Contraseñas',desc:'Generar y estimar rotura',icon:'lock'},
{id:'pwdleak',cat:'seguridad',title:'¿Contraseña filtrada?',desc:'Comprobación k-anónima',icon:'shield'},
{id:'passphrases',cat:'seguridad',title:'Frases de paso',desc:'Memorables y resistentes',icon:'pen'},
{id:'cifrado',cat:'seguridad',title:'Cifrado y Base64',desc:'AES-GCM y codificación',icon:'key'},
{id:'hashes',cat:'seguridad',title:'Hashes',desc:'Integridad de archivos',icon:'hash'},
{id:'nombres',cat:'identidad',title:'Nombres / alias',desc:'Identidades operativas',icon:'user'},
{id:'huella',cat:'identidad',title:'Huella del navegador',desc:'Qué ven los sitios de ti',icon:'eye'},
{id:'metadatos',cat:'archivos',title:'Limpiar metadatos',desc:'GPS y EXIF fuera',icon:'image'},
{id:'metalectura',cat:'archivos',title:'Leer metadatos',desc:'Inspeccionar EXIF',icon:'search'},
{id:'pdf',cat:'archivos',title:'Herramientas PDF',desc:'Combinar, rotar, marca…',icon:'file'},
{id:'compresor',cat:'archivos',title:'Compresor',desc:'Menos peso, más control',icon:'box'},
{id:'convertidor',cat:'archivos',title:'Convertidor multimedia',desc:'PNG · JPEG · WebP',icon:'swap'},
{id:'stego',cat:'archivos',title:'Esteganografía',desc:'Texto oculto en imagen',icon:'spark'},
{id:'urls',cat:'red',title:'Limpiar URLs',desc:'Sin utm ni trackers',icon:'link'},
{id:'acortador',cat:'red',title:'IDs cortos',desc:'Códigos locales offline',icon:'tag'}
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
tag:'<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>'
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
}

function filterTools(){
  const q=currentQ.trim().toLowerCase();
  const grid=document.getElementById('toolsGrid');
  if(!grid)return;
  let html='';
  const groups=currentCat==='all'
    ?['seguridad','identidad','archivos','red']
    :[currentCat];
  groups.forEach(cat=>{
    const items=TOOL_META.filter(t=>t.cat===cat&&(!q||t.title.toLowerCase().includes(q)||t.desc.toLowerCase().includes(q)||cat.includes(q)));
    if(!items.length)return;
    html+=`<div class="col-span-full mt-2 first:mt-0"><p class="text-xs uppercase tracking-wider text-steel/80 mb-2 font-medium">${CAT_LABEL[cat]}</p></div>`;
    items.forEach(t=>{
      const ic=ICONS[t.icon]||ICONS.file;
      const col=ICON_COLOR[t.cat]||'text-neon';
      html+=`<button onclick="showTool('${t.id}')" class="tool-card group text-left p-4 rounded-2xl bg-panel border border-white/5 hover:border-neon/35 hover:glow-blue transition flex items-start justify-between gap-3">
        <div class="min-w-0"><h2 class="font-semibold text-white group-hover:text-white">${t.title}</h2><p class="text-sm text-steel mt-0.5 leading-snug">${t.desc}</p></div>
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

async function analyzeFingerprint(){
  const out=document.getElementById('fpOut');
  if(!out)return;
  out.innerHTML='<p class="text-steel text-sm">Analizando en local…</p>';
  const rows=[];
  const add=(k,v)=>rows.push([k,v]);
  add('Idioma',navigator.language||'—');
  add('Idiomas',(navigator.languages||[]).join(', ')||'—');
  add('Zona horaria',Intl.DateTimeFormat().resolvedOptions().timeZone||'—');
  add('Plataforma',navigator.platform||'—');
  add('Núcleos CPU',String(navigator.hardwareConcurrency||'—'));
  add('Memoria (approx.)',navigator.deviceMemory?navigator.deviceMemory+' GB':'no expuesta');
  add('Pantalla',`${screen.width}×${screen.height} · DPR ${window.devicePixelRatio||1}`);
  add('Color depth',String(screen.colorDepth||'—'));
  add('Cookies',navigator.cookieEnabled?'habilitadas':'deshabilitadas');
  add('Do Not Track',navigator.doNotTrack||'no indicado');
  add('User-Agent',navigator.userAgent||'—');
  try{
    const c=document.createElement('canvas');
    c.width=240;c.height=60;
    const ctx=c.getContext('2d');
    ctx.textBaseline='top';ctx.font='16px Arial';ctx.fillStyle='#0a84ff';ctx.fillRect(0,0,240,60);
    ctx.fillStyle='#fff';ctx.fillText('privacidad·tools',8,20);
    const data=c.toDataURL();
    const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(data));
    const hex=Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('').slice(0,16);
    add('Huella canvas (extracto)',hex+'…');
  }catch(e){add('Huella canvas','no disponible')}
  try{
    const gl=document.createElement('canvas').getContext('webgl');
    if(gl){
      const dbg=gl.getExtension('WEBGL_debug_renderer_info');
      add('WebGL vendor',dbg?gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL):gl.getParameter(gl.VENDOR));
      add('WebGL renderer',dbg?gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER));
    }else add('WebGL','no disponible');
  }catch(e){add('WebGL','error')}
  out.innerHTML=rows.map(([k,v])=>`<div class="flex flex-col sm:flex-row sm:gap-4 py-2.5 border-b border-white/5"><span class="text-xs text-steel w-44 shrink-0">${k}</span><span class="text-sm text-white break-all">${String(v).replace(/</g,'&lt;')}</span></div>`).join('')+
    `<p class="text-xs text-steel mt-4 leading-relaxed">Esto no se envía a ningún servidor. Sirve para ver señales que sitios y trackers pueden combinar para reconocerte. Extensiones anti-huella y contenedores de identidad reducen parte de esta superficie.</p>`;
}
