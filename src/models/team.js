import R from 'ramda';

export default class Team {

  constructor(name, position, people) {
    this.name = name;
    this.position = position;
    this.people = people || [];
  }

  addPerson(person) {
    return new Team(
      this.position,
      R.append(this.people, person)
    );
  }
  alivePeople() { return R.filter(p => p.isAlive(), this.people); }
  moveTo(x, y) {
    return new Team(
      this.position.moveTo(x, y),
      this.people
    );
  }
  move(x, y) {
    return new Team(
      this.position.move(x, y),
      this.people
    );
  }
  toString() { return `Team(${this.position}, ${this.people})`; }

}
