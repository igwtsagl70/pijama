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
import { AsignarProductoComponent } from '../asignar-producto/asignar-producto.component';
import { EditarProductoComponent } from '../editar-producto/editar-producto.component';
import { isThisSecond } from 'date-fns';

@Component({
  selector: 'app-agregar-pedido',
  templateUrl: './agregar-pedido.component.html',
  styleUrls: ['./agregar-pedido.component.css'],
  providers: [ErrorValidationService, ProductosService, PedidosService],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class AgregarPedidoComponent implements OnInit {
  pedido: PedidoAgregar = new PedidoAgregar();
  isAgregar = true;

  constructor(
    private configService: ConfigService,
    private toastr: ToastrService,
    private productoService: ProductosService,
    private pedidosService: PedidosService,
    private identityUserService: IdentityUserService,
    private sessionService: SessionService,
    private loadingService: LoadingService,
    private errorValidationService: ErrorValidationService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AgregarPedidoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { _id: string, isAgregar: boolean}) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    if(this.data == null) this.onNoClick();
    this.isAgregar = this.data.isAgregar;

    //Validar si viene de admin o de user
    if(this.isAgregar && !this.identityUserService.isAdmin()){
      //Si es usuario buscar pedido en cookie      
      var nPedido = this.sessionService.getCookiePedido();
      if(nPedido != null){
        this.pedido = nPedido;
        this.setTotales();
      }
    }else{
      //Si es de admin buscar pedido      
      this.getPedido(this.data._id);
    }
  }

  getImg(producto: PedidoProductos){      
    return this.configService.getApiURI() + '/' + producto.imagenes[0].url;
  }

  getPedido(id: string) {
    this.loadingService.show();
    this.pedidosService.getPedido(id)
        .subscribe(
        res => {
            this.loadingService.hide();
            if (res.success) { 
              this.pedido = res.payload; 
              this.setTotales();
            } 
            else { this.toastr.error('No se obtuvieron datos del usuario', 'Error'); }
            }, error => {
              this.loadingService.hide();
              this.toastr.error(error);
            }
        );
  }

  guardarPedido(){
    this.sessionService.crearCookiePedido(this.pedido);
  }

  //OPCIONES
  getGenero(genero :string){
    switch(genero){
      case "1": return "Infantil"; break;
      case "2": return "Dama"; break;
      case "3": return "Caballero"; break;
    }
  }

  getTalla(talla: string){
    switch(talla){
      case "1": return "2/4"; break;
      case "2": return "6/8"; break;
      case "3": return "10/12"; break;
      case "4": return "Unitalla"; break;
      case "5": return "XL"; break;
      case "6": return "28/32"; break;
      case "7": return "34/36"; break;
    }
  }

  openAgregarProducto(){ 
    const dialogRef = this.dialog.open(AsignarProductoComponent, {
      disableClose: false, autoFocus: false, width: '750px',  data: { }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { this.openEditarProducto(result, null); }
    });
  }

  openEditarProducto(productoSimple: ProductoSimpleView, productoPedido: PedidoProductos): void {
    const dialogRef = this.dialog.open(EditarProductoComponent, {
      disableClose: false, autoFocus: false, width: '750px',  data: {productoSimple: productoSimple, productoPedido: productoPedido}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { 
        console.log(result);
        //Si viene de editar se edita
        if(productoPedido != null){
          this.editarProducto(productoPedido, result);
        }

        //Si viene de agregar se agrega
        if(productoSimple !=null){
          this.agregarProducto(result);
        }
      }
    });
  }

  agregarProducto(producto: PedidoProductos){
    if(this.pedido.pedidoProductos == null) this.pedido.pedidoProductos = new Array();
    this.pedido.pedidoProductos.push(producto);
    this.setTotales();
  }

  editarProducto(inicial: PedidoProductos, result: PedidoProductos){
    Object.assign(inicial, result);
    this.setTotales();
  }

  eliminarProducto(index: number) {
    var a = this.pedido.pedidoProductos.slice(0, index);
    var b = this.pedido.pedidoProductos.slice(index + 1, this.pedido.pedidoProductos.length);
    this.pedido.pedidoProductos = a.concat(b);
    this.setTotales();
  }

  initTotales(){
    this.pedido.nModelos = 0;
    this.pedido.nPiezas = 0;
    this.pedido.cantidad = 0;
    this.pedido.subtotal = 0;
    this.pedido.descuento = 0;
    this.pedido.total = 0;
  }

  setTotales(){
    this.initTotales();
    this.pedido.pedidoProductos.forEach(p => {
      this.pedido.nModelos += 1;
      if(p.tipo == "1" || p.tipo == "2") this.pedido.nPiezas += 2;
      else this.pedido.nPiezas += 1;
      this.pedido.cantidad += p.cantidad;
      this.pedido.descuento += p.descuento;
      var precio = 0;
      if(p.cantidad > 5) precio = p.mayoreo;
      else precio = p.menudeo;
      this.pedido.subtotal += (precio * p.cantidad);
      this.pedido.total += this.pedido.subtotal - this.pedido.descuento;
    });
  }

  guardar() {
    const confirmacion = confirm('Seguro de finalizar el pedido?');
    if (confirmacion) {      
      this.loadingService.show();
      this.pedido.esMayoreo = false;
      this.pedido.fecha = new Date();
      this.pedido.fecha.setHours(this.pedido.fecha.getHours() - (this.pedido.fecha.getTimezoneOffset() / 60));
      this.pedido.user = this.identityUserService.getUserUser();
      this.pedidosService.postPedido(this.pedido)
          .subscribe(
          registro => {
              this.loadingService.hide();
              this.toastr.success('Datos correctos', 'Pedido enviado');
              this.sessionService.deleteCookiePedido();
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
    this.loadingService.show();
    this.pedidosService.putPedido(this.pedido)
        .subscribe(
        registro => {
            this.loadingService.hide();
            this.toastr.success('Registro!', 'Datos correctos!');
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
