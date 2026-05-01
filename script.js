const firebaseConfig = {
  apiKey: "AIzaSyDlBIFEJqVv5RfLNOh6POyO1hPeQ1CVRPY",
  authDomain: "nexo-0.firebaseapp.com",
  projectId: "nexo-0",
  storageBucket: "nexo-0.firebasestorage.app",
  messagingSenderId: "977099086248",
  appId: "1:977099086248:web:fc05dccab20b41aee2e59d",
  measurementId: "G-DK9RDC3DY5"
};


firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


document.addEventListener('DOMContentLoaded', () => {
    
    let currentUser = "";


    const loginScreen = document.getElementById('login-screen');
    const passcodeInp = document.getElementById('passcode');
    const loginBtn = document.getElementById('loginBtn');
    const msgInput = document.getElementById('msgInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatBox = document.getElementById('chat-box');


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
            alert("Wrong passcode. Please try again.");
            passcodeInp.value = "";
        }
    });


    function sendMessage() {
        const text = msgInput.value.trim();
        
        if (text === "" || !currentUser) return;


        db.collection("messages").add({
            user: currentUser,
            content: text,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            msgInput.value = ""; 
        })
        .catch((error) => {
            console.error("Error sending message: ", error);
        });
    }

    sendBtn.addEventListener('click', sendMessage);


    msgInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // --- RECEIVE MESSAGES LOGIC ---
    function loadMessages() {
        // Listen to the 'messages' collection in real-time
        db.collection("messages")
          .orderBy("timestamp", "asc")
          .onSnapshot((snapshot) => {
            chatBox.innerHTML = ""; // Clear current view
            
            snapshot.forEach((doc) => {
                const data = doc.data();
                const messageDiv = document.createElement('div');
                
                // Add base class and specific user class
                messageDiv.classList.add('msg');
                messageDiv.classList.add(data.user === "Tori" ? 'tori' : 'charlie');
                
                messageDiv.innerHTML = `<strong>${data.user}</strong><br>${data.content}`;
                chatBox.appendChild(messageDiv);
            });
            
            // Scroll to the bottom of the chat
            chatBox.scrollTop = chatBox.scrollHeight;
          }, (error) => {
              console.error("Firestore Error:", error);
          });
    }
});
