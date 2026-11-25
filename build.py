#!/usr/bin/env python3
"""Gerador da wiki (só biblioteca standard). Uso: python3 build.py [pasta-de-saida]
Sem argumentos, regenera as páginas na raiz do repositório. Fontes: src/pages, src/css, assets/."""
import re,os,sys,shutil,hashlib,json
ROOT=os.path.dirname(os.path.abspath(__file__)); OUT=os.path.abspath(sys.argv[1]) if len(sys.argv)>1 else ROOT
BASE='https://nmbb.github.io/wiki/'
INFRA=[('homelab','Home Lab'),('redes','Redes e VLANs'),('pfsense','pfSense'),('proxmox','Proxmox'),('tailscale','Tailscale'),('cloudflare','Cloudflare e alojamento')]
SERV=[('banana-pi-m5','Banana Pi M5'),('home-assistant','Home Assistant'),('homarr','Homarr'),('monitorizacao','Monitorização')]
CASOS=[('banana-pi-docker-rede','Docker arrancou antes da rede')]
LAB=[('projetos','Visão geral do laboratório'),('mainframes','Mainframes IBM · MVS'),('dos','MS-DOS · 1982–1994'),('windows-antigos','Windows 1.01, 2.1 e 3.11'),('windows-nt','Windows NT 3.1, NT4 e 2000'),('redhat-samba','Red Hat 7.1 + Samba'),('suse9','SuSE Linux 9.0'),('retro-simh','Retro-SIMH · 1977–1982'),('86box','86Box · x86 histórico'),('pxe-iventoy','PXE e iVentoy'),('fog','FOG Project')]
TOP=[('index','Início'),('artigos','Biblioteca'),('linha-do-tempo','Timeline retro'),('sobre','Sobre')]
ORDER=[k for k,_ in INFRA+SERV+CASOS+LAB if '#' not in k]; TITLES=dict(INFRA+SERV+CASOS+LAB)
CSS=['legacy/wiki.css','legacy/wiki-unified.css','legacy/archive-2026.css','legacy/gallery-modal-20261113.css','legacy/wiki-sidebar-v2.css','theme.css']
rd=lambda p:open(p,encoding='utf-8').read()
def put(p,t):
    os.makedirs(os.path.dirname(p),exist_ok=True); open(p,'w',encoding='utf-8').write(t)
hv=lambda p:hashlib.md5(open(p,'rb').read()).hexdigest()[:8]
def link(it,cur):
    k,t=it; slug,_,a=k.partition('#'); c=' class="cur" aria-current="page"' if slug==cur and not a else ''
    return '<a href="%s.html%s"%s>%s</a>'%(slug,'#'+a if a else '',c,t)
def header(cur):
    top=lambda k,t:'<a href="%s.html"%s>%s</a>'%(k,' aria-current="page"' if k==cur else '',t)
    menu=lambda t,L:'<details class="wiki-menu"><summary>%s</summary><div class="wiki-submenu">%s</div></details>'%(t,''.join(link(i,cur) for i in L))
    return ('<header class="bar"><div class="wrap"><a class="brand" href="index.html">◈  ARQUIVO / WIKI</a><nav aria-label="Navegação principal">'
        +top('index','Início')+menu('Infraestrutura',INFRA)+menu('Serviços e casos',SERV+CASOS)+menu('Laboratório',LAB)+top('artigos','Biblioteca')+top('linha-do-tempo','Timeline retro')+top('sobre','Sobre')+'</nav></div></header>')
def sidebar(cur):
    g=lambda t,L:'<div class="wiki-side-group"><span class="wiki-side-title">%s</span>%s</div>'%(t,''.join(link(i,cur) for i in L))
    return g('PRINCIPAL',[('artigos','Biblioteca'),('linha-do-tempo','Timeline retro')])+g('INFRAESTRUTURA',INFRA)+g('SERVIÇOS E AUTOMAÇÃO',SERV)+g('CASOS PRÁTICOS',CASOS)+g('LABORATÓRIO RETRO',LAB)
def parse(p):
    t=rd(p); m=re.match(r'---\n(.*?)\n---\n',t,re.S)
    return dict(l.split(': ',1) for l in m.group(1).split('\n') if ': ' in l),t[m.end():]
STRIP='<div class="redesign-strip"><span class="strip-time">ESTAÇÃO 2026 / ARQUIVO DE EXPERIÊNCIAS</span><span>Redes · sistemas antigos · serviços · testes reais   <a href="linha-do-tempo.html">Explorar timeline ↗</a></span></div>'
FOOT='<footer><div class="wrap"><span>© 2026 Nuno Brandão · Wiki pessoal e técnica</span><a href="artigos.html">Voltar à Biblioteca ↑</a></div></footer>'
# 1) CSS único com versão automática
os.makedirs(OUT+'/assets/css',exist_ok=True)
if OUT!=ROOT: shutil.copytree(ROOT+'/assets',OUT+'/assets',dirs_exist_ok=True)
put(OUT+'/assets/css/site.css',rd(ROOT+'/src/css/site-base.css'))
for theme in ('arquivo', 'verde', 'hercules', 'mf3270', 'mf3279', 'nextstep', 'os2warp', 'solaris'):
    put(OUT+'/assets/css/theme-'+theme+'.css',rd(ROOT+'/src/css/themes/theme-'+theme+'.css'))
