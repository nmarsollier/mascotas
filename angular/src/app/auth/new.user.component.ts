import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { BasicFromGroupController } from '../tools/error.form';

@Component({
    selector: 'app-auth-new-user',
    templateUrl: './new.user.component.html'
})
export class NewUserComponent extends BasicFromGroupController {
    form = new FormGroup({
        login: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
        password2: new FormControl('', [Validators.required]),
    }, (formGroup: FormGroup) => {
        return this.validarPasswords(formGroup);
    });

    constructor(private authService: AuthService, private router: Router) {
        super();
    }

    validarPasswords(group: FormGroup) {
        if (group.controls.password.value !== group.controls.password2.value) {
            this.errors.set('password2', 'Los passwords no son iguales');
            return this.errors;
        } else {
            this.cleanRestValidations();
        }
        return null;
    }

    submitForm() {
        this.cleanRestValidations();

        try {
            this.authService.newUser({
                name: this.form.get('name').value,
                login: this.form.get('login').value,
                password: this.form.get('password').value
            });
            this.router.navigate(['/']);
        } catch (error) {
            this.processRestValidations(error);
        }
    }
}
