const canvas = document.getElementById('canvas')
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d')

const cellSize = 50
canvas.width = cellSize * 9
canvas.height = cellSize * 9

const solveBtn = document.getElementById('solve')

const colors = {
    '': '#45576E',
    'error': '#E55C6C',
    'success': '#0072E3',
    'bg': '#FFFFFF',
    'sel-pri': '#BBDEFB',
    'sel-sec': '#E2EBF3',
    'sel-err': '#F7CFD6',
}

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
                value: v, canChange: v === 0 ? true : false, stat: '', selected: false
            }
        })
    })
}

const setCurrentBoard = () => {
    return createBoard(tests[0].board)
}

const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = colors['bg']
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

const select = event => {
    if (game.cell) game.cell = null
    const [x, y] = calculateIndex([event.clientX, event.clientY])
    if (x > 9 || y > 9) return
    game.cell = [x, y]
}

const keyDown = event => {
    if (!game.cell) return
    if (isNaN(event.key)) return
    const [x, y] = game.cell
    if (!game.board[y][x].canChange) return

    const number = parseInt(event.key)

    if (number === 0) {
        game.board[y][x].stat = ''
        game.board[y][x].value = number
        return
    }

    if (isValidNumber([x, y], convertBoard(game.board), number)) {
        game.board[y][x].stat = 'success'
    } else {
        game.board[y][x].stat = 'error'
    }
    game.board[y][x].value = number

    if (getValidPosition(convertBoard(game.board)) === false) {
        for (let row of game.board) {
            for (let cell of row) {
                if (cell.stat === 'error') return
                if (cell.value === 0) return
            }
        }
        game.over = true
    }
}

const drawSameNumberSelection = (board, x, y, j, i) => {
    ctx.fillStyle = colors['sel-pri']
    if (board[y][x].value === board[i][j].value && board[y][x].value !== 0) {
        ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize)
    }

}

const drawHorizontalVerticalSelection = (board, x, y, i) => {
    ctx.fillStyle = colors['sel-sec']
    ctx.fillRect(x * cellSize, i * cellSize, cellSize, cellSize)
    ctx.fillRect(i * cellSize, y * cellSize, cellSize, cellSize)
    if (board[y][x].stat === 'error' && board[y][x].value !== 0) {
        ctx.fillStyle = colors['sel-err']
        if (board[y][x].value === board[y][i].value
            && x !== i) {
            ctx.fillRect(i * cellSize, y * cellSize, cellSize, cellSize)
        }
        if (board[y][x].value === board[i][x].value
            && y !== i) {
            ctx.fillRect(x * cellSize, i * cellSize, cellSize, cellSize)
        }
    }

}

const drawSubGridSelection = (board, x, y, gridX, gridY, j, i) => {
    if ((i >= gridY && i < gridY + 3) && (j >= gridX && j < gridX + 3)) {
        ctx.fillStyle = colors['sel-sec']
        ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize)
        if (board[y][x].stat === 'error' && board[y][x].value !== 0) {
            ctx.fillStyle = colors['sel-err']
            if (board[y][x].value === board[i][j].value
                && [x, y] !== [j, i]) {
                ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize)
            }
        }

    }
}

const drawCellSelection = (x, y) => {
    ctx.fillStyle = colors['sel-pri']
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
}

const drawSubGridBorder = i => {
    ctx.strokeStyle = colors['']
    ctx.lineWidth = 2
    if (i % 3 === 0 && i !== 0) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.closePath();
        ctx.stroke()
    }
}

const drawCellBorder = (i) => {
    ctx.strokeStyle = 'rgba(100,100,100,.25)'
    ctx.lineWidth = .75
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, canvas.height);
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(canvas.width, i * cellSize);
    ctx.closePath();
    ctx.stroke()
}

const drawNumbers = (board, j, i) => {
    ctx.font = `${cellSize}px sans serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = colors[board[i][j].stat]
    const posX = (cellSize / 2) + (j * cellSize)
    const posY = (cellSize / 2) + (i * cellSize)
    const text = board[i][j].value > 0 ? board[i][j].value : ''
    ctx.fillText(text, posX, posY)
}

const game = {
    originalBoard: bb1,
    board: convertBoard(bb1),
    cell: null,
    over: false
}

const draw = game => {
    clearCanvas()
    if (game.cell) {
        const [x, y] = game.cell
        const [gridX, gridY] = [(x / 3 | 0) * 3, (y / 3 | 0) * 3]
        for (let i = 0; i < game.board.length; i++) {
            for (let j = 0; j < game.board.length; j++) {
                drawHorizontalVerticalSelection(game.board, x, y, i)
                drawSameNumberSelection(game.board, x, y, j, i)
                drawSubGridSelection(game.board, x, y, gridX, gridY, j, i)
            }
        }
        drawCellSelection(x, y)
    }
    for (let i = 0; i < game.board.length; i++) {
        for (let j = 0; j < game.board.length; j++) {
            drawNumbers(game.board, j, i)
        }
        drawCellBorder(i)
        drawSubGridBorder(i)
    }
}


let lastTime = 0;
let deltaTime = 0;
const update = (time = 0) => {
    deltaTime = time - lastTime
    lastTime = time
    draw(game)
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
