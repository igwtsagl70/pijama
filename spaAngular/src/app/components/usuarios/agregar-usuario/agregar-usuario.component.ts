import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UsuarioAgregar } from 'src/app/models/usuario/usuarioAgregar';
import { slideInDownAnimation } from 'src/app/utils/constants/animations';
import { UsuarioService } from '../usuario.service';
import { ErrorValidationService } from 'src/app/utils/service/error-validation.service';
import { ConfigService } from 'src/app/utils/service/config.service';
import { ToastrService } from 'ngx-toastr';
import { IdentityUserService } from 'src/app/utils/IdentityUser/identity-user.service';
import { LoadingService } from '../../loading/loading.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UsuarioView } from 'src/app/models/usuario/usuarioView';

@Component({
  selector: 'app-agregar-usuario',
  templateUrl: './agregar-usuario.component.html',
  styleUrls: ['./agregar-usuario.component.css'],
  providers: [UsuarioService, ErrorValidationService, ConfigService ],
  animations: [slideInDownAnimation ]
})

export class AgregarUsuarioComponent implements OnInit {
  fecha = new FormControl(new Date());
  isAgregar = true;
  selectedValue: string;
  tiposUsuarios: string[] = ['admin', 'user'];
  usuario = new UsuarioAgregar();

  constructor(
    private config: ConfigService,
    private toastr: ToastrService,
    private usuarioService: UsuarioService,
    private identityUserService: IdentityUserService,
    private loadingService: LoadingService,
    private errorValidationService: ErrorValidationService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AgregarUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {isAgregar: boolean, usuario: UsuarioView}) { }

  ngOnInit() {
    if (this.data == null) { this.onNoClick(); } else {
      this.isAgregar = this.data.isAgregar;
      if (!this.isAgregar) { this.getUsuario(this.data.usuario._id); } else {
        this.usuario.tipo = 'user';
        this.usuario.fechaIngreso = new Date();
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  setUrlImagen(): string {
    return this.config.getApiURI() + '/' + this.usuario.imagen;
  }

  getUsuario(id: string) {
    this.loadingService.show();
    this.usuarioService.getUsuario(id)
        .subscribe(
        res => {
            this.loadingService.hide();
            // tslint:disable-next-line: max-line-length
            if (res.success) { this.usuario = res.payload; } else { this.toastr.error('No se obtuvieron datos del usuario', 'Error'); }
            }, error => {
              this.loadingService.hide();
              this.toastr.error(error);
            }
        );
  }

  guardar(form: any) {
    this.usuario.fechaIngreso = this.fecha.value;
    this.loadingService.show();
    if (form.valid) {
        this.usuarioService.postUsuario(this.usuario)
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
        this.usuarioService.putUsuario(this.usuario)
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
