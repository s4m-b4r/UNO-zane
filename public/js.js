console.log("JS is working")
console.log("link for html https://www.w3schools.com/html/default.asp")
console.log("link for css https://www.w3schools.com/css/default.asp")
console.log("link for JS https://www.w3schools.com/js/default.asp")

let cwidth = 70
let cheight = 107
let cBackWidth = 60
let cBackHeight = 97
let cxoffset = 3
let cyoffset = 9
let beginsheetx = 414
let beginsheety = 123
let backCardx = 10
let backCardy = 26
let rotateStart = -0.35
let uno;
let numberOfCards = 7
let v1;
let v2;
let v3;
let currentpos;
let startv;
let rotatebool;
let deck = [];
let playersHands = [[],
[],
[],
[]];
let discardPile = []
let cardNumber;
let drawCardP = 0;
let turn = 0;
let playernum;
let maxplayer = 4;
let ChangeColourMode = false
let turnClockWise = true
let EndGame = false
let room_ID;
let gameMode = "Menu"
let roomInput;


function setup() {
    createCanvas(windowWidth, windowHeight);
    v2 = createVector((width / 2) - 100 * Math.sin(0.6), (height) - 100 * Math.cos(0.6))
    v1 = createVector(width / 2, height)
    angleMode(RADIANS)
    if (gameMode == "Menu") {
        push()
        background("white")
        button = createButton("create room")
        button.position(width / 2, height / 2)
        button.mousePressed(createRoom)
        pop()

        push()
        background("white")
        text("input room ID: ", (width / 2) - 90, (height / 2) + 45)
        roomInput = createInput()
        roomInput.position(width / 2, (height / 2) + 40)
        roomInput.changed(joinRoom)
        pop()
    }
}

function preload() {
    uno = loadImage('Uno - Standard Deck.png')
}

