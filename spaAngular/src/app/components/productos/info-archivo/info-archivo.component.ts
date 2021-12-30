import { Component, HostBinding, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { slideInDownAnimation } from '../../../utils/constants/animations';
import { ConstantsRoutes } from '../../../utils/constants/ConstantsRoutes';
import { ErrorValidationService } from '../../../utils/service/error-validation.service';
import { IdentityUserService } from '../../../utils/IdentityUser/identity-user.service';
import { LoadingService } from '../../loading/loading.service';
import { ImportDataLog } from '../../../models/file/ImportDataLog';
import { ConfigService } from 'src/app/utils/service/config.service';
import { ProductoImagen } from 'src/app/models/producto/productosView';

@Component({
  selector: 'app-info-archivo',
  templateUrl: './info-archivo.component.html',
  styleUrls: ['./info-archivo.component.css'],
  providers: [ErrorValidationService],
  animations: [slideInDownAnimation]
})
export class InfoArchivoComponent implements OnInit {
  archivo: ProductoImagen;
  url: string;

  constructor(
    private loadingService: LoadingService,
    public errorValidationService: ErrorValidationService,
    private configService: ConfigService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<InfoArchivoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductoImagen
  ) {

  }

  ngOnInit(): void {
    this.archivo = this.data;
    this.url = this.configService.getApiURI() + '/' + this.archivo.url;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
