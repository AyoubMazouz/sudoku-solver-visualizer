const canvas = document.getElementById('sudoku')
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d')
const btns = document.getElementById('btns')
const dropDown = document.getElementById('drop-down')
const stopTimer = document.getElementById('stop-timer')
const speedSlider = document.getElementById('speed-slider')
const speedLabel = document.getElementById('speed-label')
const stepsLabel = document.getElementById('step-counter')
const timer = document.getElementById('timer')
const icon1 = document.getElementById('i-1')
const icon2 = document.getElementById('i-2')

canvas.width = cellSize * 9
canvas.height = cellSize * 9

// ##############################################
// ### > Generale Functions < ###################
// ##############################################
const getMousePos = event => [event.clientX, event.clientY]
const copy2dArray = arr => JSON.parse(JSON.stringify(arr))

const calculateIndex = pos => {
    // Convert mouse position to indexes to be used to access values in the board 
    const canvasPos = event.target.getBoundingClientRect();
    const correctedX = pos[0] - canvasPos.x
    const correctedY = pos[1] - canvasPos.y
    let x = correctedX / cellSize | 0
    let y = correctedY / cellSize | 0
    return [x, y]
}

const convertBoard = board => {
    // if the board contain number covert all number to object and add the value in object.value
    return board.map(row => {
        return row.map(v => {
            if (isNaN(v)) return v.value
            return {
                value: v, canChange: v === 0 ? true : false, stat: '', selected: false
            }
        })
    })
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
    }
}

const selectBoard = () => {
    // From the drop down, the user can select difficulty level then we get
    //      a random board according to the specified level of difficulty.
    const r = Math.random() * 3 | 0
    game.originalBoard = copy2dArray(boards[dropDown.value][r])
    game.board = convertBoard(game.originalBoard)
}

// ##############################################
// ### > DOM Elements Functions < ###############
// ##############################################
const updateSpeedLabel = v => speedLabel.innerText = v / 1000 === 0 ? 0.001 : v / 1000
const updateStepsLabel = (v, t) => stepsLabel.innerText = `${v}/${t}`

const toggleTimer = () => {
    game.timerIsPaused = !game.timerIsPaused
    icon1.classList.toggle('hidden')
    icon2.classList.toggle('hidden')
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

const updateTimer = time => {
    const t = new Date(time)
    // Make sure we always have a leading "0" unless we already have it.
    let min = t.getMinutes() <= 9 ? `0${t.getMinutes()}` : `${t.getMinutes()}`
    let sec = t.getSeconds() <= 9 ? `0${t.getSeconds()}` : `${t.getSeconds()}`
    timer.innerText = `${min}:${sec}`
}

// ##############################################
// ### > Input functions < ######################
// ##############################################
const select = event => {
    // This function give us the correct cell which the user click.
    if (game.cell) game.cell = null
    const [x, y] = calculateIndex([event.clientX, event.clientY])
    if (x >= 9 || y >= 9) return
    game.cell = [x, y]
}

const keyDown = event => {
    // This function is called when the user press on the keyboard.

    // If the user didn't select a cell we break out of the function.
    if (!game.cell) return
    // Check for the correct argument.
    const value = event instanceof Object ? event.key : event
    // Break the function if the value wasn't a number 1-9.
    if (isNaN(value)) return
    // Convert the value type from string to a number.
    const number = parseInt(value)
    const [x, y] = game.cell
    // If the selected cell is part of the puzzle and can't be changed
    // break out.
    if (!game.board[y][x].canChange) return

    // If the number equal "0" that mean the user wants to delete current cell value.
    if (number === 0) {
        game.board[y][x].stat = ''
        game.board[y][x].value = number
        return
    }

    // Object.stat help determine the color which this cell will be drawn with
    if (isValidNumber([x, y], game.board, number)) {
        game.board[y][x].stat = 'success'
        game.steps.push(0)
    } else {
        game.board[y][x].stat = 'error'
        game.steps.push(0)
    }
    game.board[y][x].value = number

    // Now we check if the player won.
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

// ##############################################
// ### > Draw Functions < #######################
// ##############################################
const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = colors['bg']
    ctx.fillRect(0, 0, canvas.width, canvas.height)
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
    // this function has two loops to avoid overlapping.
    // In each loop we pass in addition to arguments, "j" & "i".
    // Functions that need one loop, is being placed in the outer loop.

    clearCanvas()
    updateTimer(game.time)
    updateSpeedLabel(speedSlider.value)
    updateStepsLabel(game.steps.length, game.steps.length)
    // If the user is currently selecting a cell draw the selections
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

// ##############################################
// ### > Main Loop & Game Object < ##############
// ##############################################
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
}

let [lastTime, deltaTime] = [0, 0]
const update = (time = 0) => {
    // Count the time between each frame "DeltaTime".
    deltaTime = time - lastTime
    lastTime = time
    // Count the time passed for the timer.
    if (!game.timerIsPaused) game.time += deltaTime
    draw(game)
    // Make sure we are not visualizing currently.
    if (!game.visualizing) requestAnimationFrame(update)
}

const init = () => {
    ctx.font = `${cellSize}px montserrat`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    game.originalBoard = easy[0]
    game.board = convertBoard(game.originalBoard)
    requestAnimationFrame(update)
}
init()

// ##############################################
// ### > Events < ###############################
// ##############################################
canvas.addEventListener('click', event => select(event, game))
document.addEventListener('keydown', event => keyDown(event, game))
stopTimer.addEventListener('click', event => toggleTimer(game, event))
dropDown.addEventListener('input', () => {
    reset()
    selectBoard()
})
btns.addEventListener('click', event => {
    if (event.target !== event.currentTarget) {
        if (event.target.id === 'solve') backtrack(game.board)
        if (event.target.id === 'visualize') visualize()
        if (event.target.id === 'reset') reset()
        keyDown(event.target.dataset.number, game)
    }
})
