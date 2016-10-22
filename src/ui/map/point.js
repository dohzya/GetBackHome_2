export default class Point {
  constructor(x, y) {
    this.x = Math.round(x);
    this.y = Math.round(y);
  }

  add(pt) {
    return new Point(this.x + pt.x, this.y + pt.y);
  }
  diff(pt) {
    return new Point(this.x - pt.x, this.y - pt.y);
  }
}
