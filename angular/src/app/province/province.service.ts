import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import { RestBaseService } from '../tools/rest.tools';

@Injectable()
export class ProvinceService extends RestBaseService {
  constructor(private http: Http) {
    super();
  }

  async getProvinces(): Promise<Province[]> {
    return this.http
      .get(
        environment.serverBase + 'province',
        this.getRestHeader()
      )
      .toPromise()
      .then(response => {
        return response.json() as Province[];
      })
      .catch(this.handleError);
  }
}

export interface Province {
  id: string;
  name: string;
}
