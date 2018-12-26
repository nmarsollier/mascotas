import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { LoggedIn, routing } from './app.routes';
import { AuthService } from './auth/auth.service';
import { InfoComponent } from './auth/info.component';
import { LoginComponent } from './auth/login.component';
import { NewPasswordComponent } from './auth/new.password.component';
import { NewUserComponent } from './auth/new.user.component';
import { MenuComponent } from './menu/menu.component';
import { AppComponent } from './root.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { FileUploadComponent } from './tools/file.upload.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ProfileComponent } from './profile/profile.component';
import { ProvinceService } from './province/province.service';
import { ProfileService } from './profile/profile.service';
import { ImageService } from './image/image.service';
import { PetComponent } from './pet/pet.component';
import { NewPetComponent } from './pet/new-pet.component';
import { PetService } from './pet/pet.service';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    ToolbarComponent,
    LoginComponent,
    NewUserComponent,
    WelcomeComponent,
    FileUploadComponent,
    InfoComponent,
    NewPasswordComponent,
    ProfileComponent,
    PetComponent,
    NewPetComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing
  ],
  providers: [AuthService, ProvinceService, ProfileService, ImageService, PetService, LoggedIn],
  bootstrap: [AppComponent]
})
export class AppModule { }
