// Resources: 
//      https://www.programiz.com/dsa/backtracking-algorithm
//      https://www.youtube.com/watch?v=eqUwSA0xI-s&t=17s
//      https://medium.com/swlh/backtracking-algorithm-to-solve-sudoku-puzzle-in-javascript-732aedcf5e2

const getValidPosition = board => {
    // Get the next valid position starting from top left.
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board.length; x++) {
            if (board[y][x].value === 0) return [x, y]
        }
    } return false
}

const isValidNumber = (pos, board, number) => {
    const [x, y] = pos
    // Check in all columns except at y & x.
    for (let i = 0; i < board.length - 1; i++) {
        if (board[i][x].value === number && y !== i) {
            return false
        }
    }
    // Check in all rows except at y & x.
    for (let i = 0; i < board.length; i++) {
        if (board[y][i].value === number && x !== i) {
            return false
        }
    }
    // Check in sub-grid except at y & x.
    const gridY = (y / 3 | 0) * 3
    const gridX = (x / 3 | 0) * 3
    for (let i = gridY; i < gridY + 3; i++) {
        for (let j = gridX; j < gridX + 3; j++) {
            if (board[i][j].value === number && [y, x] !== [i, j]) {
                return false
            }
        }
    }
    return true
}


const backtrack = board => {
    const pos = getValidPosition(board)
    if (!pos) return true
    const [x, y] = pos
    for (let n = 0; n < 10; n++) {
        if (isValidNumber(pos, board, n)) {
            board[y][x].value = n
            // Record steps for visualization.
            if (game.visualizing) game.steps.push([copy2dArray(board), pos])
            // Recursion.
            if (backtrack(board)) return true
            board[y][x].value = 0
        }
    } return false
}
