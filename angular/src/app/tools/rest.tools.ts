import { Headers, RequestOptions, Response } from '@angular/http';

export class RestBaseService {

  // Maneja los errores de llamadas a servicios rest
  protected handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      if (error.status === 0) {
        return Promise.reject({ error: 'No se puede conectar con el servidor.' });
      }
      const body = error.json() || '';
      return Promise.reject(body);
    } else {
      errMsg = error.message ? error.message : error.toString();
      return Promise.reject({ 'error': errMsg });
    }
  }

  // Obtiene los headers genéricos para hacer llamadas a servicios rest
  protected getRestHeader(moreHeaders?: any): RequestOptions {
    const params = {
      'Content-Type': 'application/json',
      'Authorization': 'bearer ' + localStorage.getItem('auth_token')
    };

    if (moreHeaders) {
      Object.assign(params, moreHeaders);
    }

    const headers = new Headers(params);

    const options = new RequestOptions({ headers: headers, withCredentials: true });
    return options;
  }
}
