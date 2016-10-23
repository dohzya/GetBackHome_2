export default class LifeInfos {

  constructor(life, lifeMax) {
    this.life = life;
    this.lifeMax = lifeMax || this.life;
  }

  copy(life) {
    return new LifeInfos(Math.min(life, this.lifeMax), this.lifeMax);
  }

  isAlive() { return this.life > 0; }
  hurt(pv) { return this.copy(this.life - pv); }
  heal(pv) { return this.copy(this.life + pv); }
  toString() { return `life=${this.life}/${this.lifeMax})`; }

}
