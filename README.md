# checklist

Um todo list pessoal: cria tarefas com descrição, data limite e importância, e a
lista se reordena sozinha por prioridade conforme o prazo se aproxima.

O objetivo final é abrir no Safari do celular e usar o "Adicionar à Tela de
Início", pra funcionar como um app — e acessar a mesma lista do PC.

![draft](draft.png)

---

## O que a tela faz

**Entrada** — três campos: descrição, data limite (quando precisa estar pronto)
e importância.

**Lista ativa** — ordenada por prioridade. Exibe apenas **descrição, data e
is_done**; a importância não aparece, ela só alimenta o cálculo. Cada linha tem
editar e apagar.

**Done** — tarefas concluídas, ordenadas por data de conclusão.

**Prioridade** — `prio(e) = importância * 60% - date_delta * 40%`. Como o
`date_delta` muda com o tempo, a ordem da lista muda sozinha sem ninguém mexer
em nada.

---

## Decisões tomadas

| Área | Decisão | Por quê |
|---|---|---|
| Front | Vite + React 19 + TypeScript | já estava montado |
| Estilo | Bootstrap, só o CSS | sem o bundle JS; componentes interativos serão feitos em React |
| Hospedagem | GitHub Pages | grátis e estático, abre no celular |
| Dados | serviço externo com API chamada direto do browser (Supabase ou Firebase) | GitHub Pages não roda servidor; precisa sincronizar entre celular e PCs |
| Login | Entrar com Google (OAuth) | menos atrito no celular, nenhuma senha pra esquecer, recuperação de conta é problema do Google |

### Consequências que valem estar escritas

**Não existe backend próprio.** GitHub Pages serve arquivos estáticos. Todo o
"servidor" é o serviço externo.

**A chave do cliente é pública.** Ela vai no bundle e qualquer um consegue ler.
Isso é o desenho desses serviços, não uma falha. O que protege os dados são as
regras de acesso configuradas **no lado do serviço** — não dá pra proteger nada
escondendo coisa no frontend.

**O login com Google nunca passa pelo nosso código.** O usuário autentica no
site do Google e volta com um comprovante. O app não vê e não pode ver a senha
do Google — um formulário próprio pedindo a senha do Gmail seria phishing, e
por isso não existe essa opção em lugar nenhum.

---

## Passo a passo

Cada fase tem um documento de trabalho em [`fases/`](fases/), com as decisões
tomadas e o detalhe de cada passo.

### Fase 0 — feito

- [x] Scaffold Vite + React + TypeScript
- [x] Prettier no lugar do ESLint
- [x] Bootstrap instalado (`import 'bootstrap/dist/css/bootstrap.css'`)

### Fase 1 — modelagem e serviço · [doc](fases/fase-1-modelagem.md) ✅

1. **Definir o formato de um item.** Quais campos existem, quais são
   obrigatórios, qual o tipo de cada um. Lembrar do que não vem do formulário:
   id, dono, data de criação e data de conclusão (essa última é o que ordena a
   seção Done).
2. **Escolher o serviço e criar o projeto lá.** Supabase ou Firebase — não vale
   gastar tempo comparando os dois a fundo, os dois resolvem.
3. **Criar a tabela** com os campos do passo 1, já com a coluna de dono.
4. **Configurar as regras de acesso antes de qualquer código.** Regra: cada
   pessoa só lê e escreve as linhas que são dela. Esses serviços começam ou
   totalmente abertos ou totalmente fechados — descobrir qual é o padrão faz
   parte do passo.

### Fase 2 — casca no ar · [doc](fases/fase-2-casca.md) ← atual

5. **Layout estático.** A tela inteira do draft com dados chumbados no código:
   formulário em cima, lista no meio, Done embaixo. Sem estado, sem salvar.
6. **Configurar o `base` do Vite.** GitHub Pages de repositório serve numa
   subpasta, não na raiz do domínio. Sem isso, os caminhos dos assets quebram e
   a página abre em branco.
7. **Publicar no GitHub Pages.** Fazer isso cedo, ainda com a tela burra, é de
   propósito: pega o erro do `base` enquanto não tem nada pra depurar, e dá a
   URL real que a Fase 3 vai precisar.
8. **Manifest e ícones.** Sem isso, "Adicionar à Tela de Início" gera um atalho
   que abre o Safari normal, em vez de um app em tela cheia.

### Fase 3 — login

9. **Ligar o provedor Google** no painel do serviço.
10. **Cadastrar os endereços de retorno** — `localhost` e a URL do GitHub Pages,
    os dois. Erro de `redirect_uri` ou "origem não autorizada" quase sempre é
    isso, não bug no código.
11. **Fazer a tela decidir o que mostrar:** sem ninguém logado, tela de login;
    logado, a lista.
12. **Manter a sessão entre aberturas do app.** Senão o login é pedido toda vez
    que o ícone é tocado. Pensar também no que acontece quando o token vence.

### Fase 4 — as operações

13. **Ler antes de escrever.** A lista aparece com dados reais, ainda sem
    conseguir criar nada. É aqui que aparecem o "carregando" e o "deu erro".
14. **Criar.** Ligar o formulário. Perguntas chatas: o que acontece com os
    campos depois de enviar, como a lista sabe que tem item novo, o que fazer se
    a descrição vier vazia.
15. **Marcar / desmarcar done.** É a mesma operação em duas direções — tratar
    como uma coisa só desde o começo. Por ora só vira flag e muda a aparência da
    linha; a lógica de mover entre as seções fica pra depois.
16. **Editar e apagar** (os dois ícones do draft).

### Fase 5 — refino

17. **Seção Done de verdade**, ordenada por data de conclusão.
18. **Ordenação por prioridade** e o recálculo periódico. Duas perguntas pra
    responder aqui: esse recálculo precisa ir ao banco, ou é conta que dá pra
    fazer na tela com os dados que já estão em memória? E os ~300 updates por
    tarefa por dia anotados no draft — são updates de quê, exatamente?

---

## Armadilhas conhecidas

**Domínio não autorizado.** Esses serviços têm lista de origens permitidas.
Costuma funcionar no `localhost` e quebrar publicado, ou o contrário.

**Free tier hiberna.** Projeto parado por semanas pode ser pausado. Irrelevante
pra um app de uso diário, mas não é bug.

**Dois dispositivos discordam.** O celular carregou a lista, algo foi marcado no
PC, o celular segue mostrando o estado velho. É esperado — só precisa de decisão
sobre quando recarregar.

**Cadastro aberto.** Depois de criar a própria conta, vale desligar o cadastro
público no painel do serviço, pra ninguém criar conta no projeto e gastar cota.
