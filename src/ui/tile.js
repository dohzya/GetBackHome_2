import Hex from '../hex';

import Point from './point';

export default class Tile {
  constructor(position, height, color, picture, age) {
    this.position = position;
    this.height = height;
    this.color = color;
    this.picture = picture;
    this.age = age;
  }
  ageAlpha() {
    if (this.age > 30) {
      return 0.4;
    }
    return 1 - (this.age / 30 * 0.6);
  }
  center(size) {
    const {x, y} = Hex.positionToPixel(this.position, size);
    return new Point(x, y);
  }
  corners(size) {
    const center = this.center(size);
    const offsets = [];
    for (let i = 0; i < 6; i++) {
      const angle = 2.0 * Math.PI * (0.5 + i) / 6;
      offsets.push({x: Math.cos(angle), y: Math.sin(angle)});
    }
    const points = [];
    for (let offset of offsets) {
      points.push(new Point(center.x + (size+1) * offset.x, center.y + (size+1) * offset.y));
    }
    return points;
  }
}
