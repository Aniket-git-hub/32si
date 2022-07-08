class Spot {
    constructor(context, x, y, boardPosition, neighbours) {
        this.x = x;
        this.y = y;
        this.context = context
        this.boardPosition = boardPosition;
        this.isOccupied = false;
        this.piece = null;
        this.radius = 12;
        this.neighbours = neighbours;
        this.possibleMove = false;

        this.draw()
    }

    draw() {
        if (this.possibleMove) {
            this.context.beginPath();
            this.context.fillStyle = "green";
            this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            this.context.fill();
            this.context.stroke()
        } else {
            this.context.beginPath();
            this.context.fillStyle = "#fff";
            this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            this.context.fill();
        }
    }

    drawRelationLines(board) {
        this.neighbours.forEach(neighbour => {
            let [indexI, indexJ] = neighbour.split('')
            let spot = board[indexI][indexJ]
            this.context.beginPath();
            this.context.strokeStyle = "#fff";
            this.context.moveTo(this.x, this.y);
            this.context.lineTo(spot.x, spot.y);
            this.context.stroke();
        })
    }

    getPiece() {
        return this.piece;
    }

    addPiece(piece) {
        this.isOccupied = true;
        this.piece = piece;
    }

    removePiece() {
        this.isOccupied = false;
        this.piece = null;
        this.draw()
    }

    clicked(mouseX, mouseY) {
        const distance = Math.hypot(mouseX - this.x, mouseY - this.y);
        if (distance < this.radius) return true
        return false
    }

    isPossibleMove(isIt) {
        this.possibleMove = isIt
        this.draw()
    }

    showPossibleMoves(board) {
        let possibleJumps = []
        let [myI, myJ] = this.boardPosition.split('')

        for (let i = 0; i < this.neighbours.length; i++) {
            let [indexI, indexJ] = this.neighbours[i].split('')
            let spot = board[indexI][indexJ]
            // if any of the neighbours is empty, it is a possible move
            if (spot.isOccupied == false) spot.isPossibleMove(true)
            // if the neighbour is occupied, it is a possible jump if it is not the same colour as the current piece
            else {
                // if the spot's piece is of same color as the current spot's piece move to next iteration
                if (spot.piece.isRed === this.piece.isRed) continue
                // if the neighbour is not the same colour as the current piece, it is a possible jump
                spot.neighbours.forEach(neighbour => {
                    let [neighbourIndexI, neighbourIndexJ] = neighbour.split('')
                    let neighbouringSpot = board[neighbourIndexI][neighbourIndexJ]
                    //if the neighbour's neighbour is not empty, just return 
                    if (neighbouringSpot.isOccupied) return
                    // checking the neighbouring spot which are in the same row or column as the current piece
                    if (myI == indexI || myJ == indexJ) {
                        // checking if the neighbouring spot's neighbour is in the same row or column as the current piece
                        // if it is, it is a possible jump
                        if (myI == indexI && indexI == neighbourIndexI || myJ == indexJ && indexJ == neighbourIndexJ) {
                            neighbouringSpot.isPossibleMove(true)
                            possibleJumps.push({
                                through: spot.boardPosition,
                                to: neighbouringSpot.boardPosition,
                            })
                        }
                    } else {
                        // checking neighbour's neighbour which are not in same row or column as the current neighbour or current piece
                        // if it is, it is a possible jump
                        if ((indexI !== neighbourIndexI && indexJ !== neighbourIndexJ) &&
                            (myI !== neighbourIndexI && myJ !== neighbourIndexJ)) {
                            neighbouringSpot.isPossibleMove(true)
                            possibleJumps.push({
                                through: spot.boardPosition,
                                to: neighbouringSpot.boardPosition,
                            })
                        }
                    }
                })
            }
        }

        return possibleJumps
    }

    hidePossibleMoves(board) {
        let [myI, myJ] = this.boardPosition.split('')
        this.neighbours.forEach(neighbour => {
            let [indexI, indexJ] = neighbour.split('')
            let spot = board[indexI][indexJ]
            if (spot.isOccupied == false) {
                spot.isPossibleMove(false)
            } else {
                spot.neighbours.forEach(neighbour => {
                    let [neighbourIndexI, neighbourIndexJ] = neighbour.split('')
                    let neighbouringSpot = board[neighbourIndexI][neighbourIndexJ]

                    if (myI == indexI || myJ == indexJ) {
                        if ((myI == neighbourIndexI || myJ == neighbourIndexJ) &&
                            neighbouringSpot.isOccupied == false)
                            neighbouringSpot.isPossibleMove(false)

                    } else {
                        if ((indexI !== neighbourIndexI && indexJ !== neighbourIndexJ) &&
                            (myI !== neighbourIndexI && myJ !== neighbourIndexJ) &&
                            neighbouringSpot.isOccupied == false
                        )
                            neighbouringSpot.isPossibleMove(false)

                    }
                })
            }
        })
    }


}
