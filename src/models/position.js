export default class Position {

  static buildKey(q, r) {
    return `${q}:${r}`;
  }

  constructor(q, r) {
    this.q = q;
    this.r = r;
  }

  moveTo(q, r) {
    return new Position(
      q === undefined ? this.q : q,
      r === undefined ? this.r : r
    );
  }
  move(q, r) {
    return new Position(
      q === undefined ? this.q : this.q + q,
      r === undefined ? this.r : this.r + r
    );
  }
  key() {
    return Position.buildKey(this.q, this.r);
  }
  toString() {
    return this.key();
  }

}
