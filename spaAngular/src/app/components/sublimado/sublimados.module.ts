import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SublimadosRoutingModule } from './sublimados-routing.module';
import { AppSharedModule } from 'src/app/app-shared.module';
import { AgregarSublimadoComponent } from './agregar-sublimado/agregar-sublimado.component';
import { AsignarPedidoComponent } from './asignar-pedido/asignar-pedido.component';
import { SublimadosComponent } from './sublimados/sublimados.component';



@NgModule({
  declarations: [
    AgregarSublimadoComponent,
    AsignarPedidoComponent,
    SublimadosComponent
  ],
  entryComponents: [
    AgregarSublimadoComponent,
    AsignarPedidoComponent
  ],
  imports: [
    SublimadosRoutingModule,
      AppSharedModule
  ],
})
export class SublimadosModule { }
