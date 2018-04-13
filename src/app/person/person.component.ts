import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';
import { EmailValidator } from '@angular/forms';

import { Chart } from 'chart.js';

import { PersonService } from '../core/services/person.service';
import { Person } from '../core/models/person';

import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

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
  data: any = {};
  editingPerson: Person;
  creating: boolean = false;

  chart: Chart;

  search: SearchPerson = {
    name: '',
    cpf: '',
    birthday: '',
    email: ''
  };

  editing: boolean = false;

  validationErrors: string[] = [];
  searchError: boolean = false;
  searchEmptyError: boolean = false;

  private configSuccess: MatSnackBarConfig = {
    panelClass: ['style-success']
  };
  private configError: MatSnackBarConfig = {
    panelClass: ['style-error']
  };

  constructor(
    private snackBar: MatSnackBar,
    private personService: PersonService
  ) {
  }

  ngOnInit() {
    this.personService.getPersons()
      .subscribe((persons: Person[]) => {
        this.persons = persons;

        this.buildChart();
      }, (error: Error) => {
        this.openSnackBar(`Houve um problema ao carregar os registros.`, 'Ok', this.configError);
      });
  }

  doSearch() {
    if (_.some(this.search, (value) => { return value !== '' })) {
      this.searchEmptyError = false;

      let search = _.clone(this.search);
      search = _.mapValues(search, _.method('toLowerCase'));
      search.cpf = this.personService.validateCpf(search.cpf);

      let persons = _.cloneDeep(this.persons);
      persons = _.map(persons, (person: Person) => { return _.mapValues(person, (object: any) => { return _.isNumber(object) ? object : object.toLowerCase() })});

      let person: Person = _.find(persons, _.pickBy(search, _.identity));

      if (person) {
        this.personService.getPerson(person.id)
        .subscribe((person: Person) => {
          this.person = person;
          this.search = {
            name: '',
            cpf: '',
            birthday: '',
            email: ''
          };
          this.searchError = false;
        }, (error: Error) => {
          console.warn(error);
          this.searchError = false;
        });
      } else {
        this.searchError = true;
        this.searchEmptyError = false;
      }
    } else {
      this.person = undefined;
      this.searchEmptyError = true;
      this.searchError = false;
    }
  }

  addPerson() {
    this.person = undefined;
    this.creating = !this.creating;
  }

  onSubmitPerson(editPerson: Person, form: FormControl) {
    if (!this.editing) {
      this.editingPerson = _.cloneDeep(this.person);
    }

    this.editing = !this.editing;

    if (form.valid) {
      if (!_.isEqual(this.editingPerson, editPerson)) {
        if (!this.editing) {
          this.update(editPerson);
        } else {
          this.create();
        }
      }
    }
  }

  deletePerson(person: Person) {
    this.personService.deletePerson(person.id)
      .subscribe(() => {
        let index = this.persons.indexOf(person);

        if (index >= 1) {
          this.persons.splice(1, index);
          this.buildChart();
          this.editing = false;
          this.person = undefined;
        }

        this.openSnackBar(`O registro de ${person.name}, foi removido com sucesso.`, 'Ok', this.configSuccess);
      }, (error: Error) => {
        this.openSnackBar(`Houve um problema ao remover o registro de ${person.name}.`, 'Ok', this.configError);
      });
  }

  private update(editPerson: Person) {
    this.personService.updatePerson(editPerson)
      .subscribe((person: Person) => {
        this.person = person;
        this.buildChart();
        this.openSnackBar(`O registro de ${person.name}, foi salvo com sucesso.`, 'Ok', this.configSuccess);
        this.editing = false;
      }, (error: Error) => {
        this.openSnackBar(`Houve um problema ao salvar o registro de ${editPerson.name}.`, 'Ok', this.configError);
        this.editing = false;
      });
  }

  private create() {
    this.personService.createPerson(this.data)
      .subscribe((person: Person) => {
        this.persons.push(person);
        this.buildChart();
        this.data = {};
        this.openSnackBar(`O registro de ${person.name}, foi criado com sucesso.`, 'Ok', this.configSuccess);
        this.creating = false;
      }, (error: Error) => {
        this.openSnackBar(`Houve um problema ao criar o registro de ${this.data.name}.`, 'Ok', this.configError);
        this.creating = false;
      });
  }

  private openSnackBar(message: string, button: string, config: MatSnackBarConfig) {
    this.snackBar.open(message, button, _.assign({
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    }, config));
  }

  private buildChart() {
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: this.persons.map((person: Person) => { return person.name }),
        datasets: [{
          data: this.persons.map((person: Person) => { return person.age }),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        },
        legend: {
          display: false
        }
      }
    });
  }
}
