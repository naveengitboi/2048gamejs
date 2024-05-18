import Grid from "./Grid.js";
import Tile from "./Tile.js";

const gridElement = document.getElementById("gameGrid")
const grid = new Grid(gridElement)
grid.randomEmptyCell().tile = new Tile(gridElement);
grid.randomEmptyCell().tile = new Tile(gridElement);
setupInput();

function setupInput() {
    window.addEventListener('keydown', handleInput, { once: true })
}


async function handleInput(event) {
    let keyString = event.key;

    switch (keyString) {
        case "ArrowUp":
            await moveUp();
            break;
        case "ArrowDown":
            await moveDown();
            break;
        case "ArrowLeft":
            await moveLeft();
            break;
        case "ArrowRight":
            await moveRight();
            break;
        default:
            setupInput();
            return;

    }

    grid.cells.forEach(cell => cell.mergeTiles())

    const newTile = new Tile(gridElement );
    grid.randomEmptyCell().tile = newTile;

    if(!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()){
        newTile.waitForTransition(true).then(() => {
            alert("You Lose")
        })
        return
    }

    setupInput();

}


function moveUp() {
    return slideTiles(grid.cellsByColumns);
}

function moveDown() {
    return slideTiles(grid.cellsByColumns.map(column => [...column].reverse()));
}
function moveLeft() {
    return slideTiles(grid.cellsByRow);
}

function moveRight() {
    return slideTiles(grid.cellsByRow.map(column => [...column].reverse()));
}



function slideTiles(cells) {
    return Promise.all(
    cells.flatMap((group) => {
        const promises = []
        for (let i = 1; i < group.length; i++) {
            const cell = group[i];
            if (cell.tile == null) continue;
            let lastValidCell;
            for (let j = i - 1; j >= 0; j--) {
                const moveToCell = group[j];
                if (!moveToCell.canAccept(cell.tile)) break;
                lastValidCell = moveToCell;
            }

            if (lastValidCell != null) {
                promises.push(cell.tile.waitForTransition())
                if (lastValidCell.tile != null) {
                    lastValidCell.mergeTile = cell.tile
                }
                else {
                    lastValidCell.tile = cell.tile
                }

                cell.tile = null;
            }
        }
        return promises
    }))
}

function canMoveUp() {
    return canMove(grid.cellsByColumns)
}

function canMoveDown() {
    return canMove(grid.cellsByColumns.map(column => [...column].reverse()))
}

function canMoveLeft() {
    return canMove(grid.cellsByRow)
}

function canMoveRight() {
    return canMove(grid.cellsByRow.map(row => [...row].reverse()))
}

function canMove(cells){
    return cells.some(group => {
        return group.some((cell, index) => {
            if (index === 0) return false
            if (cell.tile == null) return false
            const moveToCell = group[index - 1]
            return moveToCell.canAccept(cell.tile)
        })
    })
}