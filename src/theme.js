import Zone from './models/zone';
import Tile from './ui/map/tile';

function zoneColor(zone) {
  switch (zone.biome) {
    case Zone.Biome.Water: return '127, 169, 181';
    case Zone.Biome.Swamp: return '105, 74, 68';
    case Zone.Biome.Plain: return '127, 168, 79';
    case Zone.Biome.Mountainous: return '127, 127, 127';

    case Zone.Biome.Bare: return '136, 136, 136';
    case Zone.Biome.Beach: return '85, 85, 85';
    case Zone.Biome.Grassland: return '137, 169, 90';
    case Zone.Biome.Ocean: return '68, 69, 120';
    case Zone.Biome.Scorched: return '85, 85, 85';
    case Zone.Biome.Shrubland: return '136, 152, 120';
    case Zone.Biome.Snow: return '221, 221, 228';
    case Zone.Biome.SubtropicalDesert: return '209, 184, 142';
    case Zone.Biome.Taiga: return '153, 169, 121';
    case Zone.Biome.TemperateDeciduousForest: return '104, 147, 91';
    case Zone.Biome.TemperateDesert: return '201, 209, 157';
    case Zone.Biome.TemperateRainForest: return '54, 118, 86';
    case Zone.Biome.TropicalRainForest: return '71, 135, 87';
    case Zone.Biome.TropicalSeasonalForest: return '87, 152, 72';
    case Zone.Biome.Tundra: return '187, 187, 171';
    default: return '0, 0, 0';
  }
}
function zonePicture(zone) {
  switch (zone.structure) {
    case Zone.Structure.City: return '🏤';
    case Zone.Structure.Forest: return '🌲';
    case Zone.Structure.Field: return '🌾';
    default: return '';
  }
}

function zone2tile(timedZone, currentTS) {
  const time = timedZone.time;
  const zone = timedZone.item;
  return new Tile(
    zone.position,
    zone.height,
    zoneColor(zone),
    zonePicture(zone),
    currentTS - time
  );
}

function build() {
  return {
    zone2tile,
  };
}

export default {
  build,
}
