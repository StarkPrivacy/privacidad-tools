/* Desenfocar zonas en foto */
var blurState={img:null, canvas:null, ctx:null, regions:[], drawing:false, start:null, scale:1};
function blurLoadImage(file){
  if(!file)return;
  var url=URL.createObjectURL(file);
  var img=new Image();
  img.onload=function(){
    blurState.img=img; blurState.regions=[];
    var canvas=document.getElementById('blurCanvas'); if(!canvas)return;
    var maxW=720; var scale=img.width>maxW?maxW/img.width:1;
    blurState.scale=scale;
    canvas.width=Math.round(img.width*scale); canvas.height=Math.round(img.height*scale);
    blurState.canvas=canvas; blurState.ctx=canvas.getContext('2d');
    blurRedraw();
    document.getElementById('blurStatus').textContent='Arrastra sobre la zona a desenfocar. Puedes marcar varias.';
    document.getElementById('blurActions').classList.remove('hidden');
  };
  img.src=url;
}
function blurRedraw(){
  var ctx=blurState.ctx, canvas=blurState.canvas, img=blurState.img;
  if(!ctx||!img)return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(img,0,0,canvas.width,canvas.height);
  var block=Math.max(4, Math.round(+(document.getElementById('blurStrength')&&document.getElementById('blurStrength').value||12)));
  blurState.regions.forEach(function(r){
    var sx=Math.max(0,Math.floor(r.x)), sy=Math.max(0,Math.floor(r.y));
    var sw=Math.min(canvas.width-sx,Math.floor(r.w)), sh=Math.min(canvas.height-sy,Math.floor(r.h));
    if(sw<2||sh<2)return;
    try{
      var sample=ctx.getImageData(sx,sy,sw,sh);
      for(var y=0;y<sh;y+=block){
        for(var x=0;x<sw;x+=block){
          var i=((y*sw)+x)*4;
          var r0=sample.data[i],g0=sample.data[i+1],b0=sample.data[i+2],a0=sample.data[i+3];
          for(var dy=0;dy<block&&y+dy<sh;dy++){
            for(var dx=0;dx<block&&x+dx<sw;dx++){
              var j=(((y+dy)*sw)+(x+dx))*4;
              sample.data[j]=r0; sample.data[j+1]=g0; sample.data[j+2]=b0; sample.data[j+3]=a0;
            }
          }
        }
      }
      ctx.putImageData(sample,sx,sy);
    }catch(e){}
  });
  ctx.save(); ctx.strokeStyle='rgba(10,132,255,0.9)'; ctx.lineWidth=2; ctx.setLineDash([6,4]);
  blurState.regions.forEach(function(r){ ctx.strokeRect(r.x,r.y,r.w,r.h); });
  ctx.restore();
}
function blurCanvasPos(e){
  var canvas=blurState.canvas; var rect=canvas.getBoundingClientRect();
  var clientX=e.touches?e.touches[0].clientX:e.clientX;
  var clientY=e.touches?e.touches[0].clientY:e.clientY;
  return { x:(clientX-rect.left)*(canvas.width/rect.width), y:(clientY-rect.top)*(canvas.height/rect.height) };
}
function blurPointerDown(e){ if(!blurState.canvas)return; e.preventDefault(); blurState.drawing=true; blurState.start=blurCanvasPos(e); }
function blurPointerMove(e){
  if(!blurState.drawing||!blurState.start)return; e.preventDefault();
  var p=blurCanvasPos(e);
  var r={ x:Math.min(blurState.start.x,p.x), y:Math.min(blurState.start.y,p.y), w:Math.abs(p.x-blurState.start.x), h:Math.abs(p.y-blurState.start.y) };
  var committed=blurState.regions; blurState.regions=committed.concat([r]); blurRedraw(); blurState.regions=committed; blurState._current=r;
}
function blurPointerUp(e){
  if(!blurState.drawing)return; blurState.drawing=false;
  if(blurState._current && blurState._current.w>4 && blurState._current.h>4) blurState.regions.push(blurState._current);
  blurState._current=null; blurRedraw();
  var st=document.getElementById('blurStatus');
  if(st)st.textContent=blurState.regions.length+' zona(s). Puedes anadir mas o descargar.';
}
function blurUndo(){ blurState.regions.pop(); blurRedraw(); }
function blurClear(){ blurState.regions=[]; blurRedraw(); }
function blurDownload(){
  if(!blurState.canvas)return;
  var ctx=blurState.ctx, canvas=blurState.canvas, img=blurState.img;
  ctx.clearRect(0,0,canvas.width,canvas.height); ctx.drawImage(img,0,0,canvas.width,canvas.height);
  var block=Math.max(4, Math.round(+(document.getElementById('blurStrength')&&document.getElementById('blurStrength').value||12)));
  blurState.regions.forEach(function(r){
    var sx=Math.max(0,Math.floor(r.x)), sy=Math.max(0,Math.floor(r.y));
    var sw=Math.min(canvas.width-sx,Math.floor(r.w)), sh=Math.min(canvas.height-sy,Math.floor(r.h));
    if(sw<2||sh<2)return;
    var sample=ctx.getImageData(sx,sy,sw,sh);
    for(var y=0;y<sh;y+=block){
      for(var x=0;x<sw;x+=block){
        var i=((y*sw)+x)*4; var r0=sample.data[i],g0=sample.data[i+1],b0=sample.data[i+2],a0=sample.data[i+3];
        for(var dy=0;dy<block&&y+dy<sh;dy++){
          for(var dx=0;dx<block&&x+dx<sw;dx++){
            var j=(((y+dy)*sw)+(x+dx))*4; sample.data[j]=r0;sample.data[j+1]=g0;sample.data[j+2]=b0;sample.data[j+3]=a0;
          }
        }
      }
    }
    ctx.putImageData(sample,sx,sy);
  });
  canvas.toBlob(function(b){
    var a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='foto_desenfocada.png'; a.click(); blurRedraw();
  },'image/png');
}
function initBlurUI(){
  var canvas=document.getElementById('blurCanvas');
  if(!canvas||canvas._blurBound)return;
  canvas._blurBound=true;
  canvas.addEventListener('mousedown',blurPointerDown);
  canvas.addEventListener('mousemove',blurPointerMove);
  window.addEventListener('mouseup',blurPointerUp);
  canvas.addEventListener('touchstart',blurPointerDown,{passive:false});
  canvas.addEventListener('touchmove',blurPointerMove,{passive:false});
  window.addEventListener('touchend',blurPointerUp);
  var file=document.getElementById('blurFile');
  if(file)file.addEventListener('change',function(){ if(file.files[0])blurLoadImage(file.files[0]); });
  var str=document.getElementById('blurStrength');
  if(str)str.addEventListener('input',function(){ blurRedraw(); });
}
