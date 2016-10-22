import Random from './ext/random';

import models from './models';
import map from './map';
import ui from './ui';

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

function start(panel) {

  const params = {
    seed: getParameterByName('seed') || generateSeed(),
    maxq: Number(getParameterByName('maxq')) || 60,
    maxr: Number(getParameterByName('maxr')) || 60,
    size: Number(getParameterByName('size')) || 21,
  }

  console.log(`seed is ${params.seed}`);

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
  function zone2tile(timedZone, currentTS) {
    const time = timedZone.time;
    const zone = timedZone.item;
    return new map.Tile(
      zone.position,
      zone.height,
      zoneColor(zone),
      zonePicture(zone),
      currentTS - time
    );
  }

  const world = models.World.build(Random(params.seed), params.maxq, params.maxr);
  const gameEngine = models.GameEngine.build(world);
  const view = map.View(world.maxq, world.maxr, params.size);
  ui.start({
    elm: panel,
    view,
    gameEngine,
    allTiles() {
      return gameEngine.snapshot.allZones().map(timedZone =>
        zone2tile(timedZone, world.timestamp)
      );
    },
  });
}

window.GetBackHome = {
  start,
}
