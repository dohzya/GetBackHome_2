export default class LifeInfos {

  private life: number;
  private lifeMax: number;

  constructor(life: number, lifeMax?: number) {
    this.life = life;
    this.lifeMax = lifeMax || this.life;
  }

  toString = () => `life=${this.life}/${this.lifeMax})`;

}
