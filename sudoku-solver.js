const getValidPosition = board => {
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[0].length; x++) {
            if (board[y][x] === 0) return [y, x]
        }
    } return false
}

const isValidNumber = (y, x, board, number) => {
    // Check in all columns except at y & x
    for (let i = 0; i < board[y].length - 1; i++) {
        if (board[i][x] === number && [y, x] !== [i, x]) {
            return false
        }
    }
    // Check in all rows except at y & x
    for (let i = 0; i < board[x].length; i++) {
        if (board[y][i] === number && [y, x] !== [y, i]) {
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
    const position = getValidPosition(board)

    if (!position) return true

    let [y, x] = position

    for (let n = 0; n < 10; n++) {
        if (isValidNumber(y, x, board, n)) {

            board[y][x] = n

            if (solve(board)) return true

            board[y][x] = 0
        }
    } return false
}

test(tests)


