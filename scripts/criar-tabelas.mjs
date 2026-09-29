// Cria as tabelas do banco. Roda automaticamente antes do "npm run build"
import postgres from 'postgres';

if (!process.env.DATABASE_URL) {
  console.log('DATABASE_URL não definida: pulando a criação das tabelas');
  process.exit(0);
}

const sql = postgres(process.env.DATABASE_URL);

await sql`
  create table if not exists usuarios (
    id serial primary key,
    nome text not null,
    email text not null unique,
    senha_hash text not null,
    foto_url text
  )
`;
await sql`
  create table if not exists sessoes (
    id text primary key,
    usuario_id integer not null references usuarios(id) on delete cascade
  )
`;
await sql`
  create table if not exists hortas (
    id serial primary key,
    usuario_id integer not null references usuarios(id) on delete cascade,
    nome text not null,
    bairro text not null,
    alimentos text not null,
    epoca text,
    foto_url text,
    criado_em timestamptz not null default now()
  )
`;

console.log('Tabelas prontas');
await sql.end();
