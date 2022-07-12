class Piece{
    isRed: boolean
    x: number
    y: number
    radius: number
    context: CanvasRenderingContext2D
    isSelected: boolean
    constructor(context:CanvasRenderingContext2D | null, x:number, y:number, isRed:boolean = false) {
        this.isRed = isRed
        this.x = x
        this.y = y
        this.radius = 10
        this.context = context as CanvasRenderingContext2D
        this.isSelected = false
        this.draw()
    }
    selected(selected:boolean): void {
        this.isSelected = selected     
    }
    draw():void {
        this.context.beginPath();
        this.context.fillStyle = this.isRed ? 'red' : 'blue'
        this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.context.fill()
        this.context.stroke()
    }
    isClicked(mouseX:number, mouseY:number):boolean {
        const distance = Math.hypot((mouseX - this.x), (mouseY - this.y))
        if (distance > this.radius) return false
        return true
    }
    newPosition(x:number, y:number):void {
        this.x = x
        this.y = y
        this.draw()
    }
}