document.addEventListener("DOMContentLoaded", function() {
    const app = document.querySelector(".app");
    const socket = io(); // Asegúrate de que el servidor esté ejecutándose para la conexión de Socket.io

    const joinScreen = app.querySelector(".join-screen");
    const chatScreen = app.querySelector(".chat-screen");
    const joinButton = app.querySelector("#join-user");
    const exitButton = app.querySelector("#exit-chat");
    const sendMessageButton = app.querySelector("#send-message");
    const messageInput = app.querySelector("#message-input");
    const messagesDiv = app.querySelector(".messages");
    let uname;

    joinButton.addEventListener("click", function() {
        let username = app.querySelector("#username").value.trim();
        if (username) {
            uname = username;
            joinScreen.classList.remove("active");
            chatScreen.classList.add("active");
            socket.emit("newuser", uname); // Emitir evento de nuevo usuario
        } else {
            alert("Please enter a username.");
        }
    });

    exitButton.addEventListener("click", function() {
        socket.emit("exituser", uname); // Opcional: emitir evento de usuario que abandona el chat
        joinScreen.classList.add("active");
        chatScreen.classList.remove("active");
    });

    sendMessageButton.addEventListener("click", function() {
        let message = messageInput.value.trim();
        if (message) {
            appendMessage(uname, message); // Añade tu mensaje al chat
            socket.emit("chatmessage", { username: uname, message: message }); // Envía el mensaje al servidor
            messageInput.value = "";
        }
    });

    socket.on("updatechat", function(data) {
        appendMessage(data.username, data.message); // Añade mensajes recibidos al chat
    });

    function appendMessage(username, message) {
        let messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.classList.add(username === uname ? "my-message" : "other-message");
        messageElement.innerHTML = `<strong>${username}</strong>: ${message}`;
        messagesDiv.appendChild(messageElement);
        messagesDiv.scrollTop = messagesDiv.scrollHeight; // Desplaza automáticamente al último mensaje
    }
});

