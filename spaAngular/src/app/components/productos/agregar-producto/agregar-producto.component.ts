import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { ProductoAgregar } from 'src/app/models/producto/productoAgregar';
import { ProductoSimpleView } from 'src/app/models/producto/productoSimpleView';
import { slideInDownAnimation } from 'src/app/utils/constants/animations';
import { IdentityUserService } from 'src/app/utils/IdentityUser/identity-user.service';
import { ConfigService } from 'src/app/utils/service/config.service';
import { ErrorValidationService } from 'src/app/utils/service/error-validation.service';
import { LoadingService } from '../../loading/loading.service';
import { ProductosService } from '../productos.service';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.component.html',
  styleUrls: ['./agregar-producto.component.css'],
  providers: [ProductosService, ErrorValidationService, ConfigService ],
  animations: [slideInDownAnimation ]
})
export class AgregarProductoComponent implements OnInit {
  isAgregar = true;
  selectedValue: string;
  producto = new ProductoAgregar();

  constructor(
    private config: ConfigService,
    private toastr: ToastrService,
    private productosService: ProductosService,
    private identityUserService: IdentityUserService,
    private loadingService: LoadingService,
    private errorValidationService: ErrorValidationService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AgregarProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {isAgregar: boolean, producto: ProductoSimpleView}) { }

  ngOnInit() {
    if (this.data == null) { this.onNoClick(); } else {
      this.isAgregar = this.data.isAgregar;
      if (!this.isAgregar) { this.getProducto(this.data.producto._id); } else {
        this.producto.nPiezas = 2;
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getProducto(id: string) {
    this.loadingService.show();
    this.productosService.getProducto(id)
        .subscribe(
        res => {
            this.loadingService.hide();
            if (res.success) { this.producto = res.payload; } else { this.toastr.error('No se obtuvieron datos del usuario', 'Error'); }
            }, error => {
              this.loadingService.hide();
              this.toastr.error(error);
            }
        );
  }

  guardar(form: any) {
    this.loadingService.show();
    if (form.valid) {
        this.productosService.postProducto(this.producto)
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
    } else {
        this.toastr.error('Campos incorrectos o vacios', 'Error');
    }
  }

  editar(form: any) {
    this.loadingService.show();
    if (form.valid) {
    
        this.productosService.putProducto(this.producto)
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
    } else {
        this.toastr.error('Campos incorrectos o vacios', 'Error');
    }
  }

}
