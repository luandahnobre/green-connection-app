import Link from 'next/link';
import './globals.css';
import RegistrarSW from './registrar-sw';

export const metadata = {
  title: 'Conexão Verde',
  description: 'Troca e doação de alimentos de hortas comunitárias',
  icons: { apple: '/icone-192.png' },
};

export const viewport = {
  themeColor: '#2e7d32',
};

export default function RootLayout({ children }) {
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
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
