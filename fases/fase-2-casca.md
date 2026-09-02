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

- [x] **Como quebrar em componentes?** → **3**, quebrados pelo que se repete.

  O reflexo é `Formulário` + `ListaAtiva` + `ListaDone`. Mas a lista ativa e a
  Done são **o mesmo quadro**: mesmas colunas, mesmos dois ícones. Só mudam o
  título, a ordenação e o riscado. Duas cópias = corrigir tudo duas vezes.

  | componente | recebe | responsabilidade |
  |---|---|---|
  | `TaskForm` | nada (ainda) | os três campos |
  | `TaskList` | título + array | desenha o quadro |
  | `TaskRow` | uma task | uma linha; decide sozinha se rabisca, olhando `completed_at` |

  O `App` decide **quais** tarefas vão em cada `TaskList` — e é aí que a
  ordenação da Fase 5 entra, sem tocar em componente nenhum.

- [x] **Onde ficam os dados falsos?** → arquivo separado, `src/mock.ts`.

  O `App.tsx` ganha só uma linha de `import`. Na Fase 4 essa linha vira a
  chamada do Supabase e o arquivo é apagado — nada de garimpar array no meio do
  arquivo que mais se mexe.

  Ganho escondido: pra escrever o array em TypeScript é preciso declarar o
  **tipo `Task`** com os campos da Fase 1 (`id`, `user_id`, `description`,
  `due_at`, `importance`, `completed_at`). Esse tipo é o mesmo que o Supabase
  vai devolver — então na Fase 4 muda a *origem* do array e mais nada. Os
  componentes nem ficam sabendo.

  **6 itens**, escolhidos pra pegar os casos chatos agora e não no celular
  depois: 4 pendentes e 2 feitas; uma com descrição comprida (quebra de linha
  no celular), uma com prazo já vencido, uma com prazo longe, importâncias 1 e
  10 nas pontas.

- [x] **Como a importância aparece na tela?** → **não aparece.** Existe no
      formulário e no cálculo de prioridade, e só. (O draft mostra a coluna, mas
      o README já decidiu contra — a coluna sai.)

- [x] **Como a data é exibida?** → `DIA/MES/ANO HORA:MINUTO`, absoluta. Nada de
      "em 3 dias".

- [x] **Como uma tarefa feita aparece?** → sai da lista ativa, entra na Done,
      riscada e com opacidade reduzida.

- [x] **Qual estrutura de HTML pra lista?** → Bootstrap.

### Feito quando

- [ ] `npm run dev` mostra a tela parecida com o draft
- [ ] Abre no celular pela rede local sem ficar espremido
      (`npm run dev -- --host`, e acessar o IP da máquina pelo Safari)

---

## Passo 2 — `base` do Vite

GitHub Pages de repositório não serve na raiz do domínio, e sim em
`usuario.github.io/nome-do-repo/`. Um build feito pra raiz procura os assets no
lugar errado e a página abre **em branco**, sem erro visível na tela.

- [x] **Qual vai ser a URL exata do site?**

  O repositório é `github.com/ricaxov/checklist`, e ele **não** se chama
  `ricaxov.github.io` — então é um *project site*, e a regra é fixa:

  ```
  https://ricaxov.github.io/checklist/     →     base: '/checklist/'
  ```

- [ ] `base` configurado no `vite.config.ts`
- [ ] `npm run build` e conferido que os caminhos no `index.html` gerado batem
      com a URL (têm que começar com `/checklist/`, não com `/`)

> Efeito colateral esperado: o dev server passa a servir em
> `http://localhost:5173/checklist/`. Não é bug.

---

## Passo 3 — Publicar

- [x] **Deploy na mão ou GitHub Action?** → **na mão.**

- [x] **De onde o Pages serve?** → **branch `main`, pasta `/docs`.**

  Combina com o "na mão": o deploy vira `build` + `commit` + `push`, sem branch
  extra e sem ferramenta extra, e os arquivos publicados ficam visíveis no
  repositório.

  **A mordida:** o Pages só aceita a **raiz** ou **`/docs`** — não aceita
  `checklist-app/dist`. Como o projeto Vite mora em `checklist-app/`, o build
  precisa cuspir em `../docs` (raiz do repo). É uma linha no `vite.config.ts`,
  junto do `base`. Vai precisar também de `emptyOutDir`, porque o Vite se
  recusa a limpar sozinho uma pasta fora da raiz do projeto.

  Conferir de quebra que `docs/` **não** está no `.gitignore` — o `dist` está,
  e é justamente por isso que ele não serve.

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

- [x] **Nome do app** → `Checklist`

- [x] **O ícone** → fica pra depois; a imagem será criada por você.

  Enquanto não existir, o iOS usa um print da página como ícone. Feio, mas não
  impede nada nesta fase. Quando for fazer: o iOS lê a tag
  `<link rel="apple-touch-icon">` — um **PNG 180×180** — e não se contenta só
  com o `icons` do manifest.

