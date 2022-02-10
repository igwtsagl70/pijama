import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Usuarios } from '../../models/Usuario/usuarios';
import { ConstantsRoutes } from 'src/app/utils/constants/ConstantsRoutes';
import { ApiClientService } from 'src/app/utils/service/api-client.service';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/shared/ApiResponse';
import { UsuarioView } from 'src/app/models/usuario/usuarioView';
import { UsuarioAgregar } from 'src/app/models/usuario/usuarioAgregar';
import { UsuarioCambioEstado } from 'src/app/models/usuario/usuarioCambioEstado';
import { UsuarioMensaje } from 'src/app/models/usuario/usuarioMensaje';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private apiClient: ApiClientService) {
  }

  getUsuarios(palabra: string, page: number, orden: string): Observable<ApiResponse<UsuarioView[]>> {
    let params = new HttpParams();
    params = params.set('palabra', palabra);

    params = params.set('page', page.toString());
    params = params.set('orden', orden);
    return this.apiClient.apiGetParam<UsuarioView[]>(ConstantsRoutes.USUARIOS, params);
  }
  deleteUsuario(id: string): Observable<ApiResponse<string>> {
    return this.apiClient.apiDelete<string>(ConstantsRoutes.USUARIOS_CANCELAR + `/${id}`);
  }
  getUsuariosCasa(casa: string): Observable<ApiResponse<UsuarioView[]>> {
    let params = new HttpParams();
    params = params.set('casa', casa);
    return this.apiClient.apiGetParam<UsuarioView[]>(ConstantsRoutes.LOGIN, params);
  }

  getUsuario(id: string): Observable<ApiResponse<UsuarioAgregar>> {
    return this.apiClient.apiGet<UsuarioAgregar>(ConstantsRoutes.LOGIN + `/${id}`);
  }

  postUsuario(usuario: UsuarioAgregar): Observable<ApiResponse<string>> {
    return this.apiClient.apiPost<string, UsuarioAgregar>(ConstantsRoutes.LOGIN, usuario);
  }

  putUsuario(usuario: UsuarioAgregar): Observable<ApiResponse<string>> {
    return this.apiClient.apiPut<string, UsuarioAgregar>(ConstantsRoutes.LOGIN + `/${usuario._id}`, usuario);
  }

   // tslint:disable-next-line: variable-name
 

  cambioEstadoUsuario(usuario: UsuarioCambioEstado): Observable<ApiResponse<string>> {
    return this.apiClient.apiPost<string, UsuarioCambioEstado>(ConstantsRoutes.LOGIN, usuario);
  }

  mensajeUsuario(usuario: UsuarioMensaje): Observable<ApiResponse<string>> {
    return this.apiClient.apiPost<string, UsuarioMensaje>(ConstantsRoutes.LOGIN, usuario);
  }

  enviarInvitacionUsuario(usuario: UsuarioView): Observable<ApiResponse<string>> {
    return this.apiClient.apiPost<string, UsuarioView>(ConstantsRoutes.LOGIN, usuario);
  }

}
