import Link from 'next/link';
import sql from '../lib/db';
import { usuarioLogado } from '../lib/sessao';
import HortaCard from './horta-card';

export default async function HomePage() {
  const usuario = await usuarioLogado();
  const hortas = await sql`
    select
      hortas.*,
      usuarios.nome as dono_nome,
      usuarios.foto_url as dono_foto,
      (select count(*)::int from curtidas where curtidas.horta_id = hortas.id) as curtidas,
      exists (
        select 1 from curtidas
        where curtidas.horta_id = hortas.id and curtidas.usuario_id = ${usuario?.id ?? 0}
      ) as curtiu
    from hortas
    join usuarios on usuarios.id = hortas.usuario_id
    order by hortas.criado_em desc
  `;

  return (
    <section>
      <div className="titulo-lista">
        <h2>Hortas perto de você</h2>
        {usuario ? (
          <Link href="/hortas/nova" className="botao botao-msg">
            + Cadastrar horta
          </Link>
        ) : (
          <Link href="/login">Entre para cadastrar sua horta</Link>
        )}
      </div>

      {hortas.length === 0 && <p>Nenhuma horta cadastrada ainda. Que tal ser a primeira?</p>}

      {hortas.map((horta) => (
        <HortaCard key={horta.id} horta={horta} usuario={usuario} />
      ))}
    </section>
  );
}
