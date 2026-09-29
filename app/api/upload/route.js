import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { usuarioLogado } from '../../../lib/sessao';

// Autoriza o navegador a enviar uma foto direto para o Vercel Blob
export async function POST(request) {
  const body = await request.json();

  try {
    const resposta = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const usuario = await usuarioLogado();
        if (!usuario) {
          throw new Error('Faça login para enviar fotos');
        }
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic'],
          maximumSizeInBytes: 10 * 1024 * 1024, // 10 MB
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(resposta);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
