// Importa os módulos necessários do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  set,
  remove,
  push,
  onChildAdded
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// Configuração do Firebase (substitua pelos seus dados)
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  databaseURL: "https://SEU_DATABASE_URL",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Elementos da interface
const procurarBtn = document.getElementById("procurar");
const chatBox = document.getElementById("chat-box");
const msgInput = document.getElementById("msg-input");
const sendBtn = document.getElementById("send-btn");

let userId = null;
let chatId = null;

// Função para gerar um ID único
function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// Função para iniciar o chat
function iniciarChat(chatId) {
  const messagesRef = ref(database, `chats/${chatId}/messages`);
  onChildAdded(messagesRef, (data) => {
    const message = data.val();
    const p = document.createElement("p");
    p.textContent = message.text;
    chatBox.appendChild(p);
  });
}

// Evento de clique no botão "Procurar Pessoa"
procurarBtn.addEventListener("click", () => {
  userId = generateId();
  const filaRef = ref(database, "fila");

  onValue(filaRef, (snapshot) => {
    const fila = snapshot.val();
    if (fila) {
      const otherUserId = Object.keys(fila).find(id => id !== userId);
      if (otherUserId) {
        chatId = generateId();
        set(ref(database, `chats/${chatId}`), {
          users: [userId, otherUserId],
          messages: []
        });
        remove(ref(database, `fila/${otherUserId}`));
        remove(ref(database, `fila/${userId}`));
        iniciarChat(chatId);
      } else {
        set(ref(database, `fila/${userId}`), true);
      }
    } else {
      set(ref(database, `fila/${userId}`), true);
    }
  });
});

// Evento de clique no botão "Enviar"
sendBtn.addEventListener("click", () => {
  const text = msgInput.value;
  if (text && chatId) {
    const messagesRef = ref(database, `chats/${chatId}/messages`);
    push(messagesRef, { text });
    msgInput.value = "";
  }
});
