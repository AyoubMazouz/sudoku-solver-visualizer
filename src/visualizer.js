const tt = async (board, x, y, gridX, gridY) => {
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
                    drawSubGridSelection(board, x, y, gridX, gridY, j, i)
                    drawNumbers(board, j, i, board[i][j].canChange ? colors.success : colors[''])
                }
                drawCellBorder(i)
                drawSubGridBorder(i)
            }
        }, 100)
    })
}
const yy = async () => {
    solve(convertBoard(game.originalBoard))
    for (const step of steps) {
        const [board, pos] = step
        const [x, y] = pos
        const [gridX, gridY] = [(x / 3 | 0) * 3, (y / 3 | 0) * 3]
        console.log(x, y)
        await tt(board, x, y, gridX, gridY)
    }
    game.visualizing = false
    game.board = steps[steps.length - 1][0]
    console.log(steps[steps.length - 1][0])
    requestAnimationFrame(update)
}