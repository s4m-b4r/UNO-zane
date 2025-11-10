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

counter = 1
playercount = 0
// Handle connections
io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  socket.on("createRoom", () => {
    if(playercount <=4){
    room = "game "+ counter
    socket.emit("roomjoin", room)
    socket.join(room)
    console.log("player " + socket.id + " has joined room " + room )
    playercount++
    }
    else{
      counter ++
      playercount = 0
      room = "game "+ counter
    socket.emit("roomjoin", room)
    socket.join(room)
    console.log("player " + socket.id + " has joined room " + room )
    playercount++
    }
})


  

  
// Disconnect cleanup
  
  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
  });
})



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(` Server running on port ${PORT}`));
