export default class Point {
  constructor(x, y) {
    this.x = Math.round(x);
    this.y = Math.round(y);
  }

  diff(pt) {
    return {x: this.x - pt.x, y: this.y - pt.y};
  }
}
