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
    showPossibleMoves(board, previouslyClickedSpot) {
        if (previouslyClickedSpot != null) {        
            previouslyClickedSpot.neighbours.forEach(neighbour => {
                let [i, j] = neighbour.split('')
                let spot = board[i][j]
                if (spot.isOccupied == false) 
                spot.isPossibleMove(false)
                
            })
        }

        this.neighbours.forEach(neighbour => {
            let [i ,j] = neighbour.split('')
            let spot = board[i][j]
            if (spot.isOccupied == false) 
                spot.isPossibleMove(true)
            
        })
    }

    hidePossibleMoves(board) {
        this.neighbours.forEach(neighbour => {
            let [i, j] = neighbour.split('')
            let spot = board[i][j]
            if(spot.isOccupied == false)
                spot.isPossibleMove(false)
        })
    }
}
