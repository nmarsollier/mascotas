import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProvinciaService, Provincia } from '../provincia/provincia.service';
import { PerfilService, Perfil } from './perfil.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {
  form: FormGroup;
  errorMessage: string;
  formSubmitted: boolean;

  provincias: Provincia[];

  constructor(fb: FormBuilder,
    private provinciaService: ProvinciaService,
    private perfilService: PerfilService,
    private route: ActivatedRoute,
    private router: Router) {
    this.form = fb.group({
      'id': [null, null],
      'provincia': [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      'email': [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      'nombre': [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      'direccion': [null, Validators.required],
      'telefono': [null, Validators.required],
    })
    this.form.patchValue({ id: null, nombre: '', email: '', provincia: '', direccion: '', telefono: '' });
  }

  ngOnInit() {
    this.provinciaService.getProvincias()
      .then(provincias => this.provincias = provincias)
      .catch(error => this.errorMessage = <any>error);

    this.perfilService.buscarPerfil()
      .then(perfil => this.form.patchValue(perfil))
      .catch(error => this.errorMessage = <any>error);

  }

  submitForm() {
    this.cleanRestValidations();
    if (this.form.valid) {
      this.perfilService.guardarPerfil(this.form.value)
        .then(usuario => this.router.navigate(['/']))
        .catch(error => this.errorMessage = <any>error);
    } else {
      this.formSubmitted = true;
    }
  }


  cleanRestValidations() {
    //    this.form.controls['nombre'].setValidity( "rest", true );
    //    $scope.form.fechaNacimiento.$setValidity( "rest", true );
    //    $scope.form.descripcion.$setValidity( "rest", true );
  }

  procesarValidacionesRest(data) {
    /*   if ( data.message ) {
           for ( var i in data.message ) {
               var error = data.message[i];
               if ( $scope.form[error.path] ) {
                   $scope.form[error.path].$setValidity( "rest", false );
                   $scope.form[error.path].$error.restMessage = error.message;
               }
           }
       } else {
           toastr.error( "Error al grabar el perfil.", data.message );
       }*/
  }
}

