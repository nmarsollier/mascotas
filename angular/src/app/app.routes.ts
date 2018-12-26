import { Injectable, ModuleWithProviders } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { InfoComponent } from './auth/info.component';
import { LoginComponent } from './auth/login.component';
import { NewUserComponent } from './auth/new.user.component';
import { NewPasswordComponent } from './auth/new.password.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ProfileComponent } from './profile/profile.component';
import { PetComponent } from './pet/pet.component';
import { NewPetComponent } from './pet/new-pet.component';


@Injectable()
export class LoggedIn implements CanActivate {
    constructor(private router: Router, private auth: AuthService) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        if (this.auth.usuarioLogueado) {
            return true;
        } else {
            this.router.navigate(['/']);
            return false;
        }
    }
}

// Route Configuration
export const routes: Routes = [
    { path: '', component: WelcomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'info', component: InfoComponent, canActivate: [LoggedIn] },
    { path: 'password', component: NewPasswordComponent, canActivate: [LoggedIn] },
    { path: 'registrarse', component: NewUserComponent },
    { path: 'perfil', component: ProfileComponent },
    { path: 'mascotas', component: PetComponent, canActivate: [LoggedIn] },
    { path: 'nuevaMascota/:id', component: NewPetComponent, canActivate: [LoggedIn] },
    { path: 'nuevaMascota', component: NewPetComponent, canActivate: [LoggedIn] }

];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
