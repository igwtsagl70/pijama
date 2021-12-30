import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PedidoAgregar } from 'src/app/models/pedido/pedidoAgregar';
import { PedidoSimpleView, PedidoView } from 'src/app/models/pedido/pedidoSimpleView';
import { ProductoAgregar } from 'src/app/models/producto/productoAgregar';
import { ProductoEliminarImagen } from 'src/app/models/producto/productoEliminarImagen';
import { ProductoSimpleView } from 'src/app/models/producto/productoSimpleView';
import { ApiResponse } from 'src/app/models/shared/ApiResponse';
import { ConstantsRoutes } from 'src/app/utils/constants/ConstantsRoutes';
import { ApiClientService } from 'src/app/utils/service/api-client.service';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(private apiClient: ApiClientService) {
  }

  getPedido(id: string): Observable<ApiResponse<PedidoAgregar>> {
    return this.apiClient.apiGet<PedidoAgregar>(ConstantsRoutes.PEDIDO_GET + `/${id}`);
  }

  getPedidos(palabra: string, fechaInicial: string, fechaFinal: string,page: number, orden: string): Observable<ApiResponse<PedidoSimpleView[]>> {
    let params = new HttpParams();
    params = params.set('palabra', palabra);
    params = params.set('fechaInicial', fechaInicial);
    params = params.set('fechaFinal', fechaFinal);
    params = params.set('page', page.toString());
    params = params.set('orden', orden);
    return this.apiClient.apiGetParam<PedidoSimpleView[]>(ConstantsRoutes.PEDIDOS, params);
  }

  getPedidosParaSublimar(palabra: string, fechaInicial: string, fechaFinal: string,page: number, orden: string): Observable<ApiResponse<PedidoView[]>> {
    let params = new HttpParams();
    params = params.set('palabra', palabra);
    params = params.set('fechaInicial', fechaInicial);
    params = params.set('fechaFinal', fechaFinal);
    params = params.set('page', page.toString());
    params = params.set('orden', orden);
    return this.apiClient.apiGetParam<PedidoView[]>(ConstantsRoutes.PEDIDOS_PARA_SUBLIMAR, params);
  }

  postPedido(pedido: PedidoAgregar): Observable<ApiResponse<string>> {
    return this.apiClient.apiPost<string, PedidoAgregar>(ConstantsRoutes.PEDIDO_AGREGAR, pedido);
  }

  putPedido(pedido: PedidoAgregar): Observable<ApiResponse<string>> {
    return this.apiClient.apiPut<string, PedidoAgregar>(ConstantsRoutes.PEDIDO_EDITAR + `/${pedido._id}`, pedido);
  }

  deletePedido(id: string): Observable<ApiResponse<string>> {
    return this.apiClient.apiDelete<string>(ConstantsRoutes.PEDIDO_ELIMINAR + `/${id}`);
  }
}
