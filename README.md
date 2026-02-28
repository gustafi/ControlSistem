# Sistema de Controle de Gastos Residenciais

Sistema para gerenciamento de gastos residenciais com cadastro de pessoas, categorias e transações.

## Tecnologias

- **Back-end:** C# e .NET 10
- **Front-end:** React com TypeScript (Vite)
- **Persistência:** SQLite

## Estrutura do Projeto

```
WebApplication1/
├── WebApplication1/          # Backend .NET
│   ├── Controllers/           # API REST
│   ├── Data/                  # DbContext e configuração EF
│   ├── Models/                # Entidades
│   └── Program.cs
├── client/                    # Frontend React
│   ├── src/
│   │   ├── api.ts            # Cliente da API
│   │   ├── pages/            # Páginas da aplicação
│   │   └── types.ts          # Tipos TypeScript
│   └── package.json
└── README.md
```

## Funcionalidades

### Cadastro de Pessoas (CRUD)
- Criar, editar, excluir e listar pessoas
- Campos: Id (auto), Nome (máx 200), Idade
- Ao excluir uma pessoa, todas as transações dela são removidas

### Cadastro de Categorias
- Criar e listar categorias
- Campos: Id (auto), Descrição (máx 400), Finalidade (despesa/receita/ambas)

### Cadastro de Transações
- Criar e listar transações
- Campos: Id (auto), Descrição (máx 400), Valor (positivo), Tipo (despesa/receita), Categoria, Pessoa
- Menores de 18 anos só podem registrar despesas
- Categoria deve ter finalidade compatível com o tipo

### Consultas
- **Totais por Pessoa:** receitas, despesas e saldo de cada pessoa + total geral
- **Totais por Categoria:** receitas, despesas e saldo por categoria + total geral

## Solução de Problemas

**Erro ao compilar: "O arquivo é bloqueado por outro processo"**
- O backend está em execução. Feche o processo (Ctrl+C no terminal ou encerre via Gerenciador de Tarefas) antes de compilar novamente.

## Como Executar

### 1. Backend (.NET)

```bash
cd WebApplication1
dotnet run --launch-profile https-44303
```

Ou no Visual Studio/VS Code: selecione o perfil **https-44303** e execute.

O backend estará em `https://localhost:44303` com **Swagger UI** em `https://localhost:44303/swagger`. O arquivo `expense_control.db` será criado na pasta do projeto para persistir os dados.

Se o navegador não abrir automaticamente, acesse: **https://localhost:44303/swagger**

Para confiar no certificado HTTPS de desenvolvimento (se necessário): `dotnet dev-certs https --trust`

### 2. Frontend (React)

```bash
cd client
npm install
npm run dev
```

O frontend estará em `http://localhost:5173`. O Vite faz proxy das requisições `/api` para o backend.

### 3. Acessar

Abra `http://localhost:5173` no navegador.

## API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/people | Lista pessoas |
| GET | /api/people/{id} | Obtém pessoa |
| POST | /api/people | Cria pessoa |
| PUT | /api/people/{id} | Atualiza pessoa |
| DELETE | /api/people/{id} | Exclui pessoa (e transações) |
| GET | /api/categories | Lista categorias |
| POST | /api/categories | Cria categoria |
| GET | /api/transactions | Lista transações |
| POST | /api/transactions | Cria transação |
| GET | /api/reports/totals-by-person | Totais por pessoa |
| GET | /api/reports/totals-by-category | Totais por categoria |
