import { Component, OnInit } from '@angular/core';
import { MascotaService, Mascota } from './mascota.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { DatePickerPipe } from '../tools/common-pipes.pipe';
import { DatePickerModule } from 'ng2-datepicker';


@Component({
  selector: 'app-nueva-mascota',
  templateUrl: './nueva-mascota.component.html'
})
export class NuevaMascotaComponent implements OnInit {
  mascota: Mascota;
  errorMessage: string;
  formSubmitted: boolean;
  errors: string[] = [];

  constructor(private mascotasService: MascotaService,
    private route: ActivatedRoute, private router: Router) {
    this.mascota = { id: null, nombre: '', fechaNacimiento: '', descripcion: '' };
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = +params['id'];
      if (id) {
        this.mascotasService.buscarMascota(id)
          .then(mascota => this.mascota = mascota)
          .catch(error => this.errorMessage = <any>error);
      }
    });
  }

  submitForm() {
    this.cleanRestValidations();
    this.mascotasService.guardarMascota(this.mascota)
      .then(mascota => this.router.navigate(['/mascotas']))
      .catch(error => this.procesarValidacionesRest(error));
  }
  
  
  onDelete() {
    this.cleanRestValidations();
    this.mascotasService.eliminarMascota(this.mascota.id)
      .then(any => this.router.navigate(['/mascotas']))
      .catch(error => this.procesarValidacionesRest(error));
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
