/* Fix QR: un solo enlace + disclaimer homoglifos */
function normalizeQrUrl(raw){
  var t=(raw||'').trim();
  if(!t)return {ok:false,err:'Escribe un enlace'};
  if(/\r|\n/.test(t))return {ok:false,err:'Solo se admite un enlace (una linea)'};
  if(/\s/.test(t))return {ok:false,err:'El enlace no debe contener espacios. Solo un URL.'};
  var url=t;
  if(!/^https?:\/\//i.test(url)){
    if(/^[a-z0-9.-]+\.[a-z]{2,}([\/?#].*)?$/i.test(url))url='https://'+url;
    else return {ok:false,err:'Introduce un enlace valido (https://...)'};
  }
  try{ var u=new URL(url); if(u.protocol!=='http:'&&u.protocol!=='https:')return {ok:false,err:'Solo http o https'}; }
  catch(e){return {ok:false,err:'Enlace no valido'}}
  return {ok:true,url:url};
}
function generateQr(){
  var input=document.getElementById('qrInput');
  var box=document.getElementById('qrCanvasWrap');
  var status=document.getElementById('qrStatus');
  var btn=document.getElementById('qrDownload');
  if(box)box.innerHTML='';
  if(btn)btn.classList.add('hidden');
  var parsed=normalizeQrUrl(input?input.value:'');
  if(!parsed.ok){ if(status)status.textContent=parsed.err; return; }
  if(typeof QRCode==='undefined' || typeof QRCode.toCanvas!=='function'){
    if(status)status.textContent='Libreria QR no cargada. Recarga con Ctrl+Shift+R.';
    return;
  }
  if(status)status.textContent='Generando...';
  var canvas=document.createElement('canvas');
  QRCode.toCanvas(canvas, parsed.url, {width:256, margin:2, color:{dark:'#0a84ff', light:'#05070a'}, errorCorrectionLevel:'M'}, function(err){
    if(err){ if(status)status.textContent='Error: '+String(err.message||err); return; }
    if(box)box.appendChild(canvas);
    if(status)status.textContent='Listo. Un solo enlace. El PNG descargado es permanente.';
    if(btn){
      btn.classList.remove('hidden');
      btn.onclick=function(){
        canvas.toBlob(function(b){
          var a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='qr.png'; a.click();
        });
      };
    }
  });
}
function checkHomoglyphs(){
  var raw=document.getElementById('homoInput').value||'';
  var out=document.getElementById('homoOut'),status=document.getElementById('homoStatus');
  if(!out)return;
  var domain=raw.trim();
  try{ if(/^https?:/i.test(domain)) domain=new URL(domain).hostname; }catch(e){}
  domain=domain.replace(/^www\./i,'').toLowerCase();
  if(!domain){ if(status)status.textContent='Introduce un dominio'; return; }
  var CONF={'а':'a','е':'e','о':'o','р':'p','с':'c','у':'y','х':'x','А':'A','Е':'E','О':'O','Р':'P','С':'C','Α':'A','Ε':'E','Ο':'O','α':'a','ο':'o'};
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
  var issues=[]; var latin='';
  Array.from(domain).forEach(function(ch,i){
    if(CONF[ch]){ issues.push({i:i,ch:ch,looks:CONF[ch]}); latin+=CONF[ch]; } else latin+=ch;
  });
  var risky=issues.length>0;
  if(status)status.textContent='Listo';
  var msg=risky
    ? 'Se detectaron caracteres confusables. Eso no prueba que el sitio sea fraudulento, solo que usa letras de otros alfabetos que se parecen a las latinas.'
    : 'No se detectaron homografos habituales. Eso no significa que el dominio sea seguro ni legitimo: solo indica que no se han usado esas letras tipicas para engañar. Verifica siempre el dominio por otras vias.';
  out.innerHTML='<div class="p-4 rounded-2xl border '+(risky?'border-amber-500/30 bg-amber-500/10':'border-emerald-500/30 bg-emerald-500/10')+' mb-3">'
    +'<p class="'+(risky?'text-amber-300':'text-emerald-300')+' font-medium">'+(risky?'Posibles caracteres engañosos':'Sin homografos habituales')+'</p>'
    +'<p class="text-xs text-steel mt-2 leading-relaxed">'+msg+'</p></div>'
    +'<p class="text-sm text-white font-mono mb-2">'+esc(domain)+'</p>'
    +'<p class="text-sm text-steel mb-2">Lectura latina aproximada: <span class="text-white font-mono">'+esc(latin)+'</span></p>'
    +issues.map(function(it){return '<p class="text-sm text-white">Pos '+(it.i+1)+': <span class="text-neon">'+esc(it.ch)+'</span> parece "'+esc(it.looks)+'"</p>'}).join('')
    +'<p class="text-xs text-steel mt-3">Analisis 100% local. No garantiza la legitimidad del sitio.</p>';
}
