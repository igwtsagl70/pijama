import { Component, HostBinding, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { slideInDownAnimation } from '../../../utils/constants/animations';
import { ErrorValidationService } from '../../../utils/service/error-validation.service';
import { IdentityUserService } from '../../../utils/IdentityUser/identity-user.service';
import { LoadingService } from '../../loading/loading.service';
import { ProductosService } from '../productos.service';
import { ConfigService } from 'src/app/utils/service/config.service';
import { ProductoSimpleView } from 'src/app/models/producto/productoSimpleView';
import { ProductoImagen } from 'src/app/models/producto/productosView';
import { ProductoEliminarImagen } from 'src/app/models/producto/productoEliminarImagen';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { InfoArchivoComponent } from '../info-archivo/info-archivo.component';


@Component({
  selector: 'app-producto-imagenes',
  templateUrl: './producto-imagenes.component.html',
  styleUrls: ['./producto-imagenes.component.css'],
  providers: [ErrorValidationService, ProductosService],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class ProductoImagenesComponent implements OnInit {
  imagenes: ProductoImagen[] = new Array(); 
  
  constructor(
    private configService: ConfigService,
    private toastr: ToastrService,
    private productosService: ProductosService,
    private identityUserService: IdentityUserService,
    private loadingService: LoadingService,
    private errorValidationService: ErrorValidationService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ProductoImagenesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { producto: ProductoSimpleView}) { }

  ngOnInit() {
    if (this.data == null) { this.onNoClick(); } else {
      this.imagenes = this.data.producto.imagenes;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  eliminar(documento: ProductoImagen) {
    // tslint:disable-next-line: one-variable-per-declaration
    const confirmacion = confirm('Seguro de eliminar la imágen?');
    if (confirmacion) {
      this.loadingService.show();
      const aEliminar = new ProductoEliminarImagen();
      aEliminar._id = this.data.producto._id;
      aEliminar.archivoId = documento._id;
      this.productosService.postProductoDeleteFile(aEliminar).subscribe(
      registro => {
          this.loadingService.hide();
          this.toastr.success('', 'Imágen eliminado');
          this.eliminarArchivoArreglo(documento._id);
          }, error => {
              this.loadingService.hide();
              this.toastr.error(error);
          }, () => {
              this.loadingService.hide();
          }
        );
    }
  }

  eliminarArchivoArreglo(id: string) {
    // tslint:disable-next-line: no-shadowed-variable
    const index = this.imagenes.findIndex(a => {
      return a._id === id;
    });
    const a = this.imagenes.slice(0, index);
    const b = this.imagenes.slice(index + 1, this.imagenes.length);
    this.imagenes = a.concat(b);
  }

  getArchivoUrl(archivo: ProductoImagen): string {
    return this.configService.getApiURI() + '/' + archivo.url;
  }

  openVer(archivo: ProductoImagen): void {
    const dialogRef = this.dialog.open(InfoArchivoComponent, {
      disableClose: false, autoFocus: false, width: '950px', data: archivo
    });
  }
}
