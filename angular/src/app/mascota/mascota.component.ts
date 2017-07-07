import { Component, OnInit } from '@angular/core';
import { MascotaService, Mascota } from './mascota.service'
import { Observable } from 'rxjs/Rx';


@Component( {
    selector: 'app-mascota',
    templateUrl: './mascota.component.html'
})
export class MascotaComponent implements OnInit {
    errorMessage: string;
    mascotas: Mascota[];

    constructor( private mascotasService: MascotaService ) { }

    ngOnInit() {
        this.mascotasService.buscarMascotas()
          .then(mascotas => this.mascotas = mascotas)
          .catch(error => this.errorMessage = <any>error );
    }
}
