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
  constructor(canvas, size) {
    const width = getWidth()
    const height = getHeight()
    canvas.setAttribute("width", width + "px");
    canvas.setAttribute("height", height + "px");

    this.bounding = canvas.getBoundingClientRect();

    this.width = width;
    this.height = height;
    this.offsetX = this.width / 2;
    this.offsetY = this.height / 2;
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
    for (let tile of tiles) {

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
      this.ctx.strokeStyle = `rgb(0, 0, 0)`;
      this.ctx.fill();
      this.ctx.stroke();

      // display content (name for now)
      this.ctx.fillStyle = `rgba(255, 255, 255, 1)`;
      this.ctx.font = '16px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(tile.picture, this.localToGlobalX(tile.center.x), this.localToGlobalY(tile.center.y));

      // display position (debug)
      this.ctx.font = '10px Arial';
      this.ctx.textBaseline = 'top';
      this.ctx.fillText(`${tile.position.q}:${tile.position.r}`, this.localToGlobalX(tile.center.x), this.localToGlobalY(tile.center.y) + 5);
    }
  }
  getPosition(globalPt) {
    const localPt = this.globalToLocal(globalPt);
    return Hex.pixelToPosition(localPt, this.size);
  }
  move(d) {
    this.offsetX += d.x;
    this.offsetY += d.y;
  }
}
