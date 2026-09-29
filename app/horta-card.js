import Avatar from './avatar';
import LikeButton from './like-button';
import Mensagem from './mensagem';

export default function HortaCard({ horta, usuario }) {
  const alimentos = horta.alimentos.split(',').map((alimento) => alimento.trim());
  const minhaHorta = usuario?.id === horta.usuario_id;

  return (
    <article className="card">
      {horta.foto_url ? (
        <img src={horta.foto_url} alt={horta.nome} className="card-foto" />
      ) : (
        <div className="card-foto card-sem-foto">🌱</div>
      )}
      <div className="card-corpo">
        <h3>{horta.nome}</h3>
        <p className="card-info dono">
          <Avatar usuario={{ nome: horta.dono_nome, foto_url: horta.dono_foto }} />
          {horta.dono_nome} · {horta.bairro}
        </p>
        <ul className="tags">
          {alimentos.map((alimento) => (
            <li key={alimento}>{alimento}</li>
          ))}
        </ul>
        {horta.epoca && <p className="epoca">🗓️ {horta.epoca}</p>}
        <div className="acoes">
          <LikeButton horta={horta} logado={Boolean(usuario)} />
        </div>
        {usuario && !minhaHorta && <Mensagem horta={horta} />}
        {minhaHorta && <p className="epoca">⭐ Esta é a sua horta</p>}
      </div>
    </article>
  );
}
