/* Tipo real de archivo (magic bytes) */
const MAGIC_SIGS=[
  {name:'PNG',ext:'.png',mime:'image/png',bytes:[0x89,0x50,0x4E,0x47]},
  {name:'JPEG',ext:'.jpg/.jpeg',mime:'image/jpeg',bytes:[0xFF,0xD8,0xFF]},
  {name:'GIF',ext:'.gif',mime:'image/gif',bytes:[0x47,0x49,0x46,0x38]},
  {name:'WebP',ext:'.webp',mime:'image/webp',test:function(u8){return u8[0]===0x52&&u8[1]===0x49&&u8[2]===0x46&&u8[3]===0x46&&u8[8]===0x57&&u8[9]===0x45&&u8[10]===0x42&&u8[11]===0x50}},
  {name:'PDF',ext:'.pdf',mime:'application/pdf',bytes:[0x25,0x50,0x44,0x46]},
  {name:'ZIP',ext:'.zip',mime:'application/zip',bytes:[0x50,0x4B,0x03,0x04]},
  {name:'RAR',ext:'.rar',mime:'application/x-rar-compressed',bytes:[0x52,0x61,0x72,0x21]},
  {name:'7-Zip',ext:'.7z',mime:'application/x-7z-compressed',bytes:[0x37,0x7A,0xBC,0xAF]},
  {name:'MP4/ISO-BMFF',ext:'.mp4/.m4a',mime:'video/mp4',test:function(u8){return u8[4]===0x66&&u8[5]===0x74&&u8[6]===0x79&&u8[7]===0x70}},
  {name:'WebM/MKV',ext:'.webm/.mkv',mime:'video/webm',bytes:[0x1A,0x45,0xDF,0xA3]},
  {name:'MP3 (ID3)',ext:'.mp3',mime:'audio/mpeg',bytes:[0x49,0x44,0x33]},
  {name:'WAV',ext:'.wav',mime:'audio/wav',test:function(u8){return u8[0]===0x52&&u8[1]===0x49&&u8[2]===0x46&&u8[3]===0x46&&u8[8]===0x57&&u8[9]===0x41&&u8[10]===0x56&&u8[11]===0x45}},
  {name:'OGG',ext:'.ogg',mime:'audio/ogg',bytes:[0x4F,0x67,0x67,0x53]},
  {name:'SQLite',ext:'.sqlite/.db',mime:'application/x-sqlite3',bytes:[0x53,0x51,0x4C,0x69]},
  {name:'Windows EXE/DLL',ext:'.exe/.dll',mime:'application/x-msdownload',bytes:[0x4D,0x5A]},
  {name:'ELF (Linux)',ext:'.elf',mime:'application/x-executable',bytes:[0x7F,0x45,0x4C,0x46]},
  {name:'GZIP',ext:'.gz',mime:'application/gzip',bytes:[0x1F,0x8B]},
  {name:'DOC (OLE)',ext:'.doc/.xls/.ppt',mime:'application/msword',bytes:[0xD0,0xCF,0x11,0xE0]}
];
function matchMagic(u8){
  for(var i=0;i<MAGIC_SIGS.length;i++){
    var s=MAGIC_SIGS[i];
    if(s.test){ if(s.test(u8)) return s; continue; }
    var ok=true;
    for(var j=0;j<s.bytes.length;j++){ if(u8[j]!==s.bytes[j]){ok=false;break} }
    if(ok)return s;
  }
  return null;
}
async function detectFileType(){
  var input=document.getElementById('ftFile');
  var out=document.getElementById('ftOut');
  if(!input||!input.files||!input.files[0]){ if(out)out.innerHTML='<p class="text-steel text-sm">Elige un archivo</p>'; return; }
  var f=input.files[0];
  var buf=await f.slice(0,64).arrayBuffer();
  var u8=new Uint8Array(buf);
  var hex=Array.from(u8.slice(0,16)).map(function(b){return b.toString(16).padStart(2,'0')}).join(' ');
  var matched=matchMagic(u8);
  var nameExt=(f.name.split('.').pop()||'').toLowerCase();
  var declared=f.type||'(vacio)';
  var mismatch=false;
  if(matched){
    var allowed=(matched.ext||'').toLowerCase().split('/').map(function(x){return x.replace(/^\./,'')});
    if(nameExt && allowed.indexOf(nameExt)<0 && matched.name!=='ZIP') mismatch=true;
    if(matched.name==='ZIP' && ['docx','xlsx','pptx','odt','ods','apk','jar'].indexOf(nameExt)>=0) mismatch=false;
  }
  function esc(s){return typeof xEsc==='function'?xEsc(s):String(s)}
  var html='<div class="p-4 rounded-2xl bg-void border border-white/10 space-y-2 text-sm mb-3">'
    +'<p><span class="text-steel">Nombre:</span> <span class="text-white break-all">'+esc(f.name)+'</span></p>'
    +'<p><span class="text-steel">Tamano:</span> <span class="text-white">'+(f.size/1024).toFixed(1)+' KB</span></p>'
    +'<p><span class="text-steel">MIME declarado:</span> <span class="text-white">'+esc(declared)+'</span></p>'
    +'<p><span class="text-steel">Cabecera (hex):</span> <span class="text-white font-mono text-xs">'+hex+'</span></p></div>';
  if(matched){
    html+='<div class="p-4 rounded-2xl border '+(mismatch?'border-amber-500/30 bg-amber-500/10':'border-emerald-500/30 bg-emerald-500/10')+' mb-3">'
      +'<p class="text-white font-medium">Tipo detectado: '+esc(matched.name)+'</p>'
      +'<p class="text-sm text-steel mt-1">Extension tipica: '+esc(matched.ext)+' · MIME: '+esc(matched.mime)+'</p>'
      +(mismatch?'<p class="text-amber-300 text-sm mt-2">La extension del nombre no coincide con el contenido. Puede ser un archivo renombrado.</p>':'')
      +'</div>';
  }else{
    html+='<div class="p-4 rounded-2xl border border-white/10 bg-panel mb-3"><p class="text-steel text-sm">No se reconocio una firma conocida. Puede ser texto plano u otro formato.</p></div>';
  }
  html+='<p class="text-xs text-steel">Analisis local por magic bytes. No ejecuta el archivo.</p>';
  out.innerHTML=html;
}
