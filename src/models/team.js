import Position from "./position";
import Person from "./person";

export default class Team {

  constructor(position, people) {
    this.position = position;
    this.people = people || [];
  }

  addPerson(person) {
    const newPeople = this.people.slice(0); // slice(0) is optimized clone()
    newPeople.push(person);
    return new Team(
      this.position,
      newPeople
    );
  }
  alivePeople() { return this.people.filter(p => p.isAlive()); }
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
