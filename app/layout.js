import Link from 'next/link';
import './globals.css';
import RegistrarSW from './registrar-sw';
import { usuarioLogado } from '../lib/sessao';
import { sair } from './acoes';
import Avatar from './avatar';

export const metadata = {
  title: 'Conexão Verde',
  description: 'Troca e doação de alimentos de hortas comunitárias',
  icons: { apple: '/icone-192.png' },
};

export const viewport = {
  themeColor: '#2e7d32',
};

export default async function RootLayout({ children }) {
  const usuario = await usuarioLogado();

  return (
    <html lang="pt-BR">
      <body>
        <RegistrarSW />
        <header className="topo">
          <Link href="/">
            <h1>
              <img src="/logo.png" alt="Conexão Verde" className="logo" />
            </h1>
          </Link>
          <p>Troque e doe alimentos das hortas do seu bairro</p>
          <nav className="menu">
            {usuario ? (
              <>
                <Link href="/perfil" className="perfil-link">
                  <Avatar usuario={usuario} />
                  {usuario.nome}
                </Link>
                <form action={sair}>
                  <button className="link-botao" type="submit">
                    Sair
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login">Entrar</Link>
                <Link href="/cadastro">Cadastrar</Link>
              </>
            )}
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
