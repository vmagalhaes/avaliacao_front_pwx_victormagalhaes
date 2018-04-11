import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable()
export class RestClientService {

  private authToken: string;

  extract<T>(response: Response): T {
    return <T>response.json();
  }

  buildRequestOptions(queryParams: any = {}): RequestOptions {
    const headers: Headers = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=UTF-8',
      'Sgt2-Token': this.getAuthToken()
    });
    const params: URLSearchParams = new URLSearchParams();

    _.forEach((queryParams), (value: any, key: string) => {
      if (_.isArray(value)) {
        _.forEach((value), (v: string) => {
          params.append(`${key}[]`, v);
        });
      } else {
        params.set(key, value);
      }
    });

    return new RequestOptions({ headers: headers, search: params });
  }

  private getAuthToken() {
    if (!this.authToken) {
      const serialized = sessionStorage.getItem('br.com.visaogeo');
      const context = serialized ? JSON.parse(serialized) : {};

      if (context.isLoggedIn) {
        this.authToken = context.user.token;
      }
    }

    return this.authToken;
  }

  handleError(error: any): ErrorObservable {
    const message = error.message || 'Server error';
    return Observable.throw(message);
  }

}
