import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PedidosComponent } from './pedidos/pedidos.component';
import { PedidosUsuarioComponent } from './pedidosUsuario/pedidosUsuario.component';

const routes: Routes = [
    {
        path: '',
        component: PedidosUsuarioComponent,
        children: [
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PedidosUsuarioRoutingModule {
}
