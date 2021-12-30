import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/shared/ApiResponse';
import { SublimadoAgregar } from 'src/app/models/sublimado/sublimadoAgregar';
import { SublimadoSimpleView } from 'src/app/models/sublimado/sublimadoSimpleView';
import { ConstantsRoutes } from 'src/app/utils/constants/ConstantsRoutes';
import { ApiClientService } from 'src/app/utils/service/api-client.service';

@Injectable({
  providedIn: 'root'
})
export class SublimadosService {


  constructor(private apiClient: ApiClientService) {
  }

  getSublimado(id: string): Observable<ApiResponse<SublimadoAgregar>> {
    return this.apiClient.apiGet<SublimadoAgregar>(ConstantsRoutes.SUBLIMADO_GET + `/${id}`);
  }

  getSublimados(palabra: string, fechaInicial: string, fechaFinal: string,page: number, orden: string): Observable<ApiResponse<SublimadoSimpleView[]>> {
    let params = new HttpParams();
    params = params.set('palabra', palabra);
    params = params.set('fechaInicial', fechaInicial);
    params = params.set('fechaFinal', fechaFinal);
    params = params.set('page', page.toString());
    params = params.set('orden', orden);
    return this.apiClient.apiGetParam<SublimadoSimpleView[]>(ConstantsRoutes.SUBLIMADOS, params);
  }

  postSublimado(pedido: SublimadoAgregar): Observable<ApiResponse<string>> {
    return this.apiClient.apiPost<string, SublimadoAgregar>(ConstantsRoutes.SUBLIMADO_AGREGAR, pedido);
  }

  deleteSublimado(id: string): Observable<ApiResponse<string>> {
    return this.apiClient.apiDelete<string>(ConstantsRoutes.SUBLIMADO_ELIMINAR + `/${id}`);
  }
}