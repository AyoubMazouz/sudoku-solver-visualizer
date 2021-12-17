const canvas = document.getElementById('canvas')
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d')

const cellSize = 50
canvas.width = cellSize * 9
canvas.height = cellSize * 9

const solveBtn = document.getElementById('solve')

const calculateIndex = pos => {
    let x = pos[0] / cellSize | 0
    let y = pos[1] / cellSize | 0
    x = x >= 9 ? 8 : x
    y = y >= 9 ? 8 : y
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

const selectCell = event => {
    if (game.cell != null) {
        game.board[game.cell[1]][game.cell[0]].selected = false
    }
    [x, y] = calculateIndex([event.clientX, event.clientY])
    game.cell = [x, y]
    console.log(x, y)
    if (game.board[game.cell[1]][game.cell[0]].canChange) {
        game.board[y][x].selected = true
    }
}

const drawBoard = board => {
    ctx.font = `${cellSize}px sans serif`
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board.length; x++) {
            ctx.fillStyle = determineColor(game.board[y][x])
            ctx.fillText(game.board[y][x].value, x * cellSize, cellSize + y * cellSize)
            ctx.rect(x * cellSize, y * cellSize, cellSize, cellSize)
            ctx.stroke()
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
    solve(game.originalBoard)
    let solvedBoard = copy2dArray(game.originalBoard)
    solvedBoard = convertBoard(solvedBoard)
    game.board = solvedBoard
})

canvas.addEventListener('click', event => selectCell(event))

document.addEventListener('keydown', event => {
    const key = parseInt(event.key)
    if (game.cell == null) return
    let pos = game.cell
    if (!isNaN(key)) {
        if (isValidNumber(pos, game.originalBoard, key) &&
            game.board[pos[1]][pos[0]].canChange) {
            game.board[pos[1]][pos[0]].value = key
            game.board[pos[1]][pos[0]].stat = 'success'
        } else {
            if (game.board[pos[1]][pos[0]].canChange) {
                game.board[pos[1]][pos[0]].value = key
                game.board[pos[1]][pos[0]].stat = 'error'
            }
        }
    }
    if (getValidPosition(game.board)) {
        console.log('game finished')
        game.over = true
    }
})

update()
