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
  'Water',
  'Beach',
  'Swamp',
  'Plain',
  'Mountainous'
);
const Structure = makeEnum(
  'Empty',
  'City',
  'Forest',
  'Field',
  'Mountains'
);

export default class Zone {

  static get Biome() {
    return Biome;
  }
  static get Structure() {
    return Structure;
  }

  constructor(position, height, biome, structure) {
    this.position = position;
    this.biome = biome;
    this.structure = structure;
    this.height = height;
  }

  toString() {
    return `Zone(${this.position}, ${Structure[this.structure]}, ${Biome[this.biome]})`;
  }

}
