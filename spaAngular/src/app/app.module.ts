import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AppSharedModule } from './app-shared.module';
import { SingleLayoutComponent } from './containers/single-layout/single-layout.component';
import { AdminLayoutComponent } from './containers/admin-layout/admin-layout.component';
import { PanelLayoutComponent } from './containers/panel-layout/panel-layout.component';
import { NavbarAdminComponent } from './containers/menubar/navbar/navbar-admin/navbar-admin.component';
import { NavbarPanelComponent } from './containers/menubar/navbar/navbar-panel/navbar-panel.component';
import { SidebarAdminComponent } from './containers/menubar/sidebar/sidebar-admin/sidebar-admin.component';
import { SidebarPanelComponent } from './containers/menubar/sidebar/sidebar-panel/sidebar-panel.component';
import { LoadingService } from './components/loading/loading.service';
import { ConfigService } from './utils/service/config.service';
import { HandleErrorService } from './utils/service/handle-error.service';
import { SessionService } from './utils/service/session.service';
import { IdentityUserService } from './utils/IdentityUser/identity-user.service';
import { AuthGuard } from './utils/service/auth-guard.service';
import { ApiClientService } from './utils/service/api-client.service';
import { NavBarUsuarioService } from './utils/service/nav-bar-usuario.service';
import { ErrorValidationService } from './utils/service/error-validation.service';
import { EnviarMensajeComponent } from './components/usuarios/enviar-mensaje/enviar-mensaje.component';

@NgModule({
  declarations: [
    AppComponent,
    SingleLayoutComponent,
    AdminLayoutComponent,
    PanelLayoutComponent,
    NavbarAdminComponent,
    NavbarPanelComponent,
    SidebarAdminComponent,
    SidebarPanelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppSharedModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(
        {
            preventDuplicates: false,
            newestOnTop: true,
            progressBar: false,
            easing: 'ease-in',
            progressAnimation: 'decreasing',
            tapToDismiss: false,
            closeButton: true,
            disableTimeOut: false,
            timeOut: 4000,
        }
    ),
  ],
  providers: [
      ConfigService,
      LoadingService,
      HandleErrorService,
      SessionService,
      IdentityUserService,
      ToastrService,
      AuthGuard,
      ApiClientService,
      NavBarUsuarioService,
      ErrorValidationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
