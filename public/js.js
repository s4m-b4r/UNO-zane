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
let playernum = 4
let ChangeColourMode = false
let turnClockWise = true
let EndGame = false

function setup() {
    createCanvas(windowWidth, windowHeight);
    v2 = createVector((width / 2) - 100 * Math.sin(0.6), (height) - 100 * Math.cos(0.6))
    v1 = createVector(width / 2, height)
    angleMode(RADIANS)
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
    deck = shuffle(deck)

    for (i = 0; i < playernum; i++) {
        for (j = 0; j < numberOfCards; j++) {
            playersHands[i].push(deck.pop())
        }
    }

    sortHand()

    let count = 1
    let bool = true
    while (bool == true) {
        if (deck[deck.length - count][0] != 4) {
            discardPile.push((deck.splice(deck.length - count)[0]))
            bool = false
        }
        count += 1
    }


}

function preload() {
    uno = loadImage('Uno - Standard Deck.png')
}

function draw() {
    background("white")
    PlayerManager()
    if (EndGame == false) {
        v3 = createVector(mouseX, mouseY)
        currentpos = v3.sub(v1)
        startv = v2.sub(v1)


        if (mouseY >= (height - (250 + 53))) {
            if (startv.angleBetween(currentpos) < 1.4 && startv.angleBetween(currentpos) >= 0) {
                cardNumber = Math.round(startv.angleBetween(currentpos) / (1.4 / playersHands[turn].length)) - 1
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

        if (ChangeColourMode == true) {
            ChangeColour()
        }

        push()
        imageMode(CENTER)
        translate(width / 2, height)

        for (i = 0; i < playersHands[turn].length; i++) {
            push()
            rotateFrom = map(i, 0, playersHands[turn].length, -0.6, 0.8)
            rotate(rotateFrom)


            if (i == cardNumber) {
                image(uno, 0, -250, cwidth, cheight, beginsheetx + playersHands[turn][i][1] * (cwidth + cxoffset), beginsheety + playersHands[turn][i][0] * (cheight + cyoffset), cwidth, cheight)

            }

            else if (i == cardNumber - 1) {
                rotate(-(1.4 / playersHands[turn].length) * 0.8)
                image(uno, 0, -225, cwidth, cheight, beginsheetx + playersHands[turn][i][1] * (cwidth + cxoffset), beginsheety + playersHands[turn][i][0] * (cheight + cyoffset), cwidth, cheight)

            }

            else if (i == cardNumber + 1) {
                rotate((1.4 / playersHands[turn].length) * 0.8)
                image(uno, 0, -225, cwidth, cheight, beginsheetx + playersHands[turn][i][1] * (cwidth + cxoffset), beginsheety + playersHands[turn][i][0] * (cheight + cyoffset), cwidth, cheight)

            }

            else {
                if (i > cardNumber + 1 && cardNumber != -2) {
                    rotate(1.4 / playersHands[turn].length)
                }
                image(uno, 0, -175, cwidth, cheight, beginsheetx + playersHands[turn][i][1] * (cwidth + cxoffset), beginsheety + playersHands[turn][i][0] * (cheight + cyoffset), cwidth, cheight)

            }


            pop()
        }
        pop()

        push()
        imageMode(CENTER)
        translate(width / 2, height / 2)
        image(uno, 0, 0, cwidth, cheight, beginsheetx + discardPile[discardPile.length - 1][1] * (cwidth + cxoffset), beginsheety + discardPile[discardPile.length - 1][0] * (cheight + cyoffset), cwidth, cheight)
        pop()

        text("player " + turn, width / 2, height - 50)

        push()
        imageMode(CENTER)

        if (playernum == 2) {
            turn += 1
            if (turn == 2) {
                turn = 0
            }
            push()
            translate(width / 2, (height / 8) - 50)
            for (i = 0; i < playersHands[turn].length; i++) {
                push()
                rotateFrom = map(i, 0, playersHands[turn].length, 2.3, 4)
                rotate(rotateFrom)
                image(uno, 0, -100, cwidth, cheight, backCardx, backCardy, cBackWidth, cBackHeight)
                pop()
            }
            text("player " + turn, -25, 0)
            pop()
            if (turn == 0) {
                turn = 1
            }
            else if (turn == 1) {
                turn = 0
            }
        }

        else if (playernum == 3) {
            turn += 1
            if (turn == 3) {
                turn = 0
            }

            push()
            translate(width / 4, height / 4)
            for (i = 0; i < playersHands[turn].length; i++) {
                push()
                rotateFrom = map(i, 0, playersHands[turn].length, 1.5, 3.2)
                rotate(rotateFrom)
                image(uno, 0, -100, cwidth, cheight, backCardx, backCardy, cBackWidth, cBackHeight)
                pop()
            }
            text("player " + turn, -25, 0)
            pop()

            if (turn == 0) {
                turn = 2
            }
            else if (turn != 0) {
                turn -= 1
            }

            turn += 2

            if (turn > 2) {
                turn -= 3
            }

            push()
            translate(width * (3 / 4), height / 4)
            for (i = 0; i < playersHands[turn].length; i++) {
                push()
                rotateFrom = map(i, 0, playersHands[turn].length, 3.2, 4.9)
                rotate(rotateFrom)
                image(uno, 0, -100, cwidth, cheight, backCardx, backCardy, cBackWidth, cBackHeight)
                pop()
            }
            text("player " + turn, -25, 0)
            pop()

            if (turn < 2) {
                turn += 1
            }
            else if (turn == 2) {
                turn = 0
            }
        }

        else if (playernum == 4) {
            turn += 1
            if (turn == 4) {
                turn = 0
            }
            push()
            translate(width / 6, height / 2)
            for (i = 0; i < playersHands[turn].length; i++) {
                push()
                rotateFrom = map(i, 0, playersHands[turn].length, 1, 2.7)
                rotate(rotateFrom)
                image(uno, 0, -100, cwidth, cheight, backCardx, backCardy, cBackWidth, cBackHeight)
                pop()
            }
            text("player " + turn, -25, 0)
            pop()
            if (turn == 0) {
                turn = 3
            }
            else if (turn != 0) {
                turn -= 1
            }

            turn += 2
            if (turn > 3) {
                turn -= 4
            }

            push()
            translate(width / 2, (height / 8) - 50)
            for (i = 0; i < playersHands[turn].length; i++) {
                push()
                rotateFrom = map(i, 0, playersHands[turn].length, 2.3, 4)
                rotate(rotateFrom)
                image(uno, 0, -100, cwidth, cheight, backCardx, backCardy, cBackWidth, cBackHeight)
                pop()
            }
            text("player " + turn, -25, 0)
            pop()
            if (turn < 2) {
                turn += 2
            }
            else if (turn >= 2) {
                turn -= 2
            }

            turn += 3
            if (turn != 3) {
                turn -= 4
            }
            push()
            translate(width * (3 / 4), height / 2)
            for (i = 0; i < playersHands[turn].length; i++) {
                push()
                rotateFrom = map(i, 0, playersHands[turn].length, 3.8, 5.5)
                rotate(rotateFrom)
                image(uno, 0, -100, cwidth, cheight, backCardx, backCardy, cBackWidth, cBackHeight)
                pop()
            }
            text("player " + turn, -25, 0)
            pop()

            if (turn != 3) {
                turn += 1
            }
            else if (turn == 3) {
                turn -= 3
            }
        }
    }




    else if (EndGame == true) {
        text("player " + turn + " won the game", width / 2 - 100, height / 2 - 100, 200, 50)
    }
}





function sortHand() {

    for (j = 0; j < playernum; j++) {
        for (i = 0; i < playersHands[j].length; i++) {
            if (playersHands[j][i][0] == 4) {
                playersHands[j][i][0] = -1
            }
            else if (playersHands[j][i][1] == 9) {
                playersHands[j][i][1] = -1
            }
        }
    }

    for (i = 0; i < playernum; i++) {
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

    for (j = 0; j < playernum; j++) {
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




function mouseClicked() {
    if (EndGame == false) {
        if (drawCardP == 0) {
            if (ChangeColourMode == false) {
                playCard()
                drawCard()
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
                        ChangeColourMode = false
                        if (turnClockWise == true) {
                            turn += 1

                        }
                        else if (turnClockWise == false) {
                            turn -= 1
                        }
                        drawCardP += 4
                        DrawPowerCard()
                    }
                    else if (yellow == true && white == false) {
                        discardPile[discardPile.length - 1][1] += 4
                        ChangeColourMode = false
                        if (turnClockWise == true) {
                            turn += 1
                        }
                        else if (turnClockWise == false) {
                            turn -= 1
                        }
                        drawCardP += 4
                        DrawPowerCard()
                    }
                    else if (green == true && white == false) {
                        discardPile[discardPile.length - 1][1] += 2
                        ChangeColourMode = false
                        if (turnClockWise == true) {
                            turn += 1
                        }
                        else if (turnClockWise == false) {
                            turn -= 1
                        }
                        drawCardP += 4
                        DrawPowerCard()
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
                        drawCardP += 4
                        DrawPowerCard()
                    }
                }


                else if (discardPile[discardPile.length - 1][1] == 0) {
                    if (red == true && white == false) {
                        discardPile[discardPile.length - 1][1] += 1
                        ChangeColourMode = false
                        if (turnClockWise == true) {
                            turn += 1
                        }
                        else if (turnClockWise == false) {
                            turn -= 1
                        }
                    }
                    else if (yellow == true && white == false) {
                        discardPile[discardPile.length - 1][1] += 4
                        ChangeColourMode = false
                        if (turnClockWise == true) {
                            turn += 1
                        }
                        else if (turnClockWise == false) {
                            turn -= 1
                        }
                    }
                    else if (green == true && white == false) {
                        discardPile[discardPile.length - 1][1] += 2
                        ChangeColourMode = false
                        if (turnClockWise == true) {
                            turn += 1
                        }
                        else if (turnClockWise == false) {
                            turn -= 1
                        }
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
                        ChangeColourMode = false
                        if (turnClockWise == true) {
                            turn += 1

                        }
                        else if (turnClockWise == false) {
                            turn -= 1
                        }
                        drawCardP += 4
                        DrawPowerCard()
                    }
                    else if (yellow == true && white == false) {
                        discardPile[discardPile.length - 1][1] += 4
                        ChangeColourMode = false
                        if (turnClockWise == true) {
                            turn += 1
                        }
                        else if (turnClockWise == false) {
                            turn -= 1
                        }
                        drawCardP += 4
                        DrawPowerCard()
                    }
                    else if (green == true && white == false) {
                        discardPile[discardPile.length - 1][1] += 2
                        ChangeColourMode = false
                        if (turnClockWise == true) {
                            turn += 1
                        }
                        else if (turnClockWise == false) {
                            turn -= 1
                        }
                        drawCardP += 4
                        DrawPowerCard()
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
                        drawCardP += 4
                        DrawPowerCard()
                    }
                }
            }
            playCard()
        }
    }
}


function playCard() {
    if (drawCardP == 0) {
        if (cardNumber != -2) {
            if (playersHands[turn][cardNumber][0] == 4) {
                discardPile.push(playersHands[turn].splice(cardNumber, 1)[0])
                CheckPlayerWin()
                cardEffect(discardPile[discardPile.length - 1][1])
            }

            else if (playersHands[turn][cardNumber][0] == discardPile[discardPile.length - 1][0] || (discardPile[discardPile.length - 1][0] == 4 && (discardPile[discardPile.length - 1][1] - 1 == playersHands[turn][cardNumber][0] || discardPile[discardPile.length - 1][1] - 6 == playersHands[turn][cardNumber][0]))) {
                discardPile.push(playersHands[turn].splice(cardNumber, 1)[0])
                CheckPlayerWin()
                cardEffect(discardPile[discardPile.length - 1][1])
            }

            else if (playersHands[turn][cardNumber][1] == discardPile[discardPile.length - 1][1]) {
                discardPile.push(playersHands[turn].splice(cardNumber, 1)[0])
                CheckPlayerWin()
                cardEffect(discardPile[discardPile.length - 1][1])
            }
            socket.emit("playCard", { discardedCard: discardPile[discardPile.length - 1] })
        }
    }

    else if (drawCardP != 0) {
        if (cardNumber != -2) {
            if (playersHands[turn][cardNumber][0] == 4 && playersHands[turn][cardNumber][1] == 5) {
                console.log("attempting to discard during draw phase")
                discardPile.push(playersHands[turn].splice(cardNumber, 1)[0])
                CheckPlayerWin()
                cardEffect(discardPile[discardPile.length - 1][1])
            }
            else if (playersHands[turn][cardNumber][1] == 10) {
                console.log("attempting to discard during draw phase")
                discardPile.push(playersHands[turn].splice(cardNumber, 1)[0])
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
        }
        else {
            turnClockWise = true
        }
    }

    else if (effect == 12) {
        if (turnClockWise == true) {
            turn += 1
        }
        else if (turnClockWise == false) {
            turn -= 1
        }
    }

    if (turnClockWise == true && ChangeColourMode == false) {
        if (effect != 11) {
            turn += 1
        }
        else if (effect == 11 && playernum != 2) {
            turn -= 1
        }

        if ((effect == 5 && discardPile[discardPile.length - 1][0] == 4) || effect == 10) {
            DrawPowerCard()
        }
    }
    else if (turnClockWise == false && ChangeColourMode == false) {
        if (effect != 11) {
            turn -= 1
        }
        else if (effect == 11 && playernum != 2) {
            turn -= 1
        }

        if ((effect == 5 && discardPile[discardPile.length - 1][0] == 4) || effect == 10) {
            DrawPowerCard()
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
        playersHands[turn].push(deck.pop())
        sortHand()
        if (turnClockWise == true) {
            turn += 1
        }
        else if (turnClockWise == false) {
            turn -= 1
        }
    }
}

function PlayerManager() {
    if (turn < 0) {
        turn += playernum
    }
    else if (turn > playernum - 1) {
        turn -= playernum
    }
}

function DrawPowerCard() {
    PlayerManager()
    console.log(turn)
    for (i = 0; i < playersHands[turn].length; i++) {
        console.log(playersHands[turn][i])
        if (playersHands[turn][i][1] == 10 || ((playersHands[turn][i][0] == 4 && playersHands[turn][i][1] == 5))) {
            break
        }
        else if (playersHands[turn][i][1] != 10 || !(playersHands[turn][i][0] == 4 && playersHands[turn][i][1] == 5)) {

            if (i == playersHands[turn].length - 1) {

                for (j = 0; j < drawCardP; j++) {
                    console.log(deck[deck.length - 1])
                    playersHands[turn].push(deck.pop())
                }
                sortHand()
                drawCardP = 0

                if (turnClockWise == true) {
                    turn += 1
                    break
                }

                else if (turnClockWise == false) {
                    turn -= 1
                    break
                }
            }
        }
    }
}

function CheckPlayerWin() {
    if (playersHands[turn].length == 0) {
        EndGame = true
        if (turnClockWise == true) {
            turn -= 1
        }
        else if (turnClockWise == false) {
            turn += 1
        }
    }
}

// function DrawPowerCard() {
//     console.log("checking if the player needs to draw a card")
//     for (i = 0; i < playersHands[turn].length; i++) {
//         console.log(playersHands[turn][i])

//         if (playersHands[turn][i][1] != 10 || !(playersHands[turn][i][0] == 4 && playersHands[turn][i][1] == 5)) {
//             console.log(i)
//             console.log(playersHands[turn].length - 1)
//             if (i == playersHands[turn].length - 1) {

//                 console.log("player " + turn + " will be drawing " + drawCardP + " cards")
//                 for (j = 0; j < drawCardP; j++) {
//                     console.log(deck[deck.length - 1])
//                     playersHands[turn].push(deck.pop())
//                 }
//                 sortHand()
//                 drawCardP = 0
//                 turn += 1
//                 break

//             }
//         }
//         else if (playersHands[turn][i][1] == 10 || ((playersHands[turn][i][0] == 4 && playersHands[turn][i][1] == 5))) {
//             console.log("player doesnt draw cards")
//             break
//         }
//     }
// }

socket.on("playCard", (data) => {
    console.log("card played", data)
})