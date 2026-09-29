# Conexão Verde

App para troca e doação de alimentos de hortas comunitárias.

## Como rodar

1. Crie um arquivo `.env.local` com as variáveis do projeto na Vercel:

   ```
   DATABASE_URL=...
   BLOB_READ_WRITE_TOKEN=...
   ```

2. Instale e rode:

   ```bash
   npm install
   npm run build   # cria as tabelas no banco
   npm run dev
   ```

3. Abra http://localhost:3000
