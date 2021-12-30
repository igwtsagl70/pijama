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
        disableClose: false, autoFocus: false, width: '1250px',  data: {pedidos: pedidos}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) { this.buscar(); }
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


}
