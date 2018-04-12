import { Injectable, Inject, forwardRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

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
        const persons = this.extract<Person[]>(response);
        return _.sortBy(persons, ['name']);
      })
      .catch(this.handleError);
  }

  getPerson(id: number): Observable<Person> {
    return this.http
      .get(this.elementPath(id), this.buildRequestOptions())
      .map((response: Response) => {
        return this.extract<Person>(response);
      })
      .catch(this.handleError);
  }

  createPerson(data: Person): Observable<Person> {
    const body = JSON.stringify(data);

    return this.http
      .post(this.apiPath, body, this.buildRequestOptions())
      .map((response: Response) => {
        return this.extract<Person>(response);
      })
      .catch(this.handleError);
  }

  updatePerson(data: Person): Observable<Person> {
    const body = JSON.stringify(data);

    return this.http
      .put(this.elementPath(data.id), body, this.buildRequestOptions())
      .map((response: Response) => {
        return this.extract<Person>(response);
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

  private elementPath(id: number): string {
    return `${this.apiPath}/${id}`;
  }

}
