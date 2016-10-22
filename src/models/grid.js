import Position from './position';

export default class Grid {
  constructor(maxq, maxr) {
    this.maxq = maxq;
    this.maxr = maxr;
    this.zones = [];
  }
  get(q, r) {
    return this[Position.buildKey(q, r)];
  }
  addZone(zone) {
    const key = zone.position.key();
    this.zones.push(zone);
    this[key] = zone;
  }
}
