import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService, Usuario } from './usuario.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html'
})
export class RegistrarUsuarioComponent implements OnInit {
  form: FormGroup;
  errorMessage: string;
  formSubmitted: boolean;
  errors: string[] = [];

  constructor(fb: FormBuilder, private usuarioService: UsuarioService,
    private route: ActivatedRoute, private router: Router) {
    this.form = fb.group({
      'login': [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      'email': [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      'nombre': [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      'password': [null, Validators.required],
      'password2': [null, Validators.required],
    })
    this.form.patchValue({ id: null, nombre: '', password: '', password2: '', login: '', email: '' });
  }

  ngOnInit() {
  }


  submitForm() {
    this.cleanRestValidations();
    if (this.form.valid) {
      this.usuarioService.registrarUsuario({
        login: this.form.value.login,
        password: this.form.value.password,
        email: this.form.value.email,
        nombre: this.form.value.nombre
      })
        .then(usuario => this.router.navigate(['/']))
        .catch(error => this.procesarValidacionesRest(error));
    } else {
      this.formSubmitted = true;
    }
  }


  cleanRestValidations() {
    this.errorMessage = undefined;
    this.errors = [];
  }

  procesarValidacionesRest(data: any) {
    if (data.message) {
      for (const error of data.message) {
        this.errors[error.path] = error.message;
      }
    } else {
      this.errorMessage = data.message;
    }
  }
}

