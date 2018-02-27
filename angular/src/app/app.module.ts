import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { APP_BASE_HREF } from "@angular/common";

import { routing } from "./app.routes";
import { AppComponent } from "./app.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { UsuarioService } from "./usuario/usuario.service";
import { ProvinciaService } from "./provincia/provincia.service";
import { PerfilService } from "./perfil/perfil.service";
import { PerfilComponent } from "./perfil/perfil.component";
import { MascotaComponent } from "./mascota/mascota.component";
import { MenuComponent } from "./menu/menu.component";
import { NuevaMascotaComponent } from "./mascota/nueva-mascota.component";
import { MascotaService } from "./mascota/mascota.service";
import { environment } from "../environments/environment";
import { RegistrarUsuarioComponent } from "./usuario/registrar-usuario.component";
import { NgDatepickerModule } from "ng2-datepicker";
import { FileUploadComponent } from "./tools/image.base64";

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    PerfilComponent,
    MascotaComponent,
    MenuComponent,
    NuevaMascotaComponent,
    RegistrarUsuarioComponent,
    FileUploadComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    NgDatepickerModule,
    routing
  ],
  providers: [
    MascotaService,
    UsuarioService,
    ProvinciaService,
    PerfilService,
    { provide: APP_BASE_HREF, useValue: environment.baseHref }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
