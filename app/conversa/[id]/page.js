import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import sql from '../../../lib/db';
import { usuarioLogado } from '../../../lib/sessao';
import { aceitarPedido, responder } from '../../acoes';
import AtualizarSozinho from '../../atualizar-sozinho';
import Avatar from '../../avatar';

export default async function ConversaPage({ params }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  const usuario = await usuarioLogado();
  if (!usuario) redirect('/login');

  // Só quem mandou o pedido e o dono da horta podem ver a conversa
  const [pedido] = await sql`
    select mensagens.id, mensagens.texto, mensagens.confirmada, mensagens.remetente_id,
      to_char(mensagens.data_retirada, 'DD/MM/YYYY') as data,
      hortas.nome as horta_nome, hortas.usuario_id as dono_id,
      remetente.nome as remetente_nome, remetente.foto_url as remetente_foto,
      dono.nome as dono_nome, dono.foto_url as dono_foto
    from mensagens
    join hortas on hortas.id = mensagens.horta_id
    join usuarios remetente on remetente.id = mensagens.remetente_id
    join usuarios dono on dono.id = hortas.usuario_id
    where mensagens.id = ${id}
      and (mensagens.remetente_id = ${usuario.id} or hortas.usuario_id = ${usuario.id})
  `;
  if (!pedido) notFound();

  const respostas = await sql`
    select respostas.id, respostas.texto, respostas.autor_id,
      to_char(respostas.criado_em at time zone 'America/Sao_Paulo', 'DD/MM HH24:MI') as hora,
      usuarios.nome, usuarios.foto_url
    from respostas
    join usuarios on usuarios.id = respostas.autor_id
    where respostas.mensagem_id = ${id}
    order by respostas.criado_em
  `;

  const souDono = usuario.id === pedido.dono_id;
  const outraPessoa = souDono
    ? { nome: pedido.remetente_nome, foto_url: pedido.remetente_foto }
    : { nome: pedido.dono_nome, foto_url: pedido.dono_foto };

  return (
    <section className="caixa">
      <Link href="/perfil">← Voltar</Link>
      <h2 className="dono">
        <Avatar usuario={outraPessoa} />
        {outraPessoa.nome}
      </h2>
      <p className="epoca">
        {pedido.horta_nome} · 📅 Retirada em {pedido.data}
      </p>

      <div className="chat">
        <Balao minha={pedido.remetente_id === usuario.id} nome={pedido.remetente_nome}>
          {pedido.texto}
        </Balao>
        {respostas.map((resposta) => (
          <Balao
            key={resposta.id}
            minha={resposta.autor_id === usuario.id}
            nome={resposta.nome}
            hora={resposta.hora}
          >
            {resposta.texto}
          </Balao>
        ))}
      </div>

      {pedido.confirmada ? (
        <>
          <AtualizarSozinho />
          <form className="form-msg" action={responder.bind(null, pedido.id)}>
            <textarea name="texto" placeholder="Escreva uma mensagem..." required />
            <button className="botao botao-msg" type="submit">
              Enviar
            </button>
          </form>
        </>
      ) : souDono ? (
        <form action={aceitarPedido.bind(null, pedido.id)}>
          <button className="botao botao-msg" type="submit">
            Aceitar pedido e conversar
          </button>
        </form>
      ) : (
        <p className="status">⏳ O chat abre quando {pedido.dono_nome} aceitar o pedido</p>
      )}
    </section>
  );
}

function Balao({ minha, nome, hora, children }) {
  return (
    <div className={minha ? 'balao minha' : 'balao'}>
      <span className="balao-nome">
        {minha ? 'Você' : nome}
        {hora && ` · ${hora}`}
      </span>
      {children}
    </div>
  );
}
