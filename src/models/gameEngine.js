import Snapshot from './snapshot';
import Team from './team';
import Position from './position';
import Person from './person';

function build(world) {
  const engine = {
    snapshot: new Snapshot(),
    selectZone({q, r}) {
      const zone = world.grid.get(q, r);
      if (zone) {
        console.log(zone.toString());
        this.snapshot.addZone(zone, world.timestamp);
        world.timestamp++;
      }
    },
    teamIdx: 0,
    createTeam(position, people) {
      this.teamIdx++;
      const name =`Team ${this.teamIdx}`;
      const team = new Team(name, position, people);
      world.teams.push(team);
      return team;
    },
  };
  // demo
  for (let zone of world.grid.zones) {
    engine.snapshot.addZone(zone, world.timestamp);
  }
  const team = engine.createTeam(new Position(2, 6), [
    Person.random(world.rng),
    Person.random(world.rng),
    Person.random(world.rng),
  ]);
  engine.snapshot.addTeam(team, world.timestamp);
  world.timestamp = 10;
  // -
  return engine;
}

export default {
  build,
}
