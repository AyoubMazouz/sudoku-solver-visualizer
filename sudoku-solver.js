const canvas = document.getElementById('canvas')
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d')

const cellSize = 50
canvas.width = cellSize * 9
canvas.height = cellSize * 9

const solveBtn = document.getElementById('solve')

const calculateIndex = pos => {
    const canvasPos = event.target.getBoundingClientRect();
    const correctedX = pos[0] - canvasPos.x
    const correctedY = pos[1] - canvasPos.y
    let x = correctedX / cellSize | 0
    let y = correctedY / cellSize | 0
    return [x, y]
}

const getMousePos = event => [event.clientX, event.clientY]

const copy2dArray = arr => JSON.parse(JSON.stringify(arr))

const convertBoard = board => {
    return board.map(row => {
        return row.map(v => {
            if (isNaN(v)) return v.value
            return {
                value: v, canChange: v === 0 ? true : false, stat: null, selected: false
            }
        })
    })
}

const setCurrentBoard = () => {
    return createBoard(tests[0].board)
}

const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#f5f5f5'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

const determineColor = value => {
    if (game.over) return 'orange'
    if (value.stat === 'success') return '#228b22'
    if (value.stat === 'error') return '#de1738'
    if (value.canChange) return '#f5f5f5'
    else return '#000'
}

const select = event => {
    if (game.cell) game.cell = null
    const [x, y] = calculateIndex([event.clientX, event.clientY])
    if (x > 9 || y > 9) return
    if (game.board[y][x].canChange) game.cell = [x, y]
}

const keyDown = event => {
    if (!game.cell) return
    if (isNaN(event.key)) return

    const number = parseInt(event.key)
    const [x, y] = game.cell

    if (isValidNumber([x, y], game.originalBoard, number)) {
        game.board[y][x].stat = 'success'
    } else {
        game.board[y][x].stat = 'error'
    }
    game.board[y][x].value = number
}

const drawSelection = (board, cell) => {
    if (!cell) return
    const [x, y] = cell
    const [gridX, gridY] = [(x / 3 | 0) * 3, (y / 3 | 0) * 3]
    ctx.fillStyle = 'rgba(0, 0, 255, .3)'
    ctx.fillRect(gridX * cellSize, gridY * cellSize, cellSize * 3, cellSize * 3)
    for (let i = 0; i < board.length; i++) {
        ctx.fillRect(x * cellSize, i * cellSize, cellSize, cellSize)
        ctx.fillRect(i * cellSize, y * cellSize, cellSize, cellSize)
    }
}

const drawStaticElements = (board) => {
    for (let y = 0; y < board.length; y += 1) {
        for (let x = 0; x < board.length; x += 1) {
            ctx.strokeStyle = 'rgba(0,0,0,.3)'
            ctx.lineWidth = 1
            ctx.strokeRect(ctx.lineWidth + x * cellSize, y * cellSize, cellSize, cellSize)
        }
    }
    for (let y = 0; y < board.length; y += 3) {
        for (let x = 0; x < board.length; x += 3) {
            ctx.strokeStyle = 'rgba(0,0,0,1)'
            ctx.lineWidth = 3
            ctx.strokeRect(ctx.lineWidth + x * cellSize, y * cellSize, cellSize * 3, cellSize * 3)
        }
    }

}

const drawBoard = board => {
    ctx.font = `${cellSize}px sans serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board.length; x++) {
            const posX = (cellSize / 2) + (x * cellSize)
            const posY = (cellSize / 2) + (y * cellSize)
            const text = game.board[y][x].value > 0 ? game.board[y][x].value : ''
            ctx.fillStyle = determineColor(game.board[y][x])
            ctx.fillText(text, posX, posY)
        }
    }
}

const game = {
    originalBoard: tests[0].board,
    board: convertBoard(tests[0].board),
    cell: null,
    over: false
}

const draw = () => {
    clearCanvas()
    drawStaticElements(game.board)
    drawSelection(game.board, game.cell)
    drawBoard(game.board)

}

let lastTime = 0;
let deltaTime = 0;
const update = (time = 0) => {
    deltaTime = time - lastTime
    lastTime = time
    draw()
    window.requestAnimationFrame(update)
}

solveBtn.addEventListener('click', () => {
    solve(game.originalBoard)
    let solvedBoard = copy2dArray(game.originalBoard)
    solvedBoard = convertBoard(solvedBoard)
    game.board = solvedBoard
})

canvas.addEventListener('click', event => select(event))

document.addEventListener('keydown', event => { keyDown(event) })

window.requestAnimationFrame(update)
