(function(){
var T=['arquivo','verde','mf3270','mf3279','macclassic'],N={arquivo:'Default',verde:'Verde CRT',mf3270:'Mainframe 3270',mf3279:'3279 a cores',macclassic:'Macintosh Clássico'},H=document.documentElement,box,inp,list,res=[],sel=0;
var cur=function(){return H.dataset.theme||'arquivo'};
function lab(b){b.textContent='◐ '+N[cur()];b.setAttribute('aria-label','Tema: '+N[cur()]+'. Clicar para mudar.')}
function esc(s){return s.replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function norm(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function mk(){box=document.createElement('div');box.className='busca';box.hidden=true;
 box.innerHTML='<div class="busca-box" role="dialog" aria-modal="true" aria-label="Pesquisar na wiki"><input type="search" placeholder="Pesquisar: VLAN, SIMH, Samba, DOS…" aria-label="Pesquisar" autocomplete="off"><ul></ul></div>';
 document.body.append(box);inp=box.querySelector('input');list=box.querySelector('ul');
 box.addEventListener('mousedown',function(e){if(e.target===box)close()});inp.addEventListener('input',run);
 inp.addEventListener('keydown',function(e){if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();mv(e.key==='ArrowDown'?1:-1)}else if(e.key==='Enter'&&res[sel])location.href=res[sel].u})}
function snip(r,q){var i=norm(r.x).indexOf(q);return i<0?r.d:(i>40?'…':'')+r.x.substr(Math.max(0,i-40),130)}
function run(){var q=norm(inp.value).split(/\s+/).filter(Boolean);res=[];
 if(q.length){(window.WIKI_INDEX||[]).forEach(function(p){var sc=0,ok=true,t=norm(p.t),h=norm(p.h.join(' ')),d=norm(p.d),x=norm(p.x);
  q.forEach(function(w){var a=(t.indexOf(w)>-1?6:0)+(h.indexOf(w)>-1?3:0)+(d.indexOf(w)>-1?2:0)+(x.indexOf(w)>-1?1:0);if(!a)ok=false;sc+=a});
  if(ok)res.push({u:p.u,t:p.t,d:p.d,x:p.x,sc:sc})});res.sort(function(a,b){return b.sc-a.sc});res=res.slice(0,8)}
 list.innerHTML=res.length?res.map(function(r){return'<li><a href="'+r.u+'">'+esc(r.t)+'<small>'+esc(snip(r,q[0]))+'</small></a></li>'}).join(''):(q.length?'<li><small style="padding:10px 12px">Nada encontrado para “'+esc(inp.value)+'”.</small></li>':'');
 sel=0;mark()}
function mark(){list.querySelectorAll('a').forEach(function(a,i){a.setAttribute('aria-selected',i===sel)})}
function mv(d){var n=res.length;if(!n)return;sel=(sel+d+n)%n;mark();list.querySelectorAll('a')[sel].scrollIntoView({block:'nearest'})}
function open(){if(!box)mk();box.hidden=false;inp.value='';list.innerHTML='';inp.focus()}
function close(){if(box)box.hidden=true}
document.addEventListener('keydown',function(e){if(e.key==='Escape')close();
 if((e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))||((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k')){e.preventDefault();open()}});
var nav=document.querySelector('header.bar nav');
if(nav){var w=document.createElement('span');w.className='nav-tools';
 var s=document.createElement('button');s.type='button';s.textContent='Pesquisar /';s.addEventListener('click',open);
 var l=document.createElement('label');l.className='theme-picker';
  var caption=document.createElement('span');caption.className='theme-picker-label';caption.textContent='Tema';
  var b=document.createElement('select');b.id='wiki-theme-select';b.setAttribute('aria-label','Escolher tema visual da wiki');
  T.forEach(function(t){var o=document.createElement('option');o.value=t;o.textContent=N[t];b.append(o)});
  b.value=T.indexOf(cur())>=0?cur():'arquivo';
  b.addEventListener('change',function(){var n=T.indexOf(b.value)>=0?b.value:'arquivo';H.dataset.theme=n;try{localStorage.setItem('wiki-theme',n)}catch(e){}if(n==='verde'||n==='ambar'){H.classList.add('boot');setTimeout(function(){H.classList.remove('boot')},600)}});
  l.append(caption,b);w.append(s,l);nav.append(w)}
var m=document.querySelector('main.content'),sb=document.querySelector('aside.wiki-sidebar-v2');
if(m&&sb){var hs=[].slice.call(m.querySelectorAll('h2')).filter(function(h){return!h.closest('.home-timeline-callout')});
 if(hs.length>=3){var g=document.createElement('div');g.className='wiki-side-group toc-group';g.innerHTML='<span class="wiki-side-title">NESTA PÁGINA</span>';
  hs.forEach(function(h,i){var sc=h.closest('section[id]');if(!h.id)h.id=sc?sc.id+'-titulo':'sec-'+i;var a=document.createElement('a');a.href='#'+h.id;a.textContent=h.textContent.replace(/^\d+\s*[\/·.]\s*/,'').replace(/\.$/,'');g.append(a)});sb.prepend(g)}}
var lg=document.querySelector('.os-flow-legend'),st=document.querySelectorAll('.os-flow-stop');
if(lg&&st.length){var F=[['','Todos'],['os-flow-good','Funcional'],['os-flow-partial','Parcial'],['os-flow-bad','Falhou'],['os-flow-emulated','Só SIMH']],d=document.createElement('div');
 d.className='project-toolbar';d.setAttribute('role','group');d.setAttribute('aria-label','Filtrar por resultado');
 F.forEach(function(f,i){var x=document.createElement('button');x.type='button';x.textContent=f[1];x.setAttribute('aria-pressed',i===0);
  x.onclick=function(){d.querySelectorAll('button').forEach(function(y){y.setAttribute('aria-pressed',y===x)});st.forEach(function(s){s.style.display=(!f[0]||s.classList.contains(f[0]))?'':'none'})};d.append(x)});lg.after(d)}
})();