function draw() {
    switch (gameMode) {

        case ("gameMade"):
            push()
            button.hide()
            background("black")
            fill("white")
            text("game not started", width / 2, height / 2)
            text("room ID: " + room_ID, width / 2, height / 2 - 50)
            text("player number: " + playernum, width / 2, height / 2 + 50)
            pop()
            break

        case ("gameStarted"):
            background("white")
            PlayerManager()
            if (EndGame == false) {
                v3 = createVector(mouseX, mouseY)
                currentpos = v3.sub(v1)
                startv = v2.sub(v1)


                if (mouseY >= (height - (250 + 53))) {
                    if (playersHands[playernum].length >= 4) {
                        if (startv.angleBetween(currentpos) < 1.4 && startv.angleBetween(currentpos) >= 0) {
                            cardNumber = Math.round(startv.angleBetween(currentpos) / (1.4 / playersHands[playernum].length)) - 1
                            if (cardNumber < 0) {
                                cardNumber = -2
                            }
                        }

                        // console.log("the card i am on is " + cardNumber)
                        // console.log("the angle to rotate from is" + 1.4 / numberOfCards)
                        // console.log("the angle i am on is" + startv.angleBetween(currentpos))
                    }
                    else if (playersHands[playernum].length <= 3) {
                        if (startv.angleBetween(currentpos) < 0.7 && startv.angleBetween(currentpos) >= 0) {
                            cardNumber = Math.round(startv.angleBetween(currentpos) / (0.7 / playersHands[playernum].length)) - 1
                            if (cardNumber < 0) {
                                cardNumber = -2
                            }
                        }
                    }
                }
                else {
                    cardNumber = -2
                }

                push()
                imageMode(CENTER)
                translate(width / 2 - (cwidth + 10), height / 2)
                image(uno, 0, 0, cwidth, cheight, backCardx, backCardy, cBackWidth, cBackHeight)
                pop()

                push()
                fill("black")
                text("player " + turn + "'s turn", width / 2 + (cwidth + 10), height / 2)
                pop()
                if (ChangeColourMode == true) {
                    ChangeColour()
                }

                push()
                imageMode(CENTER)
                translate(width / 2, height)

                for (i = 0; i < playersHands[playernum].length; i++) {
                    if (playersHands[playernum].length >= 4) {
                        push()
                        rotateFrom = map(i, 0, playersHands[playernum].length, -0.6, 0.8)
                        rotate(rotateFrom)


                        if (i == cardNumber) {
                            image(uno, 0, -250, cwidth, cheight, beginsheetx + playersHands[playernum][i][1] * (cwidth + cxoffset), beginsheety + playersHands[playernum][i][0] * (cheight + cyoffset), cwidth, cheight)

                        }

                        else if (i == cardNumber - 1) {
                            rotate(-(1.4 / playersHands[playernum].length) * 0.8)
                            image(uno, 0, -225, cwidth, cheight, beginsheetx + playersHands[playernum][i][1] * (cwidth + cxoffset), beginsheety + playersHands[playernum][i][0] * (cheight + cyoffset), cwidth, cheight)

                        }

                        else if (i == cardNumber + 1) {
                            rotate((1.4 / playersHands[playernum].length) * 0.8)
                            image(uno, 0, -225, cwidth, cheight, beginsheetx + playersHands[playernum][i][1] * (cwidth + cxoffset), beginsheety + playersHands[playernum][i][0] * (cheight + cyoffset), cwidth, cheight)

                        }

                        else {
                            if (i > cardNumber + 1 && cardNumber != -2) {
                                rotate(1.4 / playersHands[playernum].length)
                            }
                            image(uno, 0, -175, cwidth, cheight, beginsheetx + playersHands[playernum][i][1] * (cwidth + cxoffset), beginsheety + playersHands[playernum][i][0] * (cheight + cyoffset), cwidth, cheight)

                        }
                        pop()
                    }
                    else if (playersHands[playernum].length <= 3) {
                        push()
                        rotateFrom = map(i, 0, playersHands[playernum].length, -0.3, 0.4)
                        rotate(rotateFrom)

                        if (i == cardNumber) {
                            image(uno, 0, -275, cwidth, cheight, beginsheetx + playersHands[playernum][i][1] * (cwidth + cxoffset), beginsheety + playersHands[playernum][i][0] * (cheight + cyoffset), cwidth, cheight)
                        }
                        else if (i == cardNumber - 1) {
                            image(uno, 0, -225, cwidth, cheight, beginsheetx + playersHands[playernum][i][1] * (cwidth + cxoffset), beginsheety + playersHands[playernum][i][0] * (cheight + cyoffset), cwidth, cheight)

                        }

                        else if (i == cardNumber + 1) {
                            image(uno, 0, -225, cwidth, cheight, beginsheetx + playersHands[playernum][i][1] * (cwidth + cxoffset), beginsheety + playersHands[playernum][i][0] * (cheight + cyoffset), cwidth, cheight)

                        }

                        else {
                            image(uno, 0, -175, cwidth, cheight, beginsheetx + playersHands[playernum][i][1] * (cwidth + cxoffset), beginsheety + playersHands[playernum][i][0] * (cheight + cyoffset), cwidth, cheight)
                        }
                        pop()
                    }
                }
                pop()

                push()
                imageMode(CENTER)
                translate(width / 2, height / 2)
                image(uno, 0, 0, cwidth, cheight, beginsheetx + discardPile[discardPile.length - 1][1] * (cwidth + cxoffset), beginsheety + discardPile[discardPile.length - 1][0] * (cheight + cyoffset), cwidth, cheight)
                pop()

                push()
                fill("black")
                text("player " + playernum, width / 2, height - 50)
                pop()

                push()
                imageMode(CENTER)

                if (maxplayer == 2) {
                    tempplayernum = playernum + 1
                    if (tempplayernum == 2) {
                        tempplayernum = 0
                    }
                    push()
                    translate(width / 2, (height / 8) - 50)
                    for (i = 0; i < playersHands[tempplayernum]; i++) {
                        push()
                        rotateFrom = map(i, 0, playersHands[tempplayernum], 2.3, 4)
                        rotate(rotateFrom)
                        image(uno, 0, -100, cwidth, cheight, backCardx, backCardy, cBackWidth, cBackHeight)
                        pop()
                    }
                    pop()

                    push()
                    translate(width / 2, (height / 8) - 50)
                    fill("black")
                    text("player " + tempplayernum, -25, 0)
                    pop()

                    if (tempplayernum == 0) {
                        tempplayernum = 1
                    }
                    else if (tempplayernum == 1) {
                        tempplayernum = 0
                    }
                }

                else if (maxplayer == 3) {
                    tempplayernum = playernum + 1
                    if (tempplayernum == 3) {
                        tempplayernum = 0
                    }

                    push()
                    translate(width / 4, height / 4)
                    for (i = 0; i < playersHands[tempplayernum]; i++) {
                        push()
                        rotateFrom = map(i, 0, playersHands[tempplayernum], 1.5, 3.2)
                        rotate(rotateFrom)
                        image(uno, 0, -100, cwidth, cheight, backCardx, backCardy, cBackWidth, cBackHeight)
                        pop()
                    }
                    pop()

                    push()
                    translate(width / 4, height / 4)
                    fill("black")
                    text("player " + tempplayernum, -25, 0)
                    pop()

                    if (tempplayernum == 0) {
                        tempplayernum = 2
                    }
                    else if (tempplayernum != 0) {
                        tempplayernum -= 1
                    }

                    tempplayernum += 2

                    if (tempplayernum > 2) {
                        tempplayernum -= 3
                    }

                    push()
                    translate(width * (3 / 4), height / 4)
                    for (i = 0; i < playersHands[tempplayernum]; i++) {
                        push()
                        rotateFrom = map(i, 0, playersHands[tempplayernum], 3.2, 4.9)
                        rotate(rotateFrom)
                        image(uno, 0, -100, cwidth, cheight, backCardx, backCardy, cBackWidth, cBackHeight)
                        pop()
                    }
                    pop()

                    push()
                    translate(width * (3 / 4), height / 4)
                    fill("black")
                    text("player " + tempplayernum, -25, 0)
                    pop()

                    if (tempplayernum < 2) {
                        tempplayernum += 1
                    }
                    else if (tempplayernum == 2) {
                        tempplayernum = 0
                    }
                }

                else if (maxplayer == 4) {
                    tempplayernum = playernum + 1
                    if (tempplayernum == 4) {
                        tempplayernum = 0
                    }
                    push()
                    translate(width / 6, height / 2)
                    for (i = 0; i < playersHands[tempplayernum]; i++) {
                        push()
                        rotateFrom = map(i, 0, playersHands[tempplayernum], 1, 2.7)
                        rotate(rotateFrom)
                        image(uno, 0, -100, cwidth, cheight, backCardx, backCardy, cBackWidth, cBackHeight)
                        pop()
                    }
                    pop()

                    push()
                    translate(width / 6, height / 2)
                    fill("black")
                    text("player " + tempplayernum, -25, 0)
                    pop()

                    if (tempplayernum == 0) {
                        tempplayernum = 3
                    }
                    else if (tempplayernum != 0) {
                        tempplayernum -= 1
                    }

                    tempplayernum += 2
                    if (tempplayernum > 3) {
                        tempplayernum -= 4
                    }

                    push()
                    translate(width / 2, (height / 8) - 50)
                    for (i = 0; i < playersHands[tempplayernum]; i++) {
                        push()
                        rotateFrom = map(i, 0, playersHands[tempplayernum], 2.3, 4)
                        rotate(rotateFrom)
                        image(uno, 0, -100, cwidth, cheight, backCardx, backCardy, cBackWidth, cBackHeight)
                        pop()
                    }
                    pop()

                    push()
                    translate(width / 2, (height / 8) - 50)
                    fill("black")
                    text("player " + tempplayernum, -25, 0)
                    pop()

                    if (tempplayernum < 2) {
                        tempplayernum += 2
                    }
                    else if (tempplayernum >= 2) {
                        tempplayernum -= 2
                    }

                    tempplayernum += 3
                    if (tempplayernum != 3) {
                        tempplayernum -= 4
                    }
                    push()
                    translate(width * (3 / 4), height / 2)
                    for (i = 0; i < playersHands[tempplayernum]; i++) {
                        push()
                        rotateFrom = map(i, 0, playersHands[tempplayernum], 3.8, 5.5)
                        rotate(rotateFrom)
                        image(uno, 0, -100, cwidth, cheight, backCardx, backCardy, cBackWidth, cBackHeight)
                        pop()
                    }
                    pop()

                    push()
                    translate(width * (3 / 4), height / 2)
                    fill("black")
                    text("player " + tempplayernum, -25, 0)
                    pop()

                    if (tempplayernum != 3) {
                        tempplayernum += 1
                    }
                    else if (tempplayernum == 3) {
                        tempplayernum -= 3
                    }
                }
            }
            break

        case ("gameWon"):
            push()
            fill("black")
            text("player " + turn + " won the game", width / 2 - 100, height / 2 - 100, 200, 50)
            pop()
            console.log("player " + turn + " won the game")
            break
    }
}




