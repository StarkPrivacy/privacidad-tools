/* Carga QR, extra.js y panels.js en orden */
(function(){
  function load(src, next){
    var s=document.createElement('script');
    s.src=src;
    s.onload=function(){ if(next) next(); };
    s.onerror=function(){ console.error('Error', src); if(next) next(); };
    document.body.appendChild(s);
  }
  load('https://cdn.jsdelivr.net/npm/qrcode@1.5.4/build/qrcode.min.js', function(){
    load('extra.js', function(){
      load('panels.js');
    });
  });
})();
