'use client';

import { useState } from 'react';
import { upload } from '@vercel/blob/client';

// Campo de foto: envia a imagem para o Vercel Blob e guarda o endereço
// num campo escondido, que vai junto com o formulário
export default function CampoFoto({ nome, fotoAtual, redonda }) {
  const [url, setUrl] = useState(fotoAtual ?? '');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  async function handleChange(event) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    setEnviando(true);
    setErro('');
    try {
      const blob = await upload(`fotos/${arquivo.name}`, arquivo, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });
      setUrl(blob.url);
    } catch {
      setErro('Não foi possível enviar a foto. Tente outra imagem.');
    }
    setEnviando(false);
  }

  return (
    <div className="campo-foto">
      {url && (
        <img src={url} alt="Prévia da foto" className={redonda ? 'avatar avatar-grande' : 'previa'} />
      )}
      <input type="file" accept="image/*" onChange={handleChange} />
      {enviando && <p>Enviando foto...</p>}
      {erro && <p className="erro">{erro}</p>}
      <input type="hidden" name={nome} value={url} />
    </div>
  );
}
