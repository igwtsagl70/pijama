import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SessionService } from '../../../../utils/service/session.service';
import { NavBarUsuarioService } from '../../../../utils/service/nav-bar-usuario.service';
import { IdentityUserService } from '../../../../utils/IdentityUser/identity-user.service';
import { IdentityUser } from '../../../../utils/IdentityUser/IdentityUser';
import { DatosUsuario } from '../../../../models/usuario/datosUsuario';
import { AgregarPedidoComponent } from 'src/app/components/carrito/agregar-pedido/agregar-pedido.component';

@Component({
  selector: 'app-navbar-panel',
  templateUrl: './navbar-panel.component.html',
  styleUrls: ['./navbar-panel.component.css']
})
export class NavbarPanelComponent implements OnInit {
    iUser: IdentityUser;
    dUser: DatosUsuario = new DatosUsuario('', '', '');

    /** navbar.admin ctor */
    constructor(
        private sessionService: SessionService,
        private identityUser: IdentityUserService,
        private navBarUsuarioService: NavBarUsuarioService,
        public dialog: MatDialog,
    ) {

    }

    logout() {
        this.sessionService.logout();
    }

    ngOnInit(): void {
        this.iUser = this.identityUser.getIdentityUser();
        if (this.identityUser.getDatosUser() == null || this.identityUser.getDatosUser().nombre === 'NA')  {
            this.setDataUser();
          } else {
              this.dUser = this.identityUser.getDatosUser();
          }
      }

    setDataUser() {
        // this.identityUser.getApiDataUser(this.identityUser.getUserUser()).subscribe(
        //     user => {
        //         if (user.success) {
        //             this.identityUser.createDatosUser(user.payload);
        //             this.dUser = user.payload;
        //         } 
        //         else  {alert('Error al cargar los datos de usuario');}
        //     }, error => {
        //         alert('Error al cargar los datos de usuario');
        //     }
        // );
    }

    openCarrito(){
        const dialogRef = this.dialog.open(AgregarPedidoComponent, {
            disableClose: false, autoFocus: false, width: '1050px',  data: {isAgregar : true, _id: null}
        });
    }

    // openPerfil(): void {
    //     const dialogRef = this.dialog.open(PerfilUsuarioComponent, {
    //         disableClose: false, width: '750px', autoFocus: false, data: {}
    //     });
    // }

  }
