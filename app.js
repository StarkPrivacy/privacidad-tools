function showTool(id){document.querySelectorAll('.tool-panel').forEach(p=>p.classList.remove('active'));const p=document.getElementById('panel-'+id);if(p)p.classList.add('active');const m=document.getElementById('mobileTools');if(m)m.classList.add('hidden');window.scrollTo({top:0,behavior:'smooth'})}
document.getElementById('mobileToolsBtn')?.addEventListener('click',()=>document.getElementById('mobileTools').classList.toggle('hidden'));
function copyText(id){const el=document.getElementById(id);if(el&&el.value)navigator.clipboard.writeText(el.value)}
function copyPlain(id){const t=document.getElementById(id)?.textContent?.trim();if(t&&t!=='—')navigator.clipboard.writeText(t)}
function downloadBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2500)}
function loadImage(file){return new Promise((res,rej)=>{const img=new Image();img.onload=()=>res(img);img.onerror=rej;img.src=URL.createObjectURL(file)})}
function animateProgress(id,ms,done){const bar=document.getElementById(id);if(!bar)return;let p=0;bar.style.width='0%';const step=100/(ms/40);const t=setInterval(()=>{p=Math.min(100,p+step+Math.random()*3);bar.style.width=p+'%';if(p>=100){clearInterval(t);if(done)done()}},40)}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function randHex(n){const a=new Uint8Array(n);crypto.getRandomValues(a);return Array.from(a,b=>b.toString(16).padStart(2,'0')).join('')}
function fmtTime(sec){if(sec<1)return'Ves de 1 s';if(sec<60)return sec.toFixed(1)+' s';if(sec<3600)return(sec/60).toFixed(1)+' min';if(sec<86400)return(sec/3600).toFixed(1)+' h';if(sec<31536000)return(sec/86400).toFixed(1)+' días';if(sec<31536000*100)return(sec/31536000).toFixed(1)+' años';if(sec<31536000*1e6)return(sec/31536000/1e3).toFixed(0)+' mil años';return'Prácticamente inviable'}

const adj=['silencioso','oculto','libre','nocturno','criptico','gris','nube','zorro','cuervo','veloz','seguro','privado','lejano','frio'];
const noun=['viajero','guardian','fantasma','nodo','relay','cifrado','proxy','torre','oasis','horizonte','refugio','codigo','mapa','eco'];
const animals=['lobo','cuervo','zorro','halcon','lince','orca','ciervo','buho'];
const places=['norte','valle','risco','niebla','costa','paramo','sierra','bosque'];
const syllables=['ka','zu','ri','mo','ne','xa','lu','qi','vo','ta','br','cl'];
function generateName(){let style=document.getElementById('nameStyle').value;if(style==='aleatorio')style=pick(['sombra','tecnico','natural','corto','hex']);let name='';if(style==='sombra')name=pick(adj)+'_'+pick(noun)+(10+Math.floor(Math.random()*89));else if(style==='tecnico')name=pick(syllables)+pick(syllables)+pick(syllables)+'_'+randHex(2);else if(style==='natural')name=pick(animals)+'-'+pick(places)+(Math.floor(Math.random()*90)+10);else if(style==='corto')name=pick(syllables)+pick(syllables)+pick(['','x','z'])+(Math.floor(Math.random()*9)+1);else name='id_'+randHex(4);document.getElementById('nameResult').textContent=name;document.getElementById('nameBtn').textContent='Re-generar'}

function generatePassword(){const len=+document.getElementById('pwdLen').value;let chars='';if(document.getElementById('pwdUpper').checked)chars+='ABCDEFGHIJKLMNOPQRSTUVWXYZ';if(document.getElementById('pwdLower').checked)chars+='abcdefghijklmnopqrstuvwxyz';if(document.getElementById('pwdNum').checked)chars+='0123456789';if(document.getElementById('pwdSym').checked)chars+='!@#$%^&*()-_=+[]{}|;:,.<>?';if(!chars)return;const arr=new Uint32Array(len);crypto.getRandomValues(arr);let pwd='';for(let i=0;i<len;i++)pwd+=chars[arr[i]%chars.length];document.getElementById('pwdOutput').value=pwd;document.getElementById('pwdBtn').textContent='Re-generar';const entropy=Math.floor(len*Math.log2(chars.length));const s=entropy>=80?'muy fuerte':entropy>=60?'fuerte':entropy>=40?'aceptable':'débil';document.getElementById('pwdEntropy').textContent=`≈ ${entropy} bits · ${s}`}

