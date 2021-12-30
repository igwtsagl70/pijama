import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from '../usuario.service';
import { ToastrService } from 'ngx-toastr';
import { IdentityUserService } from 'src/app/utils/IdentityUser/identity-user.service';
import { LoadingService } from '../../loading/loading.service';
import { UsuarioView } from 'src/app/models/usuario/usuarioView';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { ConfigService } from 'src/app/utils/service/config.service';
import { AgregarUsuarioComponent } from '../agregar-usuario/agregar-usuario.component';
import { MatDialog } from '@angular/material';
import { UsuarioCambioEstado } from 'src/app/models/usuario/usuarioCambioEstado';
import { EnviarMensajeComponent } from '../enviar-mensaje/enviar-mensaje.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  providers: [UsuarioService]
})
export class UsuariosComponent implements OnInit {
  displayedColumns: string[] = ['imagen', 'user', 'nombre', 'casa', 'telefono', 'tipo', 'estado', 'accion'];
  usuarios: UsuarioView[] = new Array();
  dataSource = new MatTableDataSource(this.usuarios);
  faltantes = false;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private identityUserService: IdentityUserService,
    private usuarioService: UsuarioService,
    private loadingService: LoadingService,
    private toastr: ToastrService,
    private configService: ConfigService,
    public dialog: MatDialog,
) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.isMobile();
    this.startGetDatos();
  }

  isMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        this.identityUserService.openSidebar = false;
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  startGetDatos() {
      if (!this.identityUserService.getUserId()) {
          setTimeout(() => {
              this.startGetDatos();
          }, 1000);
      } else { this.buscar(); }
  }

  buscar(): void {
    this.loadingService.show();
    const sFaltantes = this.faltantes ? '1' : '0';
    this.usuarioService.getUsuarios(sFaltantes).subscribe(
        res => {
          this.loadingService.hide();
          if (res.success) {
            if (res.payload != null && res.payload.length > 0) {
              this.usuarios = res.payload;
              this.dataSource = new MatTableDataSource(res.payload);
              this.dataSource.sort = this.sort;
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

  setUrlImagen(usuario: UsuarioView): string {
    return this.configService.getApiURI() + '/' + usuario.imagen;
  }

  openAgregar(): void {
    const dialogRef = this.dialog.open(AgregarUsuarioComponent, {
      disableClose: false, autoFocus: false, width: '750px',  data: {isAgregar : true, usuario: null}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { this.buscar(); }
    });
  }

  openEditar(usuario: UsuarioView): void {
    const dialogRef = this.dialog.open(AgregarUsuarioComponent, {
      // tslint:disable-next-line: object-literal-shorthand
      disableClose: false, autoFocus: false, width: '750px',  data: {isAgregar : false, usuario: usuario}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { this.buscar(); }
    });
  }

  openEnviarMensaje(usuario: UsuarioView): void {
    const dialogRef = this.dialog.open(EnviarMensajeComponent, {
      // tslint:disable-next-line: object-literal-shorthand
      disableClose: false, autoFocus: false, width: '750px',  data: {usuario: usuario.user}
    });
  }

  cambiarEstado(usuario: UsuarioView, estado: number) {
    // tslint:disable-next-line: one-variable-per-declaration
    const nEstado = new UsuarioCambioEstado();
    nEstado._id = usuario._id;
    nEstado.estado = estado.toString();

    this.loadingService.show();
    this.usuarioService.cambioEstadoUsuario(nEstado).subscribe(
    registro => {
        this.loadingService.hide();
        usuario.estado = estado.toString();
        }, error => {
            this.loadingService.hide();
            this.toastr.error(error);
        }, () => {
            this.loadingService.hide();
        }
    );
  }

  eliminar(usuario: UsuarioView) {
    // tslint:disable-next-line: one-variable-per-declaration
    const confirmacion = confirm('Seguro de eliminar el usuario');
    if (confirmacion) {
      this.loadingService.show();
      this.usuarioService.deleteUsuario(usuario._id).subscribe(
      registro => {
          this.loadingService.hide();
          this.toastr.success('', 'Usuario eliminado');
          this.buscar();
          }, error => {
              this.loadingService.hide();
              this.toastr.error(error);
          }, () => {
              this.loadingService.hide();
          }
        );
    }
  }

  enviarInvitacion(usuario: UsuarioView) {
    this.loadingService.show();
    this.usuarioService.enviarInvitacionUsuario(usuario).subscribe(
    registro => {
        this.loadingService.hide();
        this.toastr.success('', 'Invitación enviada');
        }, error => {
            this.loadingService.hide();
            this.toastr.error(error);
        }, () => {
            this.loadingService.hide();
        }
    );
  }

}
