'use client';

// Pergunta antes de apagar, para ninguém apagar a horta sem querer
export default function BotaoApagar({ acao }) {
  function handleSubmit(event) {
    if (!confirm('Tem certeza que quer apagar esta horta?')) {
      event.preventDefault();
    }
  }

  return (
    <form action={acao} onSubmit={handleSubmit}>
      <button className="botao botao-apagar" type="submit">
        🗑️ Apagar
      </button>
    </form>
  );
}
