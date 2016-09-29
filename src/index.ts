import Team from "./team";
import Position from "./position";
import Person from "./person";
import Zone from "./zone";
import Snapshot from "./snapshot";

// import Random from "./Rc4Random";
// Random.init("12345");

/// <reference path="seedrandom.d.ts" />
import * as seedrandom from 'seedrandom';
// console.log(seedrandom)
var rng = seedrandom('12345');

const team = new Team(new Position(2, 6))
  .addPerson(Person.random())
  .addPerson(Person.random())
  .addPerson(Person.random())
  .move(1, 2);

let snapshot = new Snapshot()
for (let i=0; i<3; ++i) {
  for (let j=0; j<3; ++j) {
    snapshot.addZone(new Zone(new Position(i, j), Zone.Type.Mountainous, Zone.Biome.City), 1)
  }
}
snapshot.addZone(new Zone(new Position(1, 2), Zone.Type.Mountainous, Zone.Biome.City), 2)

console.log(""+team);
console.log(""+snapshot);
