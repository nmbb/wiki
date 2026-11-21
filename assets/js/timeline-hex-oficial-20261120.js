/* Timeline retro: filtros por estado, plataforma e família (2026-11-21). */
(function(){
  function init(){
    const root=document.querySelector('.hex-timeline');
    if(!root) return;
    const windowEl=root.querySelector('#hex-timeline-window');
    const cards=Array.from(root.querySelectorAll('.moment'));
    const buttons=Array.from(root.querySelectorAll('button[data-filter]'));
    if(!windowEl || !cards.length || !buttons.length) return;
    root.querySelector('#hex-next')?.addEventListener('click',()=>windowEl.scrollBy({left:690,behavior:'smooth'}));
    root.querySelector('#hex-prev')?.addEventListener('click',()=>windowEl.scrollBy({left:-690,behavior:'smooth'}));
    function applyFilter(value){
      buttons.forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.filter===value)));
      cards.forEach(card=>{
        const visible=value==='all'||card.dataset.state===value||card.dataset.platform===value||card.dataset.family===value;
        card.hidden=!visible;
        card.style.display=visible?'':'none';
      });
      windowEl.scrollLeft=0;
    }
    buttons.forEach(btn=>btn.addEventListener('click',()=>applyFilter(btn.dataset.filter)));
    applyFilter('all');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
