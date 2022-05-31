const easy = [
    [
        [0, 0, 0, 2, 6, 0, 7, 0, 1],
        [6, 8, 0, 0, 7, 0, 0, 9, 0],
        [1, 9, 0, 0, 0, 4, 5, 0, 0],
        [8, 2, 0, 1, 0, 0, 0, 4, 0],
        [0, 0, 4, 6, 0, 2, 9, 0, 0],
        [0, 5, 0, 0, 0, 3, 0, 2, 8],
        [0, 0, 9, 3, 0, 0, 0, 7, 4],
        [0, 4, 0, 0, 5, 0, 0, 3, 6],
        [7, 0, 3, 0, 1, 8, 0, 0, 0]
    ],
    [
        [1, 0, 0, 4, 8, 9, 0, 0, 6],
        [7, 3, 0, 0, 0, 0, 0, 4, 0],
        [0, 0, 0, 0, 0, 1, 2, 9, 5],
        [0, 0, 7, 1, 2, 0, 6, 0, 0],
        [5, 0, 0, 7, 0, 3, 0, 0, 8],
        [0, 0, 6, 0, 9, 5, 7, 0, 0],
        [9, 1, 4, 6, 0, 0, 0, 0, 0],
        [0, 2, 0, 0, 0, 0, 0, 3, 7],
        [8, 0, 0, 5, 1, 2, 0, 0, 4],
    ],
    [
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [6, 0, 0, 0, 0, 0, 8, 7, 0],
        [1, 5, 0, 9, 0, 3, 6, 4, 0],
        [0, 4, 2, 8, 0, 0, 0, 1, 0],
        [0, 9, 0, 5, 7, 1, 0, 3, 0],
        [0, 1, 0, 0, 0, 4, 9, 8, 0],
        [0, 8, 1, 6, 0, 7, 0, 2, 3],
        [0, 6, 4, 0, 0, 0, 0, 0, 5],
        [0, 0, 0, 0, 9, 0, 0, 0, 0],
    ]
]

const normal = [
    [
        [0, 0, 0, 4, 6, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 2, 0, 0],
        [5, 3, 9, 1, 2, 8, 0, 0, 0],
        [9, 8, 0, 0, 1, 0, 5, 0, 7],
        [0, 0, 2, 0, 0, 0, 9, 0, 0],
        [6, 0, 1, 0, 5, 0, 0, 2, 4],
        [0, 0, 0, 8, 3, 9, 4, 1, 5],
        [0, 0, 3, 0, 0, 0, 0, 7, 0],
        [0, 0, 0, 0, 7, 6, 0, 0, 0],
    ],
    [
        [7, 0, 0, 9, 8, 9, 3, 0, 2],
        [3, 0, 0, 4, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 2, 0, 0, 0, 9],
        [0, 0, 6, 0, 0, 8, 0, 2, 3],
        [0, 0, 7, 0, 0, 0, 5, 0, 0],
        [8, 3, 0, 6, 0, 0, 9, 0, 0],
        [6, 0, 0, 0, 1, 0, 0, 0, 0],
        [9, 0, 0, 0, 0, 5, 0, 0, 6],
        [1, 0, 3, 8, 6, 9, 0, 0, 7],
    ],
    [
        [0, 7, 0, 0, 0, 8, 0, 5, 0],
        [6, 0, 8, 0, 0, 2, 0, 0, 1],
        [0, 0, 0, 0, 5, 0, 4, 8, 0],
        [8, 0, 2, 1, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 2, 0, 9, 0, 0],
        [0, 0, 0, 0, 0, 6, 2, 0, 7],
        [0, 1, 7, 0, 6, 0, 0, 0, 0],
        [3, 0, 0, 7, 0, 0, 5, 0, 9],
        [0, 2, 0, 8, 0, 0, 0, 7, 0],
    ]
]

const challenging = [
    [
        [0, 7, 0, 0, 1, 0, 0, 3, 0],
        [1, 0, 0, 0, 0, 3, 8, 0, 0],
        [3, 0, 4, 0, 9, 0, 0, 0, 0],
        [0, 0, 0, 5, 0, 0, 7, 0, 3],
        [6, 3, 0, 0, 0, 0, 0, 2, 1],
        [7, 0, 1, 0, 0, 8, 0, 0, 0],
        [0, 0, 0, 0, 5, 0, 2, 0, 6],
        [0, 0, 9, 6, 0, 0, 0, 0, 4],
        [0, 6, 0, 0, 4, 0, 0, 5, 0],
    ],
    [
        [1, 8, 7, 0, 0, 0, 6, 0, 0],
        [0, 0, 0, 2, 0, 0, 0, 5, 0],
        [0, 0, 0, 0, 6, 8, 0, 9, 0],
        [0, 0, 0, 9, 8, 0, 0, 0, 0],
        [4, 0, 8, 0, 5, 0, 2, 0, 1],
        [0, 0, 0, 0, 4, 3, 0, 0, 0],
        [0, 1, 0, 6, 7, 0, 0, 0, 0],
        [0, 3, 0, 0, 0, 9, 0, 0, 0],
        [0, 0, 6, 0, 0, 0, 9, 4, 5],
    ],
    [
        [0, 0, 0, 6, 0, 0, 4, 0, 0],
        [7, 0, 0, 0, 0, 3, 6, 0, 0],
        [0, 0, 0, 0, 9, 1, 0, 8, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 5, 0, 1, 8, 0, 0, 0, 3],
        [0, 0, 0, 3, 0, 6, 0, 4, 5],
        [0, 4, 0, 2, 0, 0, 0, 6, 0],
        [9, 0, 3, 0, 0, 0, 0, 0, 0],
        [0, 2, 0, 0, 0, 0, 1, 0, 0],
    ],
]

const hard = [
    [
        [0, 0, 3, 0, 0, 6, 4, 0, 5],
        [0, 0, 0, 8, 0, 0, 0, 0, 0],
        [9, 7, 0, 3, 2, 0, 0, 0, 0],
        [0, 0, 0, 0, 4, 0, 3, 0, 6],
        [0, 2, 0, 0, 0, 0, 0, 4, 0],
        [1, 0, 6, 0, 8, 0, 0, 0, 0],
        [0, 0, 0, 0, 5, 7, 0, 6, 9],
        [0, 0, 0, 0, 0, 1, 0, 0, 0],
        [7, 0, 9, 2, 0, 0, 5, 0, 0],
    ],
    [
        [2, 0, 0, 3, 0, 0, 0, 0, 0],
        [8, 0, 4, 0, 6, 2, 0, 0, 3],
        [0, 1, 3, 8, 0, 0, 2, 0, 0],
        [0, 0, 0, 0, 2, 0, 3, 9, 0],
        [5, 0, 7, 0, 0, 0, 6, 2, 1],
        [0, 3, 2, 0, 0, 6, 0, 0, 0],
        [0, 2, 0, 0, 0, 9, 1, 4, 0],
        [6, 0, 1, 2, 5, 0, 8, 0, 9],
        [0, 0, 0, 0, 0, 1, 0, 0, 2]
    ],
    [
        [0, 2, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 6, 0, 0, 0, 0, 3],
        [0, 7, 4, 0, 8, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 3, 0, 0, 2],
        [0, 8, 0, 0, 4, 0, 0, 1, 0],
        [6, 0, 0, 5, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 7, 8, 0],
        [5, 0, 0, 0, 0, 9, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 4, 0]
    ]
]

const boards = {
    'easy': easy,
    'normal': normal,
    'challenging': challenging,
    'hard': hard
}