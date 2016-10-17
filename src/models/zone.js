function makeEnum(...names) {
  const theenum = {};
  theenum.allNames = [];
  theenum.allIndexes = [];
  theenum.namesToIndexes = [];
  for (let idx=0; idx < names.length; idx++) {
    const name = names[idx];
    const enumIndex = idx+1;
    theenum[name] = name
    theenum[enumIndex] = name
    theenum.allNames.push(name);
    theenum.allIndexes.push(enumIndex);
    theenum.namesToIndexes[name] = enumIndex;
  }
  return theenum;
}

const Biome = makeEnum(
  'Bare',
  'Beach',
  'Grassland',
  'Ocean',
  'Scorched',
  'Shrubland',
  'Snow',
  'SubtropicalDesert',
  'Taiga',
  'TemperateDeciduousForest',
  'TemperateDesert',
  'TemperateRainForest',
  'TropicalRainForest',
  'TropicalSeasonalForest',
  'Tundra'
);
const Structure = makeEnum(
  'Empty',
  'City',
  'Forest',
  'Field',
  'Mountains'
);

export default class Zone {

  static get Biome() { return Biome; }
  static get Structure() { return Structure; }

  constructor(position, height, biome, structure) {
    this.position = position;
    this.biome = biome;
    this.structure = structure;
    this.height = height;
  }

  toString() {
    const biome = Biome[this.biome]
    const structure = Structure[this.structure]
    return `Zone(${this.position}, ${this.height}, ${biome}, ${structure})`;
  }

}
