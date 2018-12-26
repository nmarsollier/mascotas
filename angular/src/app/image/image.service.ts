import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { RestBaseService } from '../tools/rest.tools';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class ImageService extends RestBaseService {
  constructor(private http: Http, private securityService: AuthService) {
    super();
  }

  async getImage(id: string): Promise<Image> {
    return this.http
      .get(environment.serverBase + 'image/' + id, this.getRestHeader())
      .toPromise()
      .then(response => {
        return response.json() as Image;
      })
      .catch(this.handleError);
  }

  imageUrl(id: string): string {
    return environment.serverBase + 'image/' + id;
  }

  async saveImage(value: Image): Promise<Image> {
    return this.http
      .post(
        environment.serverBase + 'image',
        JSON.stringify(value),
        this.getRestHeader()
      )
      .toPromise()
      .then(response => {
        return response.json() as Image;
      })
      .catch(this.handleError);
  }
}

export interface Image {
  id?: string;
  image: string;
}
