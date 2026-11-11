/* Um unico controlador para todos os submenus do cabeçalho */
(function(){
  const details = Array.from(document.querySelectorAll('header.bar details.wiki-menu'));
  details.forEach(function(item){
    item.addEventListener('toggle', function(){
      if(!item.open)return;
      details.forEach(function(other){if(other!==item)other.open=false;});
      const pop=item.querySelector('.wiki-submenu');
      if(pop){pop.style.left='';pop.style.right='';
        const box=pop.getBoundingClientRect();
        if(box.right>window.innerWidth-12){pop.style.left='auto';pop.style.right='0';}
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
