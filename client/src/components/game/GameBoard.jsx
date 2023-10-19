import { useEffect, useState } from "react"
import Piece from "./Piece"
import Spot from "./Spot"

const GameBoard = ({ boardUpdate, setNewGame, creator, user }) => {
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
    let x = 430 / 2
    let y = 620 / 2
    const size = 190
    const sizes = [
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
    ]

    let boardInitialState = [
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0],
        [2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2],
        [0, 2, 2, 2, 0],
        [0, 2, 2, 2, 0],
    ]

    const [possibleMoves, setPossibleMoves] = useState(boardInitialState.map(row => row.map(_ => false)))
    let beadsBoard = []
    let linesArray = [];

    const [pieces, setPieces] = useState(boardInitialState.map((row, i) => row.map((pieceValue, j) => {
        return pieceValue !== 0 ? <Piece
            position={{
                x: `${sizes[i][j].x}px`,
                y: `${sizes[i][j].y}px`,
            }}
            size="10px"
            value={pieceValue}
        /> : null
    })));
    const [lastClickedSpot, setLastClickedSpot] = useState(null);
    const [firstClick, setFirstClick] = useState(false)
    const [currentPlayer, setCurrentPlayer] = useState(1);
    const [currentPlayerName, setCurrentPlayerName] = useState(null);
    const [redScore, setRedScore] = useState(16);
    const [blueScore, setBlueScore] = useState(16);

    function spotOnClickHandler(e, spot) {
        if (spot.piece && spot.piece.props.value !== currentPlayer) {
            return;
        }
        if (!spot.piece) {
            if (!lastClickedSpot) return
            movePiece(e, spot, lastClickedSpot)
        } else {
            showPossibleMoves(e, spot)
        }
    }

    /**
     * 
     * @param {onClick} e navtive click event
     * @param {Spot} spot currently clicked spot to of from which possible moves will be shown
     * @returns 
     */
    function showPossibleMoves(e, spot) {
        let newPossibleMoves = [...possibleMoves]
        if (firstClick && lastClickedSpot && lastClickedSpot.boardPosition.i === spot.boardPosition.i && lastClickedSpot.boardPosition.j === spot.boardPosition.j) {
            spot.relations.forEach(p => {
                let [i, j] = p.split("");
                newPossibleMoves[i][j] = false;
            });
            setPossibleMoves(newPossibleMoves);
            setLastClickedSpot(spot);
            setFirstClick(false)
            return
        }
        if (lastClickedSpot) {
            lastClickedSpot.relations.forEach(p => {
                let [lastI, lastJ] = p.split("");
                newPossibleMoves[lastI][lastJ] = false;
            });
        }
        const { i: currentI, j: currentJ } = spot.boardPosition
        spot.relations.forEach(p => {
            let [firstLevelNeighbourI, firstLevelNeighbourJ] = p.split("");
            let neighbouringSpot = beadsBoard[firstLevelNeighbourI][firstLevelNeighbourJ]
            if (!neighbouringSpot.props.piece) {
                newPossibleMoves[firstLevelNeighbourI][firstLevelNeighbourJ] = true;
            } else {
                if (neighbouringSpot.props.piece.value === spot.piece.value) {
                    neighbouringSpot.props.relations.forEach(p2 => {
                        let [secondLevelNeighbourI, secondLevelNeighbourJ] = p2.split("");
                        if (currentI == firstLevelNeighbourI || currentJ == firstLevelNeighbourJ) {
                            if ((currentI == firstLevelNeighbourI && firstLevelNeighbourI == secondLevelNeighbourI) ||
                                (currentJ == firstLevelNeighbourJ && firstLevelNeighbourJ === secondLevelNeighbourJ)) {
                                let neighbouringNeighbouringSpot = beadsBoard[secondLevelNeighbourI][secondLevelNeighbourJ]
                                if (!neighbouringNeighbouringSpot.props.piece) {
                                    newPossibleMoves[secondLevelNeighbourI][secondLevelNeighbourJ] = true;
                                }
                            }
                        } else {
                            if ((firstLevelNeighbourI != secondLevelNeighbourI && firstLevelNeighbourJ != secondLevelNeighbourJ) &&
                                (currentI != secondLevelNeighbourI && currentJ != secondLevelNeighbourJ)
                            ) {
                                newPossibleMoves[secondLevelNeighbourI][secondLevelNeighbourJ] = true;
                            }
                        }
                    });
                }

            }
        });
        setFirstClick(true)
        setPossibleMoves(newPossibleMoves);
        setLastClickedSpot(spot);
    }

    function movePiece(e, spot) {
        let lastPiece = lastClickedSpot.piece
        let { i, j } = spot.boardPosition

        if (possibleMoves[i][j]) {
            let newPiece = <Piece
                position={{
                    x: `${sizes[i][j].x}px`,
                    y: `${sizes[i][j].y}px`,
                }}
                size="10px"
                value={lastPiece.props.value}
            />

            let newPieces = pieces.map(row => [...row]);
            newPieces[i][j] = newPiece;
            newPieces[lastClickedSpot.boardPosition.i][lastClickedSpot.boardPosition.j] = null;

            if (!lastClickedSpot.relations.includes(`${i}${j}`)) {
                let middleI = (lastClickedSpot.boardPosition.i + i) / 2;
                let middleJ = (lastClickedSpot.boardPosition.j + j) / 2;

                newPieces[middleI][middleJ] = null;

                if (pieces[middleI][middleJ].props.value === 1) {
                    setRedScore(redScore - 1);
                } else if (pieces[middleI][middleJ].props.value === 2) {
                    setBlueScore(blueScore - 1);
                }
            }

            setPieces(newPieces);

            setPossibleMoves(possibleMoves.map(row => row.map(() => false)));
            setLastClickedSpot(null);
            setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
            setCurrentPlayerName(currentPlayer == 1 ? user.username : creator)

        }

    }

    function resetGame() {
        setPieces(boardInitialState.map((row, i) => row.map((pieceValue, j) => {
            return pieceValue !== 0 ? <Piece
                position={{
                    x: `${sizes[i][j].x}px`,
                    y: `${sizes[i][j].y}px`,
                }}
                size="10px"
                value={pieceValue}
            /> : null
        })));
        setPossibleMoves(boardInitialState.map(row => row.map(_ => false)));
        setLastClickedSpot(null);
        setFirstClick(false);
        setCurrentPlayer(1);
        setRedScore(16);
        setBlueScore(16);
    }

    useEffect(() => {
        resetGame()
    }, [setNewGame])

    useEffect(() => {
        let winner = redScore === 0 ? 2 : blueScore === 0 ? 1 : null
        setCurrentPlayerName(currentPlayer == 1 ? user.username : creator)
        boardUpdate(currentPlayerName, redScore, blueScore, winner)
    }, [blueScore, redScore, currentPlayer])

    boardInitialState.forEach((row, i) => {
        let rowArray = [];
        row.forEach((_, j) => {
            rowArray.push(
                <Spot
                    key={`${i}${j}`}
                    position={{
                        x: `${sizes[i][j].x}px`,
                        y: `${sizes[i][j].y}px`,
                    }}
                    size="12px"
                    boardPosition={{ i, j }}
                    nullSpot={
                        `${i}${j}` == "84" ||
                            `${i}${j}` == "80" ||
                            `${i}${j}` == "74" ||
                            `${i}${j}` == "70" ||
                            `${i}${j}` == "14" ||
                            `${i}${j}` == "10" ||
                            `${i}${j}` == "00" ||
                            `${i}${j}` == "04"
                            ? true
                            : false
                    }
                    piece={pieces[i][j]}
                    relations={relations[`${i}${j}`]}
                    isPossibleMove={possibleMoves[i][j]}
                    onClick={spotOnClickHandler}
                />
            )
        })
        beadsBoard.push(rowArray);
    })


    Object.entries(relations).forEach((row, rowIndex) => {
        const [i, j] = row[0].split("");
        let from = sizes[i][j];
        let rowArray = [];
        row[1].forEach((e, columnIndex) => {
            const [k, l] = e.split("");
            let to = sizes[k][l];
            let line = (
                <line
                    key={`${rowIndex}-${columnIndex}`}
                    x1={`${from.x}`}
                    y1={`${from.y}`}
                    x2={`${to.x}`}
                    y2={`${to.y}`}
                    stroke="white"
                    strokeWidth="3px"
                />
            );
            rowArray.push(line);
        });
        linesArray.push(rowArray);
    });

    return (
        <svg className={`board ${creator === user.username && 'rotate'} `} >
            {linesArray}
            {beadsBoard}
        </svg>
    )
}

export default GameBoard
