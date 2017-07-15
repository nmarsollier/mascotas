import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ProvinciaService, Provincia } from "../provincia/provincia.service";
import { PerfilService, Perfil } from "./perfil.service";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs/Rx";
import { Router } from "@angular/router";

import { IErrorController } from '../tools/error-handler';
import * as errorHanlder from '../tools/error-handler';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit, IErrorController {
  form: FormGroup;
  formSubmitted: boolean;

  errorMessage: string;
  errors: string[] = [];

  provincias: Provincia[];

  constructor(
    fb: FormBuilder,
    private provinciaService: ProvinciaService,
    private perfilService: PerfilService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = fb.group({
      id: [null, null],
      provincia: [
        null,
        [Validators.required, Validators.minLength(1), Validators.maxLength(50)]
      ],
      email: [
        null,
        [Validators.required, Validators.minLength(1), Validators.maxLength(50)]
      ],
      nombre: [
        null,
        [Validators.required, Validators.minLength(1), Validators.maxLength(50)]
      ],
      direccion: [null, Validators.required],
      telefono: [null, Validators.required]
    });
    this.form.patchValue({
      id: null,
      nombre: '',
      email: '',
      provincia: '',
      direccion: '',
      telefono: ''
    });
  }

  ngOnInit() {
    this.provinciaService
      .getProvincias()
      .then(provincias => (this.provincias = provincias))
      .catch(error => errorHanlder.procesarValidacionesRest(this, error));

    this.perfilService
      .buscarPerfil()
      .then(perfil => this.form.patchValue(perfil))
      .catch(error => errorHanlder.procesarValidacionesRest(this, error));
  }

  submitForm() {
    errorHanlder.cleanRestValidations(this);
    if (this.form.valid) {
      this.perfilService
        .guardarPerfil(this.form.value)
        .then(usuario => this.router.navigate(['/']))
        .catch(error => errorHanlder.procesarValidacionesRest(this, error));
    } else {
      this.formSubmitted = true;
    }
  }
}
