import R from 'ramda';
import {Component, h, Message, startApp} from 'kaiju';

import snabbdomClass from 'snabbdom/modules/class';
import snabbdomProps from 'snabbdom/modules/props';
import snabbdomStyle from 'snabbdom/modules/style';
import snabbdomAttributes from 'snabbdom/modules/attributes';

import map from '../map';

function teamComponent(team) {
  return h('li', team.item.name);
}

function teamsComponent(gameEngine) {
  return Component({
    name: 'teams',
    initState() {},
    connect() {},
    render() {
      return h('ul', {id: 'teams'}, gameEngine.snapshot.allTeams().map(teamComponent));
    },
  });
}

function mapComponent(view, gameEngine, allTiles) {
  const dblclick = Message('map:dblclick');
  const mousedown = Message('map:mousedown');
  const mousemove = Message('map:mousemove');
  const mouseup = Message('map:mouseup');
  const wheel = Message('map:wheel');

  function redraw() {
    view.redraw(allTiles());
  }

  return Component({
    name: 'map',
    initState() {
      return {
        mouseMoved: false,
        oldMousePoint: undefined,
      };
    },
    connect({on}) {

      function eventPoint(e) {
        return new map.Point(e.clientX, e.clientY);
      }

      on(dblclick, (state, e) => {
        const mousePoint = eventPoint(e);
        view.moveTo(mousePoint);
        return state;
      });
      on(mousedown, (state, e) => R.merge(state, {
        oldMousePoint: eventPoint(e),
        mouseMoved: false,
      }));
      on(mousemove, (state, e) => {
        let mouseMoved = state.mouseMoved;
        let oldMousePoint = state.oldMousePoint;
        if (oldMousePoint) {
          const newMousePoint = eventPoint(e);
          const diff = newMousePoint.diff(oldMousePoint);
          if (mouseMoved || Math.abs(diff.x) + Math.abs(diff.y) > 10) {
            mouseMoved = true;
            oldMousePoint = newMousePoint;
            view.move(diff);
          }
        }
        return R.merge(state, {
          mouseMoved,
          oldMousePoint,
        });
      });
      on(mouseup, (state, e) => {
        if (!state.mouseMoved) {
          const pos = view.getPosition(e);
          gameEngine.selectZone(pos);
          redraw();
        }
        return R.merge(state, {
          oldMousePoint: undefined,
          mouseMoved: false,
        });
      });
      on(wheel, (state, e) => {
        e.preventDefault();
        if (e.deltaY !== 0) {
          view.changeSize(-e.deltaY);
        }
        return state;
      });
    },
    render() {
      return h('canvas', {
        events: {
          dblclick,
          mousedown,
          mousemove,
          mouseup,
          wheel,
        },
        hook: {
          insert: vnode => {
            view.setCanvas(vnode.elm);
            redraw();
          },
        }
      });
    },
  });
}

function panelComponent(gameEngine) {
  return Component({
    name: 'panel',
    initState() {},
    connect() {},
    render() {
      return h('sidebar', {id: 'panel'}, [
        teamsComponent(gameEngine),
      ]);
    },
  });
}

function appComponent(view, gameEngine, allTiles) {
  return Component({
    name: 'app',
    initState() {},
    connect() {},
    render() {
      return h('div', {id: 'app'}, [
        mapComponent(view, gameEngine, allTiles),
        panelComponent(gameEngine),
      ]);
    },
  });
}

const snabbdomModules = [
  snabbdomClass,
  snabbdomProps,
  snabbdomStyle,
  snabbdomAttributes,
];

export default {
  start({elm, view, gameEngine, allTiles}) {
    startApp({app: appComponent(view, gameEngine, allTiles), snabbdomModules, elm});
  },
};
