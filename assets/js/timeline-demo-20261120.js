
const viewport=document.querySelector('#retro-timeline-viewport');const milestones=[...document.querySelectorAll('.milestone')];
document.querySelector('#retro-next').addEventListener('click',()=>viewport.scrollBy({left:650,behavior:'smooth'}));
document.querySelector('#retro-prev').addEventListener('click',()=>viewport.scrollBy({left:-650,behavior:'smooth'}));
document.querySelectorAll('.timeline-demo [data-filter]').forEach(b=>b.addEventListener('click',()=>{
const value=b.dataset.filter;document.querySelectorAll('.timeline-demo [data-filter]').forEach(c=>c.setAttribute('aria-pressed',String(c===b)));
milestones.forEach(m=>m.hidden=!(value==='all'||m.dataset.state===value||m.dataset.platform===value));viewport.scrollLeft=0;
}));
