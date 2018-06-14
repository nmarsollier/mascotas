import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as errorHandler from "../tools/error-handler";
import { IErrorController } from "../tools/error-handler";
import { Usuario, UsuarioService } from "../usuario/usuario.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html"
})
export class MenuComponent implements OnInit, IErrorController {
  loginForm: FormGroup;

  errorMessage: string;
  errors: string[] = [];
  usuarioLogueado: Usuario;

  constructor(fb: FormBuilder, private router: Router, public usuarioService: UsuarioService) {
    this.loginForm = fb.group({
      username: [undefined, Validators.required],
      password: [undefined, Validators.required]
    });
  }

  ngOnInit() {
    this.usuarioService.getPrincipal()
      .then((usuario) => this.usuarioLogueado = usuario)
      .catch((error) => this.usuarioLogueado = undefined);
  }

  login() {
    this.usuarioService
      .login(this.loginForm.value.username, this.loginForm.value.password)
      .then((usuario) => this.usuarioLogueado = usuario)
      .catch(error => {
        errorHandler.procesarValidacionesRest(this, error);
        this.usuarioLogueado = undefined;
      });
  }

  logout() {
    errorHandler.cleanRestValidations(this);

    this.usuarioService
      .logout()
      .then(result => {
        this.usuarioLogueado = undefined;
        this.router.navigate(["/"]);
      })
      .catch(error => {
        errorHandler.procesarValidacionesRest(this, error);
        this.usuarioLogueado = undefined;
        this.router.navigate(["/"]);
      });
  }
}
