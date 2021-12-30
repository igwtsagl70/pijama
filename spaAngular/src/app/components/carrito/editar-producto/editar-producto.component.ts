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
import { ProductoAgregar } from 'src/app/models/producto/productoAgregar';
import { PedidoProductoEditar } from 'src/app/models/pedido/pedidoProductoEditar';
import { PedidoProductoPiezas, PedidoProductos } from 'src/app/models/pedido/pedido';
import { SessionService } from 'src/app/utils/service/session.service';
import { PedidoAgregar } from 'src/app/models/pedido/pedidoAgregar';


@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.css'],
  providers: [ErrorValidationService, ProductosService],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EditarProductoComponent implements OnInit {
  producto: PedidoProductoEditar = new PedidoProductoEditar();

  constructor(
    private configService: ConfigService,
    private toastr: ToastrService,
    private productoService: ProductosService,
    private identityUserService: IdentityUserService,
    private sessionService: SessionService,
    private loadingService: LoadingService,
    private errorValidationService: ErrorValidationService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditarProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { productoSimple: ProductoSimpleView, productoPedido: PedidoProductos}) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    console.log(this.data);
    if(this.data == null) this.onNoClick();
    if(this.data.productoSimple != null){
     this.buscar(this.data.productoSimple._id); 
    }
    if(this.data.productoPedido != null){
     this.buscar(this.data.productoPedido.producto_id); 
    }
  }

  buscar(_id: string): void {
    this.loadingService.show();
    this.productoService.getProducto(_id).subscribe(
        res => {
          this.loadingService.hide();
          if (res.success) {
            if (res.payload != null) {
              //Si viene de agregar
              if(this.data.productoSimple){
                this.setProductoAgregarToPedidoProductoEditar(res.payload);
              }
              //Si viene de pedido
              else{
                this.setProductoAgregarToPedidoProductoEditar(res.payload);
                this.setPedidoProductoToProductoEditar(this.data.productoPedido);
              }
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

  setProductoAgregarToPedidoProductoEditar(pAgregar: ProductoAgregar){
    this.producto = new PedidoProductoEditar();
    this.producto.producto_id = pAgregar._id;
    this.producto.descripcion = pAgregar.descripcion;
    this.producto.descuento = pAgregar.descuento;
    this.producto.imagenes = pAgregar.imagenes;
    this.producto.mayoreo = pAgregar.mayoreo;
    this.producto.menudeo = pAgregar.menudeo;
    this.producto.nPiezas = pAgregar.nPiezas;
    this.producto.nombre = pAgregar.nombre;
    this.producto.cantidad = 1;
    this.producto.genero = "1";
    this.producto.talla = "1";
    this.producto.tipo = "1";
  }

  setPedidoProductoToProductoEditar(pPedido: PedidoProductos){
    if(this.producto == null) this.producto = new PedidoProductoEditar();
    this.producto.producto_id = pPedido.producto_id;
    this.producto.descuento = pPedido.descuento;
    this.producto.mayoreo = pPedido.mayoreo;
    this.producto.menudeo = pPedido.menudeo;
    this.producto.cantidad = pPedido.cantidad;
    this.producto.genero = pPedido.genero;
    this.producto.talla = pPedido.talla;
    this.producto.tipo = pPedido.tipo;
  }

  getPedidoProducto():PedidoProductos{
    var nProducto = new PedidoProductos();
    nProducto.producto_id = this.producto.producto_id;
    nProducto.cantidad = this.producto.cantidad;
    nProducto.descuento = this.producto.descuento;
    nProducto.mayoreo = this.producto.mayoreo;
    nProducto.menudeo = this.producto.menudeo;
    nProducto.nPiezas = this.producto.nPiezas;
    nProducto.nombre = this.producto.nombre;
    nProducto.tipo = this.producto.tipo;
    nProducto.genero = this.producto.genero;
    nProducto.talla = this.producto.talla;
    nProducto.imagenes = this.producto.imagenes;
    nProducto.pedidoProductoPiezas = new Array();

    //Creamos piezas
    switch(this.producto.tipo){
      case "1":{
        var nP1 = new PedidoProductoPiezas(); nP1.descripcion = "Playera";
        nProducto.pedidoProductoPiezas.push(nP1);
        var nP2 = new PedidoProductoPiezas(); nP2.descripcion = "Pantalon";
        nProducto.pedidoProductoPiezas.push(nP2);
      };break;
      case "2":{
        var nP1 = new PedidoProductoPiezas(); nP1.descripcion = "Playera";
        nProducto.pedidoProductoPiezas.push(nP1);
        var nP2 = new PedidoProductoPiezas(); nP2.descripcion = "Short";
        nProducto.pedidoProductoPiezas.push(nP2);
      };break;
      case "3":{
        var nP1 = new PedidoProductoPiezas(); nP1.descripcion = "Camisón";
        nProducto.pedidoProductoPiezas.push(nP1);
      };break;
      case "4":{
        var nP1 = new PedidoProductoPiezas(); nP1.descripcion = "Playera";
        nProducto.pedidoProductoPiezas.push(nP1);
      };break;
      case "5":{
        var nP1 = new PedidoProductoPiezas(); nP1.descripcion = "Pantalon";
        nProducto.pedidoProductoPiezas.push(nP1);
      };break;
      case "6":{
        var nP1 = new PedidoProductoPiezas(); nP1.descripcion = "Short";
        nProducto.pedidoProductoPiezas.push(nP1);
      };break;
    }
    return nProducto;
  }

  getImg(){      
    return this.configService.getApiURI() + '/' + this.producto.imagenes[0].url;
  }
  
  guardar(form: any){
    if(form.valid && this.producto.producto_id != "" && this.producto.cantidad > 0){      
      //Si es editar se regresa el nuevo objeto
      if(this.data.productoPedido != null){
        this.dialogRef.close(this.getPedidoProducto());
      }else{

        //Si es usaurio se guarda en cookie
        if(!this.identityUserService.isAdmin()){
          //Se obtien pedido en cookie
          var pedido = this.sessionService.getCookiePedido();

          //Se crea nuevo pedido si no exsite
          if(pedido == null){
            pedido = new PedidoAgregar();
            pedido.user = this.identityUserService.getUserUser();
            pedido.fecha = new Date();
          }

          //Se agrega producto a predido
          if(pedido.pedidoProductos == null) pedido.pedidoProductos = new Array();
          pedido.pedidoProductos.push(this.getPedidoProducto());
          
          //Se guarda nueva cookie
          this.sessionService.crearCookiePedido(pedido);

          //Cerrar       
          this.toastr.info('Nuevo producto en el carrito', 'Producto agregado');
          this.dialogRef.close(true);
        }else{
          //Si es admin se procede normal
          this.dialogRef.close(this.getPedidoProducto());
        }
      }
    }
  }


}
