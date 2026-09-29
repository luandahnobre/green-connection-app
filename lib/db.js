import postgres from 'postgres';

// Conexão com o banco Postgres (Neon). O endereço vem da variável DATABASE_URL.
// As tabelas são criadas pelo scripts/criar-tabelas.mjs
const sql = postgres(process.env.DATABASE_URL);

export default sql;
