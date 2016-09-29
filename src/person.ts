import firstNames from "./person/firstNames";
import lastNames from "./person/lastNames";
import LifeInfos from "./lifeInfos";
import Random from "./Rc4Random";

export default class Person {

  name: string;
  isMale: boolean;
  lifeInfos: LifeInfos;

  constructor(name: string, isMale: boolean, lifeInfos: LifeInfos) {
    this.name = name;
    this.isMale = isMale;
    this.lifeInfos = lifeInfos;
  }

  isAlive = () => this.lifeInfos.life > 0;
  toString = () => `Person(${this.name}, ${this.isMale ? '♂' : '♀'}, ${this.lifeInfos})`;

  static random = () => {
    const [firstName, isMale] = firstNames();
    const lastName = lastNames();
    const lifeMax = Random.random(70, 130);
    return new Person(
      `${firstName} ${lastName}`,
      isMale,
      new LifeInfos(
        Random.random(lifeMax),
        lifeMax
      )
    );
  };

}
