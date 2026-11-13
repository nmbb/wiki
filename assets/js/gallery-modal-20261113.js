/* Galeria global da Wiki. Clique nas imagens de conteúdo para ampliar. */
(()=>{'use strict';
const init=()=>{
  if(typeof HTMLDialogElement==='undefined'||document.querySelector('dialog.wiki-image-modal'))return;
  const photos=[...new Set(document.querySelectorAll('main img, .content img, .wiki-sheet img'))]
    .filter(img=>!img.matches('.no-lightbox,[data-no-lightbox]') && !img.closest('[data-no-lightbox],nav,header,footer') && img.getAttribute('src'));
  if(!photos.length)return;
  const dialog=document.createElement('dialog');dialog.className='wiki-image-modal';dialog.setAttribute('aria-label','Imagem ampliada');
  dialog.innerHTML='<div class="wiki-modal-shell"><button type="button" class="wiki-modal-close" aria-label="Fechar imagem">×</button><img class="wiki-modal-image" alt=""><div class="wiki-modal-caption"></div></div>';
  document.body.appendChild(dialog);
  const display=dialog.querySelector('.wiki-modal-image'),description=dialog.querySelector('.wiki-modal-caption'),close=dialog.querySelector('.wiki-modal-close');
  let focusBefore=null;
  const isImageUrl=url=>/\.(?:png|jpe?g|webp|gif|svg|avif)(?:[?#].*)?$/i.test(url||'');
  const open=img=>{
    focusBefore=document.activeElement;
    const link=img.closest('a');
    const full=link && isImageUrl(link.getAttribute('href')) ? link.getAttribute('href') : (img.currentSrc||img.src);
    display.src=full;display.alt=img.alt||'Imagem da Wiki';
    description.textContent=img.closest('figure')?.querySelector('figcaption')?.textContent.trim() || img.alt || '';
    dialog.showModal();close.focus();
  };
  photos.forEach(img=>{
    const a=img.closest('a');
    img.title='Clique para ampliar';
    if(a){
      // O clique na imagem abre-a; o texto do cartão continua a navegar para o artigo.
      img.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();open(img)});
      if(isImageUrl(a.getAttribute('href'))){
        a.removeAttribute('target');a.removeAttribute('rel');
        a.addEventListener('click',e=>{e.preventDefault();open(img)});
      }
    }else{
      img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label','Ampliar imagem: '+(img.alt||'captura'));
      img.addEventListener('click',()=>open(img));
      img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(img)}});
    }
  });
  close.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
  dialog.addEventListener('close',()=>{display.removeAttribute('src');focusBefore?.focus?.()});
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
