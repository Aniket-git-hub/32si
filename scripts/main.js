const blueScore = document.getElementById('blueScore')
const redScore = document.getElementById('redScore')
const turnContainer = document.getElementById('turnContainer')
const newGame = document.getElementById('newGame')
const games = document.getElementById('games')

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const BOARD_SIZE = 190;
let RED = 16
let BLUE = 16
let TURN = true
const previousGames = []
/**
 * @type {Spot}
 */
let CURRENTLY_SELECTED_SPOT = null
let way = null

const BOARD = createBoard(ctx, BOARD_SIZE);

const dialog = document.getElementById('dialog')
const winner = document.getElementById('winner')
const close = document.getElementById("close")
close.addEventListener("click", () => {
    dialog.classList.toggle('hide')
})
turnContainer.style.setProperty("--turn", "rgb(237, 25, 78)")
turnContainer.innerText = "RED"

showPreviousGames()

drawRelationLines()
addPiecesToBoard()

function addPiecesToBoard() {    
    for (let i = 0; i < BOARD.length; i++) {
        if (i <= 3)
            for (let j = 0; j < BOARD[i].length; j++) {
                let spot = BOARD[i][j];
                if (spot != 0) spot.addPiece(new Piece(ctx, spot.x, spot.y, false));
            }
        if (i >= 5)
            for (let j = 0; j < BOARD[i].length; j++) {
                let spot = BOARD[i][j];
                if (spot != 0) spot.addPiece(new Piece(ctx, spot.x, spot.y, true));
            }
    }   
}

function createBoard(context, size) {
    let x = WIDTH / 2;
    let y = HEIGHT / 2;

    const sizes = [
        [
            { x: 0, y: 0 },
            { x: x - size / 2, y: y - size - size / 2 },
            { x: x, y: y - size - size / 2 },
            { x: x + size / 2, y: y - size - size / 2 },
            { x: 0, y: 0 },
        ],
        [
            { x: 0, y: 0 },
            { x: x - size / 4, y: y - size - size / 4 },
            { x: x, y: y - size - size / 4 },
            { x: x + size / 4, y: y - size - size / 4 },
            { x: 0, y: 0 },
        ],
        [
            { x: x - size, y: y - size },
            { x: x - size / 2, y: y - size },
            { x: x, y: y - size },
            { x: x + size / 2, y: y - size },
            { x: x + size, y: y - size },
        ],
        [
            { x: x - size, y: y - size / 2 },
            { x: x - size / 2, y: y - size / 2 },
            { x: x, y: y - size / 2 },
            { x: x + size / 2, y: y - size / 2 },
            { x: x + size, y: y - size / 2 },
        ],
        [
            { x: x - size, y: y },
            { x: x - size / 2, y: y },
            { x: x, y: y },
            { x: x + size / 2, y: y },
            { x: x + size, y: y },
        ],
        [
            { x: x - size, y: y + size / 2 },
            { x: x - size / 2, y: y + size / 2 },
            { x: x, y: y + size / 2 },
            { x: x + size / 2, y: y + size / 2 },
            { x: x + size, y: y + size / 2 },
        ],
        [
            { x: x - size, y: y + size },
            { x: x - size / 2, y: y + size },
            { x: x, y: y + size },
            { x: x + size / 2, y: y + size },
            { x: x + size, y: y + size },
        ],
        [
            { x: 0, y: 0 },
            { x: x - size / 4, y: y + size + size / 4 },
            { x: x, y: y + size + size / 4 },
            { x: x + size / 4, y: y + size + size / 4 },
            { x: 0, y: 0 },
        ],
        [
            { x: 0, y: 0 },
            { x: x - size / 2, y: y + size + size / 2 },
            { x: x, y: y + size + size / 2 },
            { x: x + size / 2, y: y + size + size / 2 },
            { x: 0, y: 0 },
        ],
    ];

    const relations = {
        "01": ["02", "11"],
        "02": ["01", "03", "12"],
        "03": ["02", "13"],
        "11": ["01", "12", "22"],
        "12": ["02", "11", "13", "22"],
        "13": ["03", "12", "22"],
        "20": ["21", "30", "31"],
        "21": ["20", "22", "31"],
        "22": ["21", "31", "32", "33", "23", "12", "11", "13"],
        "23": ["22", "24", "33"],
        "24": ["23", "33", "34"],
        "30": ["20", "31", "40"],
        "31": ["20", "21", "22", "32", "42", "41", "40", "30"],
        "32": ["22", "31", "42", "33"],
        "33": ["22", "23", "24", "34", "44", "43", "42", "32"],
        "34": ["24", "33", "44"],
        "40": ["30", "31", "41", "51", "50"],
        "41": ["31", "40", "51", "42"],
        "42": ["41", "31", "32", "33", "43", "53", "52", "51"],
        "43": ["42", "33", "44", "53"],
        "44": ["33", "34", "43", "53", "54"],
        "50": ["40", "51", "60"],
        "51": ["40", "41", "42", "50", "52", "60", "61", "62"],
        "52": ["51", "42", "53", "62"],
        "53": ["42", "43", "44", "52", "54", "62", "63", "64"],
        "54": ["44", "53", "64"],
        "60": ["50", "51", "61"],
        "61": ["51", "60", "62"],
        "62": ["51", "52", "53", "61", "63", "71", "72", "73"],
        "63": ["62", "53", "64"],
        "64": ["53", "54", "63"],
        "71": ["62", "72", "81"],
        "72": ["62", "71", "73", "82"],
        "73": ["62", "72", "83"],
        "81": ["71", "82"],
        "82": ["72", "81", "83"],
        "83": ["73", "82"],
    };

    const board = [];
    for (let i = 0; i <= 8; i++) {
        board[i] = [];
        if (i >= 2 && i <= 6)
            for (let j = 0; j <= 4; j++)
                board[i][j] = new Spot(
                    context,
                    sizes[i][j].x,
                    sizes[i][j].y,
                    `${i}${j}`,
                    relations[`${i}${j}`]
                );
        else
            for (let j = 0; j <= 4; j++)
                if (j > 0 && j <= 3) 
                    board[i][j] = new Spot(
                        context,
                        sizes[i][j].x,
                        sizes[i][j].y,
                        `${i}${j}`,
                        relations[`${i}${j}`]
                    );
                else board[i][j] = 0;
    }
    return board;
}

