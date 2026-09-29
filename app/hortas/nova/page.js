import { redirect } from 'next/navigation';
import { usuarioLogado } from '../../../lib/sessao';
import { criarHorta } from '../../acoes';
import CampoFoto from '../../campo-foto';

export default async function NovaHortaPage() {
  const usuario = await usuarioLogado();
  if (!usuario) redirect('/login');

  return (
    <section className="caixa">
      <h2>Cadastrar horta</h2>
      <form className="formulario" action={criarHorta}>
        <label>
          Nome da horta
          <input name="nome" placeholder="Ex.: Horta da Praça Central" required />
        </label>
        <label>
          Bairro
          <input name="bairro" required />
        </label>
        <label>
          Alimentos disponíveis (separe por vírgula)
          <input name="alimentos" placeholder="Alface, Couve, Tomate" required />
        </label>
        <label>
          Época de colheita
          <input name="epoca" placeholder="Ex.: Manga: de outubro a janeiro" />
        </label>
        <label>Foto da horta</label>
        <CampoFoto nome="foto_url" />
        <button className="botao botao-msg" type="submit">
          Cadastrar horta
        </button>
      </form>
    </section>
  );
}