function mouseClicked() {
    if (gameMode == "gameStarted") {
        if (EndGame == false) {
            if (drawCardP == 0) {
                if (ChangeColourMode == false) {
                    if (turn == playernum) {
                        playCard()
                        drawCard()
                    }
                }

                else if (ChangeColourMode == true) {
                    red = collidePointArc(mouseX, mouseY, width / 2, height / 2, 150, 0, Math.PI / 2)
                    yellow = collidePointArc(mouseX, mouseY, width / 2, height / 2, 150, -Math.PI / 2, Math.PI / 2)
                    green = collidePointArc(mouseX, mouseY, width / 2, height / 2, 150, -Math.PI, Math.PI / 2)
                    blue = collidePointArc(mouseX, mouseY, width / 2, height / 2, 150, -Math.PI * 3 / 2, Math.PI / 2)
                    white = collidePointCircle(mouseX, mouseY, width / 2, height / 2, 150)

                    if (discardPile[discardPile.length - 1][1] == 5) {
                        if (red == true && white == false) {
                            discardPile[discardPile.length - 1][1] += 1
                            socket.emit("colour change", { colourChanged: 1, room: room_ID, player_num: playernum })
                        }
                        else if (yellow == true && white == false) {
                            discardPile[discardPile.length - 1][1] += 4
                            socket.emit("colour change", { colourChanged: 4, room: room_ID, player_num: playernum })
                        }
                        else if (green == true && white == false) {
                            discardPile[discardPile.length - 1][1] += 2
                            socket.emit("colour change", { colourChanged: 2, room: room_ID, player_num: playernum })
                        }
                        else if (blue == true && white == false) {
                            discardPile[discardPile.length - 1][1] += 3
                            socket.emit("colour change", { colourChanged: 3, room: room_ID, player_num: playernum })
                        }
                    }


                    else if (discardPile[discardPile.length - 1][1] == 0) {
                        if (red == true && white == false) {
                            discardPile[discardPile.length - 1][1] += 1
                            socket.emit("colour change", { colourChanged: 1, room: room_ID, player_num: playernum })
                        }
                        else if (yellow == true && white == false) {
                            discardPile[discardPile.length - 1][1] += 4
                            socket.emit("colour change", { colourChanged: 4, room: room_ID, player_num: playernum })
                        }
                        else if (green == true && white == false) {
                            discardPile[discardPile.length - 1][1] += 2
                            socket.emit("colour change", { colourChanged: 2, room: room_ID, player_num: playernum })
                        }
                        else if (blue == true && white == false) {
                            discardPile[discardPile.length - 1][1] += 3
                            socket.emit("colour change", { colourChanged: 3, room: room_ID, player_num: playernum })
                        }
                    }
                }
            }


            else if (drawCardP != 0) {
                if (ChangeColourMode == true) {
                    red = collidePointArc(mouseX, mouseY, width / 2, height / 2, 150, 0, Math.PI / 2)
                    yellow = collidePointArc(mouseX, mouseY, width / 2, height / 2, 150, -Math.PI / 2, Math.PI / 2)
                    green = collidePointArc(mouseX, mouseY, width / 2, height / 2, 150, -Math.PI, Math.PI / 2)
                    blue = collidePointArc(mouseX, mouseY, width / 2, height / 2, 150, -Math.PI * 3 / 2, Math.PI / 2)
                    white = collidePointCircle(mouseX, mouseY, width / 2, height / 2, 150)

                    if (discardPile[discardPile.length - 1][1] == 5) {
                        if (red == true && white == false) {
                            discardPile[discardPile.length - 1][1] += 1
                            socket.emit("colour change", { colourChanged: 1, room: room_ID, player_num: playernum })
                        }
                        else if (yellow == true && white == false) {
                            discardPile[discardPile.length - 1][1] += 4
                            socket.emit("colour change", { colourChanged: 4, room: room_ID, player_num: playernum })
                        }
                        else if (green == true && white == false) {
                            discardPile[discardPile.length - 1][1] += 2
                            socket.emit("colour change", { colourChanged: 2, room: room_ID, player_num: playernum })
                        }
                        else if (blue == true && white == false) {
                            discardPile[discardPile.length - 1][1] += 3
                            socket.emit("colour change", { colourChanged: 3, room: room_ID, player_num: playernum })
                        }
                    }
                }
                playCard()
            }
        }
    }
}


