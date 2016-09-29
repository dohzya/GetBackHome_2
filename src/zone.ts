import Position from "./position";

enum ZoneType {
  Water = 1,
  Swamp,
  Plain,
  Mountainous,
}

enum ZoneBiome {
  City = 1,
  Forest,
  Field,
  Mountains,
}

export default class Zone {

  static Type = ZoneType;
  static Biome = ZoneBiome;

  position: Position;
  type: ZoneType;
  biome: ZoneBiome;

  constructor(position: Position, type: ZoneType, biome: ZoneBiome) {
    this.position = position;
    this.type = type;
    this.biome = biome;
  }

  toString = () => `Zone(${this.position}, ${ZoneType[this.type]}, ${ZoneBiome[this.biome]})`;

}
