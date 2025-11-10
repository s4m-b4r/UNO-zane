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
playernum = 0
// Handle connections
io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  socket.on("createRoom", () => {
    if(playercount <=3){
    room = "game "+ counter
    socket.emit("roomjoin", room)
    socket.join(room)
    socket.emit("playernum", playernum)
    console.log("player " + socket.id + " has joined room " + room + " and is player " + playernum)
    playernum++
    playercount++
    }
    
    else{
      startgame(room)
      
      counter ++
      playercount = 0
      playernum = 0
      room = "game "+ counter
    socket.emit("roomjoin", room)
    socket.join(room)
    socket.emit("playernum", playernum)
    console.log("player " + socket.id + " has joined room " + room + " and is player " + playernum)
    playercount++
    }
})
  
// Disconnect cleanup
  
  socket.on('disconnect', () => {
    socket.leave(room)
    console.log('Player disconnected:', socket.id);
  });
});

function startgame(room){
  deck = []
  maxplayer = 4
  numberOfCards = 7
  playersHands = [[], [], [], []]
discardPile = []

  for (i = 0; i <= 3; i++) {
        for (j = 0; j <= 12; j++) {

            card = [i, j]
            deck.push(card)
            card = [i, j]
            deck.push(card)

        }
    }
    for (i = 0; i <= 3; i++) {
        deck.push([4, 0])
        deck.push([4, 5])
    }
    shuffle(deck)

    for (i = 0; i < maxplayer; i++) {
        for (j = 0; j < numberOfCards; j++) {
            playersHands[i].push(deck.pop())
        }
    }
    let countCard = 1
    let bool = true
    while (bool == true) {
        if (deck[deck.length - countCard][0] != 4) {
            discardPile.push((deck.splice(deck.length - countCard)[0]))
            bool = false
        }
        countCard += 1
    }

    io.to(room).emit("deckArranged", deck)
    io.to(room).emit("playersHands", playersHands)
    io.to(room).emit("discardPile", discardPile)
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(` Server running on port ${PORT}`));
