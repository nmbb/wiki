(function(){
const root=document.querySelector('.hex-timeline');if(!root)return;
const win=root.querySelector('#hex-timeline-window');const moments=[...root.querySelectorAll('.moment')];
root.querySelector('#hex-next')?.addEventListener('click',()=>win.scrollBy({left:690,behavior:'smooth'}));
root.querySelector('#hex-prev')?.addEventListener('click',()=>win.scrollBy({left:-690,behavior:'smooth'}));
root.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{
const v=b.dataset.filter;root.querySelectorAll('[data-filter]').forEach(other=>other.setAttribute('aria-pressed',String(other===b)));
moments.forEach(e=>{e.hidden=!(v==='all'||e.dataset.state===v||e.dataset.platform===v||e.dataset.family===v)});win.scrollLeft=0;
}));
})();