import { Component, OnInit } from '@angular/core';
import { BasicFromGroupController } from '../tools/error.form';
import { Pet, PetService } from './pet.service';

@Component({
  selector: 'app-mascota',
  templateUrl: './pet.component.html'
})
export class PetComponent extends BasicFromGroupController implements OnInit {
  pets: Pet[];

  constructor(private petService: PetService) {
    super();
  }

  ngOnInit() {
    this.petService
      .getPets()
      .then(mascotas => (this.pets = mascotas))
      .catch(error => (this.processRestValidations(error)));
  }
}
