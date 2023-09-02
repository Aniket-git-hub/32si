import Spot from "./Spot";

function GameBoard(props) {
    // constants for board dimensions
    const ROWS = 7;
    const COLS = 5;

    // create relations object with only valid and relevant values
    const relations = {};

    // loop through each row
    for (let i = 0; i < ROWS; i++) {
        // loop through each column
        for (let j = 0; j < COLS; j++) {
            // create a key for each spot using its row and column index
            let key = `${i}${j}`;
            // create an empty array for each key
            relations[key] = [];
            // check if the spot has a left neighbor
            if (j > 0) {
                // add the left neighbor to the array
                relations[key].push(`${i}${j - 1}`);
            }
            // check if the spot has a right neighbor
            if (j < COLS - 1) {
                // add the right neighbor to the array
                relations[key].push(`${i}${j + 1}`);
            }
            // check if the spot has a top neighbor
            if (i > 0) {
                // add the top neighbor to the array
                relations[key].push(`${i - 1}${j}`);
            }
            // check if the spot has a bottom neighbor
            if (i < ROWS - 1) {
                // add the bottom neighbor to the array
                relations[key].push(`${i + 1}${j}`);
            }
        }
    }

    // remove some values that are not part of the grid structure
    relations["00"] = [];
    relations["04"] = [];
    relations["60"] = [];
    relations["64"] = [];

    let x = 430 / 2;
    let y = 620 / 2;
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
    ];
    let board = [
        [0, 0, 0, 0, 0],
        [0, 1, 2, 1, 0],
        [2, 2, 2, 2, 2],
        [1, 1, 0, 1, 1],
        [2, 2, 2, 2, 2],
        [0, 1, 2, 1, 0],
        [0, 0, 0, 0, 0],
    ];
    const MARGIN = 10;
    
    console.log(props)
    return (
        <div>
            {board.map((row, i) => {
                return row.map((spot, j) => {
                    // calculate position and size of each spot based on i and j
                    let position = sizes[i][j];
            return (
            <Spot
                key={`${i}-${j}`}
                relations={relations}
                position={position}
                    size={(size - (COLS + 1) * MARGIN) / COLS }
                value={spot}
            />
            );
        });
      })}
        </div>
    );
}

export default GameBoard