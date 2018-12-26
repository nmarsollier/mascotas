import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BasicFromGroupController } from '../tools/error.form';
import { PetService } from './pet.service';

@Component({
  selector: 'app-nueva-mascota',
  templateUrl: './new-pet.component.html'
})
export class NewPetComponent extends BasicFromGroupController implements OnInit {
  petId: string;

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', []),
    birthDate: new FormControl('', [])
  });

  constructor(
    private petService: PetService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.petService
          .getPet(id)
          .then(pet => {
            this.petId = pet.id;
            this.form.get('name').setValue(pet.name);
            this.form.get('description').setValue(pet.description);
            this.form.get('birthDate').setValue(pet.birthDate);
          })
          .catch(error => {
            this.processRestValidations(error);
          });
      }
    });
  }

  submitForm() {
    this.cleanRestValidations();
    this.petService
      .savePet({
        id: this.petId,
        name: this.form.get('name').value,
        description: this.form.get('description').value,
        birthDate: this.form.get('birthDate').value
      })
      .then(mascota => this.router.navigate(['/mascotas']))
      .catch(error => this.processRestValidations(error));
  }

  onDelete() {
    this.cleanRestValidations();
    this.petService
      .deletePet(this.petId)
      .then(any => this.router.navigate(['/mascotas']))
      .catch(error => this.processRestValidations(error));
  }
}
