WIKI TÉCNICA — versão com gerador, temas CRT e pesquisa (17-11-2026)

COMO INSTALAR
1. Extrair o CONTEÚDO deste ZIP na raiz do repositório nmbb/wiki (sem criar pasta wiki/wiki). Substitui todos os .html.
2. Apagar os ficheiros listados em LIMPEZA.txt (CSS e PNG antigos que já não são usados).
3. Fazer commit e push. O site continua em https://nmbb.github.io/wiki/ sem mudar nada nas definições.

COMO EDITAR A PARTIR DE AGORA
- O texto dos artigos está em src/pages/<nome>.html (cabeçalho com título e descrição, depois o conteúdo).
- O menu e a barra lateral estão num só sítio: listas INFRA, SERV e LAB no topo de build.py.
  Para acrescentar um artigo: criar src/pages/novo.html, juntar uma linha à lista certa e correr:
      python3 build.py
  Isto regenera todos os .html, o CSS único (assets/css/site.css), o índice de pesquisa e verifica as ligações.
- Estilos: src/css/. Os temas e componentes novos estão em src/css/theme.css.
- Imagens novas: usar WebP (ou PNG pequeno).

O QUE HÁ DE NOVO
- Temas: Arquivo (o original) e Verde (CRT de fósforo). Botão no menu; a escolha fica guardada no browser.
- Pesquisa em todas as páginas: tecla / ou Ctrl+K. Funciona também offline (abrir index.html).
- "Nesta página" na barra lateral, anterior/seguinte no fim dos artigos, filtro por resultado na timeline.
- Retro-SIMH com o mesmo aspeto dos outros artigos e presente no menu e na barra lateral.
- Imagens de 10,1 MB (PNG) para 1,7 MB (WebP); favicon e pré-visualização ao partilhar.

PUBLICAÇÃO AUTOMÁTICA (opcional)
.github/workflows/pages.yml publica a pasta gerada. Para a usar: Settings > Pages > Source = GitHub Actions
e acrescentar o gatilho push no ficheiro. Enquanto isso não for feito, corre só manualmente.
