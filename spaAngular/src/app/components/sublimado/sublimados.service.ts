import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from 'src/app/models/pedido/pedido';
import { ApiResponse } from 'src/app/models/shared/ApiResponse';
import { SublimadoAgregar } from 'src/app/models/sublimado/sublimadoAgregar';
import { SublimadoPedidosView } from 'src/app/models/sublimado/sublimadoPedidoView';
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

  getSublimadoPedidos(id: string): Observable<ApiResponse<SublimadoPedidosView>> {
    return this.apiClient.apiGet<SublimadoPedidosView>(ConstantsRoutes.SUBLIMADO_PEDIDOS + `/${id}`);
   }
  postSublimado(pedido: SublimadoAgregar): Observable<ApiResponse<string>> {
    return this.apiClient.apiPost<string, SublimadoAgregar>(ConstantsRoutes.SUBLIMADO_AGREGAR, pedido);
  }

  deleteSublimado(id: string): Observable<ApiResponse<string>> {
    return this.apiClient.apiDelete<string>(ConstantsRoutes.SUBLIMADO_ELIMINAR + `/${id}`);
  }

  confirmarTerminarSublimado(id: string, pedido:SublimadoSimpleView): Observable<ApiResponse<string>> {
    return this.apiClient.apiPut<string, SublimadoSimpleView>(ConstantsRoutes.SUBLIMADO_CONFIRMADO_TERMINADO + `/${id}`, pedido);
  }

  putSublimado(sublimado: SublimadoAgregar): Observable<ApiResponse<string>> {
    return this.apiClient.apiPut<string, SublimadoAgregar>(ConstantsRoutes.SUBLIMADO_EDITAR + `/${sublimado._id}`, sublimado);
  }

  getSublimadosPdf(sublimado: SublimadoSimpleView, id: string, tipo: string): Observable<ApiResponse<string>> {
    
    return this.apiClient.apiGet<string>(ConstantsRoutes.SUBLIMADO_GET_PDF+ `/${sublimado._id}`);
}
getSublimadosPlayeraPdf(sublimado: SublimadoSimpleView, id: string, tipo: string): Observable<ApiResponse<string>> {
    
  return this.apiClient.apiGet<string>(ConstantsRoutes.SUBLIMADO_GET_PLAYERA_PDF+ `/${sublimado._id}`);
}
}