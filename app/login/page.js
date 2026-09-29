import Link from 'next/link';
import { entrar } from '../acoes';

export default async function LoginPage({ searchParams }) {
  const { erro } = await searchParams;

  return (
    <section className="caixa">
      <h2>Entrar</h2>
      {erro && <p className="erro">{erro}</p>}
      <form className="formulario" action={entrar}>
        <label>
          E-mail
          <input name="email" type="email" required />
        </label>
        <label>
          Senha
          <input name="senha" type="password" required />
        </label>
        <button className="botao botao-msg" type="submit">
          Entrar
        </button>
      </form>
      <p>
        Ainda não tem conta? <Link href="/cadastro">Cadastre-se</Link>
      </p>
    </section>
  );
}
