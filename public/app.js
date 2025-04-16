// BOTÕES QUE DEVEM FUNCIONAR IMEDIATAMENTE
document.addEventListener('DOMContentLoaded', () => {
  // 1. Botão de Chat
  const chatBtn = document.getElementById('start-chat');
  if (chatBtn) {
    chatBtn.addEventListener('click', () => {
      const chatBox = document.getElementById('chat-messages');
      if (!chatBox) {
        alert('ERRO: Elemento "chat-messages" não encontrado!');
        return;
      }
      chatBox.innerHTML += `
        <div class="bot-msg">
          <strong>Bot:</strong> Funcionou! Você clicou no botão 🎉
        </div>`;
    });
  } else {
    alert('ERRO: Botão com ID "start-chat" não existe!');
  }

  // 2. Debug de Elementos (digite no console)
  console.log('Elementos carregados:', {
    chatBtn,
    messageInput: document.getElementById('message-input'),
    sendBtn: document.getElementById('send-button')
  });
});