function estimateCrack(){
const pwd=document.getElementById('crackInput').value;
const out=document.getElementById('crackResult');
if(!pwd){out.innerHTML='';return}
let charset=0;
if(/[a-z]/.test(pwd))charset+=26;
if(/[A-Z]/.test(pwd))charset+=26;
if(/[0-9]/.test(pwd))charset+=10;
if(/[^a-zA-Z0-9]/.test(pwd))charset+=32;
if(charset<2)charset=26;
const entropy=pwd.length*Math.log2(charset);
const scenarios=[
  {name:'GPU moderna (offline)',rate:1e10,hint:'Ataque con tarjeta gráfica dedicada'},
  {name:'PC de sobremesa',rate:5e8,hint:'CPU + GPU integrada o media'},
  {name:'Portátil / tablet',rate:5e7,hint:'Hardware doméstico típico'},
  {name:'Teléfono (script)',rate:1e6,hint:'Ataque lento desde móvil'}
];
let cards=scenarios.map(s=>{
  const sec=Math.pow(2,entropy)/s.rate;
  const t=fmtTime(sec);
  const tone=sec<3600?'text-red-300':sec<31536000?'text-amber-300':'text-emerald-300';
  return `<div class="p-3 rounded-xl bg-void border border-white/10"><p class="text-xs text-steel mb-0.5">${s.name}</p><p class="${tone} font-semibold text-sm">${t}</p><p class="text-[11px] text-steel/80 mt-1">${s.hint}</p></div>`;
}).join('');
out.innerHTML=`<div class="flex flex-wrap gap-3 text-xs text-steel mb-3"><span class="px-2 py-1 rounded-lg bg-white/5">Longitud ${pwd.length}</span><span class="px-2 py-1 rounded-lg bg-white/5">Charset ≈ ${charset}</span><span class="px-2 py-1 rounded-lg bg-white/5">≈ ${entropy.toFixed(0)} bits</span></div><div class="grid sm:grid-cols-2 gap-2">${cards}</div><p class="text-[11px] text-steel mt-3">Estimación de fuerza bruta offline (sin diccionario). Si la contraseña es una palabra real o reutilizada, el tiempo real puede ser mucho menor.</p>`;
}

