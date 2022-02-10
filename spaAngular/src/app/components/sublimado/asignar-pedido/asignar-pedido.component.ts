import { Component, HostBinding, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { slideInDownAnimation } from '../../../utils/constants/animations';
import { ErrorValidationService } from '../../../utils/service/error-validation.service';
import { IdentityUserService } from '../../../utils/IdentityUser/identity-user.service';
import { LoadingService } from '../../loading/loading.service';
import { ConfigService } from 'src/app/utils/service/config.service';
import { ProductoSimpleView } from 'src/app/models/producto/productoSimpleView';
import { ProductoImagen, ProductoView } from 'src/app/models/producto/productosView';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { ProductosService } from '../../productos/productos.service';
import { PedidosService } from '../../pedido/pedido.service';
import { PedidoSimpleView, PedidoView } from 'src/app/models/pedido/pedidoSimpleView';
import { SublimadosService } from '../sublimados.service';
import { Pedido } from 'src/app/models/pedido/pedido';
import { PedidoAgregar } from 'src/app/models/pedido/pedidoAgregar';
import { SublimadoSimpleView } from 'src/app/models/sublimado/sublimadoSimpleView';

@Component({
  selector: 'app-asignar-pedido',
  templateUrl: './asignar-pedido.component.html',
  styleUrls: ['./asignar-pedido.component.css'],
  providers: [ErrorValidationService, PedidosService],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AsignarPedidoComponent implements OnInit {
  fecha = new FormControl(new Date());
  fecha2 = new FormControl(new Date());
  shoes = new FormControl();
  fechaInicio = new Date();
  fechaFinal = new Date();
  documentos: PedidoView[] = new Array();
  seleccionados: PedidoView[] = new Array();
  ordenar = "nombre";
  palabra = "";
  page = 0;
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  isAgregar = true;
  _id = "";
 

  constructor(
    private configService: ConfigService,
    private toastr: ToastrService,
    private sublimadosService: SublimadosService,
    private pedidoService: PedidosService,
    private identityUserService: IdentityUserService,
    private loadingService: LoadingService,
    private errorValidationService: ErrorValidationService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AsignarPedidoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {isAgregar: boolean, _id: string}) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.fechaInicio.setDate(1);
    if (this.data != null) {
   this.isAgregar = this.data.isAgregar;
   this._id = this.data._id
    
    }
    this.startGetDatos();
  }

  startGetDatos() {
      if (!this.identityUserService.getUserId()) {
          setTimeout(() => {
              this.startGetDatos();
          }, 1000);
      } else { 
        
        this.buscar();
        
         }
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
    this.pedidoService.getPedidosParaSublimar(this.palabra,sFechaInicial, sFechaFinal, this.page, "").subscribe(
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

  siguientePagina(){
    this.page += 1;
    this.buscar;
  }

  anteriorPagina(){
    this.page -= 1;
    if(this.page < 0) this.page = 0;
    this.buscar();
  }

  seleccionar(producto: ProductoSimpleView){    
    this.dialogRef.close(producto);
  }

  guardar(){
    if(this.seleccionados == null || this.seleccionados.length == 0) this.onNoClick();
    else this.dialogRef.close(this.seleccionados);
  }
}
