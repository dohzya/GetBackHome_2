export default class Position {

  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  moveTo = (x?: number, y?: number) => new Position(
    x === undefined ? this.x : x,
    y === undefined ? this.y : y
  );
  move = (x?: number, y?: number) => new Position(
    x === undefined ? this.x : this.x + x,
    y === undefined ? this.y : this.y + y
  );
  key = () => `${this.x}:${this.y}`
  toString = () => this.key();

}
