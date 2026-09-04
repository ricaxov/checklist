import type { Task } from '../types/Task'
import { TaskRow } from './TaskRow'

interface TaskTableProps {
  tasks: Task[]
  heading: string
  onToggleDone: (id: string) => void
}
export function TaskTable({ heading, tasks, onToggleDone }: TaskTableProps) {
  return (
    <>
      <h1>{heading}</h1>
  
  
    </>
  )
}

// 1. Cria src/components/TaskTable.tsx.
// 2. Imports: o tipo Task (pra tipar o array) e o TaskRow. Só isso — sem mockTasks, sem useState. Repara que Task entra como import type, igual você fez no TaskRow, porque é só tipo.
// 3. A interface de props, com três campos:
//    - o título do quadro (string) — é o que diferencia "Ativas" de "Done"
//    - o array de tasks a desenhar
//    - o onToggleDone, com o tipo idêntico ao que está no TaskRow. O TaskTable não usa essa função, só repassa.
// 4. A assinatura da função, desestruturando os três, igual você fez com task.
// 5. O return, de fora pra dentro:
//    - um elemento externo pra agrupar título + tabela (uma <section> ou <div>; fragmento também serve)
//    - o título dentro de um heading (<h2>), com {} porque vem de prop
//    - a <table> com as classes do Bootstrap que você já tinha (table table-striped)
//    - o <thead> com 4 <th>: Description, Date, e dois vazios pros botões
//    - o <tbody>
// 6. Dentro do <tbody>, o map sobre o array que veio por prop. Repara que a variável não se chama mais mockTasks — é o nome da prop.
// 7. O que o map devolve é um <TaskRow>, não um <tr> escrito à mão. Ele leva três coisas:
//    - key={task.id} — aqui, no elemento que o map retorna
//    - a task da volta atual
//    - o onToggleDone que chegou por prop, repassado sem mexer
// 8. Roda o tsc. Se o TaskRow reclamar de prop faltando, é porque alguma das três não desceu.