function playCard() {
    if (drawCardP == 0) {
        if (cardNumber != -2) {
            if (playersHands[playernum][cardNumber][0] == 4) {
                console.log("playing a black card")
                socket.emit("playCard", { discardedCard: playersHands[playernum][cardNumber], room: room_ID, player: playernum, cardIndex: cardNumber })
                CheckPlayerWin()
            }

            else if (playersHands[playernum][cardNumber][0] == discardPile[discardPile.length - 1][0] || (discardPile[discardPile.length - 1][0] == 4 && (discardPile[discardPile.length - 1][1] - 1 == playersHands[turn][cardNumber][0] || discardPile[discardPile.length - 1][1] - 6 == playersHands[turn][cardNumber][0]))) {
                console.log("playing card from being same colour")
                socket.emit("playCard", { discardedCard: playersHands[playernum][cardNumber], room: room_ID, player: playernum, cardIndex: cardNumber })
                CheckPlayerWin()
            }

            else if (playersHands[playernum][cardNumber][1] == discardPile[discardPile.length - 1][1]) {
                console.log("playing card from being the same number")
                socket.emit("playCard", { discardedCard: playersHands[playernum][cardNumber], room: room_ID, player: playernum, cardIndex: cardNumber })
                CheckPlayerWin()
            }
        }
    }

    else if (drawCardP != 0) {
        if (cardNumber != -2) {
            if (playersHands[playernum][cardNumber][0] == 4 && playersHands[playernum][cardNumber][1] == 5) {
                socket.emit("playCard", { discardedCard: playersHands[playernum][cardNumber], room: room_ID, player: playernum, cardIndex: cardNumber })
                CheckPlayerWin()
            }
            else if (playersHands[playernum][cardNumber][1] == 10) {
                socket.emit("playCard", { discardedCard: playersHands[playernum][cardNumber], room: room_ID, player: playernum, cardIndex: cardNumber })
                CheckPlayerWin()
            }
        }
    }
}


