import { redirect } from 'next/navigation';
import sql from '../../lib/db';
import { usuarioLogado } from '../../lib/sessao';
import { salvarFotoPerfil, aceitarPedido } from '../acoes';
import Avatar from '../avatar';
import CampoFoto from '../campo-foto';

function Status({ confirmada }) {
  return confirmada ? (
    <span className="status confirmada">✅ Pedido aceito</span>
  ) : (
    <span className="status">⏳ Aguardando resposta</span>
  );
}

export default async function PerfilPage() {
  const usuario = await usuarioLogado();
  if (!usuario) redirect('/login');

  // Mensagens que outras pessoas mandaram para as minhas hortas
  const recebidas = await sql`
    select mensagens.id, mensagens.texto, mensagens.confirmada,
      to_char(mensagens.data_retirada, 'DD/MM/YYYY') as data,
      hortas.nome as horta_nome, usuarios.nome, usuarios.foto_url
    from mensagens
    join hortas on hortas.id = mensagens.horta_id
    join usuarios on usuarios.id = mensagens.remetente_id
    where hortas.usuario_id = ${usuario.id}
    order by mensagens.criado_em desc
  `;

  // Mensagens que eu mandei para hortas de outras pessoas
  const enviadas = await sql`
    select mensagens.id, mensagens.texto, mensagens.confirmada,
      to_char(mensagens.data_retirada, 'DD/MM/YYYY') as data,
      hortas.nome as horta_nome, usuarios.nome, usuarios.foto_url
    from mensagens
    join hortas on hortas.id = mensagens.horta_id
    join usuarios on usuarios.id = hortas.usuario_id
    where mensagens.remetente_id = ${usuario.id}
    order by mensagens.criado_em desc
  `;

  return (
    <>
      <section className="caixa">
        <h2>Meu perfil</h2>
        <p>
          <strong>{usuario.nome}</strong> · {usuario.email}
        </p>
        {!usuario.foto_url && <p>Adicione uma foto para as pessoas te reconhecerem 🙂</p>}
        <form className="formulario" action={salvarFotoPerfil}>
          <CampoFoto nome="foto_url" fotoAtual={usuario.foto_url} redonda />
          <button className="botao botao-msg" type="submit">
            Salvar foto
          </button>
        </form>
      </section>

      <section className="caixa">
        <h2>Mensagens recebidas</h2>
        {recebidas.length === 0 && <p>Ninguém mandou mensagem para as suas hortas ainda.</p>}
        {recebidas.map((msg) => (
          <div key={msg.id} className="conversa">
            <p className="dono">
              <Avatar usuario={msg} />
              <strong>{msg.nome}</strong> · {msg.horta_nome}
            </p>
            <p>“{msg.texto}”</p>
            <p>📅 Retirada em {msg.data}</p>
            {msg.confirmada ? (
              <Status confirmada />
            ) : (
              <form action={aceitarPedido.bind(null, msg.id)}>
                <button className="botao botao-msg" type="submit">
                  Aceitar pedido
                </button>
              </form>
            )}
          </div>
        ))}
      </section>

      <section className="caixa">
        <h2>Mensagens enviadas</h2>
        {enviadas.length === 0 && <p>Você ainda não mandou mensagens.</p>}
        {enviadas.map((msg) => (
          <div key={msg.id} className="conversa">
            <p className="dono">
              <Avatar usuario={msg} />
              Para <strong>{msg.nome}</strong> · {msg.horta_nome}
            </p>
            <p>“{msg.texto}”</p>
            <p>📅 Retirada em {msg.data}</p>
            <Status confirmada={msg.confirmada} />
          </div>
        ))}
      </section>
    </>
  );
}
