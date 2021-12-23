const canvas = document.getElementById('sudoku')
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d')
const btns = document.getElementById('btns')
const dropDown = document.getElementById('drop-down')
const stopTimer = document.getElementById('stop-timer')
const timer = document.getElementById('timer')
const icon1 = document.getElementById('i-1')
const icon2 = document.getElementById('i-2')

const cellSize = 50
canvas.width = cellSize * 9
canvas.height = cellSize * 9


const colors = {
    '': '#45576E',
    'error': '#E55C6C',
    'success': '#0072E3',
    'bg': '#FFFFFF',
    'sel-pri': '#BBDEFB',
    'sel-sec': '#E2EBF3',
    'sel-err': '#F7CFD6',
}

const disableNumbersButtons = () => {
    for (let button of btns.querySelectorAll('button')) {
        if (button.id !== 'reset') {
            button.disabled = true
        }
    }
}
const enableNumbersButtons = () => {
    for (let button of btns.querySelectorAll('button')) {
        if (button.id !== 'reset') {
            button.disabled = false
        }
    }
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

const toggleTimer = () => {
    game.timerIsPaused = !game.timerIsPaused
    icon1.classList.toggle('hidden')
    icon2.classList.toggle('hidden')
}

const updateTimer = time => {
    const t = new Date(time)
    let min = t.getMinutes() <= 9 ? `0${t.getMinutes()}` : `${t.getMinutes()}`
    let sec = t.getSeconds() <= 9 ? `0${t.getSeconds()}` : `${t.getSeconds()}`
    timer.innerText = `${min}:${sec}`
}

const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = colors['bg']
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

const select = event => {
    if (game.cell) game.cell = null
    const [x, y] = calculateIndex([event.clientX, event.clientY])
    if (x >= 9 || y >= 9) return
    game.cell = [x, y]
}

const keyDown = event => {
    if (!game.cell) return
    const value = event instanceof Object ? event.key : event
    if (isNaN(value)) return
    const number = parseInt(value)
    const [x, y] = game.cell
    if (!game.board[y][x].canChange) return


    if (number === 0) {
        game.board[y][x].stat = ''
        game.board[y][x].value = number
        return
    }

    if (isValidNumber([x, y], game.board, number)) {
        game.board[y][x].stat = 'success'
    } else {
        game.board[y][x].stat = 'error'
    }
    game.board[y][x].value = number

    if (getValidPosition(game.board) === false) {
        for (let row of game.board) {
            for (let cell of row) {
                if (cell.stat === 'error') return
                if (cell.value === 0) return
            }
        }
        game.over = true
    }
}

const reset = () => {
    game = {
        originalBoard: game.originalBoard,
        board: convertBoard(game.originalBoard),
        cell: null,
        over: false,
        time: 0,
        timerIsPaused: false,
        difficulty: dropDown.value,
        visualizing: false,
        steps: [],
        speed: 100,
        record: true,
    }
}

const selectBoard = () => {
    const r = Math.random() * 3 | 0
    game.originalBoard = copy2dArray(boards[dropDown.value][r])
    game.board = convertBoard(game.originalBoard)
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

const drawNumbers = (board, j, i, _color) => {
    ctx.fillStyle = _color ? _color : colors[board[i][j].stat]
    const posX = (cellSize / 2) + (j * cellSize)
    const posY = (cellSize / 2) + (i * cellSize)
    const text = board[i][j].value > 0 ? board[i][j].value : ''
    ctx.fillText(text, posX, posY)
}

const draw = () => {
    clearCanvas()
    updateTimer(game.time)
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

var game = {
    originalBoard: null,
    board: null,
    cell: null,
    over: false,
    time: 0,
    timerIsPaused: false,
    difficulty: dropDown.value,
    visualizing: false,
    steps: [],
    speed: 0,
    record: true,
}

let lastTime = 0
let deltaTime = 0;
const update = (time = 0) => {
    deltaTime = time - lastTime
    lastTime = time

    if (!game.timerIsPaused) {
        game.time += deltaTime
    }

    draw(game)
    if (!game.visualizing) {
        requestAnimationFrame(update)
    }
}


canvas.addEventListener('click', event => select(event, game))
document.addEventListener('keydown', event => keyDown(event, game))
stopTimer.addEventListener('click', event => toggleTimer(game, event))
dropDown.addEventListener('input', () => selectBoard())
btns.addEventListener('click', event => {
    if (event.target !== event.currentTarget) {
        if (event.target.id === 'solve') backtrack(game.board)
        if (event.target.id === 'visualize') visualize(game)
        if (event.target.id === 'reset') reset()

        keyDown(event.target.dataset.number, game)
    }
})

const init = () => {
    ctx.font = `${cellSize}px montserrat`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    game.originalBoard = easy[0]
    game.board = convertBoard(game.originalBoard)
    requestAnimationFrame(update)
}

init()()