async function runBreachScan(){
const email=document.getElementById('breachEmail').value.trim();
if(!email||!email.includes('@')){alert('Introduce un correo válido');return}
const btn=document.getElementById('breachBtn'),wrap=document.getElementById('breachProgressWrap'),status=document.getElementById('breachStatus'),results=document.getElementById('breachResults');
btn.disabled=true;wrap.classList.remove('hidden');results.classList.add('hidden');
const bar=document.getElementById('breachProgress');bar.style.width='12%';status.textContent='Consultando índices públicos…';
const safeEmail=email.replace(/</g,'');
const esc=s=>(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const brief=(d,name,data,year)=>{
  const t=(d||'').trim();
  if(t.length>40){let s=t;if(s.length>260)s=s.slice(0,257)+'…';return s;}
  const types=(data||'').split(/[;|,]/).map(x=>x.trim()).filter(Boolean);
  const top=types.slice(0,5).join(', ')||'datos de cuenta';
  const y=year?` (aprox. ${year})`:'';
  return `Filtración asociada a «${name||'un servicio'}»${y}. Datos típicos en este incidente: ${top}. Trata cualquier contraseña de ese servicio (y reutilizaciones) como comprometida.`;
};
try{
  bar.style.width='40%';status.textContent='Obteniendo detalle de cada incidente…';
  const res=await fetch('https://api.xposedornot.com/v1/breach-analytics?email='+encodeURIComponent(email));
  if(res.status===429){
    bar.style.width='100%';status.textContent='Límite de consultas alcanzado';
    document.getElementById('breachSummary').innerHTML=`<div class="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10"><p class="text-amber-200 font-medium">Demasiadas consultas desde esta red</p><p class="text-steel text-sm mt-2">El índice limita peticiones por IP (≈25/h). Espera un rato e inténtalo de nuevo. Cada persona consulta desde su propia dirección, no compartís el cupo con el resto de usuarios de la web.</p></div>`;
    document.getElementById('breachList').innerHTML='';
    results.classList.remove('hidden');btn.disabled=false;return;
  }
  if(!res.ok)throw new Error('HTTP '+res.status);
  bar.style.width='75%';status.textContent='Organizando resultados…';
  const data=await res.json();
  const details=(data.ExposedBreaches&&data.ExposedBreaches.breaches_details)||[];
  bar.style.width='100%';status.textContent='Listo';
  if(!details.length){
    document.getElementById('breachSummary').innerHTML=`<div class="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10"><p class="text-emerald-300 font-medium">Sin filtraciones en el índice consultado</p><p class="text-white mt-1">${esc(safeEmail)}</p></div>`;
    document.getElementById('breachList').innerHTML='<p class="text-steel text-sm">No aparece en las bases indexadas de esta consulta.</p>';
  }else{
    details.sort((a,b)=>String(b.xposed_date||'').localeCompare(String(a.xposed_date||'')));
    document.getElementById('breachSummary').innerHTML=`<div class="p-5 rounded-2xl border border-red-500/30 bg-red-500/10"><p class="text-red-300 font-medium text-sm">Se han encontrado filtraciones</p><p class="text-white text-lg font-semibold mt-1">${esc(safeEmail)}</p><p class="text-steel text-sm mt-1">${details.length} incidente(s) con detalle</p></div>`;
    document.getElementById('breachList').innerHTML=details.map(b=>{
      const name=esc(b.breach||'Desconocido');
      const year=esc(b.xposed_date||'—');
      const domain=esc(b.domain||'');
      const types=(b.xposed_data||'').split(/[;|,]/).map(x=>x.trim()).filter(Boolean);
      const chips=types.map(t=>`<span class="inline-flex text-[11px] px-2.5 py-1 rounded-lg bg-red-500/15 text-red-200 border border-red-500/25 font-medium">${esc(t)}</span>`).join('')||'<span class="text-xs text-steel">Tipos de dato no especificados</span>';
      const exp=esc(brief(b.details,b.breach,b.xposed_data,b.xposed_date));
      const rec=b.xposed_records?Number(b.xposed_records).toLocaleString('es'):null;
      return `<article class="p-4 sm:p-5 rounded-2xl bg-void border border-white/10 space-y-3">
        <div class="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p class="text-[11px] uppercase tracking-wider text-steel mb-0.5">Dónde se filtró</p>
            <p class="text-white font-semibold text-base">${name}</p>
            ${domain?`<p class="text-xs text-steel mt-0.5">${domain}</p>`:''}
          </div>
          <div class="text-right">
            <p class="text-[11px] uppercase tracking-wider text-steel mb-0.5">Cuándo</p>
            <p class="text-mist font-medium">${year}</p>
          </div>
        </div>
        ${rec?`<div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5"><span class="text-xs text-steel">Registros en el incidente</span><span class="text-white font-semibold text-sm">~${rec}</span></div>`:''}
        <div>
          <p class="text-[11px] uppercase tracking-wider text-steel mb-1.5">Qué se filtró</p>
          <div class="flex flex-wrap gap-1.5">${chips}</div>
        </div>
        <p class="text-xs text-steel leading-relaxed border-t border-white/5 pt-3">${exp}</p>
      </article>`;
    }).join('');
  }
  results.classList.remove('hidden');
}catch(e){
  bar.style.width='100%';status.textContent='No se pudo completar la consulta';
  document.getElementById('breachSummary').innerHTML=`<div class="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10"><p class="text-amber-200 font-medium">Consulta no disponible ahora</p><p class="text-steel text-sm mt-2">Puede deberse a red, CORS o límite temporal. El plan de respuesta de abajo sigue siendo válido.</p></div>`;
  document.getElementById('breachList').innerHTML='';
  results.classList.remove('hidden');
}
btn.disabled=false;
}

async function checkPwdLeak(){
const pwd=document.getElementById('pwdLeakInput').value;if(!pwd)return;
const out=document.getElementById('pwdLeakOut');out.textContent='Comprobando…';
try{
const buf=await crypto.subtle.digest('SHA-1',new TextEncoder().encode(pwd));
const hash=Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('').toUpperCase();
const prefix=hash.slice(0,5),suffix=hash.slice(5);
const res=await fetch('https://api.pwnedpasswords.com/range/'+prefix,{headers:{'Add-Padding':'true'}});
const text=await res.text();
let count=0;for(const line of text.split('\n')){const[h,c]=line.trim().split(':');if(h===suffix){count=parseInt(c,10);break}}
if(count>0)out.innerHTML=`<p class="text-red-300 font-medium">Aparece en filtraciones conocidas</p><p class="text-steel mt-1">Visto unas <strong class="text-white">${count.toLocaleString('es')}</strong> veces en bases públicas. Cámbiala donde la uses.</p>`;
else out.innerHTML=`<p class="text-emerald-300 font-medium">No aparece en el índice de contraseñas filtradas</p><p class="text-steel mt-1">Sigue siendo recomendable no reutilizarla.</p>`;
}catch(e){out.textContent='Error de red: '+e.message}}

let metaBlob=null,metaName='';
async function stripMetadata(){const f=document.getElementById('metaFile').files[0];if(!f)return;document.getElementById('metaProgressWrap').classList.remove('hidden');document.getElementById('metaDownloadWrap').classList.add('hidden');document.getElementById('metaStatus').textContent='Eliminando metadatos…';document.getElementById('metaBtn').disabled=true;animateProgress('metaProgress',700);try{const img=await loadImage(f);const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;c.getContext('2d').drawImage(img,0,0);await new Promise(r=>setTimeout(r,350));c.toBlob(blob=>{metaBlob=blob;metaName=f.name.replace(/\.[^.]+$/,'')+'_sin_meta.png';document.getElementById('metaProgress').style.width='100%';document.getElementById('metaStatus').textContent='Listo.';document.getElementById('metaDownloadWrap').classList.remove('hidden');document.getElementById('metaBtn').disabled=false},'image/png')}catch(e){document.getElementById('metaStatus').textContent='Error: '+e.message;document.getElementById('metaBtn').disabled=false}}
document.getElementById('metaDownloadBtn')?.addEventListener('click',()=>{if(metaBlob)downloadBlob(metaBlob,metaName)});

function showPdfSub(id){document.querySelectorAll('.pdf-sub').forEach(p=>p.classList.remove('active'));document.querySelectorAll('.pdf-tab').forEach(t=>t.classList.remove('active'));document.getElementById('pdf-'+id)?.classList.add('active');document.querySelector('.pdf-tab[data-pdf="'+id+'"]')?.classList.add('active')}
function parseRange(str,max){const pages=new Set();str.split(',').forEach(part=>{part=part.trim();if(part.includes('-')){const[a,b]=part.split('-').map(n=>parseInt(n,10));for(let i=Math.max(1,a||1);i<=Math.min(max,b||max);i++)pages.add(i-1)}else{const n=parseInt(part,10);if(n>=1&&n<=max)pages.add(n-1)}});return[...pages].sort((a,b)=>a-b)}
async function pdfInfo(){const f=document.getElementById('pdfInfoFile').files[0];if(!f)return;const out=document.getElementById('pdfInfoOut');out.textContent='Analizando…';try{const doc=await PDFLib.PDFDocument.load(await f.arrayBuffer());out.innerHTML=`<p class="text-white">Páginas: <strong>${doc.getPageCount()}</strong></p><p>Título: ${doc.getTitle()||'—'}</p><p>Autor: ${doc.getAuthor()||'—'}</p><p>Tamaño: ${(f.size/1024).toFixed(1)} KB</p>`}catch(e){out.textContent='Error: '+e.message}}
async function pdfMerge(){const files=document.getElementById('pdfMergeFiles').files;if(!files.length)return;const out=document.getElementById('pdfMergeOut');out.textContent='Combinando…';try{const merged=await PDFLib.PDFDocument.create();for(const f of files){const src=await PDFLib.PDFDocument.load(await f.arrayBuffer());(await merged.copyPages(src,src.getPageIndices())).forEach(p=>merged.addPage(p))}downloadBlob(new Blob([await merged.save()],{type:'application/pdf'}),'combinado.pdf');out.textContent='Descargado ('+files.length+' archivos)'}catch(e){out.textContent='Error: '+e.message}}
async function pdfSplit(){const f=document.getElementById('pdfSplitFile').files[0];const range=document.getElementById('pdfSplitRange').value;if(!f||!range)return;const out=document.getElementById('pdfSplitOut');out.textContent='Extrayendo…';try{const src=await PDFLib.PDFDocument.load(await f.arrayBuffer());const idxs=parseRange(range,src.getPageCount());if(!idxs.length){out.textContent='Rango no válido';return}const dest=await PDFLib.PDFDocument.create();(await dest.copyPages(src,idxs)).forEach(p=>dest.addPage(p));downloadBlob(new Blob([await dest.save()],{type:'application/pdf'}),'extraido.pdf');out.textContent='Descargado: '+idxs.length+' página(s)'}catch(e){out.textContent='Error: '+e.message}}
async function pdfRotate(){const f=document.getElementById('pdfRotateFile').files[0];const angle=+document.getElementById('pdfRotateAngle').value;if(!f)return;const out=document.getElementById('pdfRotateOut');out.textContent='Rotando…';try{const doc=await PDFLib.PDFDocument.load(await f.arrayBuffer());doc.getPages().forEach(p=>p.setRotation(PDFLib.degrees((p.getRotation().angle+angle)%360)));downloadBlob(new Blob([await doc.save()],{type:'application/pdf'}),'rotado.pdf');out.textContent='Descargado'}catch(e){out.textContent='Error: '+e.message}}
async function pdfRemove(){const f=document.getElementById('pdfRemoveFile').files[0];const range=document.getElementById('pdfRemoveRange').value;if(!f||!range)return;const out=document.getElementById('pdfRemoveOut');out.textContent='Procesando…';try{const src=await PDFLib.PDFDocument.load(await f.arrayBuffer());const remove=new Set(parseRange(range,src.getPageCount()));const keep=src.getPageIndices().filter(i=>!remove.has(i));const dest=await PDFLib.PDFDocument.create();(await dest.copyPages(src,keep)).forEach(p=>dest.addPage(p));downloadBlob(new Blob([await dest.save()],{type:'application/pdf'}),'sin_paginas.pdf');out.textContent='Descargado · quedan '+keep.length+' páginas'}catch(e){out.textContent='Error: '+e.message}}
async function pdfReverse(){const f=document.getElementById('pdfReverseFile').files[0];if(!f)return;const out=document.getElementById('pdfReverseOut');out.textContent='Invirtiendo…';try{const src=await PDFLib.PDFDocument.load(await f.arrayBuffer());const idxs=src.getPageIndices().reverse();const dest=await PDFLib.PDFDocument.create();(await dest.copyPages(src,idxs)).forEach(p=>dest.addPage(p));downloadBlob(new Blob([await dest.save()],{type:'application/pdf'}),'invertido.pdf');out.textContent='Descargado'}catch(e){out.textContent='Error: '+e.message}}
async function pdfSetMeta(){const f=document.getElementById('pdfMetaFile').files[0];if(!f)return;const out=document.getElementById('pdfMetaOut');out.textContent='Aplicando…';try{const doc=await PDFLib.PDFDocument.load(await f.arrayBuffer());const t=document.getElementById('pdfMetaTitle').value.trim();const a=document.getElementById('pdfMetaAuthor').value.trim();if(t)doc.setTitle(t);if(a)doc.setAuthor(a);downloadBlob(new Blob([await doc.save()],{type:'application/pdf'}),'metadatos.pdf');out.textContent='Descargado'}catch(e){out.textContent='Error: '+e.message}}
async function pdfWatermark(){const f=document.getElementById('pdfWmFile').files[0];const text=(document.getElementById('pdfWmText').value||'CONFIDENCIAL').trim();if(!f)return;const out=document.getElementById('pdfWmOut');out.textContent='Aplicando marca…';try{const doc=await PDFLib.PDFDocument.load(await f.arrayBuffer());const font=await doc.embedFont(PDFLib.StandardFonts.HelveticaBold);const pages=doc.getPages();pages.forEach(page=>{const{width,height}=page.getSize();const size=Math.min(width,height)*0.08;page.drawText(text,{x:width*0.15,y:height*0.45,size,font,color:PDFLib.rgb(0.75,0.75,0.75),opacity:0.35,rotate:PDFLib.degrees(35)})});downloadBlob(new Blob([await doc.save()],{type:'application/pdf'}),'marca_agua.pdf');out.textContent='Descargado'}catch(e){out.textContent='Error: '+e.message}}
async function pdfPageNumbers(){const f=document.getElementById('pdfNumFile').files[0];if(!f)return;const out=document.getElementById('pdfNumOut');out.textContent='Numerando…';try{const doc=await PDFLib.PDFDocument.load(await f.arrayBuffer());const font=await doc.embedFont(PDFLib.StandardFonts.Helvetica);const pages=doc.getPages();pages.forEach((page,i)=>{const{width}=page.getSize();const label=`${i+1} / ${pages.length}`;const tw=font.widthOfTextAtSize(label,10);page.drawText(label,{x:(width-tw)/2,y:18,size:10,font,color:PDFLib.rgb(0.4,0.4,0.4)})});downloadBlob(new Blob([await doc.save()],{type:'application/pdf'}),'numerado.pdf');out.textContent='Descargado'}catch(e){out.textContent='Error: '+e.message}}
async function pdfBlank(){const f=document.getElementById('pdfBlankFile').files[0];const after=+document.getElementById('pdfBlankAfter').value||0;if(!f)return;const out=document.getElementById('pdfBlankOut');out.textContent='Insertando…';try{const src=await PDFLib.PDFDocument.load(await f.arrayBuffer());const dest=await PDFLib.PDFDocument.create();const idxs=src.getPageIndices();const first=Math.min(Math.max(0,after),idxs.length);const before=idxs.slice(0,first);const afterIdx=idxs.slice(first);if(before.length)(await dest.copyPages(src,before)).forEach(p=>dest.addPage(p));const sample=src.getPage(0);const{width,height}=sample.getSize();dest.addPage([width,height]);if(afterIdx.length)(await dest.copyPages(src,afterIdx)).forEach(p=>dest.addPage(p));downloadBlob(new Blob([await dest.save()],{type:'application/pdf'}),'con_pagina_en_blanco.pdf');out.textContent='Descargado'}catch(e){out.textContent='Error: '+e.message}}

function updateCompLabel(){const el=document.getElementById('compQual');if(!el)return;const v=+el.value;let label='Muy baja';if(v>=0.9)label='Nítida';else if(v>=0.75)label='Buena calidad';else if(v>=0.55)label='Calidad media';else if(v>=0.35)label='Calidad baja';document.getElementById('compQualLabel').textContent=label+' ('+v.toFixed(2)+')'}
updateCompLabel();
let compBlob=null,compName='';
async function compressImage(){const f=document.getElementById('compFile').files[0];const q=+document.getElementById('compQual').value;if(!f)return;document.getElementById('compProgressWrap').classList.remove('hidden');document.getElementById('compDownloadWrap').classList.add('hidden');document.getElementById('compStatus').textContent='Comprimiendo…';document.getElementById('compBtn').disabled=true;animateProgress('compProgress',650);try{const img=await loadImage(f);const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;c.getContext('2d').drawImage(img,0,0);await new Promise(r=>setTimeout(r,300));c.toBlob(blob=>{compBlob=blob;compName=f.name.replace(/\.[^.]+$/,'')+'_comprimido.jpg';const ratio=((1-blob.size/f.size)*100).toFixed(0);document.getElementById('compProgress').style.width='100%';document.getElementById('compStatus').textContent=`${(f.size/1024).toFixed(1)} KB → ${(blob.size/1024).toFixed(1)} KB (≈${ratio}% menos)`;document.getElementById('compDownloadWrap').classList.remove('hidden');document.getElementById('compBtn').disabled=false},'image/jpeg',q)}catch(e){document.getElementById('compStatus').textContent='Error: '+e.message;document.getElementById('compBtn').disabled=false}}
document.getElementById('compDownloadBtn')?.addEventListener('click',()=>{if(compBlob)downloadBlob(compBlob,compName)});

let convBlob=null,convName='';
async function convertImage(){const f=document.getElementById('convFile').files[0];const mime=document.getElementById('convFormat').value;if(!f)return;const ext=mime==='image/png'?'png':mime==='image/webp'?'webp':'jpg';document.getElementById('convProgressWrap').classList.remove('hidden');document.getElementById('convDownloadWrap').classList.add('hidden');document.getElementById('convStatus').textContent='Convirtiendo…';animateProgress('convProgress',500);try{const img=await loadImage(f);const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;c.getContext('2d').drawImage(img,0,0);await new Promise(r=>setTimeout(r,250));c.toBlob(blob=>{convBlob=blob;convName=f.name.replace(/\.[^.]+$/,'')+'.'+ext;document.getElementById('convProgress').style.width='100%';document.getElementById('convStatus').textContent=convName+' · '+(blob.size/1024).toFixed(1)+' KB';document.getElementById('convDownloadWrap').classList.remove('hidden')},mime,mime==='image/jpeg'?0.92:undefined)}catch(e){document.getElementById('convStatus').textContent='Error: '+e.message}}
document.getElementById('convDownloadBtn')?.addEventListener('click',()=>{if(convBlob)downloadBlob(convBlob,convName)});

function toggleHashSrc(){const isFile=document.querySelector('input[name="hashSrc"]:checked')?.value==='file';document.getElementById('hashFile')?.classList.toggle('hidden',!isFile);document.getElementById('hashText')?.classList.toggle('hidden',isFile)}
async function computeHashes(){const isFile=document.querySelector('input[name="hashSrc"]:checked')?.value==='file';let buffer;if(isFile){const f=document.getElementById('hashFile').files[0];if(!f)return;buffer=await f.arrayBuffer()}else{const t=document.getElementById('hashText').value;if(!t)return;buffer=new TextEncoder().encode(t)}const out=document.getElementById('hashResults');out.classList.remove('hidden');let html='';for(const alg of['SHA-256','SHA-384','SHA-512','SHA-1']){const dig=await crypto.subtle.digest(alg,buffer);html+=`<div class="p-3 rounded-lg bg-void border border-white/5"><span class="text-steel text-xs">${alg}</span><p class="text-white break-all mt-1 select-all text-xs">${Array.from(new Uint8Array(dig)).map(b=>b.toString(16).padStart(2,'0')).join('')}</p></div>`}out.innerHTML=html}

const wordList=['alpha','bravo','campo','delta','eco','faro','gato','hielo','isla','jade','kilo','luna','mar','nube','oro','piedra','rio','sol','tigre','uva','viento','yate','zorro','agua','bosque','casa','estrella','fuego','grano','hoja','jardin','lago','monte','norte','oceano','puente','roca','sierra','torre','valle','cipher','node','relay','shadow','quiet','bright','silent','rapid','calm','storm','nieve','rayo','bruma','cumbre','sendero','refugio','clave','sello'];
function generatePassphrase(){const n=+document.getElementById('ppCount').value;const sep=document.getElementById('ppSep').value;const cap=document.getElementById('ppCap').checked;const addNum=document.getElementById('ppNum').checked;const arr=new Uint32Array(n);crypto.getRandomValues(arr);const words=[];for(let i=0;i<n;i++){let w=wordList[arr[i]%wordList.length];if(cap)w=w.charAt(0).toUpperCase()+w.slice(1);words.push(w)}let phrase=words.join(sep);if(addNum){const num=new Uint32Array(1);crypto.getRandomValues(num);phrase+=sep+(num[0]%90+10)}document.getElementById('ppResult').textContent=phrase;document.getElementById('ppBtn').textContent='Re-generar';document.getElementById('ppStrength').textContent=`Entropía ≈ ${Math.floor(n*Math.log2(wordList.length))+(addNum?6:0)} bits`}

async function deriveKey(pass,salt){const base=await crypto.subtle.importKey('raw',new TextEncoder().encode(pass),{name:'PBKDF2'},false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:100000,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
async function encryptText(){const text=document.getElementById('cipherText').value,pass=document.getElementById('cipherPass').value;if(!text||!pass)return;const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));const key=await deriveKey(pass,salt);const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(text));const packed=new Uint8Array(28+ct.byteLength);packed.set(salt,0);packed.set(iv,16);packed.set(new Uint8Array(ct),28);document.getElementById('cipherOut').value=btoa(String.fromCharCode(...packed))}
async function decryptText(){try{const packed=Uint8Array.from(atob(document.getElementById('cipherText').value),c=>c.charCodeAt(0));const key=await deriveKey(document.getElementById('cipherPass').value,packed.slice(0,16));const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:packed.slice(16,28)},key,packed.slice(28));document.getElementById('cipherOut').value=new TextDecoder().decode(pt)}catch{document.getElementById('cipherOut').value='Error: contraseña incorrecta o datos inválidos'}}

const trackParams=['utm_source','utm_medium','utm_campaign','utm_term','utm_content','utm_id','fbclid','gclid','gclsrc','dclid','msclkid','mc_eid','mc_cid','yclid','_ga','_gl','ref','ref_src','si','igshid'];
function cleanUrl(){const raw=document.getElementById('urlIn').value.trim();if(!raw)return;try{const u=new URL(raw);let removed=0;trackParams.forEach(p=>{if(u.searchParams.has(p)){u.searchParams.delete(p);removed++}});[...u.searchParams.keys()].forEach(k=>{if(k.startsWith('utm_')){u.searchParams.delete(k);removed++}});document.getElementById('urlOut').value=u.toString();document.getElementById('urlStatus').textContent=removed?`Eliminados ${removed} parámetro(s).`:'Sin parámetros de tracking conocidos.'}catch{document.getElementById('urlStatus').textContent='URL no válida'}}

function generateShortId(){const ref=document.getElementById('shortInput').value.trim();const id=randHex(3)+'-'+pick(['a','k','m','x','z'])+(Math.floor(Math.random()*900)+100);document.getElementById('shortOutput').textContent=id;if(ref){try{const map=JSON.parse(localStorage.getItem('priv_short_map')||'{}');map[id]=ref;localStorage.setItem('priv_short_map',JSON.stringify(map));document.getElementById('shortStatus').textContent='Guardado en este navegador.'}catch{document.getElementById('shortStatus').textContent='Generado.'}}else document.getElementById('shortStatus').textContent='Solo local.'}

function generateUuid(){const a=new Uint8Array(16);crypto.getRandomValues(a);a[6]=(a[6]&0x0f)|0x40;a[8]=(a[8]&0x3f)|0x80;const h=Array.from(a,b=>b.toString(16).padStart(2,'0')).join('');document.getElementById('uuidOut').textContent=h.slice(0,8)+'-'+h.slice(8,12)+'-'+h.slice(12,16)+'-'+h.slice(16,20)+'-'+h.slice(20);document.getElementById('uuidBtn').textContent='Re-generar'}
function b64Encode(){const t=document.getElementById('b64In').value;try{document.getElementById('b64Out').value=btoa(unescape(encodeURIComponent(t)));document.getElementById('b64Status').textContent='Codificado'}catch{document.getElementById('b64Status').textContent='Error al codificar'}}
function b64Decode(){const t=document.getElementById('b64In').value;try{document.getElementById('b64Out').value=decodeURIComponent(escape(atob(t)));document.getElementById('b64Status').textContent='Decodificado'}catch{document.getElementById('b64Status').textContent='Base64 no válido'}}
