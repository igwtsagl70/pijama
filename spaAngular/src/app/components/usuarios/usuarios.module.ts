import { NgModule } from '@angular/core';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AppSharedModule } from 'src/app/app-shared.module';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { AgregarUsuarioComponent } from './agregar-usuario/agregar-usuario.component';
import { EnviarMensajeComponent } from './enviar-mensaje/enviar-mensaje.component';

@NgModule({
    imports: [
        UsuariosRoutingModule,
        AppSharedModule
    ],
    declarations: [
        UsuariosComponent,
        AgregarUsuarioComponent
    ],
    providers: [
    ],
    entryComponents: [
        AgregarUsuarioComponent,
        EnviarMensajeComponent
    ]
})

export class UsuariosModule {
}
