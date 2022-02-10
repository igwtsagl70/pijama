import { Component, HostBinding, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, throwToolbarMixedModesError } from '@angular/material';
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
import { ProductoAgregar } from 'src/app/models/producto/productoAgregar';
import { PedidoProductoEditar } from 'src/app/models/pedido/pedidoProductoEditar';
import { Pedido, PedidoProductoPiezas, PedidoProductos } from 'src/app/models/pedido/pedido';
import { PedidosService } from '../../pedido/pedido.service';
import { PedidoAgregar } from 'src/app/models/pedido/pedidoAgregar';
import { SessionService } from 'src/app/utils/service/session.service';
import { isThisSecond } from 'date-fns';
import { SublimadosService } from '../sublimados.service';
import { PedidoSimpleView, PedidoView } from 'src/app/models/pedido/pedidoSimpleView';
import { SublimadoAgregar } from 'src/app/models/sublimado/sublimadoAgregar';
import { PedidosSublimado, SublimadoModelo } from 'src/app/models/sublimado/sublimado';
import { SublimadoSimpleView } from 'src/app/models/sublimado/sublimadoSimpleView';

@Component({
  selector: 'app-agregar-sublimado',
  templateUrl: './agregar-sublimado.component.html',
  styleUrls: ['./agregar-sublimado.component.css'],
  providers: [ErrorValidationService, SublimadosService],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class AgregarSublimadoComponent implements OnInit {
  sublimado: SublimadoAgregar = new SublimadoAgregar();
  isAgregar = true;
  _id = "";
sublimadoEditar: SublimadoSimpleView = new SublimadoSimpleView();

  constructor(
    private configService: ConfigService,
    private toastr: ToastrService,
    private productoService: ProductosService,
    private sublimadosService: SublimadosService,
    private identityUserService: IdentityUserService,
    private sessionService: SessionService,
    private loadingService: LoadingService,
    private errorValidationService: ErrorValidationService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AgregarSublimadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { pedidos: PedidoView[], isAgregar: boolean , _id: string, sublimado: SublimadoSimpleView}) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    if(this.data == null) this.onNoClick();
    
    this.isAgregar = this.data.isAgregar != null && !this.data.isAgregar ? false : true;
    this._id = this.data._id != null && this.data._id != undefined ? this.data._id : ""; 
    this.sublimadoEditar = this.data.sublimado != null ? this.data.sublimado : new SublimadoSimpleView();
    console.log("111");
    this.crearSublimadoModelo();
    this.setTotales();
  }

  crearSublimadoModelo(){
    if(this.data.pedidos != null && this.data.pedidos.length > 0){
      this.sublimado.sublimadoModelo = new Array();
      this.sublimado.pedidos = new Array();
      this.data.pedidos.forEach(p => {
        //Crear modelo sublimado productos
        if(p.pedidoProductos != null){
          p.pedidoProductos.forEach(producto => {
            var nRow = this.getRowSublimadoModelo(producto);
            var fModelo = this.sublimado.sublimadoModelo.find(m => m.producto_id == nRow.producto_id);
            if(fModelo == null) this.sublimado.sublimadoModelo.push(nRow);
            else{    
              fModelo.pantalonHG += nRow.pantalonHG;
              fModelo.pantalonHM += nRow.pantalonHM;
              fModelo.pantalonMXL += nRow.pantalonMXL;
              fModelo.pantalonMU += nRow.pantalonMU;
              fModelo.pantalonN += nRow.pantalonN;
              fModelo.shortH += nRow.shortH;
              fModelo.shortM += nRow.shortM;
              fModelo.shortN += nRow.shortN;
              fModelo.camison += nRow.camison;
              fModelo.playeraHG += nRow.playeraHG;
              fModelo.playeraHM += nRow.playeraHM;
              fModelo.playeraMXL += nRow.playeraMXL;
              fModelo.playeraMU += nRow.playeraMU;
              fModelo.playeraN4 += nRow.playeraN4;
              fModelo.playeraN8 += nRow.playeraN8;
              fModelo.playeraN12 += nRow.playeraN12;
            }
          })
        }

        //Crear pedidos folios
        this.sublimado.pedidos.push(this.getRowSublimadoPedido(p));
        
      });
    }
  }

  getRowSublimadoPedido(pedido: PedidoView): PedidosSublimado{    
    var nRow = new PedidosSublimado();
    nRow._id = pedido._id;
    nRow.folio = pedido.folio;
    return nRow;
  }

  getRowSublimadoModelo(producto: PedidoProductos): SublimadoModelo{
    var nRow = new SublimadoModelo();
    nRow.producto_id = producto.producto_id;
    nRow.modelo = producto.nombre;

    //Recorrer piezas
    if(producto.pedidoProductoPiezas != null){
      producto.pedidoProductoPiezas.forEach(p => {
        switch(p.descripcion){
          case "Camisón":{
            nRow.camison += producto.cantidad;
          };break;
          case "Playera":{
            if(producto.genero == "1"){
              if(producto.talla == "1") nRow.playeraN4 += producto.cantidad;
              if(producto.talla == "2") nRow.playeraN8 += producto.cantidad;
              if(producto.talla == "3") nRow.playeraN12 += producto.cantidad;
            }
            if(producto.genero == "2"){
              if(producto.talla == "4") nRow.playeraMU += producto.cantidad;
              if(producto.talla == "5") nRow.playeraMXL += producto.cantidad;
            }
            if(producto.genero == "3"){
              if(producto.talla == "6") nRow.playeraHM += producto.cantidad;
              if(producto.talla == "7") nRow.playeraHG += producto.cantidad;
            }
          };break;
          case "Pantalon":{
            if(producto.genero == "1"){
              nRow.pantalonN += producto.cantidad;
            }
            if(producto.genero == "2"){
              if(producto.talla == "4") nRow.pantalonMU += producto.cantidad;
              if(producto.talla == "5") nRow.pantalonMXL += producto.cantidad;
            }
            if(producto.genero == "3"){
              if(producto.talla == "6") nRow.pantalonHM += producto.cantidad;
              if(producto.talla == "7") nRow.pantalonHG += producto.cantidad;
            }
          };break;
          case "Short":{
            if(producto.genero == "1"){
              if(producto.talla == "3") nRow.shortM += producto.cantidad;
              else nRow.shortN += producto.cantidad;
            }
            if(producto.genero == "2"){
              nRow.shortM += producto.cantidad;
            }
            if(producto.genero == "3"){
              nRow.shortH += producto.cantidad;
            }
          };break;
        }
      });
    }

    return nRow;
  }

  initTotales(){
    this.sublimado.nModelos = 0;
    this.sublimado.nPiezas = 0;
  }

  setTotales(){
    this.initTotales();
    this.sublimado.sublimadoModelo.forEach(p => {
      this.sublimado.nModelos += 1;
      this.sublimado.nPiezas += 
        (p.pantalonHG + p.pantalonHM + 
          p.pantalonMU + p.pantalonMXL +
          p.pantalonN + 
          p.playeraHG + p.playeraHM + 
          p.playeraMU + p.playeraMXL + 
          p.playeraN12 + p.playeraN8 + p.playeraN4 +
          p.shortH + p.shortM + p.shortN + 
          p.camison);
    });
  }

  guardar() {
    const confirmacion = confirm('Seguro de finalizar el sublimado?');
    if (confirmacion) {      
      this.loadingService.show();
      this.sublimado.fecha = new Date();
      this.sublimado.fecha.setHours(this.sublimado.fecha.getHours() - (this.sublimado.fecha.getTimezoneOffset() / 60));
      this.sublimadosService.postSublimado(this.sublimado)
          .subscribe(
          registro => {
              this.loadingService.hide();
              this.toastr.success('Datos correctos', 'Pedido enviado');
              this.dialogRef.close(true);
              }, error => {
                  this.loadingService.hide();
                  this.toastr.error(error);
              }, () => {
                  this.loadingService.hide();
              }
          ); 
    }
  }

  editar() {
    const confirmacion = confirm('Seguro de finalizar editado del sublimado?');
    if (confirmacion) {      
      this.loadingService.show();
      this.sublimado._id = this._id;
      this.sublimado.fecha = this.sublimado.fecha;
      this.sublimado.fecha.setHours(this.sublimado.fecha.getHours() - (this.sublimado.fecha.getTimezoneOffset() / 60));
      this.sublimadosService.putSublimado(this.sublimado)
          .subscribe(
          registro => {
              this.loadingService.hide();
              this.toastr.success('Datos correctos', 'Sublimado corregido');
              this.dialogRef.close(true);
              }, error => {
                  this.loadingService.hide();
                  this.toastr.error(error);
              }, () => {
                  this.loadingService.hide();
              }
          ); 
    }
  }
}
