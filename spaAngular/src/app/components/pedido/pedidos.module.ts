import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidosComponent } from './pedidos/pedidos.component';
import { PedidosRoutingModule } from './pedidos-routing.module';
import { AppSharedModule } from 'src/app/app-shared.module';



@NgModule({
  declarations: [
    PedidosComponent
  ],
  imports: [
    PedidosRoutingModule,
      AppSharedModule
  ],
})
export class PedidosModule { }
