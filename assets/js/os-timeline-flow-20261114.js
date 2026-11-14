document.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('.os-flow').forEach(function(section){
    var viewport=section.querySelector('.os-flow-viewport');
    var prev=section.querySelector('.os-flow-prev');
    var next=section.querySelector('.os-flow-next');
    if(!viewport||!prev||!next)return;
    function update(){var max=viewport.scrollWidth-viewport.clientWidth;prev.disabled=viewport.scrollLeft<3;next.disabled=viewport.scrollLeft>=max-3;}
    prev.addEventListener('click',function(){viewport.scrollBy({left:-Math.max(viewport.clientWidth*.75,180),behavior:'smooth'});});
    next.addEventListener('click',function(){viewport.scrollBy({left:Math.max(viewport.clientWidth*.75,180),behavior:'smooth'});});
    viewport.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);
    update();
  });
});