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
import { ProductoImagen } from 'src/app/models/producto/productosView';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { ProductosService } from '../../productos/productos.service';

@Component({
  selector: 'app-asignar-producto',
  templateUrl: './asignar-producto.component.html',
  styleUrls: ['./asignar-producto.component.css'],
  providers: [ErrorValidationService, ProductosService],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AsignarProductoComponent implements OnInit {

  documentos: ProductoSimpleView[] = new Array();
  ordenar = "nombre";
  tipos = [{ "key": "nombre", "value": "Nombre"},{ "key": "menudeo", "value": "Precio"}]
  palabra = "";
  page = 0;
  
  constructor(
    private configService: ConfigService,
    private toastr: ToastrService,
    private productoService: ProductosService,
    private identityUserService: IdentityUserService,
    private loadingService: LoadingService,
    private errorValidationService: ErrorValidationService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AsignarProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { }) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

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
}
