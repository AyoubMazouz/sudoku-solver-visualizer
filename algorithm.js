const getValidPosition = board => {
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board.length; x++) {
            if (board[y][x] === 0) return [x, y]
        }
    } return false
}

const isValidNumber = (pos, board, number) => {
    const [x, y] = pos
    // Check in all columns except at y & x
    for (let i = 0; i < board.length - 1; i++) {
        if (board[i][x] === number && y !== i) {
            return false
        }
    }
    // Check in all rows except at y & x
    for (let i = 0; i < board.length; i++) {
        if (board[y][i] === number && x !== i) {
            return false
        }
    }
    // Check in sub-grid except at y & x
    const gridY = (y / 3 | 0) * 3
    const gridX = (x / 3 | 0) * 3
    for (let i = gridY; i < gridY + 3; i++) {
        for (let j = gridX; j < gridX + 3; j++) {
            if (board[i][j] === number && [y, x] !== [i, j]) {
                return false
            }
        }
    }
    return true
}

const solve = board => {
    const pos = getValidPosition(board)

    if (!pos) return true

    const [x, y] = pos

    for (let n = 0; n < 10; n++) {
        if (isValidNumber(pos, board, n)) {

            board[y][x] = n

            if (solve(board)) return true

            board[y][x] = 0
        }
    } return false
}
