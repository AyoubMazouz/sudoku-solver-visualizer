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
    ctx.fillStyle = 'yellow'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

const determineColor = value => {
    if (game.over) return 'orange'
    if (value.stat === 'success') return 'green'
    if (value.stat === 'error') return 'red'
    if (value.selected) return 'blue'
    if (value.canChange) return 'gray'
    else return '#000'
}

const select = event => {
    if (game.cell) game.cell = null
    const [x, y] = calculateIndex([event.clientX, event.clientY])
    if (x > 9 || y > 9) return
    if (game.board[y][x].canChange) {
        game.cell = [x, y]
        game.board[y][x].selected = true
    }
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

const drawSelection = cell => {
    if (!cell) return
    const [x, y] = cell
    ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize)
}

const drawBoard = board => {
    ctx.font = `${cellSize}px sans serif`
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board.length; x++) {

            ctx.fillStyle = determineColor(game.board[y][x])
            ctx.fillText(game.board[y][x].value, x * cellSize, cellSize + y * cellSize)

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
    drawBoard(game.board)
    drawSelection(game.cell)

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
