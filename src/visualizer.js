const drawVisualization = async (board, x, y, gridX, gridY) => {
    // Using Promises we can go outside the mainLoop and rendering
    // the steps, and return to continue where we left of.
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
            clearCanvas()
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
        }, game.speed)
    })
}

const visualize = async () => {
    game.visualizing = true
    disableNumbersButtons()
    backtrack(convertBoard(game.originalBoard))
    for (const step of game.steps) {
        const [board, pos] = step
        const [x, y] = pos
        const [gridX, gridY] = [(x / 3 | 0) * 3, (y / 3 | 0) * 3]
        await drawVisualization(board, x, y, gridX, gridY)
    }
    game.visualizing = false
    game.board = game.steps[game.steps.length - 1][0]
    enableNumbersButtons()
    requestAnimationFrame(update)
}