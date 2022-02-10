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
import { PedidoSimpleView, PedidoView } from 'src/app/models/pedido/pedidoSimpleView';
import { AgregarPedidoComponent } from '../../carrito/agregar-pedido/agregar-pedido.component';
import { SublimadosService } from '../sublimados.service';
import { SublimadoSimpleView } from 'src/app/models/sublimado/sublimadoSimpleView';
import { AsignarPedidoComponent } from '../asignar-pedido/asignar-pedido.component';
import { AgregarSublimadoComponent } from '../agregar-sublimado/agregar-sublimado.component';
import { VisualizarPdfComponent } from '../../file/visualizar-pdf/visualizar-pdf.component';

@Component({
  selector: 'app-sublimados',
  templateUrl: './sublimados.component.html',
  styleUrls: ['./sublimados.component.css'],
  providers: [SublimadosService],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SublimadosComponent implements OnInit {

  fecha = new FormControl(new Date());
  fecha2 = new FormControl(new Date());
  fechaInicio = new Date();
  fechaFinal = new Date();
  documentos: SublimadoSimpleView[] = new Array();
  palabra = "";
  page = 0;

  constructor(
    private identityUserService: IdentityUserService,
    private sublimadoService: SublimadosService,
    private loadingService: LoadingService,
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
      this.sublimadoService.getSublimados(this.palabra, sFechaInicial, sFechaFinal, this.page, "").subscribe(
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
  
    openAsignarPedido(): void {
      const dialogRef = this.dialog.open(AsignarPedidoComponent, {
        disableClose: false, autoFocus: false, width: '750px',  data: {}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) { this.openAgregarSublimado(result); }
      });
    }
  
    openAgregarSublimado(pedidos: PedidoView[]): void {
      const dialogRef = this.dialog.open(AgregarSublimadoComponent, {
        disableClose: false, autoFocus: false, width: '1250px',  data: {isAgregar: true, pedidos: pedidos}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) { this.buscar(); }
      });
    }

    openEditarSublimado(pedidos: PedidoView[], ): void {
      const dialogRef = this.dialog.open(AgregarSublimadoComponent, {
        disableClose: false, autoFocus: false, width: '1250px',  data: {isAgregar: false, pedidos: pedidos, }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) { this.buscar(); }
      });
    }

     // alert("ya está en sublimado pedidos");
     buscarSublimado(sublimado: SublimadoSimpleView){
        this.loadingService.show();
        this.sublimadoService.getSublimadoPedidos(sublimado._id)
            .subscribe(
            res => {
                this.loadingService.hide();
                if (res.success) { 
                  
                   alert(" Se encontró el sublimado " + res.payload._id)
                  
                            } 
                else { this.toastr.error('No se obtuvieron pedidos del sublimado', 'Error'); }
                }, error => {
                  this.loadingService.hide();
                  this.toastr.error(error);
                }
            );
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

    confirmarTerminar(documento: SublimadoSimpleView, operacion: string) {
      // tslint:disable-next-line: one-variable-per-declaration
      var op = operacion == "3" ? "Confirmado" : "Terminado";
      const confirmacion = confirm('Seguro de cambiar el estado de sublimado: a ' + op);
      if (confirmacion) {
        var op = operacion == "3" ? "Confirmado" : "Terminado";
        documento.estado = operacion;
        this.loadingService.show();
        this.sublimadoService.confirmarTerminarSublimado(documento._id, documento).subscribe(
        registro => {
            this.loadingService.hide();
            this.toastr.success('', 'Sublimado ' + op);
            this.buscar();
            }, error => {
                this.loadingService.hide();
                this.toastr.error(error);
            }, () => {
            //    this.loadingService.hide();
             //   this.toastr.error('', 'Otro Error');
            }
          );
      }
    }

    cancelar(documento: SublimadoSimpleView, operacion: string) {
      // tslint:disable-next-line: one-variable-per-declaration
      const confirmacion = confirm('Seguro de cancelar el estado de sublimado');
      if (confirmacion) {
        
        documento.estado = operacion;
        this.loadingService.show();
        this.sublimadoService.deleteSublimado(documento._id).subscribe(
        registro => {
            this.loadingService.hide();
            this.toastr.success('', 'Sublimado cancelado : ' + registro.payload);
            this.buscar();
            }, error => {
                this.loadingService.hide();
                this.toastr.error(error);
            }, () => {
            //    this.loadingService.hide();
             //   this.toastr.error('', 'Otro Error');
            }
          );
      }
    }

    getPdf(documento: SublimadoSimpleView, tipo: string) {
      // tslint:disable-next-line: one-variable-per-declaration
      var tipop="";
      if (tipo == "1") tipop="Pantalón";
      else tipop = "Playera"; 
      const confirmacion = confirm('Seguro de crear el  pdf del sublimado del tipo : ' + tipop );
      if (confirmacion) {
        this.loadingService.show();
        this.sublimadoService.getSublimadosPdf(documento, documento._id,tipo).subscribe(
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
    
    getPlayeraPdf(documento: SublimadoSimpleView, tipo: string) {
      // tslint:disable-next-line: one-variable-per-declaration
      var tipop="";
      if (tipo == "1") tipop="Pantalón";
      else tipop = "Playera"; 
      const confirmacion = confirm('Seguro de crear el  pdf del sublimado del tipo : ' + tipop );
      if (confirmacion) {
        this.loadingService.show();
        this.sublimadoService.getSublimadosPlayeraPdf(documento, documento._id,tipo).subscribe(
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
