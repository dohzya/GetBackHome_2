import firstNames from "./person/firstNames";
import lastNames from "./person/lastNames";
import LifeInfos from "./lifeInfos";

export default class Person {

  constructor(name, isMale, lifeInfos) {
    this.name = name;
    this.isMale = isMale;
    this.lifeInfos = lifeInfos;
  }

  copy(lifeInfos) { return new Person(this.name, this.isMale, lifeInfos); }
  isAlive() { return this.lifeInfos.isAlive(); }
  hurt(pv) { return this.copy(this.lifeInfos.hurt(pv)); }
  heal(pv) { return this.copy(this.lifeInfos.heal(pv)); }
  toString() {
    return `Person(${this.name}, ${this.isMale ? '♂' : '♀'}, ${this.lifeInfos})`;
  }

  static random(rng) {
    const [firstName, isMale] = firstNames(rng);
    const lastName = lastNames(rng);
    const lifeMax = rng(70, 130);
    return new Person(
      `${firstName} ${lastName}`,
      isMale,
      new LifeInfos(
        rng(lifeMax),
        lifeMax
      )
    );
  }

}
