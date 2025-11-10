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
player_num = 0
// Handle connections

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  socket.on("createRoom", () => {
    if(playercount <=3){
    room = "game "+ counter
    socket.emit("roomjoin", room)
    socket.join(room)
    socket.emit("playernum", player_num)
    console.log("player " + socket.id + " has joined room " + room + " and is player " + player_num)
    player_num++
    playercount++
    if(playercount == 4){
      startgame(room)
    }
    }
    else if(playercount == 4){
      
      counter ++
      playercount = 0
      player_num = 0
      room = "game "+ counter
    socket.emit("roomjoin", room)
    socket.join(room)
    socket.emit("playernum", player_num)
    console.log("player " + socket.id + " has joined room " + room + " and is player " + player_num)
    player_num++
    playercount++
    }
  }
)
  
socket.on("playerWon", (data) =>{
  let Room = data.room
  socket.broadcast.to(Room).emit("playerWon", data)
})


// Disconnect cleanup
  
  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
  });
});

function startgame(room){
  deck1 = []
  maxplayer = 4
  numberOfCards = 7
  playersHands1 = [[], [], [], []]
discardPile1 = []

  for (i = 0; i <= 3; i++) {
        for (j = 0; j <= 12; j++) {

            card = [i, j]
            deck1.push(card)
            card = [i, j]
            deck1.push(card)

        }
    }
    for (i = 0; i <= 3; i++) {
        deck1.push([4, 0])
        deck1.push([4, 5])
    }
    shuffle(deck1)

    for (i = 0; i < maxplayer; i++) {
        for (j = 0; j < numberOfCards; j++) {
            playersHands1[i].push(deck1.pop())
        }
    }
    let countCard = 1
    let bool = true
    while (bool == true) {
        if (deck1[deck1.length - countCard][0] != 4) {
            discardPile1.push((deck1.splice(deck1.length - countCard)[0]))
            bool = false
        }
        countCard += 1
    }

    io.to(room).emit("deckArranged", deck1)
    io.to(room).emit("playersHands", playersHands1)
    io.to(room).emit("discardPile", discardPile1)
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