function ChangeColour() {

    push()
    fill("red")
    arc(width / 2, height / 2, 300, 300, -Math.PI / 4, Math.PI / 4)

    fill("yellow")
    arc(width / 2, height / 2, 300, 300, -Math.PI * (3 / 4), -Math.PI / 4)

    fill("green")
    arc(width / 2, height / 2, 300, 300, -Math.PI * (5 / 4), -Math.PI * (3 / 4))

    fill("blue")
    arc(width / 2, height / 2, 300, 300, Math.PI / 4, -Math.PI * (5 / 4))

    fill("white")
    circle(width / 2, height / 2, 150)
    pop()

    ChangeColourMode = true

}

function drawCard() {
    if (mouseX > (width / 2 - (cwidth + 10 + cwidth / 2)) && mouseX < (width / 2 - (cwidth + 10 - cwidth / 2)) && mouseY > (height / 2 - cheight / 2) && mouseY < (height / 2 + cheight / 2)) {
        socket.emit("draw card", { player: playernum, room: room_ID })
    }
}

function PlayerManager() {
    if (turn < 0) {
        turn += maxplayer
    }
    else if (turn > maxplayer - 1) {
        turn -= maxplayer
    }
}

function DrawPowerCard() {
    PlayerManager()
    console.log(turn)
    if (turn == playernum && drawCardP != 0) {
        for (i = 0; i < playersHands[playernum].length; i++) {
            console.log(playersHands[playernum][i])
            if (playersHands[playernum][i][1] == 10 || ((playersHands[playernum][i][0] == 4 && playersHands[playernum][i][1] == 5))) {
                break
            }
            else if (playersHands[playernum][i][1] != 10 || !(playersHands[playernum][i][0] == 4 && playersHands[playernum][i][1] == 5)) {

                if (i == playersHands[playernum].length - 1) {

                    for (j = 0; j < drawCardP; j++) {
                        console.log(deck[deck.length - 1])
                        playersHands[playernum].push(deck.pop())
                        socket.emit("draw card", { cardremoved: playersHands[playernum][playersHands[playernum].length - 1], player: playernum, room: room_ID })
                    }
                    sortHand()
                    drawCardP = 0
                    socket.emit("draw power card", { room: room_ID, drawpower: drawCardP })

                    break
                }
            }
        }
    }
}

