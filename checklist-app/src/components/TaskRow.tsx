import { mockTasks } from '../data/mock'
import { formatDate } from '../utils/formatDate'
import { useState } from 'react'


// continuar com isso

// O TaskRow recebe props e dispara o clique, mas ele não deve alterar a tarefa. Quem é dono da lista é o componente da tabela — e por um motivo prático: existem 6 linhas e uma lista só. Se cada linha pudesse mudar os próprios dados, ninguém saberia qual é o estado verdadeiro. O padrão do React é o contrário: os dados descem por props, e os eventos sobem por callbacks. A linha avisa "clicaram em mim"; o pai decide o que isso significa.

// A ordem dos passos:

// 1. Faça a separação que ainda está pendente. Hoje o TaskRow é a tabela inteira. Extraia o <tr> para o TaskRow de verdade e deixe a <table> num componente próprio (TaskTable, ou o que preferir). Sem isso o resto não tem onde encaixar.
// 2. A lista vira estado no pai. Enquanto mockTasks for um const importado do módulo, clicar não muda naenha quando o estado muda. Então o TaskTable precisa de um useState inicializado com mockTasks. O mock
//    deixa dssa a sersó o valor inicial.
// 3. As props do TaskRow ficam em três: a task, e duas funções — algo como onToggleDone e onEdit. Convenção da comunidade: a prop se chama
//    onAlgummenta, láno pai, se chama handleAlgumaCoisa.
// 4. O que a Ela já tem a task, então chama onToggleDone(task.id).
//    Assim onçãodiferente para cada linha.

// Duas armadilhas que pegam todo mundo:

// - No JSX, )} executaa função na hora da renderização, não no clique — e o que vai para o onClick é o retorno dela.
//   PrecisaonToggleDone(task.id)}, que só chama quando clicam.
// - Ao marcar como feito, não altere o objeto da tarefa no lugar. O React compara referências
//   para decampo de umobjeto existente não troca a referência do array
//   e a telarar umalista nova com map, devolvendo um objeto novo só
//   para a toriginaispara o resto.

// Sobre o edit: ele é bem maior que o "marcar feito" (envolve formulário, ou edição no lugar, e decidir seropdeclarada e faria ele só depois que o toggle estiver funcionando de ponta a ponta.

// continuar a partir daqui
interface TaskRowsProps {
  onEdit: (index: number) => void
  onDone: (index: number) => void
}
export function TaskRow({ onEdit, onDone }: TaskRowsProps) {
  const [markDone, setMarkDone] = useState(-1)
  // const [selectedIndex, setSelectedIndex] = useState(-1);
  return (
    <>
      <table className="table table-striped">
        <thead>
          <tr>
            <th> Description </th>
            <th> Date </th>
            <th> Importance </th>
          </tr>
        </thead>
        <tbody>
          {mockTasks.map((task) => (
            <tr>
              <td>{task.description}</td>
              <td>{formatDate(task.dueAt)}</td>
              <td>{task.importance}</td>
              <button type="button">Edit</button>
              <button type="button">Mark as done</button>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

// Done:
// TaskRow: uma linha. Recebe uma task, formata a data em DIA/MES/ANO HORA:MINUTO,

// In progress:
// mostra os dois ícones, e risca +

// Backlog
// reduz opacidade quando completedAt não é nulo. Sem coluna de importância.
