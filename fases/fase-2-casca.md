# Fase 2 — Casca no ar

**Objetivo:** o site publicado no GitHub Pages, abrindo como app na tela de
início do iPhone, mostrando a tela do draft com dados falsos.

Nada de Supabase aqui. Nada de login. Nada funcionando de verdade — só a casca,
no ar.

**Por que antes do login:** publicar cedo pega o erro de caminho enquanto não tem
nada pra depurar junto, e dá a URL real que a Fase 3 precisa pra cadastrar o
retorno do Google.

---

## Passo 1 — Layout estático

Montar a tela do draft com dados chumbados no código. Sem estado, sem salvar,
sem clique fazendo nada.

### Decisões

- [ ] **Como quebrar em componentes?** O draft tem três blocos (formulário,
      lista ativa, Done). Isso são 3 componentes? 5? 1 só por enquanto?

  > resposta:

- [ ] **Onde ficam os dados falsos?** Array no topo do `App.tsx`? Arquivo
      separado? Quantos itens pra testar direito?

  > resposta:

- [ ] **Como a importância aparece na tela?** O README diz pra exibir só
      descrição, data e is_done. Então ela some da lista? Aparece só no
      formulário? Vira estrela, cor, nada?

  > resposta:

- [ ] **Como a data é exibida?** O draft pede `DIA/MES/ANO HORA:MINUTO`. Data
      absoluta, ou "em 3 dias"? As duas?

  > resposta:

- [ ] **Como uma tarefa feita aparece?** No draft ela está riscada. Risca só, ou
      muda cor / opacidade também?

  > resposta:

- [ ] **Qual estrutura de HTML pra lista?** `<table>` de verdade, ou divs com as
      classes de grid do Bootstrap? Pensa em como cada uma se comporta numa tela
      estreita de celular.

  > resposta:

### Feito quando

- [ ] `npm run dev` mostra a tela parecida com o draft
- [ ] Abre no celular pela rede local sem ficar espremido

---

## Passo 2 — `base` do Vite

GitHub Pages de repositório não serve na raiz do domínio, e sim em
`usuario.github.io/nome-do-repo/`. Um build feito pra raiz procura os assets no
lugar errado e a página abre **em branco**, sem erro visível na tela.

- [ ] **Qual vai ser a URL exata do site?**

  > resposta:

- [ ] `base` configurado no `vite.config.ts`
- [ ] `npm run build` e conferido que os caminhos no `dist/index.html` batem com
      a URL

---

## Passo 3 — Publicar

- [ ] **Deploy na mão ou GitHub Action?** Na mão é menos peça pra configurar;
      Action publica sozinha a cada push. Qual dói menos agora?

  > resposta:

- [ ] **De onde o Pages serve?** Branch `gh-pages`, pasta `/docs`, ou direto do
      Action? (Settings → Pages, no repositório)

  > resposta:

- [ ] Publicado
- [ ] **Abre no PC** sem tela branca
- [ ] **Abre no Safari do celular**

Se abrir em branco: F12 → Console. Erro de arquivo não encontrado é o `base`
errado. É o erro nº 1 aqui, e é sempre isso.

---

## Passo 4 — Virar app na tela de início

Sem manifest, "Adicionar à Tela de Início" gera um atalho que abre o Safari
normal, com barra de endereço e tudo. Com manifest, abre em tela cheia, com
ícone próprio.

### Decisões

- [ ] **Nome do app** (o que aparece embaixo do ícone — tela de início corta
      nome comprido)

  > resposta:

- [ ] **O ícone.** Qual imagem? Quais tamanhos o iOS pede?

  > resposta:

- [ ] **Cor de fundo / tema** (a cor que aparece enquanto o app abre)

  > resposta:

### Feito quando

- [ ] `manifest.json` no `public/`, referenciado no `index.html`
- [ ] Ícones no `public/`
- [ ] Adicionado à tela de início do iPhone
- [ ] **Abre sem a barra do Safari** ← é isso que prova que funcionou
- [ ] O ícone é o seu, não um print da página

---

## Armadilhas conhecidas

**Tela branca no Pages.** `base` errado. Sempre.

**Cache do iOS.** Depois de republicar, o app na tela de início pode continuar
mostrando a versão velha. Remover e adicionar de novo resolve na marra.

**Manifest sozinho não basta no iOS.** O Safari historicamente precisa de umas
meta tags próprias além do manifest. Vale conferir o que ainda é necessário na
versão atual do iOS antes de sair chutando.

---

## Saída desta fase

- [ ] Tela do draft montada com dados falsos
- [ ] Site publicado e abrindo no PC
- [ ] Site abrindo no Safari do celular
- [ ] Ícone na tela de início abrindo em tela cheia
- [ ] Nenhuma linha de Supabase escrita ainda
