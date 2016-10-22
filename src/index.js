import Random from './ext/random';

import models from './models';
import map from './map';
import ui from './ui';
import Theme from './theme';

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

function start(elm) {

  const params = {
    seed: getParameterByName('seed') || generateSeed(),
    maxq: Number(getParameterByName('maxq')) || 60,
    maxr: Number(getParameterByName('maxr')) || 60,
    size: Number(getParameterByName('size')) || 21,
  }

  console.log(`seed is ${params.seed}`);

  const world = models.World.build(Random(params.seed), params.maxq, params.maxr);
  const gameEngine = models.GameEngine.build(world);
  const view = map.View(world.maxq, world.maxr, params.size);
  const theme = Theme.build();

  ui.start({
    elm,
    view,
    gameEngine,
    theme,
  });
}

window.GetBackHome = {
  start,
}
