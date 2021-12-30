import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthService } from './auth.service';
import { RegistroComponent } from './registro/registro.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AuthRoutingModule,
        MatInputModule,
        MatButtonModule,
        MatTooltipModule
    ],
    declarations: [
        LoginComponent,
        ResetPasswordComponent,
        RegistroComponent
    ],
    providers: [
        AuthService
    ]
})

export class AuthModule {
}
