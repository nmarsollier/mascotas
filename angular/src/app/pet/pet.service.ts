import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { RestBaseService } from '../tools/rest.tools';
import { environment } from '../../environments/environment';

@Injectable()
export class PetService extends RestBaseService {
  constructor(private http: Http) {
    super();
  }

  getPets(): Promise<Pet[]> {
    return this.http
      .get(environment.serverBase + 'pet', this.getRestHeader())
      .toPromise()
      .then(response => {
        return response.json() as Pet[];
      })
      .catch(this.handleError);
  }

  getPet(id: number): Promise<Pet> {
    return this.http
      .get(environment.serverBase + 'pet/' + id, this.getRestHeader())
      .toPromise()
      .then(response => {
        return response.json() as Pet;
      })
      .catch(this.handleError);
  }

  savePet(value: Pet): Promise<Pet> {
    if (value.id) {
      return this.http
        .post(
          environment.serverBase + 'pet/' + value.id,
          JSON.stringify(value),
          this.getRestHeader()
        )
        .toPromise()
        .then(response => {
          return response.json() as Pet;
        })
        .catch(this.handleError);
    } else {
      return this.http
        .post(
          environment.serverBase + 'pet',
          JSON.stringify(value),
          this.getRestHeader()
        )
        .toPromise()
        .then(response => {
          return response.json() as Pet;
        })
        .catch(this.handleError);
    }
  }

  deletePet(id: string): Promise<any> {
    if (id) {
      return this.http
        .delete(
          environment.serverBase + 'pet/' + id,
          this.getRestHeader()
        )
        .toPromise()
        .then(response => {
          return '';
        })
        .catch(this.handleError);
    }
  }
}

export interface Pet {
  id: string;
  name: string;
  birthDate: string;
  description: string;
}
