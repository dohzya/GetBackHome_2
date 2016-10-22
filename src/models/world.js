import Generators from './generators';
import Grid from './grid';
import Position from './position';
import Zone from './zone';

export default class World {

  constructor({rng, maxq, maxr}) {
    this.rng = rng;
    this.timestamp = 0;
    this.grid = new Grid(maxq, maxr);
    this.teams = [];

    const {genHeight, genBiome, genStructure} = Generators(rng);
    for (let j = 0; j < this.grid.maxr; ++j) {
      for (let i = 0-(Math.floor(j/2)); i < this.grid.maxq-(Math.floor(j/2)); ++i) {
        const q = i - Math.floor(this.grid.maxq * 1/3);
        const r = j - Math.floor(this.grid.maxr * 1/2);
        const height = genHeight(q, r);
        const biome = genBiome(q, r, height);
        const structure = genStructure(q, r, height, biome);
        this.grid.addZone(new Zone(new Position(q, r), height, biome, structure))
      }
    }
  }

}
