class Cube {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
class Hex {
  constructor(q, r) {
    this.q = q;
    this.r = r;
  }
}

function cubeToHex(c) {
  const q = c.x
  const r = c.z
  return new Hex(q, r)
}

function hexToCube(h) {
  const x = h.q
  const z = h.r
  const y = -x-z
  return new Cube(x, y, z)
}

function cubeRound(h) {
  let rx = Math.round(h.x);
  let ry = Math.round(h.y);
  let rz = Math.round(h.z);

  const xDiff = Math.abs(rx - h.x);
  const yDiff = Math.abs(ry - h.y);
  const zDiff = Math.abs(rz - h.z);

  if (xDiff > yDiff && xDiff > zDiff) {
    rx = -ry-rz;
  } else if (yDiff > zDiff) {
    ry = -rx-rz;
  } else {
    rz = -rx-ry;
  }


  return new Cube(rx, ry, rz)
}

function hexRound(h) {
  return cubeToHex(cubeRound(hexToCube(h)))
}

function pixelToHex(p, size) {
  const q = (p.x * Math.sqrt(3)/3 - p.y / 3) / size;
  const r = p.y * 2/3 / size;
  return hexRound(new Hex(q, r))
}

function hexToPixel(h, size) {
  const x = size * Math.sqrt(3) * (h.q + h.r/2);
  const y = size * 3/2 * h.r;
  return {x, y};
}

function buildPoints(px, py, size) {
  var points = [];
  for (let i = 0; i < 6; ++i) {
    let angle = 2 * Math.PI / 6 * (i + 0.5);
    points.push({x: px + size() * Math.cos(angle), y: py + size * Math.sin(angle)});
  }
  return points;
}

export default {
  pixelToPosition(p, size) {
    return pixelToHex(p, size);
  },
  positionToPixel(h, size) {
    return hexToPixel(h, size);
  }
}
