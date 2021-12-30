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

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent  implements OnInit {
  private subscription: Subscription;
  submitted = false;
  tokenRes: TokenResponse;
  hide = true;
  urlCallback: string;
  correo = '';

  constructor(
      private authService: AuthService,
      private sessionService: SessionService,
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private toastr: ToastrService
  ) {

  }

  ngOnInit(): void {

  }

  onSubmit(form: any) {
      this.submitted = true;
      if (form.valid) {
          this.authService.reset(this.correo)
              .subscribe(
              res => {
                this.toastr.success('Verifica tu correo electrónico.', 'Contraseña restablecida');
                this.router.navigate(['/auth/login'], { queryParams: { user: this.correo } });
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


}
