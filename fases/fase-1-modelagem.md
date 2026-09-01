# Fase 1 — Modelagem e serviço

Documento de trabalho. A saída desta fase é uma tabela criada no Supabase, com
regras de acesso testadas, e as decisões abaixo registradas por escrito.

---

## Passo 1 — O formato de um item

### Decisão original

O usuário digita três coisas: **descrição, data limite e importância**.

Primeira versão dos atributos: `description`, `date`, `importance`, `priority`,
`completed`.

### Três ajustes

**1. `priority` saiu da tabela.**
A prioridade depende do `date_delta`, que muda sozinho a cada segundo. Guardar o
valor significa que ele nasce desatualizado — e mantê-lo fresco é exatamente o
"≈300 upd/task/day" anotado no draft: 300 escritas por dia, por tarefa, pra
manter um número que dá pra recalcular de graça.

Prioridade é **função dos outros campos**, não um dado. Calcula na hora de
exibir. Nem daria pra usar coluna calculada do Postgres: elas exigem expressão
determinística, e `now()` não é.

**2. `date` virou `timestamptz`, não inteiro.**
Epoch em inteiro funciona, mas o `timestamptz` guarda o instante **com fuso** —
então celular e PC nunca discordam do prazo — e o Postgres faz a conta do
`date_delta` nativamente. Como inteiro, seria aritmética na mão em toda leitura.

O formato `DIA/MES/ANO HORA:MINUTO` continua igual: isso é formatação de tela,
não armazenamento.

**3. `completed` (bool) saiu; ficou só `completed_at`.**
Os dois campos eram duas fontes da mesma verdade, e duas fontes podem discordar.
A regra agora é uma só:

> `completed_at is null` → pendente · `completed_at` preenchido → feita

Ganha-se de brinde a data que ordena a seção Done, sem campo extra. Marcar como
feita é gravar o instante; desmarcar é apagar de volta pra `null`.

### Campos finais

| campo | tipo | nulo? | origem | observação |
|---|---|---|---|---|
| `id` | uuid | não | sistema | gerado pelo banco |
| `user_id` | uuid | não | sistema | quem está logado |
| `description` | text | não | usuário | não pode ser vazia |
| `due_at` | timestamptz | não | usuário | o prazo |
| `importance` | smallint | não | usuário | escala 1–10 |
| `completed_at` | timestamptz | **sim** | sistema | `null` = pendente |

Calculados na tela, nunca guardados: `priority`, `date_delta`, `is_done`.

### Escala da importância

**1 a 10**, garantido pelo banco (`check (importance between 1 and 10)`).

Fica anotado pra Fase 5: a fórmula `imp * 60% - date_delta * 40%` só funciona se
os dois lados forem comparáveis. `importance` vai de 1 a 10; o `date_delta` vem
em alguma unidade de tempo com escala completamente diferente. Os pesos 60/40 só
significam alguma coisa depois que os dois estiverem na mesma faixa.

### Ordenação e desempate

A lista ordena por **prioridade**, depois **importância**, depois **prazo**. Se
os três empatarem, a ordem que o Postgres devolver está de bom tamanho.

Por isso **não existe `created_at`**: ele entraria só como desempate final, e
esse caso já foi resolvido com "tanto faz".

---

## Passo 2 — Serviço escolhido

**Supabase.**

- [x] Conta criada
- [x] Projeto criado — região `sa-east-1` (São Paulo)
- [x] URL e publishable key anotadas

---

## Passo 3 — Regras de acesso

**A regra, na linguagem do dono:** cada pessoa só lê e escreve depois de estar
logada, e só lê e escreve o que é dela.

