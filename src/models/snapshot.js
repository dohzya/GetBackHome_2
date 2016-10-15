import Position from "./position";
import Zone from "./zone";

class SnapshotItem {

  constructor(time, item) {
    this.time = time;
    this.item = item;
  }

  toString() { return `<${this.time}>${this.item}` }

}

export default class Snapshot {

  static Item() { return SnapshotItem; };

  constructor() {
    this.timedZones = {};
  }

  addZone(zone, time) {
    const key = zone.position.key();
    const existing = this.timedZones[key];
    if (!existing || existing.time < time) {
      this.timedZones[key] = new SnapshotItem(time, zone);
    }
  }
  get(x, y) {
    return this.timedZones[Position.buildKey(x, y)];
  }
  all() {
    const zones = [];
    for (let key of Object.keys(this.timedZones)) {
      zones.push(this.timedZones[key]);
    }
    return zones;
  }
  toString() {
    let txt = Object.keys(this.timedZones).map(key => this.timedZones[key]).join(', ');
    return `Snapshot(${txt})`;
  }

}
