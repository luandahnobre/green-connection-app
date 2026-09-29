import { enviarMensagem } from './acoes';

// O <details> abre e fecha o formulário sem precisar de JavaScript
export default function Mensagem({ horta }) {
  return (
    <details className="mensagem">
      <summary className="botao botao-msg">💬 Enviar mensagem</summary>
      <form className="form-msg" action={enviarMensagem}>
        <input type="hidden" name="horta_id" value={horta.id} />
        <label>
          Mensagem para {horta.dono_nome}
          <textarea
            name="texto"
            placeholder="Olá! Tenho interesse nos seus alimentos..."
            required
          />
        </label>
        <label>
          Dia para retirar
          <input name="data_retirada" type="date" required />
        </label>
        <button className="botao botao-msg" type="submit">
          Enviar
        </button>
      </form>
    </details>
  );
}
