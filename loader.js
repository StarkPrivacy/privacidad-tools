/* Carga QR (ruta correcta), extra, panels, pdf-extra */
(function(){
  function load(src, next){
    var s=document.createElement('script');
    s.src=src;
    s.onload=function(){ if(next) next(); };
    s.onerror=function(){ console.error('Error cargando', src); if(next) next(); };
    document.body.appendChild(s);
  }
  // Ruta correcta del paquete qrcode (browser build)
  load('https://cdn.jsdelivr.net/npm/qrcode@1.5.4/lib/browser.min.js', function(){
    load('extra.js', function(){
      load('panels.js', function(){
        load('pdf-extra.js');
      });
    });
  });
})();
