/* Herramientas adicionales: IP/VPN, invisibles, QR, storage, permisos */

const ZW_MAP={
'\u200B':'ZERO WIDTH SPACE (U+200B)',
'\u200C':'ZERO WIDTH NON-JOINER (U+200C)',
'\u200D':'ZERO WIDTH JOINER (U+200D)',
'\uFEFF':'BOM / ZERO WIDTH NO-BREAK (U+FEFF)',
'\u2060':'WORD JOINER (U+2060)',
'\u180E':'MONGOLIAN VOWEL SEPARATOR (U+180E)',
'\u00AD':'SOFT HYPHEN (U+00AD)',
'\u200E':'LEFT-TO-RIGHT MARK (U+200E)',
'\u200F':'RIGHT-TO-LEFT MARK (U+200F)',
'\u202A':'LRE (U+202A)','\u202B':'RLE (U+202B)','\u202C':'PDF (U+202C)',
'\u202D':'LRO (U+202D)','\u202E':'RLO (U+202E)',
'\u2066':'LRI (U+2066)','\u2067':'RLI (U+2067)','\u2068':'FSI (U+2068)','\u2069':'PDI (U+2069)'
};
const ZW_RE=/[\u200B\u200C\u200D\uFEFF\u2060\u180E\u00AD\u200E\u200F\u202A-\u202E\u2066-\u2069]/g;

