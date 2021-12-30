import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SingleLayoutComponent } from './containers/single-layout/single-layout.component';
import { AdminLayoutComponent } from './containers/admin-layout/admin-layout.component';
import { AuthGuard } from './utils/service/auth-guard.service';
import { PanelLayoutComponent } from './containers/panel-layout/panel-layout.component';


const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: '',
    component: SingleLayoutComponent,
    children: [
        { path: 'auth', loadChildren: './components/auth/auth.module#AuthModule' }
    ]
  },
  {
      path: 'admin',
      component: AdminLayoutComponent,
      canActivate: [AuthGuard],
      children: [
          { path: 'productos', loadChildren: './components/productos/productos.module#ProductosModule' },
          { path: 'pedidos', loadChildren: './components/pedido/pedidos.module#PedidosModule' },
          { path: 'sublimados', loadChildren: './components/sublimado/sublimados.module#SublimadosModule' },
      ]
  },
  {
      path: 'inicio',
      component: PanelLayoutComponent,
      canActivate: [AuthGuard],
      children: [
          { path: 'productos', loadChildren: './components/productos/productos.module#ProductosModule' },
      ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
