import Snapshot from './snapshot';
import Team from './team';
import Position from './position';
import Person from './person';
import World from './world';

function build(opts) {
  const world = new World(opts); // private
  const engine = {
    debug: opts.debug,
    get maxq() { return world.grid.maxq; },
    get maxr() { return world.grid.maxr; },
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
    allTiles(theme) {
      return this.snapshot.allZones().map(timedZone =>
        theme.zone2tile(timedZone, world.timestamp)
      );
    },
  };
  // demo
  for (let zone of world.grid.zones) {
    engine.snapshot.addZone(zone, world.timestamp);
  }
  const team1 = engine.createTeam(new Position(2, 6), [
    Person.random(world.rng),
    Person.random(world.rng),
    Person.random(world.rng),
  ]);
  engine.snapshot.addTeam(team1, world.timestamp);
  const team2 = engine.createTeam(new Position(0, 0), [
    Person.random(world.rng),
    Person.random(world.rng),
    Person.random(world.rng),
  ]);
  engine.snapshot.addTeam(team2, world.timestamp);
  world.timestamp = 10;
  // -
  return engine;
}

export default {
  build,
};
