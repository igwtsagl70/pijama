import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { LoginForm } from '../../../models/auth/loginForm';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../loading/loading.service';
import { SessionService } from '../../../utils/service/session.service';
import { TokenResponse } from '../../../models/auth/TokenResponse';
import { UsuarioAgregar, UsuarioRegistro } from 'src/app/models/usuario/usuarioAgregar';
import { RegistroForm } from 'src/app/models/auth/registroForm';
import { ConstantsRoutes } from 'src/app/utils/constants/ConstantsRoutes';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  submitted = false;
  loginFormModel: RegistroForm = { email: '', password: '', passwordConfirm: '' };
  tokenRes: TokenResponse;
  hide = true;
  urlCallback: string;

  constructor(
      private authService: AuthService,
      private sessionService: SessionService,
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private toastr: ToastrService
  ) {

  }

  onSubmit(form: any) {
      this.submitted = true;

      if(this.loginFormModel.password != this.loginFormModel.passwordConfirm){          
        this.toastr.error('Contraseñas no coinciden', 'Error');
        return true;
      }

      if (form.valid) {
          this.authService.registro(this.loginFormModel)
              .subscribe(
                  user => {
                    this.toastr.success('Registro completado', 'Correcto');
                    this.router.navigate([ConstantsRoutes.ANGULAR_LOGIN]);
                  }
              , error => {
                  this.toastr.error(error, 'Error');
                  this.submitted = false;
                  }, () => {
                      this.submitted = false;
                  }
              );
      } else {
          this.toastr.error('Campos incorrectos o vacios', 'Error');
          this.submitted = false;
      }
  }

  ngOnInit(): void {
      this.activatedRoute.queryParams.subscribe(params => {
          this.loginFormModel.email = params.user;
          this.urlCallback = params.callBack;
      });

      this.sessionService.validateSession(this.urlCallback);
  }

  ngOnDestroy(): void {
      
  }
}