function xEsc(s){return String(s??'—').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function xSleep(ms){return new Promise(r=>setTimeout(r,ms))}

const VPN_HINTS=/(vpn|proxy|hosting|datacenter|data center|cloud|vps|dedicated|server|digitalocean|linode|ovh|hetzner|amazon|aws|google|microsoft|azure|cloudflare|oracle|m247|choopa|vultr|contabo|nord|expressvpn|mullvad|proton|surfshark|private internet|pia|cyberghost)/i;

async function runIpCheck(){
  const out=document.getElementById('ipOut');
  const wrap=document.getElementById('ipProgressWrap');
  const bar=document.getElementById('ipProgress');
  const status=document.getElementById('ipStatus');
  const btn=document.getElementById('ipBtn');
  if(!out)return;
  if(btn)btn.disabled=true;
  if(wrap)wrap.classList.remove('hidden');
  out.innerHTML='';
  const setP=(p,msg)=>{if(bar)bar.style.width=p+'%';if(status)status.textContent=msg};

  let pub='', geo=null, webrtc=[];
  try{
    setP(12,'Consultando IP pública…');
    const r1=await fetch('https://api.ipify.org?format=json',{cache:'no-store'});
    const j1=await r1.json();
    pub=j1.ip||'';
    await xSleep(120);

    setP(35,'Obteniendo red y geolocalización aproximada…');
    try{
      const r2=await fetch('https://ipwho.is/'+encodeURIComponent(pub),{cache:'no-store'});
      geo=await r2.json();
    }catch(e){
      try{
        const r3=await fetch('https://ipapi.co/'+encodeURIComponent(pub)+'/json/',{cache:'no-store'});
        const g=await r3.json();
        geo={
          success:!g.error, ip:g.ip, city:g.city, region:g.region, country:g.country_name, country_code:g.country_code,
          connection:{isp:g.org||g.org_name, org:g.org, asn:g.asn},
          security:{vpn:false,proxy:false,tor:false,hosting:false}
        };
      }catch(e2){geo={success:false}}
    }
    await xSleep(100);

    setP(60,'Sondeando candidatos WebRTC…');
    if(typeof probeWebRTC==='function') webrtc=await probeWebRTC();
    else webrtc=[];
    setP(85,'Evaluando señales de VPN / hosting…');
    await xSleep(150);
  }catch(e){
    setP(100,'Error de red');
    out.innerHTML=`<p class="text-red-300 text-sm">No se pudo completar la consulta: ${xEsc(e.message)}. Comprueba la conexión.</p>`;
    if(btn)btn.disabled=false;
    return;
  }

  const conn=geo&&geo.connection?geo.connection:{};
  const sec=geo&&geo.security?geo.security:{};
  const isp=(conn.isp||conn.org||'').toString();
  const org=(conn.org||isp).toString();
  const asn=conn.asn!=null?String(conn.asn):'—';
  const city=[geo&&geo.city, geo&&geo.region, geo&&geo.country].filter(Boolean).join(', ')||'—';
  const flagVpn=!!(sec.vpn||sec.proxy||sec.tor);
  const flagHost=!!sec.hosting || VPN_HINTS.test(isp+' '+org);
  let verdict='Tráfico que parece residencial / ISP habitual';
  let vClass='text-emerald-300 border-emerald-500/30 bg-emerald-500/10';
  if(flagVpn){verdict='Señales de VPN, proxy o Tor detectadas por la base de datos';vClass='text-amber-300 border-amber-500/30 bg-amber-500/10'}
  else if(flagHost){verdict='Red compatible con hosting / datacenter / VPN (heurística)';vClass='text-amber-300 border-amber-500/30 bg-amber-500/10'}

  setP(100,'Listo');
  if(status)status.textContent='Consulta completada';

  const localOnly=webrtc.filter(ip=>/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|fd|fc)/i.test(ip));
  const otherWebrtc=webrtc.filter(ip=>!localOnly.includes(ip));

  out.innerHTML=`
  <div class="p-5 rounded-2xl border ${vClass} mb-4">
    <p class="text-xs uppercase tracking-wider opacity-80 mb-1">Valoración orientativa</p>
    <p class="text-lg font-semibold text-white">${xEsc(verdict)}</p>
    <p class="text-xs text-steel mt-2 leading-relaxed">Ningún detector es infalible: muchas VPN residenciales no se marcan, y algunos ISP de hosting se parecen a VPN.</p>
  </div>
  <div class="grid gap-3">
    <div class="p-4 rounded-2xl bg-void border border-white/10 space-y-2">
      <p class="text-[11px] uppercase tracking-wider text-neon/80 font-medium">IP pública</p>
      <p class="text-xl font-mono text-white break-all">${xEsc(pub|| (geo&&geo.ip) || '—')}</p>
      <p class="text-sm text-steel">${xEsc(city)}</p>
    </div>
    <div class="p-4 rounded-2xl bg-void border border-white/10 space-y-2">
      <p class="text-[11px] uppercase tracking-wider text-neon/80 font-medium">Red / operador</p>
      <div class="text-sm space-y-1">
        <div class="flex gap-2"><span class="text-steel w-24 shrink-0">ISP / org</span><span class="text-white break-all">${xEsc(isp||org||'—')}</span></div>
        <div class="flex gap-2"><span class="text-steel w-24 shrink-0">ASN</span><span class="text-white">${xEsc(asn)}</span></div>
        <div class="flex gap-2"><span class="text-steel w-24 shrink-0">VPN flag</span><span class="text-white">${flagVpn?'sí':'no indicado'}</span></div>
        <div class="flex gap-2"><span class="text-steel w-24 shrink-0">Hosting</span><span class="text-white">${flagHost?'posible / sí':'no destacado'}</span></div>
      </div>
    </div>
    <div class="p-4 rounded-2xl bg-void border border-white/10 space-y-2">
      <p class="text-[11px] uppercase tracking-wider text-neon/80 font-medium">WebRTC (este dispositivo)</p>
      <p class="text-sm text-white break-all">${webrtc.length?xEsc(webrtc.join(', ')):'ningún candidato en esta prueba'}</p>
      ${otherWebrtc.length&&pub&&otherWebrtc.some(i=>i!==pub)?`<p class="text-xs text-amber-300 mt-1">Hay candidatos distintos de la IP pública: revisa fugas WebRTC si usas VPN.</p>`:''}
      ${localOnly.length?`<p class="text-xs text-steel mt-1">Locales: ${xEsc(localOnly.join(', '))}</p>`:''}
    </div>
    <div class="p-4 rounded-2xl border border-neon/25 bg-neon/5 space-y-2">
      <p class="text-white font-medium text-sm">¿Quieres una VPN seria?</p>
      <p class="text-sm text-steel leading-relaxed">Recomendamos <strong class="text-mist">Proton VPN</strong>: sin registros de actividad, apps abiertas y sede en Suiza. Puedes empezar desde nuestro enlace:</p>
      <a href="https://privtr.ee/@stark" target="_blank" rel="noopener" class="inline-flex px-4 py-2.5 rounded-xl bg-neon text-void font-semibold text-sm hover:bg-neon-glow transition">Proton VPN → privtr.ee/@stark</a>
    </div>
  </div>
  <p class="text-xs text-steel mt-4 leading-relaxed">Esta herramienta necesita Internet (consulta de IP/geo). La petición sale desde <strong class="text-mist">tu navegador</strong>, no desde un servidor nuestro. No almacenamos el resultado.</p>`;
  if(btn)btn.disabled=false;
}

