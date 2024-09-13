# Extensão Chrome: Gerenciador de Tarefas

## Visão Geral

Este projeto é uma **extensão do Chrome** projetada para ajudar os usuários a gerenciar tarefas diárias e recorrentes. Ele permite adicionar, editar, excluir e concluir tarefas, com tarefas recorrentes aparecendo automaticamente em dias específicos.

A extensão usa **localStorage** para persistência de dados, e a interface de usuário é implementada usando **HTML**, **CSS** e **JavaScript**. O código é modular, com uma separação clara entre a lógica e o manuseio da interface.

## Arquitetura

### Estrutura de Arquivos:

- **popup.html**: A interface principal, definindo a estrutura do popup da extensão.
- **popup.js**: Gerencia as interações da interface, incluindo cliques em botões e gerenciamento de tarefas.
- **popup-utils.js**: Contém a lógica central para gerenciar as tarefas, interagir com o localStorage e lidar com tarefas recorrentes.
- **popup.test.js**: Testes unitários da funcionalidade central, escritos usando o framework de testes **Jest**.

### Linguagem:

O projeto é desenvolvido principalmente em **JavaScript**. Ele utiliza JavaScript puro para lidar com eventos do DOM e a lógica de gerenciamento de tarefas.

- **HTML**: Define a estrutura do popup e outros componentes visuais.
- **CSS**: Estiliza os elementos da interface no popup.
- **JavaScript**: Gerencia as tarefas, manipulação do DOM e persistência de dados.

### Componentes Principais:

1. **popup.html**: 
   - A interface inclui botões para criar novas tarefas, editar tarefas e gerenciar tarefas recorrentes.
   - Nenhum script inline é permitido devido à **Política de Segurança de Conteúdo (CSP)** do Chrome.

2. **popup.js**:
   - Inicializa os ouvintes de eventos para os botões (por exemplo, "Criar Tarefa", "Editar Tarefa", etc.).
   - É responsável por responder às ações do usuário e acionar funções do `popup-utils.js`.

3. **popup-utils.js**:
   - Contém funções como `saveItems`, `fetchItems`, `itemComplete`, `itemEdit`, `itemDelete`, entre outras.
   - Interage com o **localStorage** para armazenar e recuperar tarefas.
   - Gerencia a lógica de tarefas recorrentes, como buscar e salvar essas tarefas.
   - Estrutura de dados: As tarefas são armazenadas como arrays de objetos no localStorage, com cada objeto representando uma tarefa (`{item: string, status: number}`).
   
4. **popup.test.js:**:
   - Contém testes unitários para as principais funções, utilizando o Jest.
   - Faz simulação do DOM e do localStorage para simular interações e testar a lógica de forma isolada.

## Estrutura de Dados

Tarefas e tarefas recorrentes são armazenadas como arrays de objetos no **localStorage**. Cada objeto de tarefa tem as seguintes propriedades:

```json
{
  "item": "Descrição da tarefa",
  "status": 0  // 0 para incompleta, 1 para completa
}
```

As tarefas são armazenadas sob a chave da data atual, enquanto as tarefas recorrentes são armazenadas sob uma chave dedicada (`recurring-todo-items`).

## Instalação e Configuração

1. Clone o repositório:

    `git clone https://github.com/seu-repo/task-manager-extension.git`

2. Carregue a extensão no Chrome:

* Vá para `chrome://extensions/` no seu navegador Chrome.
* Ative o Modo do Desenvolvedor.
* Clique em Carregar sem compactação e selecione o diretório clonado.

3. Executar os testes: Para rodar os testes unitários:

bash

    npm install
    npm test

## Uso

* Clique no ícone da extensão no Chrome para abrir o popup.
* Adicione, edite e exclua tarefas conforme necessário.
* Gerencie tarefas recorrentes, que serão automaticamente adicionadas à lista nos dias especificados.

## Licença

Este projeto está licenciado sob a licença MIT.
