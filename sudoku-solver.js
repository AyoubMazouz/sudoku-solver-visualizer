class Vector2 {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    getPos() {
        return [this.x, this.y]
    }
    plus(vector) {
        return new Vector2(this.x + vector.x, this.y + vector.y)
    }
}

class Block {
    constructor(pos, value, stat) {
        this.pos = pos
        this.value = value
        this.stat = stat
    }
}

const canvas = document.getElementById('canvas')
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d')

const cellSize = 50
canvas.width = cellSize * 9
canvas.height = cellSize * 9

const solveBtn = document.getElementById('solve')

const game = {
    board: tests[0].board,
}


const getIndex = pos => {
    return new Vector2(pos.x / cellSize | 0, pos.y / cellSize | 0)
}

const getMousePos = event => {
    return new Vector2(event.clientX, event.clientY)
}

const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const drawBoard = board => {
    ctx.font = `${cellSize}px sans serif`
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board.length; x++) {
            ctx.fillText(game.board[y][x], x * cellSize, cellSize + y * cellSize)
            ctx.fillStyle = '#000'
        }
    }
}

const draw = () => {
    clearCanvas()
    drawBoard(game.board)
}

let lastTime = 0;
let deltaTime = 0;
const update = (time = 0) => {
    deltaTime = time - lastTime
    lastTime = time


    draw()
    requestAnimationFrame(update)
}

solveBtn.addEventListener('click', () => {
    solve(game.board)
})

update()

// test(tests)
// console.log(tests[1].board)