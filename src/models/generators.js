import FastSimplexNoise from 'fast-simplex-noise';

import Zone from "./zone";

const ZONE_BIOME = 0;
const ZONE_STRUCTURE = 1;

function genBiome(rng) {
  const gen = new FastSimplexNoise({
    amplitude: 1,
    frequency: 1,
    max: Zone.Biome.allNames.length,
    min: 0,
    octaves: 1,
    persitence: 0.5,
    random: rng,
  });
  return (q, r) => {
    let val = Math.ceil(gen.in3D(q, r, ZONE_BIOME));
    return Zone.Biome[val];
  };
}

function genStructure(rng) {
  const gen = new FastSimplexNoise({
    amplitude: 1,
    frequency: 1,
    max: Zone.Structure.allNames.length,
    min: 0,
    octaves: 1,
    persitence: 0.5,
    random: rng,
  });
  return (q, r) => {
    let val = Math.ceil(gen.in3D(q, r, ZONE_STRUCTURE));
    return Zone.Structure[val];
  };
}

export default function(rng) {
  return {
    genBiome: genBiome(rng),
    genStructure: genStructure(rng),
  };
}
