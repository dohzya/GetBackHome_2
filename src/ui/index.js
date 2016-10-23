import R from 'ramda';
import {Component, h, Message, startApp, log} from 'kaiju';

import snabbdomClass from 'snabbdom/modules/class';
import snabbdomProps from 'snabbdom/modules/props';
import snabbdomStyle from 'snabbdom/modules/style';
import snabbdomAttributes from 'snabbdom/modules/attributes';

import map from './map';

function teamComponent(teamItem, isSelected, teamMessages) {
  const click = Message('team:click');
  const team = teamItem.item;
  return Component({
    name: 'team',
    props: {
      isSelected
    },
    initState() {},
    connect({on, msg}) {
      on(click, () => {
        msg.sendToParent(teamMessages.click(team.name));
      });
    },
    render({props}) {
      return h(
        'li.team',
        {
          events: {click},
          class: {
            selected: props.isSelected,
          },
        },
        team.name
      );
    },
  });
}

function teamsComponent(gameEngine) {
  const messages = {
    click: Message('teams:select'),
  };
  return Component({
    name: 'teams',
    initState() {
      return {
        selected: undefined,
      };
    },
    connect({on}) {
      on(messages.click, (state, teamName) =>
        R.merge(state, {selected: teamName})
      );
    },
    render({state}) {
      function isSelected(timedTeam) {
        return state.selected === timedTeam.item.name;
      }
      return h('ul.teams',
        gameEngine.snapshot.allTeams().map(timedTeam =>
          teamComponent(timedTeam, isSelected(timedTeam), messages)
        )
      );
    },
  });
}

function mapComponent(view, gameEngine, theme) {
  const dblclick = Message('map:dblclick');
  const mousedown = Message('map:mousedown');
  const mousemove = Message('map:mousemove');
  const mouseup = Message('map:mouseup');
  const wheel = Message('map:wheel');

  function redraw() {
    view.redraw(gameEngine.allTiles(theme));
  }

  window.addEventListener('resize', () => view.resized());

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
      return h('div.map',
        [
          h('canvas', {
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
          }),
        ]
      );
    },
  });
}

function panelComponent(gameEngine) {
  return Component({
    name: 'panel',
    initState() {},
    connect() {},
    render() {
      return h('sidebar.panel', [
        teamsComponent(gameEngine),
      ]);
    },
  });
}

function appComponent(view, gameEngine, theme) {
  return Component({
    name: 'app',
    initState() {},
    connect() {},
    render() {
      return h('div.app', [
        mapComponent(view, gameEngine, theme),
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
  start({elm, gameEngine, theme, size}) {
    const debug = gameEngine.debug;
    if (debug) {
      log.render = true;
      log.message = true;
    }
    const view = map.View({size, debug});
    startApp({app: appComponent(view, gameEngine, theme), snabbdomModules, elm});
  },
};
