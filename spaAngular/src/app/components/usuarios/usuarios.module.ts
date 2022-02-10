import { NgModule } from '@angular/core';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AppSharedModule } from 'src/app/app-shared.module';
import { UsuariosRoutingModule } from './usuarios-routing.module';


@NgModule({
    declarations: [
      UsuariosComponent
    ],
    imports: [
      UsuariosRoutingModule,
        AppSharedModule
    ],
  })
  export class UsuariosModule { }
  
