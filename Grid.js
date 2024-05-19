import { GRID_SIZE } from "./app.js";
import { CELL_SIZE } from "./app.js";
import { CELL_GAP } from "./app.js";




export default class Grid {
  #cellItems;
  constructor(gridElement) {
    console.log(GRID_SIZE)
    gridElement.style.setProperty("--grid_size", GRID_SIZE);
    gridElement.style.setProperty("--cell_size", `${CELL_SIZE}vmin`);
    gridElement.style.setProperty("--cell_gap", `${CELL_GAP}vmin`);
    this.cellsArray = createCells(gridElement);
    this.#cellItems = this.cellsArray.map((cell, idx) => {
      return new Cell(cell, idx % GRID_SIZE, Math.floor(idx / GRID_SIZE));
    });
  }

  get cells() {
    return this.#cellItems;
  }

  get cellsByColumns() {
    return this.#cellItems.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || [];
      cellGrid[cell.x][cell.y] = cell;
      return cellGrid;
    }, []);
  }
  get cellsByRow() {
    return this.#cellItems.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || [];
      cellGrid[cell.y][cell.x] = cell;
      return cellGrid;
    }, []);
  }

  get #emptyCells() {
    return this.#cellItems.filter((item) => item.tile == null);
  }

  randomEmptyCell() {
    this.randomIdx = Math.floor(Math.random() * this.#emptyCells.length);
    return this.#emptyCells[this.randomIdx];
  }
  
}

class Cell {
  #cellElement;
  #x;
  #y;
  #tile;
  #mergeTile;
  constructor(cell, x, y) {
    this.#cellElement = cell;
    this.#x = x;
    this.#y = y;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get tile() {
    return this.#tile;
  }

  get mergeTile() {
    return this.#mergeTile;
  }

  set mergeTile(val) {
    this.#mergeTile = val;
    if (val == null) return;
    this.#mergeTile.x = this.#x;
    this.#mergeTile.y = this.#y;
  }

  set tile(val) {
    this.#tile = val;
    if (val == null) return;
    this.#tile.x = this.#x;
    this.#tile.y = this.#y;
  }
  canAccept(tile) {
    return (this.tile == null || (this.#mergeTile == null && this.tile.value == tile.value));
  }

  mergeTiles() {
    if (this.tile == null || this.mergeTile == null) return;
    this.tile.value = this.tile.value + this.mergeTile.value;
    this.mergeTile.remove();
    this.mergeTile = null;
  } 
}

function createCells(gridElement) {
  let cellsArray = [];
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cellsArray.push(cell);
    gridElement.appendChild(cell);
  }

  return cellsArray;
}
