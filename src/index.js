import models from './models';
import ui from './ui';

import Random from './ext/random';

function getParameterByName(name) {
  const url = window.location.href;
  const cleanedName = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + cleanedName + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function generateSeed() {
  return (Math.ceil(Math.random() * 10000000)).toString()
}

function start(canvas) {

  const seed = getParameterByName('seed') || generateSeed();
  console.log(`seed is ${seed}`);
  const rng = Random(seed);
  const {genHeight, genBiome, genStructure} = models.Generators(rng);

  const team = new models.Team(new models.Position(2, 6))
    .addPerson(models.Person.random(rng))
    .addPerson(models.Person.random(rng))
    .addPerson(models.Person.random(rng))
    .move(1, 2);

  const MAXQ = Number(getParameterByName('maxq')) || 40;
  const MAXR = Number(getParameterByName('maxr')) || 40;
  const SIZE = Number(getParameterByName('size')) || 21;

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
      const q = i - Math.floor(MAXQ * 1/3);
      const r = j - Math.floor(MAXR * 1/2);
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

      case models.Zone.Biome.Bare: return '136, 136, 136';
      case models.Zone.Biome.Beach: return '85, 85, 85';
      case models.Zone.Biome.Grassland: return '137, 169, 90';
      case models.Zone.Biome.Ocean: return '68, 69, 120';
      case models.Zone.Biome.Scorched: return '85, 85, 85';
      case models.Zone.Biome.Shrubland: return '136, 152, 120';
      case models.Zone.Biome.Snow: return '221, 221, 228';
      case models.Zone.Biome.SubtropicalDesert: return '209, 184, 142';
      case models.Zone.Biome.Taiga: return '153, 169, 121';
      case models.Zone.Biome.TemperateDeciduousForest: return '104, 147, 91';
      case models.Zone.Biome.TemperateDesert: return '201, 209, 157';
      case models.Zone.Biome.TemperateRainForest: return '54, 118, 86';
      case models.Zone.Biome.TropicalRainForest: return '71, 135, 87';
      case models.Zone.Biome.TropicalSeasonalForest: return '87, 152, 72';
      case models.Zone.Biome.Tundra: return '187, 187, 171';
      default: return '0, 0, 0';
    }
  }
  function zonePicture(zone) {
    switch (zone.structure) {
      case models.Zone.Structure.City: return '🏤';
      case models.Zone.Structure.Forest: return '🌲';
      case models.Zone.Structure.Field: return '🌾';
      default: return '';
    }
  }
  function zone2tile(timedZone, size, currentTS) {
    const time = timedZone.time;
    const zone = timedZone.item;
    return new ui.Tile(
      zone.position,
      zone.height,
      zoneColor(zone),
      zonePicture(zone),
      currentTS - time
    );
  }

  const view = new ui.View(canvas, MAXQ, MAXR, SIZE)
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
      if (zone) {
        console.log(zone.toString());
        snapshot.addZone(zone, TS)
      }
      TS++;
      redraw();
    }
  }
  canvas.onwheel = function (e) {
    e.preventDefault();
    if (e.deltaY === 0) return;
    view.changeSize(-e.deltaY);
  }
}

window.GetBackHome = {
  start,
}
