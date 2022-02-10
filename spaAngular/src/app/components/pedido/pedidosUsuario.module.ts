import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidosComponent } from './pedidos/pedidos.component';
import { PedidosRoutingModule } from './pedidos-routing.module';
import { AppSharedModule } from 'src/app/app-shared.module';
import { PedidosUsuarioComponent } from './pedidosUsuario/pedidosUsuario.component';
import { PedidosUsuarioRoutingModule } from './pedidosUsuario-routing.module';



@NgModule({
  declarations: [
   
    PedidosUsuarioComponent
  ],
  imports: [
    PedidosUsuarioRoutingModule,
      AppSharedModule
  ],
})
export class PedidosUsuarioModule { }