Isso vira duas coisas no SQL: `to authenticated` (a parte do "depois de estar
logada") e `auth.uid() = user_id` (a parte do "o que é dela").

**Padrão do Supabase:** tabela criada por SQL **nasce sem RLS, ou seja, aberta**.
A linha `enable row level security` é obrigatória — sem ela, as políticas não
são aplicadas.

---

# Passo a passo

## 1. Criar conta e projeto (nada pra baixar)

Tudo pelo navegador, em [supabase.com](https://supabase.com).

1. Entrar com a conta do GitHub.
2. **New project**. Nome: `checklist`.
3. Região: a mais perto (South America / São Paulo, se aparecer).
4. Ele gera uma **senha do banco** — guardar num lugar seguro. Não é a senha de
   login do app, é a do Postgres; só faz falta em acesso direto ao banco.
5. Esperar o provisionamento (~2 min).

## 2. Rodar o SQL

No painel do projeto: **SQL Editor → New query**, colar tudo abaixo, **Run**.

```sql
-- ========================================================================
-- 1. A TABELA
-- ========================================================================
create table public.tasks (

  -- a identidade da própria linha. "primary key" = único e não nulo.
  -- gen_random_uuid() é nativo do Postgres: o banco sorteia o id sozinho,
  -- o front não precisa inventar nenhum
  id           uuid        primary key default gen_random_uuid(),

  -- de quem é a tarefa. aponta pra tabela de usuários que o Supabase gerencia
  --   not null           -> tarefa sem dono não pode existir
  --   references         -> só aceita id de usuário que existe de verdade
  --   on delete cascade  -> apagou a conta, as tarefas vão junto
  --   default auth.uid() -> o front NUNCA envia o dono;
  --                         o banco preenche com quem está logado
  user_id      uuid        not null references auth.users(id) on delete cascade
                           default auth.uid(),

  -- o texto da tarefa.
  -- trim() tira os espaços das pontas antes de medir o tamanho, então o check
  -- barra tanto "" quanto "   " (string só de espaço)
  description  text        not null check (length(trim(description)) > 0),

  -- o prazo. timestamptz = instante COM fuso horário,
  -- é o que faz celular e PC nunca discordarem da hora
  due_at       timestamptz not null,

  -- a importância. o check faz o BANCO garantir a escala 1–10:
  -- nem um bug no front consegue gravar 0 ou 11.
  -- smallint porque o número é pequeno (o tipo vai até 32767)
  importance   smallint    not null check (importance between 1 and 10),

  -- quando foi concluída. é a ÚNICA coluna que aceita null, e é justamente
  -- isso que dá o significado:  null = pendente  |  preenchida = feita
  -- marcar = gravar o instante; desmarcar = voltar pra null
  completed_at timestamptz
);


-- ========================================================================
-- 2. ÍNDICE
-- ========================================================================
-- acelera a busca que o app faz o tempo todo: "as tarefas do usuário X,
-- ordenadas por prazo". sem ele, o banco varre a tabela inteira a cada
-- carregamento da tela
create index tasks_user_due_idx on public.tasks (user_id, due_at);


-- ========================================================================
-- 3. SEGURANÇA
-- ========================================================================
-- LIGA o Row Level Security nesta tabela.
-- sem esta linha, as políticas abaixo até existem, mas não são aplicadas
-- e a tabela fica aberta
alter table public.tasks enable row level security;

-- As quatro políticas dizem a MESMA coisa, uma pra cada operação:
--   "só quem está logado, e só nas linhas em que ele é o dono"
--
--   to authenticated   -> a parte do "só depois de estar logada".
--                         sem isso valeria pra visitante anônimo também
--   auth.uid()         -> o id de quem está logado agora
--   using (...)        -> filtra quais linhas você consegue ALCANÇAR
--   with check (...)   -> valida a linha ANTES de gravar

-- LER: a consulta pode pedir tudo, o banco devolve só o que é seu
create policy "select own" on public.tasks
  for select to authenticated using (auth.uid() = user_id);

-- CRIAR: rejeita se alguém tentar criar tarefa no nome de outra pessoa
-- (insert não tem "using" porque a linha ainda não existe pra ser filtrada)
create policy "insert own" on public.tasks
  for insert to authenticated with check (auth.uid() = user_id);

-- EDITAR: precisa dos dois.
--   using      -> você só alcança as suas tarefas
--   with check -> e não pode, na edição, passar a tarefa pra outro dono
create policy "update own" on public.tasks
  for update to authenticated using (auth.uid() = user_id)
                             with check (auth.uid() = user_id);

-- APAGAR: só apaga as suas
create policy "delete own" on public.tasks
  for delete to authenticated using (auth.uid() = user_id);
```

## 3. Verificar que as regras pegaram

⚠️ **O teste só vale com dado na tabela.** Numa tabela vazia, "zero linhas" tanto
pode ser o RLS bloqueando quanto não haver nada pra devolver — não distingue os
dois casos, e portanto não prova nada.

E não dá pra inserir uma tarefa antes de existir um usuário: `user_id` é
`not null` e tem FK pra `auth.users`. Pelo painel também não rola, porque ali o
`default auth.uid()` vira `null` (não existe login no dashboard).

Então a ordem é: **usuário → tarefa → teste**.

### 3.1 Criar um usuário de teste

**Authentication → Users → Add user.** E-mail e senha quaisquer. Copiar o
**UUID** que aparece na lista.

### 3.2 Inserir uma tarefa pra ele

```sql
insert into public.tasks (user_id, description, due_at, importance)
values ('COLE-O-UUID-AQUI', 'tarefa de teste', now() + interval '2 days', 7);

-- como postgres (dono da tabela, ignora RLS) tem que enxergar a linha
select count(*) from public.tasks;   -- 1
```

### 3.3 O teste que fecha a fase

Num Run separado. O `select` fica por **último** de propósito: o editor mostra o
resultado do último comando, e terminar com `reset role` esconderia justamente o
que você quer ver.

```sql
set role anon;   -- finge ser um visitante não logado
select count(*) as visiveis_pro_anon from public.tasks;   -- tem que dar 0
```

**Existe 1 linha na tabela e o `anon` enxerga 0.** É esse contraste que prova o
RLS — não o "Success" do comando anterior.

Também conta como aprovado o erro `permission denied for table tasks`: aí o
`anon` nem chega na tabela. Reprovado é voltar **1**.

Depois, num Run separado:

```sql
reset role;   -- volta a ser postgres
```

Se voltar 1, confere se a linha `enable row level security` rodou.

> Como `postgres` você é dono da tabela e **ignora RLS** — daqui pra frente
> `select * from tasks` sempre devolve tudo aqui no editor. Não é a política
> falhando; é o mesmo motivo pelo qual o Table Editor deixa você editar
> qualquer linha.

## 4. Anotar as credenciais

**Project Settings → API**. Anotar dois valores:

- **Project URL**
- **anon / public key**

Essa chave vai pro bundle e **é pública por desenho** — quem proteger os dados é
o RLS do passo 3, não o segredo da chave. A chave `service_role`, que aparece na
mesma tela, **nunca** entra no frontend.

## 5. O que baixar

### Agora: nada obrigatório

Os passos 1 a 4 são todos pelo navegador. Dá pra fechar a Fase 1 sem instalar
nada.

### Opcional: Supabase CLI (versionar o schema no git)

Vale se você quiser o SQL acima versionado, em vez de existir só na nuvem.

```bash
cd checklist-app
npm i -D supabase
npx supabase init
npx supabase login
npx supabase link --project-ref <ref-do-projeto>
```

O `<ref-do-projeto>` está na URL do painel e em Project Settings. Depois disso,
o SQL do passo 2 vira um arquivo em `supabase/migrations/`, e `npx supabase db
push` aplica no projeto remoto.

### Fase 4: o cliente JS

Ainda **não** instalar. Quando a lista for buscar dados de verdade:

```bash
npm i @supabase/supabase-js
```

---

## Saída desta fase

- [x] Escala da importância decidida — 1 a 10
- [x] Projeto criado no Supabase (`sa-east-1`)
- [x] Tabela `tasks` existindo
- [x] URL e publishable key anotadas
- [x] Nada disso encostou no código do `checklist-app` ainda
- [x] "Enable automatic RLS" ligado nas configurações de segurança
- [x] **Teste do RLS conclusivo** — 1 linha na tabela, `anon` enxergando 0 ✅
- [x] Senha do banco resetada ✅
