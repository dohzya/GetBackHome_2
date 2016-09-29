import Zone from "./zone";

class SnapshotItem<A> {

  time: Time;
  item: A;

  constructor(time: Time, item: A) {
    this.time = time;
    this.item = item;
  }

  toString = () => `<${this.time}>${this.item}`

}

type Time = number;

export default class Snapshot {

  static Item = SnapshotItem;

  zones: {[key:string]: SnapshotItem<Zone>};

  constructor(zones?: {[key:string]: SnapshotItem<Zone>}) {
    this.zones = zones || {};
  }

  addZone = (zone: Zone, time: Time) => {
    this.zones[zone.position.key()] = new SnapshotItem<Zone>(time, zone);
  };
  toString = () => {
    let txt = Object.keys(this.zones).map(key => this.zones[key]).join(', ');
    return `Snapshot(${txt})`;
  }

}
