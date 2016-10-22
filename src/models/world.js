import Generators from './generators';
import Grid from './grid';
import Position from './position';
import Zone from './zone';

function build({rng, maxq, maxr}) {
  const world = {
    rng,
    timestamp: 0,
    grid: new Grid(maxq, maxr),
    teams: [],
  };
  const {genHeight, genBiome, genStructure} = Generators(rng);
  for (let j = 0; j < world.grid.maxr; ++j) {
    for (let i = 0-(Math.floor(j/2)); i < world.grid.maxq-(Math.floor(j/2)); ++i) {
      const q = i - Math.floor(world.grid.maxq * 1/3);
      const r = j - Math.floor(world.grid.maxr * 1/2);
      const height = genHeight(q, r);
      const biome = genBiome(q, r, height);
      const structure = genStructure(q, r, height, biome);
      world.grid.addZone(new Zone(new Position(q, r), height, biome, structure))
    }
  }
  return world;
}

export default {
  build,
}
