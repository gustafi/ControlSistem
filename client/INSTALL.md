# Instalação do Frontend

Os erros de "Cannot find module" ocorrem porque as dependências não estão instaladas.

## Como corrigir

1. Abra um terminal (PowerShell, CMD ou Git Bash) **onde o Node.js está no PATH**
2. Navegue até a pasta client:
   ```
   cd client
   ```
3. Execute:
   ```
   npm install
   ```

Se o comando `npm` não for reconhecido, instale o Node.js em: https://nodejs.org

Após a instalação, os erros no IDE devem desaparecer.
