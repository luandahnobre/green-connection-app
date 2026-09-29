'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Busca mensagens novas a cada 2 segundos, sem recarregar a página inteira
export default function AtualizarSozinho() {
  const router = useRouter();

  useEffect(() => {
    const intervalo = setInterval(() => router.refresh(), 2000);
    return () => clearInterval(intervalo);
  }, [router]);

  return null;
}
