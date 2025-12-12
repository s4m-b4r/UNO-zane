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
    let roomCount = String(counter)
    player_num = 0
    socket.join(roomCount)
    createRoom(counter, 4, socket.id)
    socket.emit("roomJoined", { player_num: player_num, room: roomCount })
  })

  socket.on("roomJoin", (data) => {
    console.log(data)
    console.log(counter)
    if (data <= counter) {
      console.log("room exists")
      if (games[data].gameMode == "gameMade") {
        console.log("game is available to join")
        games[data].players.push(socket.id)
        let roomCount = String(data)
        socket.join(roomCount)
        socket.emit("roomJoined", { player_num: games[data].players.length - 1, room: roomCount })
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
    playCard(Number(data.room), data.discardedCard, data.player, data.cardIndex, socket.id)
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
    newplayerhand = drawCard(data)
    PlayerManager(Number(data.room))
    io.to(data.room).emit("draw card", { turn: games[data.room].turn, player_num: data.player, cardNumPlayer: newplayerhand.length, playerhand: newplayerhand })
  })

  socket.on("colour change", (data) => {
    console.log("trying to change the colour")
    games[Number(data.room)].discardPile[discardPile.length - 1][1] += data.colourChanged
    games[Number(data.room)].ChangeColourMode = false
    io.to(String(data.room)).emit("gameUpdate", { discardPile1: games[Number(data.room)].discardPile, ChangeColourMode: games[Number(data.room)].ChangeColourMode })
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

  for (let i = 0; i <= 3; i++) {
    for (let j = 0; j <= 12; j++) {

      card = [i, j]
      deck1.push(card)
      card = [i, j]
      deck1.push(card)

    }
  }
  for (let i = 0; i <= 3; i++) {
    deck1.push([4, 0])
    deck1.push([4, 5])
  }
  shuffle(deck1)

  for (let i = 0; i < maxplayer; i++) {
    for (let j = 0; j < numberOfCards; j++) {
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
  playersHands1 = sortHand(room, maxplayer, playersHands1)

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
    turnClockWise: true,
    drawCardP: 0,
    ChangeColourMode: false,
    gameMode: "gameMade"
  }
}

function gameStart(roomId) {
  console.log("the players in this room are " + games[roomId].players)
  for (let i = 0; i <= games[roomId].players.length - 1; i++) {
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
  if (games[roomId].ChangeColourMode == false) {
    if (games[roomId].turn == player_num) {
      if (playedCard[0] == games[roomId].playerHands[player_num][cardIndex][0] && playedCard[1] == games[roomId].playerHands[player_num][cardIndex][1]) {
        console.log("found the correct card to be discarded from player's hand and added to the discard pile")
        games[roomId].discardPile.push(games[roomId].playerHands[player_num].splice(cardIndex, 1)[0])
        cardEffect(games[roomId].discardPile[games[roomId].discardPile.length - 1][1], roomId, player_num)
        console.log("the turn is " + games[roomId].turn)
        io.to(String(roomId)).emit("playCard", { discardPile1: games[roomId].discardPile, newplayerhand: games[roomId].playerHands[player_num], turn: games[roomId].turn, playerLength: games[roomId].playerHands[player_num].length, player_num: player_num })
      }
    }
  };
}

function drawCard(data) {
  games[data.room].playerHands[data.player].push(games[data.room].deck.pop())
  games[data.room].playerHands = sortHand(data.room, games[data.room].playerlimit, games[data.room].playerHands)
  games[data.room].turn++
  return games[data.room].playerHands[data.player]
}

function sortHand(room, maxplayer, playersHands) {
  for (let j = 0; j < maxplayer; j++) {
    for (let i = 0; i < playersHands[j].length; i++) {
      if (playersHands[j][i][0] == 4) {
        playersHands[j][i][0] = -1
      }
      else if (playersHands[j][i][1] == 9) {
        playersHands[j][i][1] = -1
      }
    }
  }

  for (let i = 0; i < maxplayer; i++) {
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

  for (let j = 0; j < maxplayer; j++) {
    for (let i = 0; i < playersHands[j].length; i++) {
      if (playersHands[j][i][0] == -1) {
        playersHands[j][i][0] = 4
      }
      else if (playersHands[j][i][1] == -1) {
        playersHands[j][i][1] = 9
      }
    }
  }
  return playersHands
}

function turnManager(room) {
  if (games[room].turnClockWise == true) {
    games[room].turn++
  }
  else if (games[room].turnClockWise == false) {
    games[room].turn--
  }
  PlayerManager(room)
  io.to(String(room)).emit("turn change", { Turn: games[room].turn })
}

function cardEffect(effect, room, playernum) {
  if (effect == 0 && games[room].discardPile[games[room].discardPile.length - 1][0] == 4) {
    games[room].ChangeColourMode = true
    io.to(games[room].players[playernum]).emit("change Colour", { ColourChanger: games[room].ChangeColourMode })
  }

  else if (effect == 5 && games[room].discardPile[games[room].discardPile.length - 1][0] == 4) {
    games[room].ChangeColourMode = true
    io.to(games[room].players[playernum]).emit("change Colour", { ColourChanger: games[room].ChangeColourMode, turnnum: games[room].turn })
    games[room].drawCardP += 4
  }

  else if (effect == 10) {
    games[room].drawCardP += 2
  }

  else if (effect == 11) {
    if (games[room].turnClockWise == true) {
      games[room].turnClockWise = false
    }
    else {
      games[room].turnClockWise = true
    }
  }

  else if (effect == 12) {
    turnManager(room)
  }

  if (games[room].turnClockWise == true && games[room].ChangeColourMode == false) {
    if (effect != 11) {
      games[room].turn += 1
    }
    else if (effect == 11 && games[room].playerlimit != 2) {
      games[room].turn -= 1
    }

    if ((effect == 5 && games[room].discardPile[games[room].discardPile.length - 1][0] == 4) || effect == 10) {
    }
  }
  else if (games[room].turnClockWise == false && games[room].ChangeColourMode == false) {
    if (effect != 11) {
      games[room].turn -= 1
    }
    else if (effect == 11 && games[room].playerlimit != 2) {
      games[room].turn -= 1
    }

    if ((effect == 5 && games[room].discardPile[games[room].discardPile.length - 1][0] == 4) || effect == 10) {
    }
  }
  PlayerManager(room)
}

function PlayerManager(room) {
  if (games[room].turn < 0) {
    games[room].turn += games[room].playerlimit
  }
  else if (games[room].turn > games[room].playerlimit - 1) {
    games[room].turn -= games[room].playerlimit
  }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(` Server running on port ${PORT}`));