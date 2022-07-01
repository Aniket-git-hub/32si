const blueScore = document.getElementById('blueScore')
const redScore = document.getElementById('redScore')

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const BOARD_SIZE = 280;
const BOARD = createBoard(ctx, BOARD_SIZE);
let RED = 16
let BLUE = 16

/**
 * @type {Spot}
 */
let CURRENTLY_SELECTED_SPOT = null


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

function createBoard(context, size) {
    square(context, size);
    drawBoard(size);

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


canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    for (let i = 0; i < BOARD.length; i++) {
        for (let j = 0; j < BOARD[i].length; j++) {
            let spot = BOARD[i][j];
            if (spot != 0) 
                if (spot.isOccupied) {    
                    if (spot.piece.isClicked(x, y)) {
                        possibleMoves(spot)
                    } 
                } else {
                    if (spot.clicked(x, y)) {
                        movePiece(spot)
                    }
                }
        }
    }
})

function possibleMoves(spot) {
    if (CURRENTLY_SELECTED_SPOT != null) CURRENTLY_SELECTED_SPOT.hidePossibleMoves(BOARD)
    CURRENTLY_SELECTED_SPOT = spot
    CURRENTLY_SELECTED_SPOT.showPossibleMoves(BOARD)
}

function movePiece(newSpot) {
    if (newSpot.possibleMove == true) {
        CURRENTLY_SELECTED_SPOT.piece.newPosition(newSpot.x, newSpot.y)
        newSpot.addPiece(CURRENTLY_SELECTED_SPOT.piece)
        CURRENTLY_SELECTED_SPOT.removePiece()
        CURRENTLY_SELECTED_SPOT.hidePossibleMoves(BOARD)
    }
}

function killPiece(spot) {
    if (PREVIOUSLY_SELECTED_SPOT.neighbours.includes(spot.boardPosition) == false) {
        PREVIOUSLY_SELECTED_SPOT.neighbours.forEach(neighbour => {
            let [i, j] = neighbour.split('')
            let neighbouringSpot = BOARD[i][j]
            if (neighbouringSpot.neighbours.includes(spot.boardPosition) && neighbouringSpot.isOccupied) {
                neighbouringSpot.removePiece()
            }
        })
    }
}


function updateScore() {
    blueScore.innerText = BLUE
    redScore.innerText = RED
    console.log("Red: " + RED, "Blue: " + BLUE)
    
}

function drawBoard(size) {
    let x = WIDTH / 2;
    let y = HEIGHT / 2;
    let sizeOfThreeParts = size / 2;
    // horizontal lines
    drawLine(x - size, y + sizeOfThreeParts, x + size, y + sizeOfThreeParts);
    drawLine(x - size, y, x + size, y);
    drawLine(x - size, y - sizeOfThreeParts, x + size, y - sizeOfThreeParts);

    // vertical lines
    drawLine(x - sizeOfThreeParts, y - size, x - sizeOfThreeParts, y + size);
    drawLine(x, y - size - sizeOfThreeParts, x, y + size + sizeOfThreeParts);
    drawLine(x + sizeOfThreeParts, y - size, x + sizeOfThreeParts, y + size);

    // diagonal line
    drawLine(x - size, y - size, x + size, y + size);
    drawLine(x + size, y - size, x - size, y + size);

    // internal square
    drawLine(x - size, y, x, y + size);
    drawLine(x, y + size, x + size, y);
    drawLine(x, y - size, x + size, y);
    drawLine(x, y - size, x - size, y);

    // top triangle
    drawLine(x, y - size, x - sizeOfThreeParts, y - size - sizeOfThreeParts);
    drawLine(x, y - size, x + sizeOfThreeParts, y - size - sizeOfThreeParts);
    drawLine(
        x - sizeOfThreeParts,
        y - size - sizeOfThreeParts,
        x + sizeOfThreeParts,
        y - size - sizeOfThreeParts
    );
    // ||
    // drawing the triangle bisector
    drawLine(
        x,
        y - size - sizeOfThreeParts / 2,
        x - sizeOfThreeParts / 2,
        y - size - sizeOfThreeParts / 2
    );
    drawLine(
        x,
        y - size - sizeOfThreeParts / 2,
        x + sizeOfThreeParts / 2,
        y - size - sizeOfThreeParts / 2
    );

    // bottom triangle
    drawLine(x, y + size, x - sizeOfThreeParts, y + size + sizeOfThreeParts);
    drawLine(x, y + size, x + sizeOfThreeParts, y + size + sizeOfThreeParts);
    drawLine(
        x - sizeOfThreeParts,
        y + size + sizeOfThreeParts,
        x + sizeOfThreeParts,
        y + size + sizeOfThreeParts
    );
    // ||
    // drawing the triangle bisector
    drawLine(
        x,
        y + size + sizeOfThreeParts / 2,
        x + sizeOfThreeParts / 2,
        y + size + sizeOfThreeParts / 2
    );
    drawLine(
        x,
        y + size + sizeOfThreeParts / 2,
        x - sizeOfThreeParts / 2,
        y + size + sizeOfThreeParts / 2
    );
}

/**
 *
 * @param {Number} size - size of the sides of the square
 * @description - creates a sqaure on the canvas when the size is passed.
 * Caution - It us dependent on the width and height of the canvas
 */
function square(context, size, strokeSize = 2) {
    const x = WIDTH / 2;
    const y = HEIGHT / 2;

    context.strokeStyle = "#fff";
    context.beginPath();
    context.lineWidth = strokeSize;
    context.moveTo(x - size, y - size); // top left
    context.lineTo(x + size, y - size); // top right
    context.lineTo(x + size, y + size); // bottom right
    context.lineTo(x - size, y + size); // bottom left
    context.lineTo(x - size, y - size); // top left
    context.stroke();
}

/**
 *
 * @param {Number} startX - From where the line starts X cord
 * @param {Number} startY - From Where the line starts Y cord
 * @param {Number} endX - Where the line ends X cord
 * @param {Number} endY - Where the line ends Y cord
 */
function drawLine(startX, startY, endX, endY, strokeSize = 2) {
    ctx.beginPath();
    ctx.lineWidth = strokeSize;
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}

function drawCircle(
    context,
    x,
    y,
    radius,
    startAngle = 0,
    endAngle = 2 * Math.PI
) {
    context.beginPath();
    context.arc(x, y, radius, startAngle, endAngle);
    context.stroke();
}
