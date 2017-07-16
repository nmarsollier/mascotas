import { Component, OnInit } from '@angular/core';
import { MascotaService, Mascota } from './mascota.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { DatePickerPipe } from '../tools/common-pipes.pipe';
import { DatePickerModule } from 'ng2-datepicker';

import { IErrorController } from '../tools/error-handler';
import * as errorHanlder from '../tools/error-handler';

@Component({
  selector: 'app-nueva-mascota',
  templateUrl: './nueva-mascota.component.html'
})
export class NuevaMascotaComponent implements OnInit, IErrorController {
  mascota: Mascota;
  formSubmitted: boolean;

  errorMessage: string;
  errors: string[] = [];

  constructor(
    private mascotasService: MascotaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.mascota = {
      _id: null,
      name: '',
      birthDate: '',
      description: ''
    };
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.mascotasService
          .buscarMascota(id)
          .then(mascota => (this.mascota = mascota))
          .catch(error => errorHanlder.procesarValidacionesRest(this, error));
      }
    });
  }

  submitForm() {
    errorHanlder.cleanRestValidations(this);
    this.mascotasService
      .guardarMascota(this.mascota)
      .then(mascota => this.router.navigate(['/mascotas']))
      .catch(error => errorHanlder.procesarValidacionesRest(this, error));
  }

  onDelete() {
    errorHanlder.cleanRestValidations(this);
    this.mascotasService
      .eliminarMascota(this.mascota._id)
      .then(any => this.router.navigate(['/mascotas']))
      .catch(error => errorHanlder.procesarValidacionesRest(this, error));
  }
}
