import Link from 'next/link';
import { cadastrar } from '../acoes';

export default async function CadastroPage({ searchParams }) {
  const { erro } = await searchParams;

  return (
    <section className="caixa">
      <h2>Criar conta</h2>
      {erro && <p className="erro">{erro}</p>}
      <form className="formulario" action={cadastrar}>
        <label>
          Nome
          <input name="nome" required />
        </label>
        <label>
          E-mail
          <input name="email" type="email" required />
        </label>
        <label>
          Senha
          <input name="senha" type="password" minLength={6} required />
        </label>
        <button className="botao botao-msg" type="submit">
          Cadastrar
        </button>
      </form>
      <p>
        Já tem conta? <Link href="/login">Entrar</Link>
      </p>
    </section>
  );
}
