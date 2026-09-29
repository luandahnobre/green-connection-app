import Link from 'next/link';
import { curtir } from './acoes';

export default function LikeButton({ horta, logado }) {
  const texto = `${horta.curtiu ? '💚' : '🤍'} Curtir (${horta.curtidas})`;

  if (!logado) {
    return (
      <Link href="/login" className="botao botao-like">
        {texto}
      </Link>
    );
  }

  return (
    <form action={curtir.bind(null, horta.id)}>
      <button className="botao botao-like" type="submit">
        {texto}
      </button>
    </form>
  );
}