function analyzeInvisibleText(raw){
  const found=[];
  const counts={};
  for(const ch of raw){
    if(ZW_MAP[ch]){counts[ch]=(counts[ch]||0)+1}
  }
  Object.keys(counts).forEach(ch=>{
    found.push({ch, name:ZW_MAP[ch], n:counts[ch], code:'U+'+ch.codePointAt(0).toString(16).toUpperCase().padStart(4,'0')});
  });
  const cleaned=raw.replace(ZW_RE,'');
  return {found, cleaned, total:found.reduce((a,b)=>a+b.n,0), len:raw.length};
}

async function scanClipboardInvisible(){
  const out=document.getElementById('invOut');
  const status=document.getElementById('invStatus');
  if(!out)return;
  status.textContent='Leyendo portapapeles…';
  try{
    if(!navigator.clipboard||!navigator.clipboard.readText){
      status.textContent='Este navegador no permite leer el portapapeles aquí. Pega el texto en el cuadro.';
      return;
    }
    const t=await navigator.clipboard.readText();
    document.getElementById('invInput').value=t;
    renderInvisible(t);
    status.textContent='Portapapeles leído en local.';
  }catch(e){
    status.textContent='No se pudo leer el portapapeles (permiso denegado o vacío). Pega el texto manualmente.';
  }
}

function scanInvisibleInput(){
  const t=document.getElementById('invInput').value||'';
  renderInvisible(t);
  document.getElementById('invStatus').textContent='Análisis local completado.';
}

function renderInvisible(t){
  const out=document.getElementById('invOut');
  const r=analyzeInvisibleText(t);
  if(!t){out.innerHTML='<p class="text-steel text-sm">No hay texto.</p>';return}
  if(!r.total){
    out.innerHTML=`<div class="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10"><p class="text-emerald-300 font-medium">Sin caracteres invisibles habituales</p><p class="text-xs text-steel mt-1">${r.len} caracteres visibles analizados.</p></div>`;
    return;
  }
  out.innerHTML=`
  <div class="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 mb-3">
    <p class="text-amber-300 font-medium">${r.total} carácter(es) invisible(s) detectado(s)</p>
  </div>
  <div class="space-y-2 mb-4">${r.found.map(f=>`<div class="p-3 rounded-xl bg-void border border-white/10 text-sm flex justify-between gap-3"><span class="text-white">${xEsc(f.name)} <span class="text-steel">${f.code}</span></span><span class="text-neon font-mono">×${f.n}</span></div>`).join('')}</div>
  <p class="text-xs text-steel mb-2">Texto limpio (sin zero-width):</p>
  <textarea id="invClean" class="w-full h-28 bg-void border border-white/10 rounded-xl px-4 py-3 text-sm text-white result-box">${xEsc(r.cleaned)}</textarea>
  <button onclick="navigator.clipboard.writeText(document.getElementById('invClean').value)" class="mt-2 px-4 py-2 rounded-xl border border-white/10 text-sm text-steel hover:text-mist">Copiar limpio</button>`;
}

function generateQr(){
  const text=(document.getElementById('qrInput').value||'').trim();
  const box=document.getElementById('qrCanvasWrap');
  const status=document.getElementById('qrStatus');
  box.innerHTML='';
  if(!text){status.textContent='Escribe un texto o URL.';return}
  if(typeof QRCode==='undefined'){status.textContent='Librería QR no cargada. Recarga la página.';return}
  status.textContent='Generando en local…';
  const canvas=document.createElement('canvas');
  QRCode.toCanvas(canvas, text, {width:240, margin:2, color:{dark:'#0a84ff', light:'#05070a'}}, function(err){
    if(err){status.textContent='Error: '+err.message;return}
    box.appendChild(canvas);
    status.textContent='Listo. No se ha enviado nada a ningún servidor.';
    const btn=document.getElementById('qrDownload');
    btn.classList.remove('hidden');
    btn.onclick=()=>{
      canvas.toBlob(b=>{
        const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='qr-privacidad.png';a.click();
        setTimeout(()=>URL.revokeObjectURL(a.href),2000);
      });
    };
  });
}