- [x] **Cor de fundo / tema** → **tema escuro nativo do Bootstrap.**

  O Bootstrap 5.3 já tem modo escuro pronto. Um atributo no `<html>` e todo
  componente vira escuro de uma vez, sem inventar paleta:

  ```html
  <html lang="pt-BR" data-bs-theme="dark">
  ```

  O fundo que ele usa é **`#212529`**. Esse mesmo valor vai nos outros três
  lugares que pintam tela — se divergirem, o app pisca de uma cor pra outra ao
  abrir:

  | onde | pra quê |
  |---|---|
  | `<meta name="theme-color" content="#212529">` | barra do navegador / do app |
  | `background_color` no manifest | a tela enquanto o app carrega |
  | `theme_color` no manifest | a cor que o sistema usa em volta |

  Vale também `<meta name="color-scheme" content="dark">`: deixa os campos do
  formulário e a barra de rolagem escuros, e evita o flash branco antes do CSS
  carregar.

### Feito quando

- [ ] `manifest.json` no `public/`, referenciado no `index.html`
- [ ] `data-bs-theme="dark"` no `<html>` e as três cores batendo em `#212529`
- [ ] Adicionado à tela de início do iPhone
- [ ] **Abre sem a barra do Safari** ← é isso que prova que funcionou
- [ ] (depois) O ícone é o seu, não um print da página

---

## Passo a passo

### 1. A tela (`npm run dev`)

1. Declarar o tipo `Task` com os seis campos da Fase 1. Ele é o contrato entre
   tudo daqui pra frente.
2. `src/mock.ts`: exportar um array de 6 `Task`, com os casos chatos listados no
   Passo 1.
3. `TaskRow`: uma linha. Recebe uma task, formata a data em
   `DIA/MES/ANO HORA:MINUTO`, mostra os dois ícones, e risca + reduz opacidade
   quando `completed_at` não é nulo. **Sem coluna de importância.**
4. `TaskList`: recebe título e array, desenha o quadro e repete `TaskRow`.
5. `TaskForm`: os três campos, sem nenhum comportamento.
6. `App`: monta os três, filtrando o mock em duas listas por `completed_at`.
7. Abrir no celular pela rede local (`npm run dev -- --host`) **antes** de
   publicar — é onde a tabela aperta.

### 2. O build pra publicar

8. No `vite.config.ts`, acrescentar ao `defineConfig`:

   ```ts
   base: '/checklist/',
   build: {
     outDir: '../docs',
     emptyOutDir: true,
   },
   ```

9. Criar `checklist-app/public/.nojekyll` (arquivo vazio). O Pages roda Jekyll
   por padrão; o `.nojekyll` desliga isso. Ficando em `public/`, ele é copiado
   pro `docs/` a cada build e você nunca mais lembra dele.
10. `npm run build`. Abrir `docs/index.html` e conferir: os `src`/`href` têm que
    começar com `/checklist/`.

### 3. Ligar o Pages

11. Commitar `docs/` e dar push.
12. No GitHub: **Settings → Pages → Source: Deploy from a branch**, branch
    `main`, pasta `/docs`. Salvar.
13. Esperar um ou dois minutos e abrir `https://ricaxov.github.io/checklist/`.
14. Abrir no Safari do celular.

A partir daqui, publicar é sempre: `npm run build` → commit → push.

### 4. Virar app

15. No `index.html`: `data-bs-theme="dark"` no `<html>`, e as metas de
    `theme-color` e `color-scheme`.
16. `public/manifest.json` com `name`, `short_name: "Checklist"`,
    `start_url: "/checklist/"`, `display: "standalone"`, e as duas cores.
17. Referenciar o manifest no `<head>`.
18. Rebuild, push, e **remover e adicionar de novo** o ícone na tela de início
    do iPhone (ver armadilha do cache abaixo).
19. Confirmar que abre sem a barra de endereço.

---

## Armadilhas conhecidas

**Tela branca no Pages.** `base` errado. Sempre.

**`docs/` ignorado pelo git.** O `.gitignore` do scaffold ignora `dist`. Se o
build fosse pra lá, o push subiria vazio. É parte do motivo de usar `docs/`.

**Cache do iOS.** Depois de republicar, o app na tela de início pode continuar
mostrando a versão velha. Remover e adicionar de novo resolve na marra.

**Manifest sozinho não basta no iOS.** O iOS moderno respeita o `display` do
manifest, mas as tags `apple-mobile-web-app-*` ainda são o que versões mais
antigas leem, e o ícone continua vindo do `apple-touch-icon`. Conferir o que
ainda é necessário na versão atual do iOS antes de sair chutando.

---

## Saída desta fase

- [ ] Tela do draft montada com dados falsos
- [ ] Site publicado e abrindo no PC
- [ ] Site abrindo no Safari do celular
- [ ] Ícone na tela de início abrindo em tela cheia
- [ ] Nenhuma linha de Supabase escrita ainda
