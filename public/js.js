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
let maxplayer = 2;
let ChangeColourMode = false
let turnClockWise = true
let EndGame = false
let room_ID;
let gameStarted = false;

function setup() {
    createCanvas(windowWidth, windowHeight);
    v2 = createVector((width / 2) - 100 * Math.sin(0.6), (height) - 100 * Math.cos(0.6))
    v1 = createVector(width / 2, height)
    angleMode(RADIANS)

    socket.emit("createRoom")
    socket.on("roomjoin", room => {
        room_ID = room
    })

}

socket.on("playernum", player_num => {
    playernum = player_num
})
socket.on("deckArranged", deck1 => {
    deck = deck1
})
socket.on("discardPile", discardPile1 => {
    discardPile = discardPile1
})
socket.on("playersHands", playersHands1 => {
    playersHands = playersHands1
    sortHand()
    gameStarted = true
})


function sortHand() {

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


function preload() {
    uno = loadImage('Uno - Standard Deck.png')
}

function draw() {
    if (gameStarted == false) {
        background("black")
        fill("white")
        text("game not started", width / 2, height / 2)
    }

    else if (gameStarted == true) {
        background("white")
        PlayerManager()
        if (EndGame == false) {
            v3 = createVector(mouseX, mouseY)
            currentpos = v3.sub(v1)
            startv = v2.sub(v1)


            if (mouseY >= (height - (250 + 53))) {
                if (startv.angleBetween(currentpos) < 1.4 && startv.angleBetween(currentpos) >= 0) {
                    cardNumber = Math.round(startv.angleBetween(currentpos) / (1.4 / playersHands[playernum].length)) - 1
                    if (cardNumber < 0) {
                        cardNumber = -2
                    }

                    // console.log("the card i am on is " + cardNumber)
                    // console.log("the angle to rotate from is" + 1.4 / numberOfCards)
                    // console.log("the angle i am on is" + startv.angleBetween(currentpos))
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
                        image(uno, 0, -250, cwidth, cheight, beginsheetx + playersHands[playernum][i][1] * (cwidth + cxoffset), beginsheety + playersHands[playernum][i][0] * (cheight + cyoffset), cwidth, cheight)
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
                pop()
            }
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
                for (i = 0; i < playersHands[tempplayernum].length; i++) {
                    push()
                    rotateFrom = map(i, 0, playersHands[tempplayernum].length, 2.3, 4)
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
                for (i = 0; i < playersHands[tempplayernum].length; i++) {
                    push()
                    rotateFrom = map(i, 0, playersHands[tempplayernum].length, 1.5, 3.2)
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
                for (i = 0; i < playersHands[tempplayernum].length; i++) {
                    push()
                    rotateFrom = map(i, 0, playersHands[tempplayernum].length, 3.2, 4.9)
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
                for (i = 0; i < playersHands[tempplayernum].length; i++) {
                    push()
                    rotateFrom = map(i, 0, playersHands[tempplayernum].length, 1, 2.7)
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
                for (i = 0; i < playersHands[tempplayernum].length; i++) {
                    push()
                    rotateFrom = map(i, 0, playersHands[tempplayernum].length, 2.3, 4)
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
                for (i = 0; i < playersHands[tempplayernum].length; i++) {
                    push()
                    rotateFrom = map(i, 0, playersHands[tempplayernum].length, 3.8, 5.5)
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




        else if (EndGame == true) {
            push()
            fill("black")
            text("player " + turn + " won the game", width / 2 - 100, height / 2 - 100, 200, 50)
            pop()
            console.log("player " + turn + " won the game")
        }
    }
}



function mouseClicked() {
    if (gameStarted == true) {
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
                            socket.emit("colour change", { colourChanged: discardPile[discardPile.length - 1][1], room: room_ID })
                            ChangeColourMode = false
                            if (turnClockWise == true) {
                                turn += 1

                            }
                            else if (turnClockWise == false) {
                                turn -= 1
                            }
                            socket.emit("turn change", { Turn: turn, room: room_ID })
                            drawCardP += 4
                            socket.emit("draw power card", { room: room_ID, drawpower: drawCardP })
                        }
                        else if (yellow == true && white == false) {
                            discardPile[discardPile.length - 1][1] += 4
                            socket.emit("colour change", { colourChanged: discardPile[discardPile.length - 1][1], room: room_ID })
                            ChangeColourMode = false
                            if (turnClockWise == true) {
                                turn += 1
                            }
                            else if (turnClockWise == false) {
                                turn -= 1
                            }
                            socket.emit("turn change", { Turn: turn, room: room_ID })
                            drawCardP += 4
                            socket.emit("draw power card", { room: room_ID, drawpower: drawCardP })
                        }
                        else if (green == true && white == false) {
                            discardPile[discardPile.length - 1][1] += 2
                            socket.emit("colour change", { colourChanged: discardPile[discardPile.length - 1][1], room: room_ID })
                            ChangeColourMode = false
                            if (turnClockWise == true) {
                                turn += 1
                            }
                            else if (turnClockWise == false) {
                                turn -= 1
                            }
                            socket.emit("turn change", { Turn: turn, room: room_ID })
                            drawCardP += 4
                            socket.emit("draw power card", { room: room_ID, drawpower: drawCardP })
                        }
                        else if (blue == true && white == false) {
                            discardPile[discardPile.length - 1][1] += 3
                            ChangeColourMode = false

                            if (turnClockWise == true) {
                                turn += 1
                            }
                            else if (turnClockWise == false) {
                                turn -= 1
                            }
                            socket.emit("turn change", { Turn: turn, room: room_ID })
                            drawCardP += 4
                            socket.emit("draw power card", { room: room_ID, drawpower: drawCardP })
                        }
                    }


                    else if (discardPile[discardPile.length - 1][1] == 0) {
                        if (red == true && white == false) {
                            discardPile[discardPile.length - 1][1] += 1
                            socket.emit("colour change", { colourChanged: discardPile[discardPile.length - 1][1], room: room_ID })
                            ChangeColourMode = false
                            if (turnClockWise == true) {
                                turn += 1
                            }
                            else if (turnClockWise == false) {
                                turn -= 1
                            }
                            socket.emit("turn change", { Turn: turn, room: room_ID })
                        }
                        else if (yellow == true && white == false) {
                            discardPile[discardPile.length - 1][1] += 4
                            socket.emit("colour change", { colourChanged: discardPile[discardPile.length - 1][1], room: room_ID })
                            ChangeColourMode = false
                            if (turnClockWise == true) {
                                turn += 1
                            }
                            else if (turnClockWise == false) {
                                turn -= 1
                            }
                            socket.emit("turn change", { Turn: turn, room: room_ID })
                        }
                        else if (green == true && white == false) {
                            discardPile[discardPile.length - 1][1] += 2
                            socket.emit("colour change", { colourChanged: discardPile[discardPile.length - 1][1], room: room_ID })
                            ChangeColourMode = false
                            if (turnClockWise == true) {
                                turn += 1
                            }
                            else if (turnClockWise == false) {
                                turn -= 1
                            }
                            socket.emit("turn change", { Turn: turn, room: room_ID })
                        }
                        else if (blue == true && white == false) {
                            discardPile[discardPile.length - 1][1] += 3
                            socket.emit("colour change", { colourChanged: discardPile[discardPile.length - 1][1], room: room_ID })
                            ChangeColourMode = false

                            if (turnClockWise == true) {
                                turn += 1
                            }
                            else if (turnClockWise == false) {
                                turn -= 1
                            }
                            socket.emit("turn change", { Turn: turn, room: room_ID })
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
                            socket.emit("colour change", { colourChanged: discardPile[discardPile.length - 1][1], room: room_ID })
                            ChangeColourMode = false
                            if (turnClockWise == true) {
                                turn += 1
                            }
                            else if (turnClockWise == false) {
                                turn -= 1
                            }
                            socket.emit("turn change", { Turn: turn, room: room_ID })
                            drawCardP += 4
                            socket.emit("draw power card", { room: room_ID, drawpower: drawCardP })
                        }
                        else if (yellow == true && white == false) {
                            discardPile[discardPile.length - 1][1] += 4
                            socket.emit("colour change", { colourChanged: discardPile[discardPile.length - 1][1], room: room_ID })
                            ChangeColourMode = false
                            if (turnClockWise == true) {
                                turn += 1
                            }
                            else if (turnClockWise == false) {
                                turn -= 1
                            }
                            socket.emit("turn change", { Turn: turn, room: room_ID })
                            drawCardP += 4
                            socket.emit("draw power card", { room: room_ID, drawpower: drawCardP })
                        }
                        else if (green == true && white == false) {
                            discardPile[discardPile.length - 1][1] += 2
                            socket.emit("colour change", { colourChanged: discardPile[discardPile.length - 1][1], room: room_ID })
                            ChangeColourMode = false
                            if (turnClockWise == true) {
                                turn += 1
                            }
                            else if (turnClockWise == false) {
                                turn -= 1
                            }
                            socket.emit("turn change", { Turn: turn, room: room_ID })
                            drawCardP += 4
                            socket.emit("draw power card", { room: room_ID, drawpower: drawCardP })
                        }
                        else if (blue == true && white == false) {
                            discardPile[discardPile.length - 1][1] += 3
                            socket.emit("colour change", { colourChanged: discardPile[discardPile.length - 1][1], room: room_ID })
                            ChangeColourMode = false

                            if (turnClockWise == true) {
                                turn += 1
                            }
                            else if (turnClockWise == false) {
                                turn -= 1
                            }
                            socket.emit("turn change", { Turn: turn, room: room_ID })
                            drawCardP += 4
                            socket.emit("draw power card", { room: room_ID, drawpower: drawCardP })
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
                discardPile.push(playersHands[playernum].splice(cardNumber, 1)[0])
                socket.emit("playCard", { discardedCard: discardPile[discardPile.length - 1], room: room_ID, player: playernum })
                CheckPlayerWin()
                cardEffect(discardPile[discardPile.length - 1][1])
            }

            else if (playersHands[playernum][cardNumber][0] == discardPile[discardPile.length - 1][0] || (discardPile[discardPile.length - 1][0] == 4 && (discardPile[discardPile.length - 1][1] - 1 == playersHands[turn][cardNumber][0] || discardPile[discardPile.length - 1][1] - 6 == playersHands[turn][cardNumber][0]))) {
                discardPile.push(playersHands[playernum].splice(cardNumber, 1)[0])
                socket.emit("playCard", { discardedCard: discardPile[discardPile.length - 1], room: room_ID, player: playernum })
                CheckPlayerWin()
                cardEffect(discardPile[discardPile.length - 1][1])
            }

            else if (playersHands[playernum][cardNumber][1] == discardPile[discardPile.length - 1][1]) {
                discardPile.push(playersHands[playernum].splice(cardNumber, 1)[0])
                socket.emit("playCard", { discardedCard: discardPile[discardPile.length - 1], room: room_ID, player: playernum })
                CheckPlayerWin()
                cardEffect(discardPile[discardPile.length - 1][1])
            }
        }
    }

    else if (drawCardP != 0) {
        if (cardNumber != -2) {
            if (playersHands[playernum][cardNumber][0] == 4 && playersHands[playernum][cardNumber][1] == 5) {
                discardPile.push(playersHands[playernum].splice(cardNumber, 1)[0])
                socket.emit("playCard", { discardedCard: discardPile[discardPile.length - 1], room: room_ID, player: playernum })
                CheckPlayerWin()
                cardEffect(discardPile[discardPile.length - 1][1])
            }
            else if (playersHands[playernum][cardNumber][1] == 10) {
                discardPile.push(playersHands[playernum].splice(cardNumber, 1)[0])
                socket.emit("playCard", { discardedCard: discardPile[discardPile.length - 1], room: room_ID, player: playernum })
                CheckPlayerWin()
                cardEffect(discardPile[discardPile.length - 1][1])
            }
        }
    }

}


function cardEffect(effect) {
    if (effect == 0 && discardPile[discardPile.length - 1][0] == 4) {
        ChangeColour()
    }

    else if (effect == 5 && discardPile[discardPile.length - 1][0] == 4) {
        ChangeColour()
    }

    else if (effect == 10) {
        drawCardP += 2
    }

    else if (effect == 11) {
        if (turnClockWise == true) {
            turnClockWise = false
            socket.emit("turn order", { turnOrder: turnClockWise, room: room_ID })
        }
        else {
            turnClockWise = true
            socket.emit("turn order", { turnOrder: turnClockWise, room: room_ID })
        }
    }

    else if (effect == 12) {
        if (turnClockWise == true) {
            turn += 1
        }
        else if (turnClockWise == false) {
            turn -= 1
        }
        socket.emit("turn change", { Turn: turn, room: room_ID })
    }

    if (turnClockWise == true && ChangeColourMode == false) {
        if (effect != 11) {
            turn += 1
        }
        else if (effect == 11 && maxplayer != 2) {
            turn -= 1
        }
        socket.emit("turn change", { Turn: turn, room: room_ID })

        if ((effect == 5 && discardPile[discardPile.length - 1][0] == 4) || effect == 10) {
            socket.emit("draw power card", { room: room_ID, drawpower: drawCardP })
        }
    }
    else if (turnClockWise == false && ChangeColourMode == false) {
        if (effect != 11) {
            turn -= 1
        }
        else if (effect == 11 && maxplayer != 2) {
            turn -= 1
        }
        socket.emit("turn change", { Turn: turn, room: room_ID })

        if ((effect == 5 && discardPile[discardPile.length - 1][0] == 4) || effect == 10) {
            socket.emit("draw power card", { room: room_ID, drawpower: drawCardP })
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
        playersHands[playernum].push(deck.pop())
        socket.emit("draw card", { cardremoved: playersHands[playernum][playersHands[playernum].length - 1], player: playernum, room: room_ID })
        sortHand()
        if (turnClockWise == true) {
            turn += 1
        }
        else if (turnClockWise == false) {
            turn -= 1
        }
        socket.emit("turn change", { Turn: turn, room: room_ID })
    }
}

function PlayerManager() {
    if (turn < 0) {
        turn += maxplayer
        socket.emit("turn change", { Turn: turn, room: room_ID })
    }
    else if (turn > maxplayer - 1) {
        turn -= maxplayer
        socket.emit("turn change", { Turn: turn, room: room_ID })
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

                    if (turnClockWise == true) {
                        turn += 1
                        socket.emit("turn change", { Turn: turn, room: room_ID })
                        break
                    }

                    else if (turnClockWise == false) {
                        turn -= 1
                        socket.emit("turn change", { Turn: turn, room: room_ID })
                        break
                    }
                }
            }
        }
    }
}

function CheckPlayerWin() {
    if (playersHands[playernum].length == 0) {
        EndGame = true
        if (turnClockWise == true) {
            turn -= 1
        }
        else if (turnClockWise == false) {
            turn += 1
        }
        let playerwinstat = {
            turn1: turn,
            gameStatus: EndGame,
            room: room_ID
        }
        socket.emit("playerWon", playerwinstat)
    }
}


socket.on("playerWon", (data) => {
    EndGame = data.gameStatus
    turn = data.turn1
})

socket.on("playCard", (data) => {
    discardPile.push(data.discardedCard)
    for (i = 0; i < playersHands[data.player].length; i++) {
        if (playersHands[data.player][i][0] == data.discardedCard[0] && playersHands[data.player][i][1] == data.discardedCard[1]) {
            playersHands[data.player].splice(i, 1)
            break
        }
    }
})

socket.on("turn change", (data) => {
    turn = data.Turn
})

socket.on("turn order", (data) => {
    turnClockWise = data.turnOrder
})

socket.on("draw card", (data) => {
    playersHands[data.player].push(deck.pop())
    sortHand()
})

socket.on("colour change", (data) => {
    discardPile[discardPile.length - 1][1] = data.colourChanged
})

socket.on("draw power card", (data) => {
    drawCardP = data.drawpower
    DrawPowerCard()
})