class Piece {
    constructor(context, x, y, isRed = false) {
        this.isRed = isRed
        this.x = x
        this.y = y
        this.radius = 13

        context.beginPath();
        context.fillStyle = isRed ? 'red' : 'blue'
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fill()
        context.stroke()
    }
    clicked(mouseX, mouseY) {
        const distance = Math.hypot((mouseX - this.x), (mouseY - this.y))
        if (distance > this.radius) return
        return this
    }
   
}