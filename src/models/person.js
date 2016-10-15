import firstNames from "./person/firstNames";
import lastNames from "./person/lastNames";
import LifeInfos from "./lifeInfos";

export default class Person {

  constructor(name, isMale, lifeInfos) {
    this.name = name;
    this.isMale = isMale;
    this.lifeInfos = lifeInfos;
  }

  isAlive() { return this.lifeInfos.life > 0; }
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
