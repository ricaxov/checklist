# checklist-app

Front-end da todo list. A ideia do projeto esta no
[README da raiz](../README.md).

## Stack

- **React 19** com o **React Compiler** ligado (via
  `babel-plugin-react-compiler` no `vite.config.ts`)
- **TypeScript**
- **Vite 8** com o `@vitejs/plugin-react`
- **Prettier** pra formatacao

O React Compiler otimiza os componentes sozinho, desde que as convencoes do
React sejam respeitadas (nome de hook comecando com `use`, hook so no topo do
componente). Detalhes na [documentacao](https://react.dev/learn/react-compiler).
Ele deixa o dev e o build um pouco mais lentos em troca disso.

## Comandos npm

Os scripts ficam no `package.json` desta pasta, entao rode a partir daqui:

```bash
npm install       # instala as dependencias
npm run dev       # sobe o servidor de desenvolvimento do Vite
npm run build     # roda o tsc -b e gera o build de producao em dist/
npm run format    # formata os arquivos com o Prettier
```

A config do Prettier esta no `.prettierrc` (sem ponto e virgula, aspas
simples, virgula no final, 80 colunas).
