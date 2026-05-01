// 1. Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDlBIFEJqVv5RfLNOh6POyO1hPeQ1CVRPY",
    projectId: "nexo-0",
    appId: "1:977099086248:web:fc05dccab20b41aee2e59d"
};

// 2. Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let currentUser = "";

// 3. UI Elements
const loginScreen = document.getElementById('login-screen');
const passcodeInp = document.getElementById('passcode');
const loginBtn = document.getElementById('loginBtn');
const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');
const chatBox = document.getElementById('chat-box');

// 4. Login Logic
loginBtn.addEventListener('click', () => {
    const code = passcodeInp.value;
    if (code === "000000") {
        currentUser = "Tori";
        loginScreen.style.display = 'none';
        loadMessages();
    } else if (code === "111111") {
        currentUser = "Charlie";
        loginScreen.style.display = 'none';
        loadMessages();
    } else {
        alert("Access Denied");
    }
});

// 5. Send Message Logic
function sendMessage() {
    const text = msgInput.value.trim();
    if (text === "" || !currentUser) return;

    db.collection("private_chat").add({
        user: currentUser,
        text: text,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    msgInput.value = "";
}

sendBtn.addEventListener('click', sendMessage);

// Allow pressing "Enter" to send
msgInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// 6. Listen for Real-time Messages
function loadMessages() {
    db.collection("private_chat")
      .orderBy("timestamp")
      .onSnapshot((snapshot) => {
        chatBox.innerHTML = "";
        snapshot.forEach((doc) => {
            const data = doc.data();
            const div = document.createElement('div');
            div.classList.add('msg');
            
            // Assign class based on user
            div.classList.add(data.user === "Tori" ? 'tori' : 'charlie');
            
            div.innerHTML = `<strong>${data.user}:</strong> ${data.text}`;
            chatBox.appendChild(div);
        });
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}
