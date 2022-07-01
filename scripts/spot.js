class Spot {
    constructor(context, x, y, boardPosition, neighbours) {
        this.x = x;
        this.y = y;
        this.context = context
        this.boardPosition = boardPosition;
        this.isOccupied = false;
        this.piece = null;
        this.radius = 15;
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
        let [myI, myJ] = this.boardPosition.split('')

        for (let i = 0; i < this.neighbours.length; i++) {
            let [indexI, indexJ] = this.neighbours[i].split('')
            let spot = board[indexI][indexJ]

            if (spot.isOccupied == false) {
                spot.isPossibleMove(true)
            } else {
                if (spot.piece.isRed !== this.piece.isRed) 
                    spot.neighbours.forEach(neighbour => {
                        let [neighbourIndexI, neighbourIndexJ] = neighbour.split('')
                        let neighbouringSpot = board[neighbourIndexI][neighbourIndexJ]

                        if (myI == indexI || myJ == indexJ) {
                            if ((myI == neighbourIndexI || myJ == neighbourIndexJ) &&
                                neighbouringSpot.isOccupied == false) 
                                neighbouringSpot.isPossibleMove(true)
                            
                        } else {
                            if ((indexI !== neighbourIndexI && indexJ !== neighbourIndexJ) &&
                                (myI !== neighbourIndexI && myJ !== neighbourIndexJ) &&
                                neighbouringSpot.isOccupied == false
                            ) 
                                neighbouringSpot.isPossibleMove(true)
                               
                        }
                    })
            }
        }

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
