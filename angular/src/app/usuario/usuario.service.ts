import { Injectable } from "@angular/core";
import { Http, Headers, Response, URLSearchParams } from "@angular/http";
import { RestBaseService } from "../tools/rest.tools";
import "rxjs/add/operator/toPromise";

@Injectable()
export class UsuarioService extends RestBaseService {
  private loginUrl = "/auth/signin";
  private logoutUrl = "/auth/signout";
  private principalUrl = "/auth/currentUser";
  private registrarUrl = "/auth/signup";

  private usuarioLogueado;

  constructor(private http: Http) {
    super();
  }

  login(username: string, password: string): Promise<Usuario> {
    const data = {
      login: username,
      password: password
    };
    localStorage.removeItem('auth_token');

    return this.http
      .post(
      UsuarioService.serverUrl + this.loginUrl,
      JSON.stringify(data),
      this.getRestHeader()
      )
      .toPromise()
      .then(response => {
        localStorage.setItem("auth_token", response.json().token);
        return this.getPrincipal();
      })
      .catch(this.handleError);
  }

  logout(): Promise<Usuario> {
    localStorage.removeItem('auth_token');

    return this.http
      .get(UsuarioService.serverUrl + this.logoutUrl, this.getRestHeader())
      .toPromise()
      .then(response => {
        return response.json() as Usuario;
      })
      .catch(this.handleError);
  }

  getPrincipal(): Promise<Usuario> {
    return this.http
      .get(UsuarioService.serverUrl + this.principalUrl, this.getRestHeader())
      .toPromise()
      .then(response => {
        return response.json() as Usuario;
      })
      .catch(this.handleError);
  }

  registrarUsuario(value: RegistrarUsuario): Promise<Usuario> {
    return this.http
      .put(
      UsuarioService.serverUrl + this.registrarUrl,
      JSON.stringify(value),
      this.getRestHeader()
      )
      .toPromise()
      .then(response => {
        return response.json() as Usuario;
      })
      .catch(this.handleError);
  }
}

export interface RegistrarUsuario {
  login: string;
  name: string;
  password: string;
}

export interface Usuario {
  login: string;
  name: string;
  email: string;
  enabled: boolean;
  roles: string[];
}
