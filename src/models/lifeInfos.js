export default class LifeInfos {

  constructor(life, lifeMax) {
    this.life = life;
    this.lifeMax = lifeMax || this.life;
  }

  toString() { return `life=${this.life}/${this.lifeMax})`; }

}
