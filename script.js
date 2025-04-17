
const auth = firebase.auth();
const db = firebase.database();

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, password)
    .then(() => showChat())
    .catch(error => alert(error.message));
}

function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => showChat())
    .catch(error => alert(error.message));
}

function logout() {
  auth.signOut().then(() => location.reload());
}

function showChat() {
  document.getElementById("login-container").style.display = "none";
  document.getElementById("chat-container").style.display = "block";
  db.ref("messages").on("child_added", snapshot => {
    const msg = snapshot.val();
    const msgEl = document.createElement("div");
    msgEl.textContent = msg.user + ": " + msg.text;
    document.getElementById("messages").appendChild(msgEl);
  });
}

function sendMessage() {
  const text = document.getElementById("message-input").value;
  const user = auth.currentUser.email;
  db.ref("messages").push({ user, text });
  document.getElementById("message-input").value = "";
}
// Inicialize o Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, remove, set, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  databaseURL: "SUA_DATABASE_URL",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Elementos da interface
const procurarBtn = document.getElementById("procurar");
const chatBox = document.getElementById("chat-box");
const msgInput = document.getElementById("msg-input");
const sendBtn = document.getElementById("send-btn");

let userId = null;
let chatId = null;

// Função para procurar pessoa
procurarBtn.addEventListener("click", async () => {
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

// Enviar mensagem
sendBtn.addEventListener("click", () => {
  const text = msgInput.value;
  if (text && chatId) {
    const messagesRef = ref(database, `chats/${chatId}/messages`);
    push(messagesRef, { text });
    msgInput.value = "";
  }
});

// Gerar ID único
function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}
