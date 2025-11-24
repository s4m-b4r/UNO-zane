// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public')); // serve your HTML/JS/CSS

// Store all game rooms
const games = {};

counter = 0
playercount = 0
player_num = 0
// Handle connections

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  socket.on("createRoom", () => {
    counter++
    player_num = 0
    socket.join(counter)
    createRoom(counter, 4, socket.id)
    socket.emit("roomJoined", { player_num: player_num, room: counter })
  })

  socket.on("roomJoin", (data) => {
    console.log(data)
    console.log(counter)
    if (data <= counter) {
      console.log("room exists")
      if (games[data].gameMode == "gameMade") {
        console.log("game is available to join")
        games[data].players.push(socket.id)
        socket.join(data)
        socket.emit("roomJoined", { player_num: games[data].players.length - 1, room: data })
        console.log("this socket is player " + games[data].players[games[data].players.length - 1])
        if (games[data].players.length == games[data].playerlimit) {
          games[data].gameMode = "gameStarted"
          console.log("game is full, start now")
          gameStart(data)
        }
      }
    }
  })


  socket.on("playerWon", (data) => {
    let Room = data.room
    socket.broadcast.to(Room).emit("playerWon", data)
  })

  socket.on("playCard", (data) => {
    playCard(data.room, data.discardedCard, data.player, data.cardIndex, socket.id)
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
    drawCard(data)
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

function setGame(room, maxplayer) {
  deck1 = []
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
  sortHand(room, maxplayer, playerHands)

  return {
    deck: deck1,
    playerHands: playersHands1,
    discardPile: discardPile1
  }

}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createRoom(roomId, playerlim, gamehost) {
  const startgamevar = setGame(roomId, playerlim)
  games[roomId] = {
    id: roomId,
    players: [gamehost],
    playerlimit: playerlim,
    deck: startgamevar.deck,
    playerHands: startgamevar.playerHands,
    discardPile: startgamevar.discardPile,
    turn: 0,
    gameMode: "gameMade"
  }
}

function gameStart(roomId) {
  for (i = 0; i <= games[roomId].players.length - 1; i++) {
    if (games[roomId].players.length == 4) {
      j = i + 1
      k = i + 2
      l = i + 3
      if (j > 3) {
        j = j - 4
        k = k - 4
        l = l - 4
      }
      else if (k > 3) {
        k = k - 4
        l = l - 4
      }
      else if (l > 3) {
        l = l - 4
      }
      io.to(games[roomId].players[i]).emit("startGame", { playersHands1: games[roomId].playerHands[i], otherplayers: [j, k, l], discardPile1: games[roomId].discardPile })
      console.log("the starting discard card is " + discardPile1)
    }

    else if (games[roomId].players.length == 3) {
      j = i + 1
      k = i + 2
      if (j > 2) {
        j = j - 3
        k = k - 3
      }
      else if (k > 2) {
        k = k - 3
      }
      io.to(games[roomId].players[i]).emit("startGame", { playersHands1: games[roomId].playerHands[i], otherplayers: [j, k], discardPile1: games[roomId].discardPile })
    }

    else if (games[roomId].players.length == 2) {
      j = i + 1
      if (j > 1) {
        j = j - 2
      }
      io.to(games[roomId].players[i]).emit("startGame", { playersHands1: games[roomId].playerHands[i], otherplayers: [j], discardPile1: games[roomId].discardPile })
    }
  }
}

function playCard(roomId, playedCard, player_num, cardIndex, socket) {
  if (games[roomId].turn == player_num) {
    if (playedCard == games[roomId].playerHands[player_num][cardIndex]) {
      discardPile.push(playerHands.splice(cardIndex, 1)[player_num])
    }
  };

}

function drawCard(data) {
  if (deck.length > 0) {
    games[roomId].playerHands[data.playernum].push(games[roomId].deck.pop())
  }

  else {
    if (discardPile.length > 2) {
      tempCard = games[roomId].discardPile.pop()
      shuffle(games[roomId].discardPile)
      games[roomId].deck = games[roomId].discardPile
      games[roomId].discardPile = [tempCard]
    }
    else {
      games[roomId].gameMode = "gameBroke"
    }
  }
}


function sortHand(room, maxplayer, playerHands) {
  for (j = 0; j < maxplayer; j++) {
    for (i = 0; i < playersHands[j].length; i++) {
      if (playersHands[j][i][0] == 4) {
        playersHands[j][i][0] = -1
      }
      else if (playersHands[j][i][1] == 9) {
        playersHands[j][i][1] = -1
      }
    }
  }

  for (i = 0; i < maxplayer; i++) {
    for (let p of playersHands) {
      p.sort((a, b) => {
        if (a[0] < b[0]) {
          return -1
        } else if (a[0] > b[0]) {
          return 1
        } else if (a[1] < b[1]) {
          return -1
        } else if (a[1] > b[1]) {
          return 1
        } else return 0

      })
    }
  }

  for (j = 0; j < maxplayer; j++) {
    for (i = 0; i < playersHands[j].length; i++) {
      if (playersHands[j][i][0] == -1) {
        playersHands[j][i][0] = 4
      }
      else if (playersHands[j][i][1] == -1) {
        playersHands[j][i][1] = 9
      }
    }
  }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(` Server running on port ${PORT}`));