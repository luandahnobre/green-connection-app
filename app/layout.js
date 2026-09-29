import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Conexão Verde',
  description: 'Troca e doação de alimentos de hortas comunitárias',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="topo">
          <Link href="/">
            <h1>
              <img src="/logo.png" alt="Conexão Verde" className="logo" />
            </h1>
          </Link>
          <p>Troque e doe alimentos das hortas do seu bairro</p>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
