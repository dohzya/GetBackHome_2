import Hex from '../hex';

import Point from './point';

function getHeight() {
  const body = document.body;
  const html = document.documentElement;
  return Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );
}
function getWidth() {
  return document.body.clientWidth;
}

export default function(maxq, maxr, size) {
  const width = Math.floor(getWidth() * 0.8);
  const height = getHeight();

  return {

    width,
    height,
    size,

    halfSize: new Point(width/2, height/2),
    center: new Point(0, 0),

    hasBeenCentered: false,
    setCanvas(canvas) {
      canvas.setAttribute("width", width + "px");
      canvas.setAttribute("height", height + "px");
      this.bounding = canvas.getBoundingClientRect();
      this.ctx = canvas.getContext('2d');
      this.clear();
      if (!this.hasBeenCentered) {
        this.hasBeenCentered = true;
        this.centerView();
      }
    },
    clear() {
      this.ctx.fillStyle = 'rgb(0, 0, 0)';
      this.ctx.fillRect(0, 0, this.width, this.height);
    },
    redraw(tiles) {
      this.clear();
      this.displayTiles(tiles);
    },
    localToGlobal(px) {
      return new Point(
        this.localToGlobalX(px.x),
        this.localToGlobalY(px.y)
      );
    },
    localToGlobalX(px) {
      return px + this.center.x + Math.max(0, this.bounding.left);
    },
    localToGlobalY(py) {
      return py + this.center.y + Math.max(0, this.bounding.top);
    },
    globalToLocal(p) {
      return new Point(
        p.x - this.center.x - Math.max(0, this.bounding.left),
        p.y - this.center.y - Math.max(0, this.bounding.top)
      );
    },
    isVisible(p) {
      const lp = p.add(this.center);
      return (
        lp.x + this.size < 0 ||
        lp.x - this.size < this.width ||
        lp.y + this.size < 0 ||
        lp.y - this.size < this.height
      );
    },
    displayTiles(tiles) {
      if (tiles) {
        this.lastTiles = tiles;
      }
      if (!this.lastTiles) return;
      for (let tile of this.lastTiles) {
        const center = tile.center(this.size);
        if (!this.isVisible(center)) continue;

        // display background and border
        const points = tile.corners(this.size);
        this.ctx.beginPath();
        let lastPoint = points[0];
        this.ctx.moveTo(this.localToGlobalX(lastPoint.x), this.localToGlobalY(lastPoint.y));
        for (let point of points) {
          this.ctx.lineTo(this.localToGlobalX(point.x), this.localToGlobalY(point.y));
        }
        this.ctx.closePath();
        this.ctx.fillStyle = `rgba(${tile.color}, ${tile.ageAlpha()})`;
        this.ctx.fill();

        const fontSize = this.size * 4/5;

        // display content (name for now)
        this.ctx.fillStyle = `rgba(255, 255, 255, 1)`;
        this.ctx.font = `${fontSize}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(tile.picture, this.localToGlobalX(center.x), this.localToGlobalY(center.y));

        // if (this.size > 20) {
        //   const debugFontSize = this.size < 30 ? 5 : 10;
        //   const margin = this.size / 2;
        //   // display height (debug)
        //   this.ctx.font = `${debugFontSize}px Arial`;
        //   this.ctx.textBaseline = 'bottom';
        //   this.ctx.fillText(tile.height, this.localToGlobalX(center.x), this.localToGlobalY(center.y) - margin);

        //   // display position (debug)
        //   this.ctx.font = `${debugFontSize}px Arial`;
        //   this.ctx.textBaseline = 'top';
        //   this.ctx.fillText(`${tile.position.q}:${tile.position.r}`, this.localToGlobalX(center.x), this.localToGlobalY(center.y) + margin);
        // }
      }
    },
    getPosition(globalPt) {
      const localPt = this.globalToLocal(globalPt);
      return Hex.pixelToPosition(localPt, this.size);
    },
    move(d) {
      this.center = this.center.add(d);
      this.redraw();
    },
    moveTo(d) {
      this.center = this.center.diff(d).add(this.halfSize);
      this.redraw();
    },
    changeSize(delta) {
      const qtt = Math[delta > 0 ? 'ceil' : 'floor'](delta / 10);
      const newSize = this.size + qtt;
      if (qtt < 0 && newSize > 2 || qtt > 0 && newSize < 80) {
        const oldCenterPt = this.halfSize.diff(this.center);
        const newCenterPt = Hex.updateSize(oldCenterPt, this.size, newSize);
        this.center = this.center.add(oldCenterPt).diff(newCenterPt);
        this.size = newSize;
        this.redraw();
      }
    },
    centerView() {
      this.moveTo(this.localToGlobal(Hex.hexToPixel({q: 0, r: 0}, this.size)));
    },
  };
}