function refreshStorageView(){
  const out=document.getElementById('storageOut');
  if(!out)return;
  const rows=[];
  let total=0;
  try{
    for(let i=0;i<localStorage.length;i++){
      const k=localStorage.key(i);
      const v=localStorage.getItem(k)||'';
      total+=k.length+v.length;
      rows.push({k, bytes:k.length+v.length, preview:v.slice(0,80)+(v.length>80?'…':'')});
    }
  }catch(e){out.innerHTML='<p class="text-red-300 text-sm">No se puede leer localStorage.</p>';return}
  if(!rows.length){
    out.innerHTML='<p class="text-steel text-sm">Este origen no tiene datos en localStorage.</p>';
    return;
  }
  out.innerHTML=`
  <p class="text-sm text-steel mb-3">${rows.length} clave(s) · ~${total} caracteres</p>
  <div class="space-y-2 max-h-80 overflow-y-auto">${rows.map(r=>`
    <div class="p-3 rounded-xl bg-void border border-white/10">
      <div class="flex justify-between gap-2"><span class="text-white text-sm font-mono break-all">${xEsc(r.k)}</span><span class="text-xs text-steel shrink-0">${r.bytes} B</span></div>
      <p class="text-xs text-steel mt-1 break-all">${xEsc(r.preview)}</p>
    </div>`).join('')}</div>`;
}

function clearLocalStorageTool(){
  if(!confirm('¿Borrar TODO el localStorage de este origen (privacidad-tools)?'))return;
  try{localStorage.clear();refreshStorageView();document.getElementById('storageStatus').textContent='localStorage vaciado.';}
  catch(e){document.getElementById('storageStatus').textContent='Error: '+e.message}
}

function clearSessionStorageTool(){
  try{sessionStorage.clear();document.getElementById('storageStatus').textContent='sessionStorage vaciado.';}
  catch(e){document.getElementById('storageStatus').textContent='Error: '+e.message}
}

const PERM_LIST=[
  ['geolocation','Ubicación'],
  ['notifications','Notificaciones'],
  ['camera','Cámara'],
  ['microphone','Micrófono'],
  ['clipboard-read','Leer portapapeles'],
  ['clipboard-write','Escribir portapapeles'],
  ['midi','MIDI'],
  ['push','Push'],
  ['persistent-storage','Almacenamiento persistente']
];

async function checkPermissions(){
  const out=document.getElementById('permOut');
  const wrap=document.getElementById('permProgressWrap');
  const bar=document.getElementById('permProgress');
  const status=document.getElementById('permStatus');
  if(!out)return;
  if(wrap)wrap.classList.remove('hidden');
  out.innerHTML='';
  const rows=[];
  const n=PERM_LIST.length;
  for(let i=0;i<n;i++){
    const [name,label]=PERM_LIST[i];
    if(bar)bar.style.width=Math.round(((i+1)/n)*100)+'%';
    if(status)status.textContent='Consultando: '+label+'…';
    let state='no soportado';
    try{
      if(navigator.permissions&&navigator.permissions.query){
        const r=await navigator.permissions.query({name});
        state=r.state;
      }
    }catch(e){state='no consultable'}
    rows.push([label,state]);
    await xSleep(40);
  }
  if(status)status.textContent='Listo (solo este origen / políticas del navegador)';
  const color=s=>s==='granted'?'text-emerald-300':s==='denied'?'text-red-300':s==='prompt'?'text-amber-300':'text-steel';
  out.innerHTML=`
  <div class="space-y-2">${rows.map(([k,v])=>`
    <div class="flex justify-between gap-3 py-2.5 border-b border-white/5">
      <span class="text-sm text-white">${xEsc(k)}</span>
      <span class="text-sm font-mono ${color(v)}">${xEsc(v)}</span>
    </div>`).join('')}</div>
  <p class="text-xs text-steel mt-4 leading-relaxed">“prompt” = aún no has decidido. “granted/denied” = decisión guardada para este origen. No se activan cámaras ni micrófonos al consultar.</p>`;
}
