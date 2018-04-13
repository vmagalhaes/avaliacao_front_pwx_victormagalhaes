import { Injectable, Inject, forwardRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import * as moment from 'moment';

import { Person } from '../models/person';

import { RestClientService } from './rest-client.service';
import { SettingsService } from './settings.service';

@Injectable()
export class PersonService extends RestClientService {

  private apiPath: string;

  constructor(
    private http: Http,
    private settings: SettingsService
  ) {
    super();
    this.apiPath = this.settings.getApiPath();
  }

  getPersons(): Observable<Person[]> {
    return this.http
      .get(this.apiPath, this.buildRequestOptions())
      .map((response: Response) => {
        let persons = this.extract<Person[]>(response);
        return _.sortBy(this.unmarshalPersons(persons), ['name']);
      })
      .catch(this.handleError);
  }

  getPerson(id: number): Observable<Person> {
    return this.http
      .get(this.elementPath(id), this.buildRequestOptions())
      .map((response: Response) => {
        let person = this.extract<Person>(response);
        return this.unmarshalPerson(person);
      })
      .catch(this.handleError);
  }

  createPerson(data: Person): Observable<Person> {
    const body = JSON.stringify(this.marshalPerson(data));

    return this.http
      .post(this.apiPath, body, this.buildRequestOptions())
      .map((response: Response) => {
        return this.extract<Person>(response);
      })
      .catch(this.handleError);
  }

  updatePerson(data: Person): Observable<Person> {
    const body = JSON.stringify(this.marshalPerson(data));

    return this.http
      .put(this.elementPath(data.id), body, this.buildRequestOptions())
      .map((response: Response) => {
        let person = this.extract<Person>(response);
        return this.unmarshalPerson(person);;
      })
      .catch(this.handleError);
  }

  deletePerson(id: number): Observable<boolean> {
    return this.http
      .delete(this.elementPath(id), this.buildRequestOptions())
      .map((response: Response) => {
        return true;
      })
      .catch(this.handleError);
  }

  buildSurname(name: string) {
    return name.match(/^(\S+)\s(.*)/).slice(1);
  }

  validateCpf(cpf: string) {
    let validCpf = cpf.split('.').join("");
    validCpf = validCpf.split('-').join("");
    return validCpf;
  }

  unmarshalCpf(cpf: string) {
    if (cpf.charAt(3) === '.') {
      if (cpf.charAt(7) === '.') {
        if (cpf.charAt(11) === '-') {
          return cpf;
        }
      }
    } else {
      cpf = cpf.slice(0, 3) + "." + cpf.slice(3);

      if (cpf.charAt(7) === '.') {
        if (cpf.charAt(11) === '-') {
          return cpf;
        }
      } else {
        cpf = cpf.slice(0, 7) + "." + cpf.slice(7);

        if (cpf.charAt(11) === '-') {
          return cpf;
        } else {
          cpf = cpf.slice(0, 11) + "-" + cpf.slice(11);
          return cpf;
        }
      }
    }
  }

  private marshalPerson(person: Person) {
    return {
      id: person.id,
      name: person.name,
      cpf: this.validateCpf(person.cpf),
      email: person.email,
      birthday: moment(person.birthday).format('YYYY-MM-DD')
    }
  }

  private unmarshalPersons(persons: Person[]): Person[] {
    return persons.map((person: Person) => {
      return this.unmarshalPerson(person);
    });
  }

  private unmarshalPerson(person: Person) {
    return {
      id: person.id,
      name: `${person.name}${person.surname ? ' ' + person.surname : ''}`,
      cpf: this.unmarshalCpf(person.cpf),
      age: moment().diff(person.birthday, 'years'),
      email: person.email,
      birthday: moment(person.birthday).format('DD/MM/YYYY')
    }
  }

  private elementPath(id: number): string {
    return `${this.apiPath}/${id}`;
  }

}
