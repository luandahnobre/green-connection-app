export default function manifest() {
  return {
    name: 'Conexão Verde',
    short_name: 'ConexãoVerde',
    description: 'Troca e doação de alimentos de hortas comunitárias',
    start_url: '/',
    display: 'standalone',
    background_color: '#f3f8f1',
    theme_color: '#2e7d32',
    icons: [
      { src: '/icone-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icone-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
