import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IdentityUserService } from 'src/app/utils/IdentityUser/identity-user.service';
import { LoadingService } from '../../loading/loading.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ConfigService } from 'src/app/utils/service/config.service';
import { MatDialog } from '@angular/material';
import { FormControl } from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { ProductosService } from '../productos.service';
import { ProductoSimpleView } from 'src/app/models/producto/productoSimpleView';
import { AgregarProductoComponent } from '../agregar-producto/agregar-producto.component';
import { ProductoImagenesComponent } from '../producto-imagenes/producto-imagenes.component';
import { AgregarProductoImagenComponent } from '../agregar-producto-imagen/agregar-producto-imagen.component';
import { EditarProductoComponent } from '../../carrito/editar-producto/editar-producto.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  providers: [ProductosService],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class ProductosComponent implements OnInit {
  documentos: ProductoSimpleView[] = new Array();
  ordenar = "nombre";
  tipos = [{ "key": "nombre", "value": "Nombre"},{ "key": "menudeo", "value": "Precio"}]
  palabra = "";
  page = 0;

  constructor(
    private identityUserService: IdentityUserService,
    private productoService: ProductosService,
    private loadingService: LoadingService,
    private toastr: ToastrService,
    private configService: ConfigService,
    public dialog: MatDialog,) { }

    ngOnInit() {
      this.startGetDatos();
    }

    startGetDatos() {
        if (!this.identityUserService.getUserId()) {
            setTimeout(() => {
                this.startGetDatos();
            }, 1000);
        } else { this.buscar(); }
    }

    buscarPalabra(filterValue: string): void{
      if(filterValue.length > 2 || filterValue.length == 0){
        this.page = 0;
        this.documentos = new Array();
        this.buscar();
      }
    }

    buscar(): void {
      this.documentos = new Array();
      this.loadingService.show();
      this.productoService.getProductos(this.palabra, this.page, this.ordenar).subscribe(
          res => {
            this.loadingService.hide();
            if (res.success) {
              if (res.payload != null && res.payload.length > 0) {
                this.documentos = res.payload;
              } else {
                this.toastr.info('Sin datos', 'Consulta terminada');
              }
            }
          }, error => {
              this.loadingService.hide();
              this.toastr.error(error, 'Error');
          }
      );
    }
  
    openAgregar(): void {
      const dialogRef = this.dialog.open(AgregarProductoComponent, {
        disableClose: false, autoFocus: false, width: '750px',  data: {isAgregar : true, producto: null}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) { this.buscar(); }
      });
    }
  
    openEditar(documento: ProductoSimpleView): void {
      const dialogRef = this.dialog.open(AgregarProductoComponent, {
        disableClose: false, autoFocus: false, width: '750px',  data: {isAgregar : false, producto: documento}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) { this.buscar(); }
      });
    }

    openAgregarAlCarrito(documento: ProductoSimpleView){
      const dialogRef = this.dialog.open(EditarProductoComponent, {
        disableClose: false, autoFocus: false, width: '750px',  data: {productoSimple: documento, productoPedido: null}
      });
    }

    eliminar(documento: ProductoSimpleView) {
      // tslint:disable-next-line: one-variable-per-declaration
      const confirmacion = confirm('Seguro de eliminar el producto');
      if (confirmacion) {
        this.loadingService.show();
        this.productoService.deleteProducto(documento._id).subscribe(
        registro => {
            this.loadingService.hide();
            this.toastr.success('', 'Producto eliminado');
            this.buscar();
            }, error => {
                this.loadingService.hide();
                this.toastr.error(error);
            }, () => {
                this.loadingService.hide();
            }
          );
      }
    }

    openImagenes(documento: ProductoSimpleView): void {
      if(documento.imagenes != null && documento.imagenes.length > 0){
        const dialogRef = this.dialog.open(ProductoImagenesComponent, {
          disableClose: false, autoFocus: false, width: '750px',  data: {producto: documento}
        });
      }
    }

    openAgregarImagen(documento: ProductoSimpleView): void {
      const dialogRef = this.dialog.open(AgregarProductoImagenComponent, {
        disableClose: false, autoFocus: false, width: '550px',  data: documento._id
      });
    }

    siguientePagina(){
      this.page += 1;
      this.buscar;
    }

    anteriorPagina(){
      this.page -= 1;
      if(this.page < 0) this.page = 0;
      this.buscar();
    }

    getImg(documento: ProductoSimpleView){      
      return "url('" + this.configService.getApiURI() + '/' + documento.imagenes[0].url + "')";
    }

}
