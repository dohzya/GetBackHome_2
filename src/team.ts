import Position from "./position";
import Person from "./person";

export default class Team {

  people: Person[];
  position: Position;

  constructor(position: Position, people ?: Person[]) {
    this.position = position;
    this.people = people || [];
  }

  addPerson = (person: Person) => {
    const newPeople = this.people.slice(0); // slice(0) is optimized clone()
    newPeople.push(person);
    return new Team(
      this.position,
      newPeople
    );
  }
  alivePeople = () => this.people.filter(p => p.isAlive());
  moveTo = (x?: number, y?: number) => new Team(
    this.position.moveTo(x, y),
    this.people
  );
  move = (x?: number, y?: number) => new Team(
    this.position.move(x, y),
    this.people
  );
  toString = () => `Team(${this.position}, ${this.people})`;

}
