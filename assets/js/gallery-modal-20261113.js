/* Abre capturas originais numa janela sem sair do artigo. */
(()=>{'use strict';
const figures=[...document.querySelectorAll('figure.figure')].filter(fig=>fig.querySelector('img'));
if(!figures.length||typeof HTMLDialogElement==='undefined')return;
const modal=document.createElement('dialog');modal.className='wiki-image-modal';modal.setAttribute('aria-label','Imagem ampliada');
modal.innerHTML='<div class="wiki-modal-shell"><button type="button" class="wiki-modal-close" aria-label="Fechar imagem">×</button><img class="wiki-modal-image" alt=""><div class="wiki-modal-caption"></div></div>';
document.body.appendChild(modal);
const enlarged=modal.querySelector('img'), caption=modal.querySelector('.wiki-modal-caption'),close=modal.querySelector('button');
let lastFocus=null;
const isLocalImage=(a)=>a&&/\.(png|jpe?g|webp|gif)(?:[?#].*)?$/i.test(a.getAttribute('href')||'') && !/^https?:/i.test(a.getAttribute('href')||'');
figures.forEach(fig=>{const img=fig.querySelector('img'), anchor=img.closest('a'); if(anchor&&!isLocalImage(anchor))return;
 const opener=anchor||img;if(anchor){anchor.removeAttribute('target');anchor.removeAttribute('rel');anchor.setAttribute('aria-label','Ampliar imagem: '+img.alt)}else{img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label','Ampliar imagem: '+img.alt)}
 const show=e=>{if(e){e.preventDefault()} lastFocus=opener;enlarged.src=anchor?anchor.getAttribute('href'):img.currentSrc||img.src;enlarged.alt=img.alt;caption.textContent=fig.querySelector('figcaption')?.textContent.trim()||img.alt;modal.showModal();close.focus()};
 opener.addEventListener('click',show);if(!anchor)opener.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){show(e)}});
});
close.addEventListener('click',()=>modal.close());modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});modal.addEventListener('close',()=>{enlarged.removeAttribute('src');if(lastFocus?.isConnected)lastFocus.focus()});
})();