function drawRelationLines() {
    for (let i = 0; i <= 8; i++)
        for (let j = 0; j <= 4; j++)
            if (BOARD[i][j] != 0)
                BOARD[i][j].drawRelationLines(BOARD);
}

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    for (let i = 0; i < BOARD.length; i++) {
        for (let j = 0; j < BOARD[i].length; j++) {
            let spot = BOARD[i][j];
            if (spot != 0) 
                if (spot.isOccupied) {    
                    if (spot.piece.isClicked(x, y)) 
                        decideTurn(spot)
                } else {
                    if (spot.clicked(x, y)) 
                        movePiece(spot)
                    
                }
        }
    }
})

newGame.addEventListener("click", () => {
    BOARD.forEach(col => {
        col.forEach(spot => {
            if(spot.isOccupied == true) spot.removePiece()
        })
    })
    addPiecesToBoard()
    RED = 16
    BLUE = 16
    updateScore()
})


function updateTurn() {
    TURN ? TURN = false : TURN = true
    if (TURN) {
        turnContainer.style.setProperty("--turn", "rgb(237, 25, 78)")
        turnContainer.innerText = "RED"
    } else {
        turnContainer.style.setProperty("--turn", "rgb(80, 150, 249)")
        turnContainer.innerText = "BLUE"
    }
}

function decideTurn(spot) {
    if (TURN == true) {
        if (spot.piece.isRed == true) possibleMoves(spot)
        else {    
            hideMoves()
            alert("Blue cannot move ")
        } 
    } else {
        if (spot.piece.isRed === false) possibleMoves(spot)
        else {
            hideMoves()
            alert("Red cannot move ")      
        } 
    }
}

function hideMoves() {
    if (CURRENTLY_SELECTED_SPOT != null) CURRENTLY_SELECTED_SPOT.hidePossibleMoves(BOARD)
}

function possibleMoves(spot) {
    hideMoves()
    CURRENTLY_SELECTED_SPOT = spot
    way = CURRENTLY_SELECTED_SPOT.showPossibleMoves(BOARD)
}

function movePiece(newSpot) {
    if (newSpot.possibleMove == true) {
        CURRENTLY_SELECTED_SPOT.hidePossibleMoves(BOARD)
        CURRENTLY_SELECTED_SPOT.piece.newPosition(newSpot.x, newSpot.y)
        newSpot.addPiece(CURRENTLY_SELECTED_SPOT.piece)
        CURRENTLY_SELECTED_SPOT.removePiece()
        killPiece(way.filter(w => w.to === newSpot.boardPosition)[0]?.through)
        updateTurn()
    }
}

function killPiece(targetSpot) {
    if(targetSpot == undefined) return 
    let [i, j] = targetSpot.split('')
    let spot = BOARD[i][j]
    if (spot.piece.isRed) {
        RED--
        updateScore()
        spot.removePiece()
        navigator.vibrate(100)
    } else {
        BLUE--
        updateScore()
        spot.removePiece()
        navigator.vibrate(100)
        
    }
}

function showPreviousGames() {
    if (previousGames.length > 0) {  
        if (previousGames.length == 1) games.innerHTML = ``
        games.innerHTML = ``
        previousGames.forEach(game => {
            games.innerHTML += `<li><h4>${game.winner} ${game.red} - ${game.blue}<h4><li>`
        })
    } else 
        games.innerHTML += `<li><h4>-<h4><li>`
}


function updateScore() {
    blueScore.innerText = BLUE
    redScore.innerText = RED
    
    if (BLUE == 0 && RED >= 1) {
        dialog.classList.toggle('hide')    
        winner.textContent = `RED! Won This Game`
        previousGames.push({
            winner: "RED",
            red:RED,
            blue:BLUE
        })
        showPreviousGames()
    } else if (RED == 0 && BLUE >= 1) {
        dialog.classList.toggle('hide')
        winner.textContent = `BLUE! Won This Game`
        previousGames.push({
            winner: "BLUE",
            red:RED,
            blue:BLUE
        })
        showPreviousGames()
    }
}