'use server';

import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import sql from '../lib/db';
import { usuarioLogado } from '../lib/sessao';

// Só aceita fotos que foram enviadas para o nosso Vercel Blob
function fotoValida(url) {
  try {
    return new URL(url).hostname.endsWith('.public.blob.vercel-storage.com');
  } catch {
    return false;
  }
}

async function iniciarSessao(usuarioId) {
  const sessaoId = crypto.randomUUID();
  await sql`insert into sessoes (id, usuario_id) values (${sessaoId}, ${usuarioId})`;

  const cookieStore = await cookies();
  cookieStore.set('sessao', sessaoId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 dias
  });
}

export async function cadastrar(formData) {
  const nome = formData.get('nome').trim();
  const email = formData.get('email').trim().toLowerCase();
  const senha = formData.get('senha');

  if (senha.length < 6) {
    redirect('/cadastro?erro=A senha precisa ter pelo menos 6 caracteres');
  }

  const [existente] = await sql`select id from usuarios where email = ${email}`;
  if (existente) {
    redirect('/cadastro?erro=Este e-mail já está cadastrado');
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const [usuario] = await sql`
    insert into usuarios (nome, email, senha_hash)
    values (${nome}, ${email}, ${senhaHash})
    returning id
  `;

  await iniciarSessao(usuario.id);
  redirect('/perfil');
}

export async function entrar(formData) {
  const email = formData.get('email').trim().toLowerCase();
  const senha = formData.get('senha');

  const [usuario] = await sql`select id, senha_hash from usuarios where email = ${email}`;
  const senhaCerta = usuario && (await bcrypt.compare(senha, usuario.senha_hash));

  if (!senhaCerta) {
    redirect('/login?erro=E-mail ou senha incorretos');
  }

  await iniciarSessao(usuario.id);
  redirect('/');
}

export async function sair() {
  const cookieStore = await cookies();
  const sessaoId = cookieStore.get('sessao')?.value;
  if (sessaoId) {
    await sql`delete from sessoes where id = ${sessaoId}`;
    cookieStore.delete('sessao');
  }
  redirect('/login');
}

export async function salvarFotoPerfil(formData) {
  const usuario = await usuarioLogado();
  if (!usuario) redirect('/login');

  const fotoUrl = formData.get('foto_url');
  if (fotoValida(fotoUrl)) {
    await sql`update usuarios set foto_url = ${fotoUrl} where id = ${usuario.id}`;
  }
  redirect('/');
}

export async function criarHorta(formData) {
  const usuario = await usuarioLogado();
  if (!usuario) redirect('/login');

  const fotoUrl = formData.get('foto_url');
  await sql`
    insert into hortas (usuario_id, nome, bairro, alimentos, epoca, foto_url)
    values (
      ${usuario.id},
      ${formData.get('nome').trim()},
      ${formData.get('bairro').trim()},
      ${formData.get('alimentos').trim()},
      ${formData.get('epoca').trim()},
      ${fotoValida(fotoUrl) ? fotoUrl : null}
    )
  `;
  redirect('/');
}
