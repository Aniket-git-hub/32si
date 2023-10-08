import { useEffect, useState } from "react"
import Piece from "./Piece"
import Spot from "./Spot"

const GameBoard = ({ spotOnClick }) => {
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
    const [turn, setTurn] = useState(false)

    useEffect(() => {
        spotOnClick(turn)
    }, [turn])

    const boardInitialState = [
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

    const [possibleMoves, setPossibleMoves] = useState([
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false]
    ])

    let beadsBoard = []
    const [pieces, setPieces] = useState(boardInitialState.map((row, i) => row.map((pieceValue, j) => {
        return <Piece
            position={{
                x: `${sizes[i][j].x}px`,
                y: `${sizes[i][j].y}px`,
            }}
            size="10px"
            value={pieceValue}
        />
    })));
    const [lastClickedSpot, setLastClickedSpot] = useState(null);
    const [firstClick, setFirstClick] = useState(false)

    function spotOnClickHandler(e, spot) {
        if (!spot.piece) {
            if (!lastClickedSpot) return
            movePiece(e, spot, lastClickedSpot)
        } else
            showPossibleMoves(e, spot)

    }

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
        spot.relations.forEach(p => {
            let [i, j] = p.split("");
            let neighouringSpot = beadsBoard[i][j]
            if (!neighouringSpot.props.piece) {
                newPossibleMoves[i][j] = true;
            }
        });
        setFirstClick(true)
        setPossibleMoves(newPossibleMoves);
        setLastClickedSpot(spot);
    }
    function movePiece(e, spot, lastClickedSpot) {
        // alert("Selected Piece wil be moved here")
        console.log(lastClickedSpot)
    }

    boardInitialState.forEach((row, i) => {
        let rowArray = [];
        row.forEach((col, j) => {

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
                    piece={pieces[i][j].props.value !== 0 ? pieces[i][j] : null}
                    relations={relations[`${i}${j}`]}
                    isPossibleMove={possibleMoves[i][j]}
                    onClick={spotOnClickHandler}
                />
            )
        })
        beadsBoard.push(rowArray);
    })

    return (
        <svg className="board">
            {Object.entries(relations).map((row, index) => {
                const [i, j] = row[0].split("")
                let from = sizes[i][j]
                return row[1].map((e, indexTwo) => {
                    const [k, l] = e.split("")
                    let to = sizes[k][l]
                    return (
                        <line
                            key={`${index + indexTwo}`}
                            x1={`${from.x}`}
                            y1={`${from.y}`}
                            x2={`${to.x}`}
                            y2={`${to.y}`}
                            stroke="white"
                            strokeWidth="3px"
                        />
                    )
                })
            })}
            {beadsBoard}
        </svg>
    )
}

export default GameBoard
