import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

import { PersonService } from '../core/services/person.service';
import { Person } from '../core/models/person';

export interface SearchPerson {
  name: string;
  cpf: string;
  birthday: string;
  email: string;
}

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {

  persons: Person[] = [];
  person: Person;

  search: SearchPerson = {
    name: '',
    cpf: '',
    birthday: '',
    email: ''
  };

  editing: boolean = false;

  constructor(
    private personService: PersonService
  ) { }

  ngOnInit() {
    this.personService.getPersons()
      .subscribe((persons: Person[]) => {
        console.log(persons)
        this.persons = persons;
      }, (error: Error) => {
        // TODO ALERT ERROR
      });
  }

  doSearch() {
    let person: Person = _.find(this.persons, _.pickBy(this.search, _.identity));

    this.personService.getPerson(person.id)
      .subscribe((person: Person) => {
        this.person = person;
      }, (error: Error) => {
        // TODO ALERT ERROR
      });
  }

  addPerson() {
  }

  searchChange(search: string) {
  }

}