for f in os.listdir(ROOT+'/src/css/extra'): shutil.copy(ROOT+'/src/css/extra/'+f,OUT+'/assets/css/'+f)
V={n:hv(OUT+'/assets/'+n) for n in ('css/site.css','js/site.js','js/wiki-nav.js','js/gallery-modal-20261113.js')}
# 2) páginas
MES=['jan.','fev.','mar.','abr.','mai.','jun.','jul.','ago.','set.','out.','nov.','dez.']
import datetime;_d=datetime.date.today();HOJE='%d %s %d'%(_d.day,MES[_d.month-1],_d.year)
index=[];esc=lambda s:s.replace('&','&amp;').replace('"','&quot;')
strip=lambda s:re.sub(r'\s+',' ',re.sub(r'<[^>]+>',' ',s)).strip()
for f in sorted(os.listdir(ROOT+'/src/pages')):
    slug=f[:-5]; fm,body=parse(ROOT+'/src/pages/'+f)
    body=re.sub(r'(<aside[^>]*wiki-sidebar-v2[^>]*>).*?(</aside>)',lambda m:m.group(1)+sidebar(slug)+m.group(2),body,flags=re.S)
    body=body.replace('{{N_ARTIGOS}}',str(len(ORDER))).replace('{{ATUALIZADO}}',HOJE)
    body=re.sub(r'<main(?![^>]*\bid=)([^>]*)>',r'<main id="conteudo"\1>',body,count=1)
    if slug in ORDER and 'class="content"' in body:
        i=ORDER.index(slug); pn=''
        if i>0: pn+='<a class="pn-prev" href="%s.html"><small>← Anterior</small>%s</a>'%(ORDER[i-1],TITLES[ORDER[i-1]])
        if i<len(ORDER)-1: pn+='<a class="pn-next" href="%s.html"><small>Seguinte →</small>%s</a>'%(ORDER[i+1],TITLES[ORDER[i+1]])
        k=body.rfind('</main>'); body=body[:k]+'<nav class="pn" aria-label="Artigos vizinhos">'+pn+'</nav>'+body[k:]
    title,desc=fm['title'],fm['description']
    og=os.path.exists(OUT+'/assets/img/og.png')
    head=('<!DOCTYPE html><html lang="pt-PT" data-theme="arquivo"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#10191f">'
      '<title>%s</title><meta name="description" content="%s"><meta property="og:type" content="website"><meta property="og:locale" content="pt_PT"><meta property="og:title" content="%s"><meta property="og:description" content="%s"><meta property="og:url" content="%s%s.html"><link rel="canonical" href="%s%s.html">'%(title,esc(desc),esc(title),esc(desc),BASE,slug,BASE,slug)
      +('<meta property="og:image" content="%sassets/img/og.png"><meta name="twitter:card" content="summary_large_image">'%BASE if og else '')
      +'<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml"><script>try{var t=localStorage.getItem("wiki-theme");if([\"arquivo\",\"verde\",\"hercules\",\"mf3270\",\"mf3279\",\"nextstep\",\"os2warp\",\"solaris\"].indexOf(t)!==-1)document.documentElement.dataset.theme=t}catch(e){}</script>'
      '<link rel="stylesheet" href="assets/css/site.css?v=%s">'%V['css/site.css']
      +''.join('<link rel="stylesheet" href="assets/css/%s">'%c for c in fm.get('css','').split(',') if c)+"<script>(function(){var names=['arquivo', 'verde', 'hercules', 'mf3270', 'mf3279', 'nextstep', 'os2warp', 'solaris'];function apply(){var t=document.documentElement.dataset.theme||'arquivo';if(names.indexOf(t)<0)t='arquivo';var l=document.getElementById('active-wiki-theme');if(!l){l=document.createElement('link');l.rel='stylesheet';l.id='active-wiki-theme';document.head.appendChild(l)}var h='assets/css/theme-'+t+'.css?v=20261124-eight-v1';if(l.getAttribute('href')!==h)l.setAttribute('href',h)}apply();new MutationObserver(apply).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']})})();</script>"+'</head>')
    js=''.join('<script defer src="assets/js/%s"></script>'%j for j in fm.get('js','').split(',') if j)
    tail=('<div class="crt-tint" aria-hidden="true"></div><div class="crt-lines" aria-hidden="true"></div>'
      '<script defer src="assets/js/search-index.js"></script><script defer src="assets/js/site.js?v=%s"></script><script defer src="assets/js/wiki-nav.js?v=%s"></script><script defer src="assets/js/gallery-modal-20261113.js?v=%s"></script>%s</body></html>'%(V['js/site.js'],V['js/wiki-nav.js'],V['js/gallery-modal-20261113.js'],js))
    page=head+'<body><a class="skip-link" href="#conteudo">Saltar para o conteúdo</a><div id="crt">'+header(slug)+(STRIP if fm.get('strip')=='1' else '')+body+(FOOT if fm.get('footer')=='1' else '')+'</div>'+tail
    put(OUT+'/%s.html'%slug,page)
    txt=strip(re.sub(r'<aside.*?</aside>|<nav class="pn".*?</nav>','',body,flags=re.S))
    h1=re.search(r'<h1[^>]*>(.*?)</h1>',body,re.S)
    index.append({'u':slug+'.html','t':strip(h1.group(1)) if h1 else title.split(' | ')[0].split(' — ')[0],'d':desc,'h':[strip(h) for h in re.findall(r'<h[23][^>]*>(.*?)</h[23]>',body,re.S)][:25],'x':txt[:5000]})
put(OUT+'/assets/js/search-index.js','window.WIKI_INDEX='+json.dumps(index,ensure_ascii=False,separators=(',',':'))+';')
# 3) verificação de ligações e imagens
bad=[]
for f in os.listdir(OUT):
    if f.endswith('.html'):
        for u in re.findall(r'(?:href|src)="([^"#:]+?)(?:[?#][^"]*)?"',rd(OUT+'/'+f)):
            if not os.path.exists(os.path.join(OUT,u)): bad.append((f,u))
print('%d páginas geradas em %s | ligações/recursos em falta: %s'%(len(index),OUT,sorted(set(bad)) or 'nenhum'))
