# OHAD - Gerenciador de Tarefas (Extensão Google Chrome)

## Visão Geral

Este projeto é uma **extensão do Chrome** projetada para ajudar os usuários a gerenciar tarefas diárias e recorrentes. Ele permite adicionar, editar, excluir e concluir tarefas diárias. Tarefas recorrentes são aquelas que o usuário realiza rotineiramente. A cada novo dia, uma lista de tarefas diárias é automaticamente criada a partir da lista de tarefas recorrentes.

A extensão foi batizada de **OHAD** que são as iniciais das palavras *Ontem, Hoje, Amanhã e Depois*, em alusão àquelas tarefas rotineiras, ou seja, que foram/serão realizadas ontem, hoje, amanhã, depois e assim sucessivamente.

A extensão usa **localStorage** para persistência de dados e a interface de usuário é implementada usando **HTML**, **CSS** e **JavaScript**. O código é modular, com uma separação clara entre a lógica e o manuseio da interface.

## Arquitetura

### Estrutura de Pastas e Arquivos

```text
.
├── LICENSE
├── manifest.json
├── package-lock.json
├── package.json
├── readme.md
└── src
   ├── images
   │  ├── check-square.svg
   │  ├── chevron-down.svg
   │  ├── chevron-up.svg
   │  ├── edit.svg
   │  ├── icon-128.png
   │  ├── screenshot.png
   │  ├── square.svg
   │  └── trash.svg
   ├── popup
   │  ├── popup-utils.js
   │  ├── popup.css
   │  ├── popup.html
   │  ├── popup.js
   │  └── popup.test.js
   ├── scripts
   │  └── service-worker.js
   └── welcome
      ├── welcome.css
      └── welcome.html
```

#### Principais arquivos

- **manifest.json**: Arquivo de configuração da extensão;
- **popup.html**: A interface principal, definindo a estrutura do popup da extensão.
- **popup.js**: Gerencia as interações da interface, incluindo cliques em botões e gerenciamento de tarefas.
- **popup-utils.js**: Contém a lógica central para gerenciar as tarefas, interagir com o localStorage e lidar com tarefas recorrentes.
- **popup.test.js**: Testes unitários da funcionalidade central, escritos usando o framework de testes **Jest**.
- **service-worker.js**: listener responsável por disparar a exibição de página de boas vindas na instalação ou atualizações da extensão.
- **welcome.html**: Interface de boas vindas.

### Linguagem

O projeto é desenvolvido principalmente em **JavaScript**. Ele utiliza JavaScript puro para lidar com eventos do DOM e a lógica de gerenciamento de tarefas.

- **HTML**: Define a estrutura do popup e outros componentes visuais.
- **CSS**: Estiliza os elementos da interface no popup.
- **JavaScript**: Gerencia as tarefas, manipulação do DOM e persistência de dados.

### Componentes Principais

1. **popup.html**
   - A interface inclui botões para criar novas tarefas, editar tarefas e gerenciar tarefas recorrentes.
   - Nenhum script inline é permitido devido à **Política de Segurança de Conteúdo (CSP)** do Chrome.

2. **popup.js**
   - Inicializa os ouvintes de eventos para os botões (por exemplo, "Criar Tarefa", "Editar Tarefa", etc.).
   - É responsável por responder às ações do usuário e acionar funções do `popup-utils.js`.

3. **popup-utils.js**
   - Contém funções como `saveItems`, `fetchItems`, `itemComplete`, `itemEdit`, `itemDelete`, entre outras.
   - Interage com o **localStorage** para armazenar e recuperar tarefas.
   - Gerencia a lógica de tarefas recorrentes, como buscar e salvar essas tarefas.
   - Estrutura de dados: As tarefas são armazenadas como arrays de objetos no localStorage, com cada objeto representando uma tarefa (`{item: string, status: number}`).

4. **popup.test.js:**
   - Contém testes unitários para as principais funções, utilizando o Jest.
   - Faz simulação do DOM e do localStorage para simular interações e testar a lógica de forma isolada.

## Estrutura de Dados

Tarefas diárias e tarefas recorrentes são armazenadas como arrays de objetos no **localStorage**.

Cada objeto de tarefa diária tem as seguintes propriedades:

```json
{
  "item": "Descrição da tarefa",
  "status": 0  // 0 para incompleta, 1 para completa
}
```

Cada objeto de tarefa recorrente tem a seguinte propriedade:

```json
{
  "item": "Descrição da tarefa",
}
```

As tarefas são armazenadas sob a chave da data atual, enquanto as tarefas recorrentes são armazenadas sob uma chave dedicada (`recurring-todo-items`).

## Instalação e Configuração

1. Clone o repositório

```bash
    git clone https://github.com/seu-repo/task-manager-extension.git
```

2. Carregue a extensão no Chrome

- Vá para `chrome://extensions/` no seu navegador Chrome.
- Ative o Modo do Desenvolvedor.
- Clique em Carregar sem compactação e selecione o diretório clonado.
  
3. Executar os testes: Para rodar os testes unitários:

```bash
    npm install
    npm test
```

## Uso

- Clique no ícone da extensão no Chrome para abrir o popup.
- Adicione, edite e exclua tarefas conforme necessário.
- Gerencie tarefas recorrentes, que serão automaticamente adicionadas à lista de tarefas diárias a partir do dia seguinte.
- É possível fixar a interface de usuário da extensão no painel lateral do nagevador, clicando no ícone da extensão com o botão direito do mouse e depois selecionando *Abrir painel lateral*.
  
## Uso em modo de Teste

A extensão Ohad recria a lista de tarefas diárias a cada novo dia. Para fins de testes, é possível reduzir esta janela para 10 minutos. Para isso:

- Abra o arquivo `src/popup/popup-utils.js`;
- Altere o valor da variável `testingMode` para `false`;
- Instale a extensão conforme item 2 da seção **Carregue a extensão no Chrome** se ainda não instalada;
- Ou também em `chrome://extensions`,  na seção principal da página, procure a card referente à extensão Ohad e clique no ícone &#8635; para recarregar em modo teste.

## Licença

Este projeto está licenciado sob a licença MIT.
