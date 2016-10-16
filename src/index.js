import models from './models';
import ui from './ui';

import Random from './ext/random';
const seed = '12345'
const rng = Random(seed);
const {genHeight, genBiome, genStructure} = models.Generators(rng);

const team = new models.Team(new models.Position(2, 6))
  .addPerson(models.Person.random(rng))
  .addPerson(models.Person.random(rng))
  .addPerson(models.Person.random(rng))
  .move(1, 2);

const MAXQ = 20;
const MAXR = 20;
const SIZE = 20;

models.Grid = class {
  constructor() {
    this.zones = [];
  }
  get(q, r) {
    return this[models.Position.buildKey(q, r)];
  }
  addZone(zone) {
    const key = zone.position.key();
    this.zones.push(zone);
    this[key] = zone;
  }
}

let grid = new models.Grid()
for (let j = 0; j < MAXR; ++j) {
  for (let i = 0-(Math.floor(j/2)); i < MAXQ-(Math.floor(j/2)); ++i) {
    const q = i - Math.floor(MAXQ / 2);
    const r = j - Math.floor(MAXR / 2);
    const height = genHeight(q, r);
    const biome = genBiome(q, r, height);
    const structure = genStructure(q, r, height, biome);
    grid.addZone(new models.Zone(new models.Position(q, r), height, biome, structure))
  }
}

function zoneColor(zone) {
  switch (zone.biome) {
    case models.Zone.Biome.Water: return '127, 169, 181';
    case models.Zone.Biome.Swamp: return '105, 74, 68';
    case models.Zone.Biome.Plain: return '127, 168, 79';
    case models.Zone.Biome.Mountainous: return '127, 127, 127';
    default: return '0, 0, 0';
  }
}
function zonePicture(zone) {
  switch (zone.structure) {
    case models.Zone.Structure.City: return 'City';
    case models.Zone.Structure.Forest: return 'Forest';
    case models.Zone.Structure.Field: return 'Field';
    case models.Zone.Structure.Mountains: return 'Mount';
    default: return '';
  }
}
export function zone2tile(timedZone, size, currentTS) {
  const time = timedZone.time;
  const zone = timedZone.item;
  return new ui.Tile(
    zone.position,
    size,
    zone.height,
    zoneColor(zone),
    zonePicture(zone),
    currentTS - time
  );
}

function start(canvas) {
  const view = new ui.View(canvas, SIZE)
  let TS = 1;

  let snapshot = new models.Snapshot();
  for (let zone of grid.zones) {
    snapshot.addZone(zone, TS);
  }

  TS += 10;

  function redraw() {
    const tiles = snapshot.all().map(timedZone => zone2tile(timedZone, SIZE, TS))
    view.redraw(tiles);
  }
  redraw();

  let mouseMoved = false;
  let oldMousePoint = undefined;
  function eventPoint(e) {
    return new ui.Point(e.clientX, e.clientY);
  }
  canvas.onmousedown = function (e) {
    oldMousePoint = eventPoint(e);
    mouseMoved = false;
  };
  canvas.onmousemove = function (e) {
    if (oldMousePoint) {
      const newMousePoint = eventPoint(e);
      const diff = newMousePoint.diff(oldMousePoint);
      if (mouseMoved || Math.abs(diff.x) + Math.abs(diff.y) > 10) {
        mouseMoved = true;
        oldMousePoint = newMousePoint;
        view.move(diff);
        redraw();
      }
    }
  }
  canvas.onmouseup = function (e) {
    oldMousePoint = undefined;
    if (mouseMoved) {
      mouseMoved = false;
    } else {
      const {q, r} = view.getPosition(e);
      const zone = grid.get(q, r);
      snapshot.addZone(zone, TS)
      TS++;
      redraw();
    }
  }
}

window.GetBackHome = {
  start,
}
