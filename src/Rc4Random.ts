function rc4RandomGen(seed: string) {
  const keySchedule: number[] = [];
  let keyScheduleI = 0;
  let keyScheduleJ = 0;

  function init(seed: string) {
    for (let i = 0; i < 256; i++) {
      keySchedule[i] = i;
    }

    let j: number = 0;
    for (let i = 0; i < 256; i++) {
      j = (j + keySchedule[i] + seed.charCodeAt(i % seed.length)) % 256;

      let t = keySchedule[i];
      keySchedule[i] = keySchedule[j];
      keySchedule[j] = t;
    }
  }
  init(seed);

  function getRandomByte() {
    keyScheduleI = (keyScheduleI + 1) % 256;
    keyScheduleJ = (keyScheduleJ + keySchedule[keyScheduleI]) % 256;

    const t = keySchedule[keyScheduleI];
    keySchedule[keyScheduleI] = keySchedule[keyScheduleJ];
    keySchedule[keyScheduleJ] = t;

    return keySchedule[(keySchedule[keyScheduleI] + keySchedule[keyScheduleJ]) % 256];
  }

  return {
    getRandomNumber: () => {
      let number = 0;
      let multiplier = 1;
      for (let i = 0; i < 8; i++) {
        number += getRandomByte() * multiplier;
        multiplier *= 256;
      }
      return number / 18446744073709551616;
    }
  };

}

let rc4Random = rc4RandomGen(genSeed());

function genSeed(): string {
  let seed = "";
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 30; i++) {
    seed += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return seed;
}

function random(arg1 ?: number, arg2 ?: number) {
  let min: number;
  let max: number;
  if (arg1 !== undefined) {
    if (arg2 !== undefined) {
      min = arg1;
      max = arg2;
    } else {
      min = 0;
      max = arg1;
    }
    return Math.floor((rc4Random.getRandomNumber() * (max - min)) + min);
  }
  return rc4Random.getRandomNumber();
}

function init(seed ?: string) {
  rc4Random = rc4RandomGen(seed || genSeed());
}

export default {
  init,
  random
};
