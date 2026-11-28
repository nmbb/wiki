/* Um unico controlador para todos os submenus do cabeçalho */
(function(){
  const details = Array.from(document.querySelectorAll('header.bar details.wiki-menu'));
  details.forEach(function(item){
    item.addEventListener('toggle', function(){
      if(!item.open)return;
      details.forEach(function(other){if(other!==item)other.open=false;});
      const pop=item.querySelector('.wiki-submenu');
      if(pop){
        pop.style.removeProperty('left');pop.style.removeProperty('right');
        const parent=item.getBoundingClientRect();
        const label=item.classList.contains('wiki-split-menu') ? item.previousElementSibling : null;
        let left=label && label.classList.contains('wiki-split-link') ? label.getBoundingClientRect().left : parent.left;
        const width=pop.getBoundingClientRect().width;
        left=Math.max(12,Math.min(left,window.innerWidth-12-width));
        pop.style.setProperty('left',(left-parent.left)+'px','important');
        pop.style.setProperty('right','auto','important');
      }
    });
  });
  document.addEventListener('click',function(event){
    details.forEach(function(item){if(!item.contains(event.target))item.open=false;});
  });
  document.addEventListener('keydown',function(event){
    if(event.key==='Escape')details.forEach(function(item){item.open=false;});
  });
})();
