import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Province, ProvinceService } from '../province/province.service';
import { BasicFromGroupController } from '../tools/error.form';
import { ImageService } from '../image/image.service';
import { Profile, ProfileService } from './profile.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './profile.component.html'
})
export class ProfileComponent extends BasicFromGroupController implements OnInit {
  newImage: string;
  provinces: Province[];
  profile: Profile;

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    picture: new FormControl('/assets/select_image.png'),
    email: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    province: new FormControl('', [])
  });

  constructor(
    private provinceService: ProvinceService,
    private profileService: ProfileService,
    private imageService: ImageService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
    this.profile = {
      name: '',
      email: '',
      province: '',
      address: '',
      picture: '',
      phone: ''
    };
  }

  updateImage(imagen: string) {
    if (imagen.indexOf(environment.serverBase) < 0) {
      this.newImage = imagen;
    }
  }

  async ngOnInit() {
    try {
      this.provinces = await this.provinceService.getProvinces();
      this.profile = await this.profileService.findProfile();
      this.form.get('name').setValue(this.profile.name);
      this.form.get('email').setValue(this.profile.email);
      this.form.get('address').setValue(this.profile.address);
      this.form.get('phone').setValue(this.profile.phone);
      if (this.profile.province) {
        this.form.get('province').setValue(this.profile.province);
      }
      if (this.profile.picture) {
        this.form.get('picture').setValue(this.imageService.imageUrl(this.profile.picture));
      }
    } catch (error) {
      this.processRestValidations(error);
    }
  }

  async submitForm() {
    this.cleanRestValidations();

    try {
      if (this.newImage) {
        const imagen = await this.imageService.saveImage({ image: this.newImage });
        this.profile.picture = imagen.id;
      }

      this.profile.address = this.form.get('address').value;
      this.profile.name = this.form.get('name').value;
      this.profile.email = this.form.get('email').value;
      this.profile.province = this.form.get('province').value;
      this.profile.phone = this.form.get('phone').value;

      await this.profileService.saveProfile(this.profile);
      this.router.navigate(['/']);
    } catch (error) {
      this.processRestValidations(error);
    }
  }
}
