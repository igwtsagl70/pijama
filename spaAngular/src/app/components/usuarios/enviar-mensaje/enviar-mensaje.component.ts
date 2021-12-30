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
import { UsuarioMensaje } from 'src/app/models/usuario/usuarioMensaje';

@Component({
  selector: 'app-enviar-mensaje',
  templateUrl: './enviar-mensaje.component.html',
  styleUrls: ['./enviar-mensaje.component.css'],
  providers: [UsuarioService, ErrorValidationService, ConfigService ],
  animations: [slideInDownAnimation ]
})
export class EnviarMensajeComponent implements OnInit {
  mensaje = new UsuarioMensaje();
  sMensaje = '';
  IsCorreo = false;
  usuario = '';

  constructor(
    private config: ConfigService,
    private toastr: ToastrService,
    private usuarioService: UsuarioService,
    private identityUserService: IdentityUserService,
    private loadingService: LoadingService,
    private errorValidationService: ErrorValidationService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EnviarMensajeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { usuario: string}) { }

  ngOnInit() {
    if (this.data == null) { this.onNoClick(); } else {
      this.usuario = this.data.usuario;
      this.mensaje.user = this.data.usuario;
      this.mensaje.admin = this.identityUserService.getUserUser();
      this.mensaje.correo = false;
      this.mensaje.mensaje = '';
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  guardar(form: any) {
    this.mensaje.mensaje = this.sMensaje;
    this.mensaje.correo = this.IsCorreo;
    this.loadingService.show();
    if (form.valid) {
        this.usuarioService.mensajeUsuario(this.mensaje)
            .subscribe(
            registro => {
                this.loadingService.hide();
                this.toastr.success('Mensaje enviado', 'Datos correctos!');
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
