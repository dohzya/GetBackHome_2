import seedrandom from 'seedrandom';

export default function (seed) {
  const rnf = seedrandom(seed);
  return function (min, max) {
    if (min !== undefined && max !== undefined) {
      return Math.floor(rnf() * max + min);
    } else if (min !== undefined) {
      return Math.floor(rnf() * min);
    } else {
      return rnf();
    }
  }
}
