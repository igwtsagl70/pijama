import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SublimadosComponent } from './sublimados/sublimados.component';

const routes: Routes = [
    {
        path: '',
        component: SublimadosComponent,
        children: [
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SublimadosRoutingModule {
}
