import { cookies } from 'next/headers';
import sql from './db';

// Descobre quem está logado a partir do cookie "sessao"
export async function usuarioLogado() {
  const cookieStore = await cookies();
  const sessaoId = cookieStore.get('sessao')?.value;
  if (!sessaoId) return null;

  const [usuario] = await sql`
    select usuarios.id, usuarios.nome, usuarios.email, usuarios.foto_url
    from sessoes
    join usuarios on usuarios.id = sessoes.usuario_id
    where sessoes.id = ${sessaoId}
  `;
  return usuario ?? null;
}
