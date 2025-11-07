// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public')); // serve your HTML/JS/CSS

// Store all game rooms
const games = {}; // { roomName: { players: [], started: false, data: {} } }

// Handle connections
io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  // Send current lobby list to new player
  socket.emit('lobbyUpdate', getLobbyList());

  // Create room
  socket.on('createRoom', (roomName, playerName) => {
    if (games[roomName]) {
      socket.emit('errorMsg', 'Room already exists.');
      return;
    }

    games[roomName] = { players: [], started: false, data: {} };
    joinRoom(socket, roomName, playerName);
    io.emit('lobbyUpdate', getLobbyList());
  });

  // Join room
  socket.on('joinRoom', (roomName, playerName) => {
    if (!games[roomName]) {
      socket.emit('errorMsg', 'Room not found.');
      return;
    }

    joinRoom(socket, roomName, playerName);
  });

  // Leave room (optional)
  socket.on('leaveRoom', (roomName) => {
    socket.leave(roomName);
    removePlayer(socket.id);
    io.emit('lobbyUpdate', getLobbyList());
  });

  // Handle custom messages (you can define your own events here)
  socket.on('gameMessage', (data) => {
    // Forward to everyone in the same room
    io.to(data.room).emit('gameMessage', {
      playerId: socket.id,
      message: data.message
    });
  });

  // Disconnect cleanup
  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    removePlayer(socket.id);
    io.emit('lobbyUpdate', getLobbyList());
  });
});

// Join helper
function joinRoom(socket, roomName, playerName) {
  socket.join(roomName);

  const game = games[roomName];
  game.players.push({ id: socket.id, name: playerName });

  io.to(roomName).emit('playerJoined', game.players);
  io.emit('lobbyUpdate', getLobbyList());
}

// Remove player helper
function removePlayer(socketId) {
  for (const roomName in games) {
    const game = games[roomName];
    game.players = game.players.filter(p => p.id !== socketId);

    if (game.players.length === 0) delete games[roomName];
  }
}

// Lobby list
function getLobbyList() {
  return Object.entries(games).map(([roomName, game]) => ({
    name: roomName,
    players: game.players.length,
    started: game.started
  }));
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
