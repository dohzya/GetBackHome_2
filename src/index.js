import Random from './ext/random';

import models from './models';
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
  return (Math.ceil(Math.random() * 10000000)).toString();
}

function start(elm) {

  const seed = getParameterByName('seed') || generateSeed();
  const maxq = Number(getParameterByName('maxq')) || 60;
  const maxr = Number(getParameterByName('maxr')) || 60;
  const size = Number(getParameterByName('size')) || 21;
  const debug = getParameterByName('debug') === 'true';

  console.log(`seed is ${seed}`);

  const gameEngine = models.GameEngine.build({
    debug,
    rng: Random(seed),
    maxq,
    maxr,
  });
  const theme = Theme.build();

  ui.start({
    elm,
    gameEngine,
    theme,
    size,
  });
}

window.GetBackHome = {
  start,
};
