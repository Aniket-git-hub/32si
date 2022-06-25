const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const BOARD_SIZE = 280

const BOARD = createBoard(ctx, BOARD_SIZE)

console.table(BOARD)

for (let i = 0; i < BOARD.length; i++) {
    if (i <= 3) 
        for (let j = 0; j < BOARD[i].length; j++) {
            let spot = BOARD[i][j]
            spot.addPiece(new Piece(ctx, spot.x, spot.y, false))
        }
            
    if (i >= 5)
        for (let j = 0; j < BOARD[i].length; j++) {
            let spot = BOARD[i][j]
            spot.addPiece(new Piece(ctx, spot.x, spot.y, true))
        } 
}

function createBoard(context, size) {
    square(context, size);
    drawBoard(size);
    
    let x = WIDTH / 2;
    let y = HEIGHT / 2;

    const sizes = [
        [
            { x:x - size / 2,   y:y - size - size / 2},
            { x:x,              y:y - size - size / 2},
            { x:x + size / 2,   y:y - size - size / 2}
        ],
        [
            { x:x - size / 4,   y:y - size - size / 4},
            { x:x,              y:y - size - size / 4},
            { x:x + size / 4,   y:y - size - size / 4}
        ],
        [
            { x:x - size,       y: y - size},
            { x:x - size / 2,   y: y - size},
            { x:x,              y: y - size},
            { x:x + size / 2 ,  y: y - size},
            { x:x + size,       y: y - size},
        ],
        [
            { x:x - size,       y: y - size / 2},
            { x:x - size / 2 ,  y: y - size / 2},
            { x:x,              y: y - size / 2},
            { x:x + size / 2,   y: y - size / 2},
            { x:x + size,       y: y - size / 2},
        ],
        [
            { x:x - size,       y: y},
            { x:x - size / 2 ,  y: y},
            { x:x,              y: y},
            { x:x + size / 2,   y: y},
            { x:x + size,       y: y},
        ],
        [
            { x:x - size,       y: y + size / 2},
            { x:x - size / 2 ,  y: y + size / 2},
            { x:x,              y: y + size / 2},
            { x:x + size / 2,   y: y + size / 2},
            { x:x + size,       y: y + size / 2},
        ],
        [
            { x:x - size,       y: y + size},
            { x:x - size / 2 ,  y: y + size},
            { x:x,              y: y + size},
            { x:x + size / 2,   y: y + size},
            { x:x + size,       y: y + size},
        ],
        [
            { x:x - size / 2,   y:y + size + size / 2},
            { x:x,              y:y + size + size / 2},
            { x:x + size / 2,   y:y + size + size / 2}
        ],
        [
            { x:x - size / 4,   y:y + size + size / 4},
            { x:x,              y:y + size + size / 4},
            { x:x + size / 4,   y:y + size + size / 4}
        ]
    ]
    
    const board = []
    for (let i = 0; i <= 8; i++) {
        board[i] = []
        if (i >= 2 && i <= 6) 
            for (let j = 0; j <= 4; j++)
                board[i][j] = new Spot(context, sizes[i][j].x, sizes[i][j].y)
         else 
            for (let j = 0; j <= 2; j++)
                board[i][j] = new Spot(context, sizes[i][j].x, sizes[i][j].y)   
    }

    return board
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    for (let i = 0; i < BOARD.length; i++) {
        for (let j = 0; j < BOARD[i].length; j++) {
            let spot = BOARD[i][j]
            if (spot.isOccupied) {
                if (spot.piece.clicked(x, y)) {
                    let neighbours = spot.checkNeighbouringSpot(BOARD, i, j)
                    // spot.showPossibleMoves(neighbours)
                    console.log(neighbours)
                }
            } else {
                spot.clicked(x, y)   
            } 
        }           
    }
})

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
    drawLine(x, (y - size) - sizeOfThreeParts, x, (y + size) + sizeOfThreeParts);
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
    drawLine(x, y - size, x - sizeOfThreeParts, (y - size) - sizeOfThreeParts);
    drawLine(x, y - size, x + sizeOfThreeParts, (y - size) - sizeOfThreeParts);
    drawLine(x - sizeOfThreeParts, (y - size) - sizeOfThreeParts, x + sizeOfThreeParts, (y - size) - sizeOfThreeParts);
    // ||
    // drawing the triangle bisector 
    drawLine(x, y - size - sizeOfThreeParts / 2, x - sizeOfThreeParts / 2, y - size - sizeOfThreeParts / 2)
    drawLine(x, y - size - sizeOfThreeParts / 2, (x + sizeOfThreeParts / 2), y - size - sizeOfThreeParts / 2)

    // bottom triangle
    drawLine(x, y + size, x - sizeOfThreeParts, (y + size) + sizeOfThreeParts);
    drawLine(x, y + size, x + sizeOfThreeParts, (y + size) + sizeOfThreeParts);
    drawLine(x - sizeOfThreeParts, (y + size) + sizeOfThreeParts, x + sizeOfThreeParts, (y + size) + sizeOfThreeParts);
    // ||
    // drawing the triangle bisector 
    drawLine(x, y + size + sizeOfThreeParts / 2, x + sizeOfThreeParts / 2, y + size + sizeOfThreeParts / 2)
    drawLine(x, y + size + sizeOfThreeParts / 2, (x - sizeOfThreeParts / 2), y + size + sizeOfThreeParts / 2)
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

    context.strokeStyle = '#fff';
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

function drawCircle(context, x, y, radius, startAngle = 0, endAngle = 2 * Math.PI) {
    context.beginPath();
    context.arc(x, y, radius, startAngle, endAngle);
    context.stroke();
} 