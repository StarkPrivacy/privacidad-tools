/* Carga dinámica de scripts de herramientas extra */
(function(){
var s1=document.createElement('script');s1.src='https://cdn.jsdelivr.net/npm/qrcode@1.5.4/build/qrcode.min.js';
var s2=document.createElement('script');s2.src='extra.js';
var s3=document.createElement('script');s3.src='panels.js';
s1.onload=function(){document.body.appendChild(s2);s2.onload=function(){document.body.appendChild(s3);};};
document.body.appendChild(s1);
})();
