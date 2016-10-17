import FastSimplexNoise from 'fast-simplex-noise';

import Zone from "./zone";

const ZONE_HEIGHT = 0;
const ZONE_MOISTURE = 1;
const ZONE_STRUCTURE = 2;

/* NOISE GENERATOR CONFIGURATION

amplitude: 1
  The maximum absolute value that a specific coherent-noise function can output.
  But value will be scale so no final height is greater than 1

frequency: 0.05
  The frequency determines how many changes occur along a unit length.
  Increasing the frequency will increase the number of terrain features
  (and also decrease the size of these features),
  decreasing it will rendera smoother map.

octaves: 6
  The final output you can see is actually the sum of several functions
  and each one is called an octave.
  Each octave has a greater frequency than the previous one,
  thus, the more octaves, the more details on the map.

persitence: 0.2
  A multiplier that determines how quickly the amplitudes diminish
  for each successive octave.
  Increasing the persistence value will create a rougher map,
  while decreasing the persistence value will create a smoother height map.

*/

function genHeight(rng) {
  const gen = new FastSimplexNoise({
    amplitude: 1,
    frequency: 0.05,
    max: 1,
    min: 0,
    octaves: 5,
    persitence: 0.2,
    random: rng,
  });
  return (q, r) => {
    const val = gen.in3D(q, r, ZONE_HEIGHT);
    let level = 100;
    if (q > -10 && q < 10 && r > -10 && r < 10) {
      level = 0;
    }
    return Math.floor(Math.pow(val, 3) * 5000 - level);
  };
}

function genBiome(rng) {
  const gen = new FastSimplexNoise({
    amplitude: 1,
    frequency: 0.005,
    max: 1,
    min: 0,
    octaves: 6,
    persitence: 0.2,
    random: rng,
  });
  return (q, r, height) => {
    const val = gen.in3D(q, r, ZONE_MOISTURE);
    if (height < 0) return Zone.Biome.Ocean;
    if (height < 2) return Zone.Biome.Beach;

    if (height > 3200) {
      if (val < 0.1) return Zone.Biome.Scorched;
      if (val < 0.2) return Zone.Biome.Bare;
      if (val < 0.5) return Zone.Biome.Tundra;
      return Zone.Biome.Snow;
    }

    if (height > 2400) {
      if (val < 0.33) return Zone.Biome.TemperateDesert;
      if (val < 0.66) return Zone.Biome.Shrubland;
      return Zone.Biome.Taiga;
    }

    if (height > 1200) {
      if (val < 0.16) return Zone.Biome.TemperateDesert;
      if (val < 0.50) return Zone.Biome.Grassland;
      if (val < 0.83) return Zone.Biome.TemperateDeciduousForest;
      return Zone.Biome.TemperateRainForest;
    }

    if (val < 0.16) return Zone.Biome.SubtropicalDesert;
    if (val < 0.33) return Zone.Biome.Grassland;
    if (val < 0.66) return Zone.Biome.TropicalSeasonalForest;
    return Zone.Biome.TropicalRainForest;
  };
}

function genStructure(rng) {
  const gen = new FastSimplexNoise({
    amplitude: 1,
    frequency: 0.1,
    max: 1,
    min: 0,
    octaves: 6,
    persitence: 0.2,
    random: rng,
  });
  return (q, r, height, biome) => {
    if (q === 0 && r === 0) return Zone.Structure.City;
    const val = gen.in3D(q, r, ZONE_STRUCTURE);
    switch (biome) {

      case Zone.Biome.Ocean: // falls through
      case Zone.Biome.Scorched:
        if (val < 0.05) {
          return Zone.Structure.City;
        }
        return Zone.Structure.Empty;

      case Zone.Biome.Bare: // falls through
      case Zone.Biome.Beach: // falls through
      case Zone.Biome.Shrubland: // falls through
      case Zone.Biome.Snow: // falls through
      case Zone.Biome.SubtropicalDesert: // falls through
      case Zone.Biome.Taiga: // falls through
      case Zone.Biome.TemperateDesert: // falls through
      case Zone.Biome.Tundra:
        if (val < 0.1) {
          return Zone.Structure.City;
        }
        return Zone.Structure.Empty;

      case Zone.Biome.TemperateDeciduousForest: // falls through
      case Zone.Biome.TemperateRainForest: // falls through
      case Zone.Biome.TropicalRainForest: // falls through
      case Zone.Biome.TropicalSeasonalForest:
        if (val < 0.1) return Zone.Structure.City;
        if (val < 0.2) return Zone.Structure.Field;
        return Zone.Structure.Forest;

      case Zone.Biome.Grassland:
        if (val < 0.2) return Zone.Structure.City;
        if (val < 0.5) return Zone.Structure.Field;
        if (val < 0.7) return Zone.Structure.Forest;
        return Zone.Structure.Empty;

      default:
        return Zone.Structure.Empty;
    }
  };
}

export default function(rng) {
  return {
    genHeight: genHeight(rng),
    genBiome: genBiome(rng),
    genStructure: genStructure(rng),
  };
}
