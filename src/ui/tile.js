import Hex from '../hex';

import Point from './point';

export default class Tile {
  constructor(position, size, height, color, picture, age) {
    this.position = position;
    this.size = size;
    this.height = height;
    this.color = color;
    this.picture = picture;
    this.age = age;
    const {x, y} = Hex.positionToPixel(position, size)
    this.center = new Point(x, y);
  }
  ageAlpha() {
    if (this.age > 30) {
      return 0.3;
    }
    return 0.7 - (this.age / 30 * 0.7) + 0.3;
  }
  corners() {
    const x = this.center.x
    const y = this.center.y
    const offsets = [];
    for (let i = 0; i < 6; i++) {
      const angle = 2.0 * Math.PI * (0.5 + i) / 6;
      offsets.push({x: Math.cos(angle), y: Math.sin(angle)});
    }
    const points = [];
    for (let offset of offsets) {
      points.push(new Point(x + this.size * offset.x, y + this.size * offset.y));
    }
    return points;
  }
}
