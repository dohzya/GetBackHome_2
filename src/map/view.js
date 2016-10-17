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

export default class View {
  constructor(canvas, maxq, maxr, size) {
    const width = Math.floor(getWidth() * 0.8);
    const height = getHeight();
    canvas.setAttribute("width", width + "px");
    canvas.setAttribute("height", height + "px");

    this.bounding = canvas.getBoundingClientRect();

    this.width = width;
    this.height = height;

    const centerPt = Hex.hexToPixel({q: maxq * (1/4), r: maxr * (1/8)}, size)
    this.offsetX = centerPt.x;
    this.offsetY = centerPt.y;

    this.ctx = canvas.getContext('2d');
    this.size = size;

    this.clear();
  }
  clear() {
    this.ctx.fillStyle = 'rgb(0, 0, 0)';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }
  redraw(tiles) {
    this.clear();
    this.displayTiles(tiles);
  }
  localToGlobalX(px) {
    return px + this.offsetX + Math.max(0, this.bounding.left);
  }
  localToGlobalY(py) {
    return py + this.offsetY + Math.max(0, this.bounding.top);
  }
  globalToLocal(p) {
    return new Point(
      p.x - this.offsetX - Math.max(0, this.bounding.left),
      p.y - this.offsetY - Math.max(0, this.bounding.top)
    );
  }
  displayTiles(tiles) {
    if (tiles) {
      this.lastTiles = tiles;
    }
    for (let tile of this.lastTiles) {

      const center = tile.center(this.size);

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
      // this.ctx.strokeStyle = `rgb(0, 0, 0)`;
      // this.ctx.stroke();

      const fontSize = this.size * 4/5;
      const debugFontSize = this.size < 30 ? 5 : 10;

      // display content (name for now)
      this.ctx.fillStyle = `rgba(255, 255, 255, 1)`;
      this.ctx.font = `${fontSize}px Arial`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(tile.picture, this.localToGlobalX(center.x), this.localToGlobalY(center.y));

      // if (this.size > 20) {
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
  }
  getPosition(globalPt) {
    const localPt = this.globalToLocal(globalPt);
    return Hex.pixelToPosition(localPt, this.size);
  }
  move(d) {
    this.offsetX += d.x;
    this.offsetY += d.y;
    this.redraw();
  }
  changeSize(delta) {
    const qtt = Math[delta > 0 ? 'ceil' : 'floor'](delta / 10);
    const newSize = this.size + qtt;
    if (qtt < 0 && newSize > 5 || qtt > 0 && newSize < 60) {
      const oldCenterPt = new Point(this.width/2 - this.offsetX, this.height/2 - this.offsetY);
      const newCenterPt = Hex.updateSize(oldCenterPt, this.size, newSize);
      this.offsetX += oldCenterPt.x - newCenterPt.x;
      this.offsetY += oldCenterPt.y - newCenterPt.y;
      this.size = newSize;
      this.redraw();
    }
  }
}
