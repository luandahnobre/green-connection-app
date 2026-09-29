'use server';

import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import sql from '../lib/db';

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
  redirect('/');
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
