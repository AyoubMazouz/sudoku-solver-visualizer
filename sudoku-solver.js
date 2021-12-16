const getValidPosition = board => {
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[0].length; x++) {
            if (board[y][x] === 0) return new Vector2(y, x)
        }
    } return false
}

const isValidNumber = (vector, board, number) => {
    const [x, y] = [vector.x, vector.y]
    // Check in all columns except at y & x
    for (let i = 0; i < board[y].length - 1; i++) {
        if (board[i][x] === number && [y, x] !== [i, x]) {
            return false
        }
    }
    // Check in all rows except at y & x
    for (let i = 0; i < board[x].length; i++) {
        if (board[y][i] === number && [y, x] !== [y, i]) {
            return false
        }
    }
    // Check in sub-grid except at y & x
    const gridY = (y / 3 | 0) * 3
    const gridX = (x / 3 | 0) * 3
    for (let i = gridY; i < gridY + 3; i++) {
        for (let j = gridX; j < gridX + 3; j++) {
            if (board[i][j] === number && [y, x] !== [i, j]) {
                return false
            }
        }
    }
    return true
}

const solve = board => {
    const pos = getValidPosition(board)

    if (!position) return true

    let [y, x] = [pos.x, pos.y]

    for (let n = 0; n < 10; n++) {
        if (isValidNumber(pos, board, n)) {

            board[y][x] = n

            if (solve(board)) return true

            board[y][x] = 0
        }
    } return false
}

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
    originalBoard: tests[0].board,
    board: null,
    cell: null,
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
            if (game.board[y][x].stat == 'error') {
                ctx.fillStyle = '#943'
            }
            else if (game.board[y][x].stat == 'success') {
                ctx.fillStyle = '#049'
            }
            ctx.fillText(game.board[y][x].value, x * cellSize, cellSize + y * cellSize)
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

canvas.addEventListener('click', event => {
    let mousePos = getMousePos(event)
    let indexes = getIndex(mousePos)
    let [x, y] = indexes.getPos()
    console.log(x, y)
    game.cell = indexes
})



document.addEventListener('keydown', event => {
    let input = parseInt(event.key)
    let pos = game.cell
    if (game.cell) {
        console.log(event.key)
        if (input || input === 0) {
            console.log(game.board, game.cell)
            game.board[pos.y][pos.x].value = input
            if (isValidNumber(pos, game.board, game.board[pos.y][pos.x])) {
                game.board[pos.y][pos.x].stat = 'success'
            } else {
                game.board[pos.y][pos.x].stat = 'error'
            }
        }
    }
})

const setUpBoardObject = () => {
    const b = game.originalBoard
    const board = []
    for (let y = 0; y < b.length; y++) {
        const row = []
        for (let x = 0; x < b.length; x++) {
            const block = new Block(new Vector2(x, y), b[y][x], null)
            row.push(block)
        }
        board.push(row)
    }
    game.board = board
}
setUpBoardObject()
console.log(game.board)
update()

