import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { RestBaseService } from '../tools/rest.tools';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class ProfileService extends RestBaseService {
  constructor(private http: Http, private securityService: AuthService) {
    super();
  }

  async findProfile(): Promise<Profile> {
    return this.http
      .get(environment.serverBase + 'profile', this.getRestHeader())
      .toPromise()
      .then(response => {
        return response.json() as Profile;
      })
      .catch(this.handleError);
  }

  async saveProfile(value: Profile): Promise<Profile> {
    return this.http
      .post(
        environment.serverBase + 'profile',
        JSON.stringify(value),
        this.getRestHeader()
      )
      .toPromise()
      .then(response => {
        this.securityService.getPrincipal().then();
        return response.json() as Profile;
      })
      .catch(this.handleError);
  }
}

export interface Profile {
  name: string;
  province: string;
  email: string;
  address: string;
  phone: string;
  picture: string;
}
