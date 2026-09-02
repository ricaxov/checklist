import type { Task } from '../types/Task'

// apenas dados mockados

export const mockTasks: Task[] = [
  // vencido + importância máxima
  {
    id: 'c1a7e3f0-5d92-4b18-9a3c-7e2f8b4d6019',
    userId: '8f2a1c4e-3b7d-4e91-a0f5-6c8d9e2b1a34',
    description: 'Renovar o passaporte',
    dueAt: '2026-08-20T15:00:00+00:00',
    importance: 10,
    completedAt: null,
  },
  // descrição comprida: é ela que quebra a tabela no celular
  {
    id: '4b8d2e91-7a3f-4c05-b6e1-9d3a5f7c2481',
    userId: '8f2a1c4e-3b7d-4e91-a0f5-6c8d9e2b1a34',
    description:
      'Levar o carro na revisão dos 30 mil km e aproveitar pra trocar o filtro de ar, verificar o alinhamento e pedir orçamento das pastilhas de freio',
    dueAt: '2026-09-05T12:00:00+00:00',
    importance: 5,
    completedAt: null,
  },
  // vira o dia na conversão de fuso: tem que exibir 09/09 23:00
  {
    id: '9e5c1b73-2f48-4d6a-8017-3c9b5e1f7a26',
    userId: '8f2a1c4e-3b7d-4e91-a0f5-6c8d9e2b1a34',
    description: 'Pagar o IPVA',
    dueAt: '2026-09-10T02:00:00+00:00',
    importance: 7,
    completedAt: null,
  },
  // prazo longe + importância mínima: tem que ficar no fim da lista
  {
    id: '2d6f8a04-9c15-4e73-b28d-5a1e7f3c9b60',
    userId: '8f2a1c4e-3b7d-4e91-a0f5-6c8d9e2b1a34',
    description: 'Trocar a resistência do chuveiro',
    dueAt: '2027-03-15T13:00:00+00:00',
    importance: 1,
    completedAt: null,
  },
  // feitas: completedAt diferentes, pra dar pra ver a ordem da Done
  {
    id: '7a3e9d21-6b04-4f85-9c37-1e8d2b5a4c93',
    userId: '8f2a1c4e-3b7d-4e91-a0f5-6c8d9e2b1a34',
    description: 'Comprar presente de aniversário da Ana',
    dueAt: '2026-09-01T21:00:00+00:00',
    importance: 6,
    completedAt: '2026-09-01T23:15:00+00:00',
  },
  {
    id: '5c9b2f18-4d70-4a36-8e51-2f6a9c3d7b84',
    userId: '8f2a1c4e-3b7d-4e91-a0f5-6c8d9e2b1a34',
    description: 'Enviar o relatório mensal',
    dueAt: '2026-08-28T11:00:00+00:00',
    importance: 8,
    completedAt: '2026-08-28T12:05:00+00:00',
  },
]
