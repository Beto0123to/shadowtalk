// Variáveis globais
let currentUser = null;
let currentChatId = null;
let partnerId = null;

// Elementos DOM
const authStatus = document.getElementById('auth-status');
const chatSection = document.getElementById('chat-section');
const loginSection = document.getElementById('login-section');
const startChatBtn = document.getElementById('start-chat');
const googleLoginBtn = document.getElementById('google-login');
const newChatBtn = document.getElementById('new-chat');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    setupEventListeners();
});

// Autenticação
function initAuth() {
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            authStatus.textContent = `Logado como: ${user.isAnonymous ? 'Anônimo' : user.email}`;
            loginSection.classList.add('hidden');
            chatSection.classList.remove('hidden');
            findChatPartner();
        } else {
            currentUser = null;
            authStatus.textContent = 'Não logado';
            loginSection.classList.remove('hidden');
            chatSection.classList.add('hidden');
        }
    });
}

// Encontrar parceiro de chat
async function findChatPartner() {
    const usersRef = db.collection('users');
    
    // 1. Procurar usuários disponíveis
    const availableUsers = await usersRef
        .where('status', '==', 'online')
        .where('userId', '!=', currentUser.uid)
        .limit(1)
        .get();

    if (!availableUsers.empty) {
        // Encontrou um parceiro
        const partner = availableUsers.docs[0].data();
        partnerId = partner.userId;
        createChatSession();
    } else {
        // Ninguém disponível - coloca na fila
        await usersRef.doc(currentUser.uid).set({
            userId: currentUser.uid,
            status: 'waiting',
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Monitora por novos usuários
        const unsubscribe = usersRef
            .where('status', '==', 'waiting')
            .where('userId', '!=', currentUser.uid)
            .onSnapshot(snapshot => {
                if (!snapshot.empty && !partnerId) {
                    const partner = snapshot.docs[0].data();
                    partnerId = partner.userId;
                    createChatSession();
                    unsubscribe(); // Para de monitorar
                }
            });
    }
}

// Criar sessão de chat
async function createChatSession() {
    // Cria um ID único para o chat
    currentChatId = db.collection('chats').doc().id;
    
    // Atualiza status dos usuários
    await db.collection('users').doc(currentUser.uid).update({
        status: 'in_chat',
        currentChat: currentChatId
    });
    
    await db.collection('users').doc(partnerId).update({
        status: 'in_chat',
        currentChat: currentChatId
    });

    // Configura listener de mensagens
    setupChatListener();
}

// Configurar listener do chat
function setupChatListener() {
    db.collection('chats').doc(currentChatId)
        .collection('messages')
        .orderBy('timestamp')
        .onSnapshot(snapshot => {
            chatMessages.innerHTML = '';
            snapshot.forEach(doc => {
                const message = doc.data();
                displayMessage(message);
            });
        });
}

// Enviar mensagem
async function sendMessage() {
    const text = messageInput.value.trim();
    if (!text || !currentChatId) return;

    const message = {
        text,
        senderId: currentUser.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('chats').doc(currentChatId)
        .collection('messages')
        .add(message);

    messageInput.value = '';
}

// Mostrar mensagem
function displayMessage(message) {
    const isCurrentUser = message.senderId === currentUser.uid;
    const messageElement = document.createElement('div');
    messageElement.className = `message ${isCurrentUser ? 'sent' : 'received'}`;
    messageElement.textContent = message.text;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Event Listeners
function setupEventListeners() {
    // Login Anônimo
    startChatBtn.addEventListener('click', () => {
        auth.signInAnonymously()
            .catch(error => console.error('Erro no login anônimo:', error));
    });

    // Login com Google
    googleLoginBtn.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .catch(error => console.error('Erro no login com Google:', error));
    });

    // Novo Chat
    newChatBtn.addEventListener('click', () => {
        if (currentChatId) {
            // Limpa chat anterior
            db.collection('chats').doc(currentChatId).update({
                active: false
            });
        }
        findChatPartner();
    });

    // Enviar mensagem
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

// Service Worker (PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('ServiceWorker registrado com sucesso:', registration.scope);
            })
            .catch(error => {
                console.log('Falha no registro do ServiceWorker:', error);
            });
    });
}
