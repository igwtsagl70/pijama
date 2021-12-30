import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosRoutingModule } from './productos-routing.module';
import { AppSharedModule } from 'src/app/app-shared.module';
import { AgregarProductoComponent } from './agregar-producto/agregar-producto.component';
import { AgregarProductoImagenComponent } from './agregar-producto-imagen/agregar-producto-imagen.component';
import { ProductosComponent } from './productos/productos.component';
import { ProductoImagenesComponent } from './producto-imagenes/producto-imagenes.component';
import { InfoArchivoComponent } from './info-archivo/info-archivo.component';



@NgModule({
  imports: [
    ProductosRoutingModule,
      AppSharedModule
  ],
  declarations: [
    ProductosComponent,
    ProductoImagenesComponent,
    InfoArchivoComponent,
    AgregarProductoComponent, 
    AgregarProductoImagenComponent
  ],
  entryComponents: [
    ProductoImagenesComponent,
    InfoArchivoComponent,
    AgregarProductoComponent, 
    AgregarProductoImagenComponent
  ]
})
export class ProductosModule { }
