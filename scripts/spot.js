class Spot {
    constructor(context, x, y) {
        this.x = x
        this.y = y
        this.isOccupied = false
        this.piece = null
        this.radius = 15
        
        context.beginPath();
        context.fillStyle = "#fff"
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fill()
    }
    getPiece() {
        return this.piece
    }
    addPiece(piece) {
        this.isOccupied = true
        this.piece = piece
    }
    removePiece() {
        this.isOccupied = false
        this.piece = null
    }
    clicked(mouseX, mouseY) {
        const distance = Math.hypot((mouseX - this.x), (mouseY - this.y))
        if (distance < this.radius) {
            console.log("clicked the empty spot")
        }
    }
    checkNeighbouringSpot(grid, x, y) {
        let neighbours = []
        for (let i = x - 1; i < x + 2; i++)
            for (let j = y - 1; j < y + 2; j++) 
                neighbours.push(grid[i][j])
            
        return neighbours.filter(s => {
            if (s != undefined)
                if (s != this)
                    return s
        })
    }
    // showPossibleMoves(neighbours) {
    //     neighbours.forEach(neighbour => {
    //         if (neighbour.isOccupied == false) {
    //            console.log(neighbour)
    //         }
    //     })
    // }
   
}