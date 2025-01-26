export const getAIMove = (board, player) => {
    const moves = getAllValidMoves(board, player === 'BLUE' ? 2 : 1);
    if (moves.length === 0) return null;

    // Simple AI: prioritize moves with captures, then random
    const captureMoves = moves.filter(m => m.jumps.length > 0);
    if (captureMoves.length > 0) {
        return captureMoves[Math.floor(Math.random() * captureMoves.length)];
    }
    return moves[Math.floor(Math.random() * moves.length)];
};

const getAllValidMoves = (board, player) => {
    const moves = [];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 5; j++) {
            if (board[i][j] === player) {
                const pieceMoves = calculatePossibleMoves(board, i, j);
                moves.push(...pieceMoves.map(move => ({
                    from: { i, j },
                    to: { i: move.to.i, j: move.to.j },
                    jumps: move.jumped
                })));
            }
        }
    }
    return moves;
};

export const calculatePossibleMoves = (board, i, j) => {
    const moves = [];
    const player = board[i][j];

    // Simple adjacent moves
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1],
        [-1, -1], [-1, 1], [1, -1], [1, 1]
    ];

    directions.forEach(([dx, dy]) => {
        const x = i + dx;
        const y = j + dy;
        if (x >= 0 && x < 9 && y >= 0 && y < 5 && board[x][y] === 0) {
            moves.push({ to: { i: x, j: y }, jumped: [] });
        }
    });

    // Jump moves
    directions.forEach(([dx, dy]) => {
        const midX = i + dx;
        const midY = j + dy;
        const landX = i + dx * 2;
        const landY = j + dy * 2;

        if (landX >= 0 && landX < 9 && landY >= 0 && landY < 5) {
            if (board[midX][midY] !== 0 && board[midX][midY] !== player &&
                board[landX][landY] === 0) {
                moves.push({
                    to: { i: landX, j: landY },
                    jumped: [{ i: midX, j: midY }]
                });
            }
        }
    });

    return moves;
};