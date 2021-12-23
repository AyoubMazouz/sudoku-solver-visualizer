// Resources: 
//      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
//      https://www.youtube.com/watch?v=DHvZLI7Db8E
//      https://www.youtube.com/watch?v=PoRJizFvM7s&t=1294s

const drawVisualization = async (board, x, y, gridX, gridY) => {
    // Using Promises we can go outside the mainLoop and rendering
    //      the steps, and return to continue where we left of.
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
            clearCanvas()
            updateSpeedLabel(speedSlider.value)
            for (let i = 0; i < board.length; i++) {
                drawHorizontalVerticalSelection(board, x, y, i)
            }
            drawCellSelection(x, y)
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board.length; j++) {
                    const color = board[i][j].canChange ? colors.success : colors['']
                    drawSubGridSelection(board, x, y, gridX, gridY, j, i)
                    drawNumbers(board, j, i, color)
                }
                drawCellBorder(i)
                drawSubGridBorder(i)
            }
        }, speedSlider.value)
    })
}

const visualize = async (game) => {
    // this function make sure that when we visualize the user cannot interrupt
    //      the process, and also get us back to the main loop once we're finished. 
    game.visualizing = true
    game.steps = []
    disableNumbersButtons()
    backtrack(convertBoard(game.originalBoard))

    let stepCounter = 0
    for (const step of game.steps) {
        if (game.visualizing) {
            updateStepsLabel(stepCounter, game.steps.length)
            const [board, pos] = step
            const [x, y] = pos
            const [gridX, gridY] = [(x / 3 | 0) * 3, (y / 3 | 0) * 3]
            await drawVisualization(board, x, y, gridX, gridY)
        } else {
            // If the user wants to stop the visualization he would click on reset
            //      then the reset function will reset all values for the game object,
            //      so game.visualize will be false then this block will execute.
            enableNumbersButtons()
            // This function will get us back to the main loop.
            requestAnimationFrame(update)
            return
        }
        stepCounter++
    }
    game.visualizing = false
    game.board = game.steps[game.steps.length - 1][0]
    enableNumbersButtons()
    requestAnimationFrame(update)
}