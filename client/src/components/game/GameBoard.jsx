import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Piece from "./Piece";
import Spot from "./Spot";

const WIDTH = 430;
const HEIGHT = 600;
const BOARD_SIZE = 150;

const colors = {
    red: "#E63946",    // Vibrant red
    blue: "#457B9D"    // Muted slate blue
}

const GameBoard = ({ spotOnClick, onScoreChange }) => {
    const createInitialBoard = () => {
        const board = Array(9).fill().map(() => Array(5).fill(0));

        // Red pieces (top)
        // First 2 rows: 3 pieces each (columns 1-3)
        for (let i = 0; i <= 1; i++) {
            for (let j = 1; j <= 3; j++) board[i][j] = 1;
        }
        // Next 2 rows: 5 pieces each (all columns)
        for (let i = 2; i <= 3; i++) {
            for (let j = 0; j <= 4; j++) board[i][j] = 1;
        }

        // Blue pieces (bottom)
        // First 2 rows of blue: 5 pieces each (all columns)
        for (let i = 5; i <= 6; i++) {
            for (let j = 0; j <= 4; j++) board[i][j] = 2;
        }
        // Last 2 rows of blue: 3 pieces each (columns 1-3)
        for (let i = 7; i <= 8; i++) {
            for (let j = 1; j <= 3; j++) board[i][j] = 2;
        }

        return board;
    };


    const createEmptyMoves = () =>
        Array(9).fill().map(() => Array(5).fill(false));


    // Calculate positions similar to original createBoard
    const calculateSizes = () => {
        const x = WIDTH / 2;
        const y = HEIGHT / 2;
        const size = BOARD_SIZE;

        return [
            [
                { x: 0, y: 0 },
                { x: x - size / 2, y: y - size - size / 2 },
                { x: x, y: y - size - size / 2 },
                { x: x + size / 2, y: y - size - size / 2 },
                { x: 0, y: 0 },
            ],
            [
                { x: 0, y: 0 },
                { x: x - size / 4, y: y - size - size / 4 },
                { x: x, y: y - size - size / 4 },
                { x: x + size / 4, y: y - size - size / 4 },
                { x: 0, y: 0 },
            ],
            [
                { x: x - size, y: y - size },
                { x: x - size / 2, y: y - size },
                { x: x, y: y - size },
                { x: x + size / 2, y: y - size },
                { x: x + size, y: y - size },
            ],
            [
                { x: x - size, y: y - size / 2 },
                { x: x - size / 2, y: y - size / 2 },
                { x: x, y: y - size / 2 },
                { x: x + size / 2, y: y - size / 2 },
                { x: x + size, y: y - size / 2 },
            ],
            [
                { x: x - size, y: y },
                { x: x - size / 2, y: y },
                { x: x, y: y },
                { x: x + size / 2, y: y },
                { x: x + size, y: y },
            ],
            [
                { x: x - size, y: y + size / 2 },
                { x: x - size / 2, y: y + size / 2 },
                { x: x, y: y + size / 2 },
                { x: x + size / 2, y: y + size / 2 },
                { x: x + size, y: y + size / 2 },
            ],
            [
                { x: x - size, y: y + size },
                { x: x - size / 2, y: y + size },
                { x: x, y: y + size },
                { x: x + size / 2, y: y + size },
                { x: x + size, y: y + size },
            ],
            [
                { x: 0, y: 0 },
                { x: x - size / 4, y: y + size + size / 4 },
                { x: x, y: y + size + size / 4 },
                { x: x + size / 4, y: y + size + size / 4 },
                { x: 0, y: 0 },
            ],
            [
                { x: 0, y: 0 },
                { x: x - size / 2, y: y + size + size / 2 },
                { x: x, y: y + size + size / 2 },
                { x: x + size / 2, y: y + size + size / 2 },
                { x: 0, y: 0 },
            ],
        ];
    };

    const sizes = calculateSizes();

    const relations = {
        "01": ["02", "11"],
        "02": ["01", "03", "12"],
        "03": ["02", "13"],
        11: ["01", "12", "22"],
        12: ["02", "11", "13", "22"],
        13: ["03", "12", "22"],
        20: ["21", "30", "31"],
        21: ["20", "22", "31"],
        22: ["21", "31", "32", "33", "23", "12", "11", "13"],
        23: ["22", "24", "33"],
        24: ["23", "33", "34"],
        30: ["20", "31", "40"],
        31: ["20", "21", "22", "32", "42", "41", "40", "30"],
        32: ["22", "31", "42", "33"],
        33: ["22", "23", "24", "34", "44", "43", "42", "32"],
        34: ["24", "33", "44"],
        40: ["30", "31", "41", "51", "50"],
        41: ["31", "40", "51", "42"],
        42: ["41", "31", "32", "33", "43", "53", "52", "51"],
        43: ["42", "33", "44", "53"],
        44: ["33", "34", "43", "53", "54"],
        50: ["40", "51", "60"],
        51: ["40", "41", "42", "50", "52", "60", "61", "62"],
        52: ["51", "42", "53", "62"],
        53: ["42", "43", "44", "52", "54", "62", "63", "64"],
        54: ["44", "53", "64"],
        60: ["50", "51", "61"],
        61: ["51", "60", "62"],
        62: ["51", "52", "53", "61", "63", "71", "72", "73"],
        63: ["62", "53", "64"],
        64: ["53", "54", "63"],
        71: ["62", "72", "81"],
        72: ["62", "71", "73", "82"],
        73: ["62", "72", "83"],
        81: ["71", "82"],
        82: ["72", "81", "83"],
        83: ["73", "82"],
    }

    const [boardState, setBoardState] = useState(() => createInitialBoard());
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [possibleMoves, setPossibleMoves] = useState(
        Array(9).fill().map(() => Array(5).fill(false))
    );
    const [turn, setTurn] = useState("RED");

    useEffect(() => {
        setBoardState(createInitialBoard());
        setSelectedPiece(null);
        setPossibleMoves(createEmptyMoves());
        setTurn("RED");
    }, []);

    const isNullSpot = (i, j) => {
        const positions = [
            "84", "80", "74", "70",
            "14", "10", "00", "04"
        ];
        return positions.includes(`${i}${j}`);
    };

    const isValidSpot = (i, j) => !isNullSpot(i, j);

    const findValidJumps = (startI, startJ, player, board, visited = new Set()) => {
        const jumps = [];
        const currentKey = `${startI},${startJ}`;
        if (visited.has(currentKey) || !isValidSpot(startI, startJ)) return jumps;
        visited.add(currentKey);

        const neighbors = relations[`${startI}${startJ}`] || [];
        neighbors.forEach(neighbor => {
            const [midI, midJ] = neighbor.split('').map(Number);
            if (!isValidSpot(midI, midJ)) return;
            const midPiece = board[midI][midJ];

            // Check if neighbor is opponent's piece
            if (midPiece !== 0 && midPiece !== player) {
                const dx = midI - startI;
                const dy = midJ - startJ;
                const landI = midI + dx;
                const landJ = midJ + dy;

                // Check landing spot exists and is empty
                if (isValidSpot(landI, landJ) && board[landI]?.[landJ] === 0) {
                    jumps.push({
                        to: { i: landI, j: landJ },
                        jumped: [{ i: midI, j: midJ }],
                        additionalJumps: findValidJumps(landI, landJ, player, board, new Set(visited))
                    });
                }
            }
        });

        return jumps;
    };



    // Modified movement handler
    const handleSpotClick = (i, j) => {
        if (isNullSpot(i, j)) return;

        if (selectedPiece) {
            const move = possibleMoves[i][j];
            if (move) {
                // Update board state
                const newBoard = boardState.map(row => [...row]);
                newBoard[selectedPiece.i][selectedPiece.j] = 0;
                newBoard[i][j] = selectedPiece.value;

                // Calculate jumped pieces
                const jumpedPieces = move.jumped.filter(({ i, j }) =>
                    boardState[i][j] !== 0 && boardState[i][j] !== selectedPiece.value
                );

                // Update scores
                if (jumpedPieces.length > 0) {
                    const opponent = selectedPiece.value === 1 ? 'blue' : 'red';
                    const scoreChange = {
                        [opponent]: -jumpedPieces.length
                    };
                    onScoreChange(scoreChange);
                }

                // Remove jumped pieces
                jumpedPieces.forEach(({ i, j }) => {
                    newBoard[i][j] = 0;
                });

                setBoardState(newBoard);

                // Check for multi-jump
                if (jumpedPieces.length > 0) { // Only check for multi-jumps if we made a jump
                    const followUpJumps = findValidJumps(i, j, selectedPiece.value, newBoard);
                    if (followUpJumps.length > 0) {
                        const newMoves = createEmptyMoves();
                        followUpJumps.forEach(jump => {
                            newMoves[jump.to.i][jump.to.j] = {
                                ...jump,
                                jumped: [...move.jumped, ...jump.jumped]
                            };
                        });
                        setPossibleMoves(newMoves);
                        setSelectedPiece({ i, j, value: selectedPiece.value });
                    } else {
                        // End turn after final jump
                        setSelectedPiece(null);
                        setPossibleMoves(createEmptyMoves());
                        const newTurn = turn === 'RED' ? 'BLUE' : 'RED';
                        setTurn(newTurn);
                        spotOnClick(newTurn);
                    }
                } else {
                    // End turn immediately if it was a simple move
                    setSelectedPiece(null);
                    setPossibleMoves(createEmptyMoves());
                    const newTurn = turn === 'RED' ? 'BLUE' : 'RED';
                    setTurn(newTurn);
                    spotOnClick(newTurn);
                }
            } else {
                const isCurrentPlayerPiece =
                    (turn === 'RED' && boardState[i][j] === 1) ||
                    (turn === 'BLUE' && boardState[i][j] === 2);

                if (isCurrentPlayerPiece) {
                    // Switch selection to new piece
                    const moves = calculatePossibleMoves(i, j);
                    setPossibleMoves(moves);
                    setSelectedPiece({ i, j, value: boardState[i][j] });
                } else {
                    // Deselect if clicking empty or opponent's piece
                    setSelectedPiece(null);
                    setPossibleMoves(createEmptyMoves());
                }
            }
            return;
        }

        // Select piece if belongs to current player
        if (boardState[i][j] !== 0 && (
            (turn === 'RED' && boardState[i][j] === 1) ||
            (turn === 'BLUE' && boardState[i][j] === 2)
        )) {
            const moves = calculatePossibleMoves(i, j);
            setPossibleMoves(moves);
            setSelectedPiece({ i, j, value: boardState[i][j] });
        }
    };

    const calculatePossibleMoves = (i, j) => {
        const moves = createEmptyMoves();
        if (!isValidSpot(i, j)) return moves;
        const player = boardState[i][j];

        // Check simple adjacent moves
        const neighbors = relations[`${i}${j}`] || [];
        neighbors.forEach(neighbor => {
            const [x, y] = neighbor.split('').map(Number);
            if (isValidSpot(x, y) && boardState[x][y] === 0) {
                moves[x][y] = { jumped: [] };
            }
        });


        // Check jump moves
        const jumps = findValidJumps(i, j, player, boardState);
        jumps.forEach(jump => {
            moves[jump.to.i][jump.to.j] = {
                to: jump.to,
                jumped: jump.jumped,
                chain: jump.additionalJumps
            };
        });

        return moves;
    };

    return (
        <svg className="board" width={WIDTH} height={HEIGHT}>
            {/* Render connection lines */}
            {Object.entries(relations).map(([key, connections]) => {
                const [iKey, jKey] = key.split("").map(Number);
                const from = sizes[iKey][jKey];

                return connections.map((conn, idx) => {
                    const [x, y] = conn.split("").map(Number);
                    const toSpot = sizes[x][y];
                    const isPossiblePath = possibleMoves[x]?.[y] || possibleMoves[iKey]?.[jKey];

                    return (
                        <motion.line
                            key={`${key}-${idx}`}
                            x1={from.x}
                            y1={from.y}
                            x2={toSpot.x}
                            y2={toSpot.y}
                            stroke={isPossiblePath ? "#4ade80" : "white"}
                            strokeWidth="2"
                            strokeOpacity={isPossiblePath ? 1 : 0.5}
                        />
                    );
                });
            })}

            {/* Render spots */}
            {boardState.map((row, i) => row.map((cell, j) => {
                if (isNullSpot(i, j)) return null;
                const { x, y } = sizes[i][j];

                return (
                    <Spot
                        key={`${i}-${j}`}
                        x={x}
                        y={y}
                        isPossibleMove={possibleMoves[i][j]}
                        onClick={() => handleSpotClick(i, j)}
                    >
                        {cell !== 0 && (
                            <motion.g
                                layoutId={`piece-${i}-${j}`}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Piece
                                    x={x}
                                    y={y}
                                    color={cell === 1 ? colors.red : colors.blue}
                                    isSelected={selectedPiece?.i === i && selectedPiece?.j === j}
                                />
                            </motion.g>
                        )}
                    </Spot>
                );
            }))}
        </svg>
    )
}

export default GameBoard
