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
import { ProductoSimpleView } from 'src/app/models/producto/productoSimpleView';
import { EditarProductoComponent } from '../../carrito/editar-producto/editar-producto.component';
import { PedidosService } from '../pedido.service';
import { PedidoSimpleView } from 'src/app/models/pedido/pedidoSimpleView';
import { AgregarPedidoComponent } from '../../carrito/agregar-pedido/agregar-pedido.component';
import { FileUtilitiesService } from 'src/app/utils/service/file-utilities.service';
import { VisualizarPdfComponent } from '../../file/visualizar-pdf/visualizar-pdf.component';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'],
  providers: [PedidosService,FileUtilitiesService],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PedidosComponent implements OnInit {
  fecha = new FormControl(new Date());
  fecha2 = new FormControl(new Date());
  fechaInicio = new Date();  
  fechaFinal = new Date();
  documentos: PedidoSimpleView[] = new Array();
  palabra = "";
  page = 0;

  constructor(
    private identityUserService: IdentityUserService,
    private pedidoService: PedidosService,
    private loadingService: LoadingService,
    private fileService: FileUtilitiesService,
    private toastr: ToastrService,
    private configService: ConfigService,
    public dialog: MatDialog,) { }

    ngOnInit() {
      this.fechaInicio.setDate(1);
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
      var sFechaInicial = this.fechaInicio.toJSON().slice(0, 10);
      var sFechaFinal = this.fechaFinal.toJSON().slice(0, 10);
      this.pedidoService.getPedidos(this.palabra, sFechaInicial, sFechaFinal, this.page, "").subscribe(
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
      const dialogRef = this.dialog.open(AgregarPedidoComponent, {
        disableClose: false, autoFocus: false, width: '750px',  data: {isAgregar : true, producto: null}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) { this.buscar(); }
      });
    }
  
    openEditar(documento: ProductoSimpleView): void {
      const dialogRef = this.dialog.open(AgregarPedidoComponent, {
        disableClose: false, autoFocus: false, width: '1050px',  data: {isAgregar : false, _id: documento._id}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) { this.buscar(); }
      });
    }

    openAgregarAlCarrito(documento: ProductoSimpleView){
      const dialogRef = this.dialog.open(EditarProductoComponent, {
        disableClose: false, autoFocus: false, width: '750px',  data: {productoSimple: ProductoSimpleView, productoPedido: null}
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
      return this.configService.getApiURI() + '/' + documento.imagenes[0].url;
    }

    
    eliminar(documento: PedidoSimpleView) {
      // tslint:disable-next-line: one-variable-per-declaration
      const confirmacion = confirm('Seguro de eliminar el pedido');
      if (confirmacion) {
        this.loadingService.show();
        this.pedidoService.deletePedido(documento._id).subscribe(
        registro => {
            this.loadingService.hide();
            this.toastr.success('', 'Pedido eliminado');
            this.buscar();
            }, error => {
                this.loadingService.hide();
                this.toastr.error(error);
            }, () => {
                this.loadingService.hide();
                this.toastr.error('', 'Otro Error');
            }
          );
      }
    }

    confirmar(documento: PedidoSimpleView) {
      // tslint:disable-next-line: one-variable-per-declaration
      const confirmacion = confirm('Seguro de confirmar el pedido');
      if (confirmacion) {
        this.loadingService.show();
        this.pedidoService.confirmarPedido(documento._id, documento).subscribe(
        registro => {
            this.loadingService.hide();
            this.toastr.success('', 'Pedido confirmado');
            this.buscar();
            }, error => {
                this.loadingService.hide();
                this.toastr.error(error);
            }, () => {
        //this.loadingService.hide();
          //              this.toastr.error('', 'Otro Error');
            }
          );
      }
    }

    crearPdf(documento: PedidoSimpleView) {
      // tslint:disable-next-line: one-variable-per-declaration
      const confirmacion = confirm('Seguro de crear el  pdf del pedido');
      if (confirmacion) {
        this.loadingService.show();
        this.pedidoService.obtenerPdfPedido(documento._id).subscribe(
        registro => {
            this.loadingService.hide();
            this.toastr.success('', 'Pedido pdf obtenido');
            
            var data = registro.payload;
          //  alert("pdf lengt  " + data.length);
           
      
           this.openVisualizar(data);

            }, error => {
                this.loadingService.hide();
                this.toastr.error(error);
            }, () => {
       // this.loadingService.hide();
        //      this.toastr.error('', 'Otro Error');
            }
          );
      }
    }
    

    openVisualizar(s64: string) {
      let dialogRef = this.dialog.open(VisualizarPdfComponent, {
          disableClose: true, autoFocus: false, data: { url: "", s64: s64 }
      });

      dialogRef.afterClosed().subscribe(result => {
          if (result) {
              //this.busquedaActualizar();
          }
      });
  }

}
