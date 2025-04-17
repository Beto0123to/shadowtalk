
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
