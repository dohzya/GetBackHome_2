import FastSimplexNoise from 'fast-simplex-noise';

import Zone from "./zone";

const ZONE_HEIGHT = 0;
const ZONE_BIOME = 1;
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
    frequency: 0.07,
    max: 1,
    min: 0,
    octaves: 5,
    persitence: 0.2,
    random: rng,
  });
  return (q, r) => {
    const val = gen.in3D(q, r, ZONE_HEIGHT);
    return Math.floor(Math.pow(val, 3) * 4000 - 100);
  };
}

function genBiome(rng) {
  const gen = new FastSimplexNoise({
    amplitude: 1,
    frequency: 0.05,
    max: 1,
    min: 0,
    octaves: 6,
    persitence: 0.2,
    random: rng,
  });
  return (q, r, height) => {
    const val = gen.in3D(q, r, ZONE_BIOME);
    if (height <= 0) {
      return Zone.Biome.Water
    } else if (height < 100) {
      if (val < 0.1) {
        return Zone.Biome.Swamp;
      }
      return Zone.Biome.Plain;
    } else if (height < 1000) {
      return Zone.Biome.Plain;
    }
    return Zone.Biome.Mountainous;
  };
}

function genStructure(rng) {
  const gen = new FastSimplexNoise({
    amplitude: 1,
    frequency: 0.05,
    max: 1,
    min: 0,
    octaves: 6,
    persitence: 0.2,
    random: rng,
  });
  return (q, r, height, biome) => {
    const val = gen.in3D(q, r, ZONE_STRUCTURE);
    switch (biome) {
      case Zone.Biome.Water:
        return Zone.Structure.Empty;
      case Zone.Biome.Swamp:
        if (val < 0.1) {
          return Zone.Structure.City;
        }
        return Zone.Structure.Empty;
      case Zone.Biome.Plain:
        if (val < 0.2) {
          return Zone.Structure.City;
        } else if (val < 0.5) {
          return Zone.Structure.Field;
        } else if (val < 0.7) {
          return Zone.Structure.Forest;
        }
        return Zone.Structure.Empty;
      case Zone.Biome.Mountainous:
        if (height > 2000) {
          return Zone.Structure.Mountains;
        }
        if (val < 0.1) {
          return Zone.Structure.City;
        } else if (val < 0.4) {
          return Zone.Structure.Forest;
        } else if (val < 0.5) {
          return Zone.Structure.Mountains;
        }
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
