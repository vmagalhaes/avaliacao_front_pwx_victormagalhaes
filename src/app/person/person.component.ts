import { Component, OnInit } from '@angular/core';

import { PersonService } from '../core/services/person.service';
import { Person } from '../core/models/person';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {

  persons: Person[] = [];

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

  addPerson() {
  }

}
