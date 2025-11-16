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

  // socket.on("createRoom", () => {
  //   room = ("game " + counter)
  //   counter++
  //   player_num = 0
  //   socket.join(room)
  //   socket.emit("createRoom", { room: room, player_num: player_num })
  // })

  // socket.on("roomJoin", (data) => {
  //   console.log(data)
  //   console.log(counter)
  //   if (data < counter) {
  //     room = ("game " + data)
  //     socketCount = io.sockets.adapter.rooms.get(room)
  //     console.log("amount of sockets in room " + data + " is " + socketCount.size)
  //     socket.broadcast.to(room).emit("playerAttemptingJoin", socketCount.size)

  //     socket.on("playerCanJoin", (data1) => {
  //       console.log("the game state in " + room + " is " + data1)
  //       if (data1 == "gameMade") {
  //         player_num = socketCount.size
  //         socket.join(data)
  //         socket.emit("roomJoined", { room: room, player_num: player_num })
  //       }
  //     })
  //   }
  // }
  // )

  socket.on("createRoom", () =>{
    room = "room " + counter
    if (player_num <= 3){
      socket.join(room)
      socket.emit("createRoom", { room: room, player_num: player_num })
      player_num ++
      if(player_num == 4){
        counter ++
        player_num = 0
        startgame(room)
      }
    } 

  })

  socket.on("playerWon", (data) => {
    let Room = data.room
    socket.broadcast.to(Room).emit("playerWon", data)
  })

  socket.on("playCard", (data) => {
    let Room = data.room
    socket.broadcast.to(Room).emit("playCard", data)
  })

  socket.on("turn change", (data) => {
    let Room = data.room
    socket.broadcast.to(Room).emit("turn change", data)
  })

  socket.on("turn order", (data) => {
    let Room = data.room
    socket.broadcast.to(Room).emit("turn order", data)
  })

  socket.on("draw card", (data) => {
    let Room = data.room
    socket.broadcast.to(Room).emit("draw card", data)
  })

  socket.on("colour change", (data) => {
    let Room = data.room
    socket.broadcast.to(Room).emit("colour change", data)
  })

  socket.on("draw power card", (data) => {
    let Room = data.room
    socket.broadcast.to(Room).emit("draw power card", data)
  })
  // Disconnect cleanup

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
  });
});

function startgame(room) {
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

// function createRoom(roomId, playerlim){
//     games[roomId] = {
//       id: roomId,
//       players: [],
//       playerlimit: playerlim,
//       playerHands: [[],[],[],[]]
//     }
// }