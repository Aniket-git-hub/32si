class Piece {
    constructor(context, x, y, isRed = false) {
        this.isRed = isRed
        this.x = x
        this.y = y
        this.radius = 10
        this.context = context

        this.draw()
    }
    draw() {
        this.context.beginPath();
        this.context.fillStyle = this.isRed ? 'red' : 'blue'
        this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.context.fill()
        this.context.stroke()
    }
    isClicked(mouseX, mouseY) {
        const distance = Math.hypot((mouseX - this.x), (mouseY - this.y))
        if (distance > this.radius) return false
        return true
    }
    newPosition(x, y) {
        this.x = x
        this.y = y
        this.draw()
    }
   
}