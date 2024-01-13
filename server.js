const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Integrate Socket.io with the server

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle connection event for incoming sockets
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('newuser', (username) => {
        // Emitir un mensaje a todos los usuarios cuando alguien se une
        io.emit('updatechat', { username: 'System', message: `${username} has joined the chat` });
    });


    // Listen for 'chatmessage' sent by clients
    socket.on('chatmessage', (data) => {
        // Broadcast message to all connected clients
        io.emit('updatechat', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server on port 5000
server.listen(5000, () => {
    console.log('Server is running on port 5000');
});
