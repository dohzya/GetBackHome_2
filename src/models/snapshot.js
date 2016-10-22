import R from 'ramda';

import Position from "./position";

class SnapshotItem {

  constructor(time, item) {
    this.time = time;
    this.item = item;
  }

  toString() { return `<${this.time}>${this.item}` }

}

class SnapshotedCollection {
  constructor() {
    this.items = {};
  }
  add(key, item, time) {
    const existing = this.items[key];
    if (!existing || existing.time < time) {
      this.items[key] = new SnapshotItem(time, item);
    }
  }
  get(key) {
    return this.items[key];
  }
  all() {
    return R.values(this.items);
  }

}

export default class Snapshot {

  static Item() { return SnapshotItem; }

  constructor() {
    this.zones = new SnapshotedCollection();
    this.teams = new SnapshotedCollection();
  }

  addZone(zone, time) {
    const key = zone.position.key();
    this.zones.add(key, zone, time);
  }
  getZone(x, y) {
    return this.zones.get(Position.buildKey(x, y));
  }
  allZones() {
    return this.zones.all();
  }

  addTeam(team, time) {
    this.teams.add(team.name, team, time);
  }
  getTeam(teamName) {
    return this.teams.get(teamName);
  }
  allTeams() {
    return this.teams.all();
  }

  toString() {
    const zones = this.zones.all();
    const teams = this.teams.all();
    return `Snapshot(${zones}, ${teams})`;
  }

}
