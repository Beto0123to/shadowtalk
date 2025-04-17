y// TESTE ULTIMATE
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.createElement('button');
    btn.textContent = 'BOTÃO TESTE';
    btn.style = `
        position: fixed; 
        top: 10px; 
        left: 10px; 
        z-index: 9999; 
        padding: 20px;
        background: red;
        color: white;
    `;
    btn.onclick = () => {
        document.body.innerHTML += `
            <div style="color: lime; font-size: 24px;">
                ✅ FUNCIONOU!
            </div>
        `;
    };
    document.body.appendChild(btn);
});
// DEBUG ULTIMATE - VERIFICA SE O BOTÃO EXISTE
console.log("Iniciando teste...");

const btnTeste = document.createElement('button');
btnTeste.textContent = 'TESTE CLIQUE AQUI';
btnTeste.style = `
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 9999;
  padding: 15px;
  background: red;
  color: white;
  font-weight: bold;
`;

btnTeste.onclick = () => {
  const chat = document.getElementById('chat-messages') || document.body;
  chat.innerHTML += `
    <div style="color: lime; padding: 10px; background: #222;">
      ✅ BOTÃO FUNCIONANDO! Seu JavaScript está ativo.
    </div>
  `;
};

document.body.appendChild(btnTeste);
console.log("Botão de teste adicionado!");
