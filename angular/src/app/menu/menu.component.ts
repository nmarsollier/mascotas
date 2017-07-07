import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario, UsuarioService } from '../usuario/usuario.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {
  logueado: Usuario;
  errorMessage: string;

  loginForm: FormGroup;

  constructor(fb: FormBuilder, private usuarioService: UsuarioService) {
    this.loginForm = fb.group({
      'username': [null, Validators.required],
      'password': [null, Validators.required]
    });
  }

  ngOnInit() {
    this.logueado = null;
    this.usuarioService.getPrincipal()
      .then(usuario => this.logueado = usuario)
      .catch(error => this.errorMessage = <any>error);
  }

  usuarioLogueado(): Usuario {
    return this.logueado;
  }

  login() {
    this.usuarioService.login(this.loginForm.value.username, this.loginForm.value.password)
      .then(usuario => this.logueado = usuario)
      .catch(error => this.errorMessage = <any>error);
  }

  logout() {
    this.logueado = null;
    this.usuarioService.logout().then(null)
      .catch(error => this.errorMessage = <any>error);
  }
}
