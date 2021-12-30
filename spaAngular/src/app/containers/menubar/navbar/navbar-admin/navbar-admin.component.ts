import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SessionService } from '../../../../utils/service/session.service';
import { NavBarUsuarioService } from '../../../../utils/service/nav-bar-usuario.service';
import { IdentityUserService } from '../../../../utils/IdentityUser/identity-user.service';
import { IdentityUser } from '../../../../utils/IdentityUser/IdentityUser';
import { DatosUsuario } from '../../../../models/usuario/datosUsuario';

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.css']
})
export class NavbarAdminComponent implements OnInit {
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
//       this.identityUser.getApiDataUser(this.identityUser.getUserUser()).subscribe(
//           user => {
//               if (user.success) {
//                   this.identityUser.createDatosUser(user.payload);
//                   this.dUser = user.payload;
//               } else  {alert('Error al cargar los datos de usuario');
//  }          }
//           , error => {
//               alert('Error al cargar los datos de usuario');
//           }
//       );
  }

//   openPerfil(): void {
//       const dialogRef = this.dialog.open(PerfilUsuarioComponent, {
//           disableClose: false, width: '750px', autoFocus: false
//       });
//   }

}
