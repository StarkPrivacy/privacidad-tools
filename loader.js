/* Carga ordenada */
(function(){
  function load(src, next){
    var s=document.createElement('script');
    s.src=src;
    s.onload=function(){ if(next) next(); };
    s.onerror=function(){ console.error('Error', src); if(next) next(); };
    document.body.appendChild(s);
  }
  load('https://cdn.jsdelivr.net/npm/qrcode@1.5.4/lib/browser.min.js', function(){
    load('extra.js', function(){
      load('qr_fix.js', function(){
        load('extra_ft.js', function(){
          load('extra_blur.js', function(){
            load('nav_cat.js', function(){
              load('panels.js', function(){
                load('pdf-extra.js');
              });
            });
          });
        });
      });
    });
  });
})();
