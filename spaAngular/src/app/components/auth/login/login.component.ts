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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  implements OnInit, OnDestroy {
  private subscription: Subscription;
  submitted = false;
  loginFormModel: LoginForm = { email: '', password: '' };
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
      if (form.valid) {
          console.log("urlCallBack " + this.urlCallback);
          this.authService.login(form.value.email, form.value.password)
              .subscribe(
                  user => {
                      this.tokenRes = user.payload;
                      if (user.success) { this.sessionService.setSession(this.tokenRes.token, this.urlCallback); }

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