//my comment is this guy is so cool

function CheckPlayerWin() {
    if (playersHands[playernum].length == 0) {
        EndGame = true
        let playerwinstat = {
            turn1: playernum,
            gameStatus: EndGame,
            room: room_ID
        }
        socket.emit("playerWon", playerwinstat)
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function createRoom() {
    button.hide()
    roomInput.hide()
    socket.emit("createRoom")
}

function joinRoom() {
    roomCode = roomInput.value()
    roomCode = roomCode.replace(/\s+/g, '')
    roomCode = Number(roomCode)
    console.log("the room code inputted is " + roomCode)
    socket.emit("roomJoin", roomCode)
}

socket.on("roomJoined", (data) => {
    playernum = data.player_num
    room_ID = data.room
    gameMode = "gameMade"
    roomInput.hide()
    button.hide()
})

socket.on("startGame", (data) => {
    gameMode = "gameStarted"
    playersHands[playernum] = data.playersHands1
    for (i = 0; i <= data.otherplayers.length - 1; i++) {
        playersHands[data.otherplayers[i]] = 7
    }
    discardPile.push(data.discardPile1[0])
})

socket.on("playerWon", (data) => {
    EndGame = data.gameStatus
    turn = data.playernum
})

socket.on("playCard", (data) => {
    if (data.player_num == playernum) {
        playersHands[data.player_num] = data.newplayerhand
    }
    else {
        playersHands[data.player_num] = data.playerLength
    }
    discardPile = data.discardPile1
    turn = data.turn
})

socket.on("turn change", (data) => {
    turn = data.Turn
})

socket.on("draw card", (data) => {
    if (data.player_num == playernum) {
        playersHands[data.player_num] = data.playerhand
    }
    else {
        playersHands[data.player_num] = data.cardNumPlayer
    }
    turn = data.turn
})

socket.on("change Colour", (data) => {
    ChangeColour()
})

socket.on("gameUpdate", (data) => {
    discardPile = data.discardPile1
    ChangeColourMode = data.ChangeColourMode
})

socket.on("draw power card", (data) => {
    drawCardP = data.drawpower
    DrawPowerCard()
})
