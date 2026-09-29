// Foto de perfil redonda; sem foto, mostra a primeira letra do nome
export default function Avatar({ usuario }) {
  if (usuario.foto_url) {
    return <img src={usuario.foto_url} alt={usuario.nome} className="avatar" />;
  }
  return <span className="avatar avatar-letra">{usuario.nome[0].toUpperCase()}</span>;
}
