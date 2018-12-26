import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import { RestBaseService } from '../tools/rest.tools';

@Injectable()
export class AuthService extends RestBaseService {
    public usuarioLogueado: User;

    constructor(private http: Http) {
        super();
    }

    async login(username: string, password: string): Promise<User> {
        const data = {
            login: username,
            password: password
        };
        localStorage.removeItem('auth_token');

        return this.http
            .post(
                environment.serverBase + 'user/signin',
                JSON.stringify(data),
                this.getRestHeader()
            )
            .toPromise()
            .then(response => {
                localStorage.setItem('auth_token', response.json().token);
                return this.getPrincipal();
            })
            .catch(this.handleError);
    }

    async changePassword(currentPassword: string, newPassword: string): Promise<void> {
        const data = {
            currentPassword: currentPassword,
            newPassword: newPassword
        };

        return this.http
            .post(
                environment.serverBase + 'user/password',
                JSON.stringify(data),
                this.getRestHeader()
            )
            .toPromise()
            .then(response => null)
            .catch(this.handleError);
    }

    async logout(): Promise<string> {
        return this.http
            .get(environment.serverBase + 'user/signout', this.getRestHeader())
            .toPromise()
            .then(response => {
                localStorage.removeItem('auth_token');
                this.usuarioLogueado = undefined;
                return '';
            }).catch(error => {
                localStorage.removeItem('auth_token');
                this.usuarioLogueado = undefined;
                return this.handleError(error);
            });
    }

    async getPrincipal(): Promise<User> {
        if (this.usuarioLogueado) {
            return Promise.resolve(this.usuarioLogueado);
        } else {
            return this.http
                .get(environment.serverBase + 'users/current', this.getRestHeader())
                .toPromise()
                .then(response => {
                    this.usuarioLogueado = response.json();
                    return response.json() as User;
                })
                .catch(this.handleError);
        }
    }

    async newUser(value: RegistrarUsuario): Promise<User> {
        return this.http
            .post(
                environment.serverBase + 'user',
                JSON.stringify(value),
                this.getRestHeader()
            )
            .toPromise()
            .then(response => {
                localStorage.setItem('auth_token', response.json().token);
                return this.getPrincipal();
            })
            .catch(this.handleError);
    }
}

export interface RegistrarUsuario {
    login: string;
    name: string;
    password: string;
}

export interface User {
    login: string;
    name: string;
    email: string;
    enabled: boolean;
    roles: string[];
}
