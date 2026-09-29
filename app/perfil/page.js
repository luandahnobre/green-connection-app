import { redirect } from 'next/navigation';
import { usuarioLogado } from '../../lib/sessao';
import { salvarFotoPerfil } from '../acoes';
import CampoFoto from '../campo-foto';

export default async function PerfilPage() {
  const usuario = await usuarioLogado();
  if (!usuario) redirect('/login');

  return (
    <section className="caixa">
      <h2>Meu perfil</h2>
      <p>
        <strong>{usuario.nome}</strong> · {usuario.email}
      </p>
      {!usuario.foto_url && <p>Adicione uma foto para as pessoas te reconhecerem 🙂</p>}
      <form className="formulario" action={salvarFotoPerfil}>
        <CampoFoto nome="foto_url" fotoAtual={usuario.foto_url} redonda />
        <button className="botao botao-msg" type="submit">
          Salvar foto
        </button>
      </form>
    </section>
  );
}
