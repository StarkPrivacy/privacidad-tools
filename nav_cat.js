/* Remapea categorias a Privacidad y anade blur/filetype */
(function(){
  if(typeof TOOL_META==='undefined')return;
  var priv=['filtraciones','ip','huella','permisos','storage'];
  TOOL_META.forEach(function(t){
    if(priv.indexOf(t.id)>=0)t.cat='privacidad';
  });
  var ids=TOOL_META.map(function(t){return t.id});
  if(ids.indexOf('blur')<0)TOOL_META.push({id:'blur',cat:'archivos',title:'Desenfocar zonas',desc:'Oculta caras o datos en fotos',icon:'blur'});
  if(ids.indexOf('filetype')<0)TOOL_META.push({id:'filetype',cat:'archivos',title:'Tipo real de archivo',desc:'Magic bytes vs extension',icon:'file'});
  if(typeof CAT_LABEL!=='undefined')CAT_LABEL.privacidad='Privacidad';
  if(typeof ICON_COLOR!=='undefined')ICON_COLOR.privacidad='text-sky-400';
  if(typeof ICONS!=='undefined' && !ICONS.blur)ICONS.blur='<circle cx="12" cy="12" r="10"/><path d="M8 12h.01M12 12h.01M16 12h.01"/>';
  filterTools=function(){
    var q=(currentQ||'').trim().toLowerCase();
    var grid=document.getElementById('toolsGrid');
    if(!grid)return;
    var html='';
    var groups=currentCat==='all'?['privacidad','seguridad','identidad','archivos','red']:[currentCat];
    groups.forEach(function(cat){
      var items=TOOL_META.filter(function(t){
        return t.cat===cat&&(!q||t.title.toLowerCase().includes(q)||t.desc.toLowerCase().includes(q)||cat.includes(q));
      });
      if(!items.length)return;
      html+='<div class="col-span-full mt-2 first:mt-0"><p class="text-xs uppercase tracking-wider text-steel/80 mb-2 font-medium">'+(CAT_LABEL[cat]||cat)+'</p></div>';
      items.forEach(function(t){
        var ic=(ICONS&&ICONS[t.icon])||(ICONS&&ICONS.file)||'';
        var col=(ICON_COLOR&&ICON_COLOR[t.cat])||'text-neon';
        html+='<button onclick="showTool(\''+t.id+'\')" class="tool-card group text-left p-4 rounded-2xl bg-panel border border-white/5 hover:border-neon/35 hover:glow-blue transition flex items-start justify-between gap-3"><div class="min-w-0"><h2 class="font-semibold text-white">'+t.title+'</h2><p class="text-sm text-steel mt-0.5 leading-snug">'+t.desc+'</p></div><svg class="w-5 h-5 '+col+' shrink-0 mt-0.5 opacity-90" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">'+ic+'</svg></button>';
      });
    });
    if(!html)html='<p class="col-span-full text-steel text-sm py-8 text-center">Ninguna herramienta coincide</p>';
    grid.innerHTML=html;
  };
  function ensureChip(){
    var bar=document.querySelector('[data-cat="all"]');
    if(!bar)return;
    var parent=bar.parentElement;
    if(parent && !parent.querySelector('[data-cat="privacidad"]')){
      var b=document.createElement('button');
      b.setAttribute('data-cat','privacidad');
      b.setAttribute('onclick',"setCat('privacidad')");
      b.className='px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 text-steel hover:border-white/20';
      b.textContent='Privacidad';
      bar.insertAdjacentElement('afterend',b);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){ensureChip();filterTools();});
  else{ensureChip();filterTools();}
})();
