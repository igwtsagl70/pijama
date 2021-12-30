import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductoAgregar } from 'src/app/models/producto/productoAgregar';
import { ProductoEliminarImagen } from 'src/app/models/producto/productoEliminarImagen';
import { ProductoSimpleView } from 'src/app/models/producto/productoSimpleView';
import { ApiResponse } from 'src/app/models/shared/ApiResponse';
import { ConstantsRoutes } from 'src/app/utils/constants/ConstantsRoutes';
import { ApiClientService } from 'src/app/utils/service/api-client.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private apiClient: ApiClientService) {
  }

  getProductos(palabra: string, page: number, orden: string): Observable<ApiResponse<ProductoSimpleView[]>> {
    let params = new HttpParams();
    params = params.set('palabra', palabra);
    params = params.set('page', page.toString());
    params = params.set('orden', orden);
    return this.apiClient.apiGetParam<ProductoSimpleView[]>(ConstantsRoutes.PRODUCTOS, params);
  }

  getProducto(id: string): Observable<ApiResponse<ProductoAgregar>> {
    return this.apiClient.apiGet<ProductoAgregar>(ConstantsRoutes.PRODUCTO_GET + `/${id}`);
  }
  
  postProducto(producto: ProductoAgregar): Observable<ApiResponse<string>> {
    return this.apiClient.apiPost<string, ProductoAgregar>(ConstantsRoutes.PRODUCTO_AGREGAR, producto);
  }

  putProducto(producto: ProductoAgregar): Observable<ApiResponse<string>> {
    return this.apiClient.apiPut<string, ProductoAgregar>(ConstantsRoutes.PRODUCTO_EDITAR + `/${producto._id}`, producto);
  }

  deleteProducto(id: string): Observable<ApiResponse<string>> {
    return this.apiClient.apiDelete<string>(ConstantsRoutes.PRODUCTO_ELIMINAR + `/${id}`);
  }

  postProductoDeleteFile(archivo: ProductoEliminarImagen): Observable<ApiResponse<string>> {
    return this.apiClient.apiPost<string, ProductoEliminarImagen>(ConstantsRoutes.PRODUCTO_ARCHIVO_ELIMINAR, archivo);
  }

  postProductoAgregarFile(form: FormData): Observable<ApiResponse<string>> {
      return this.apiClient.apiPost<string, FormData>(ConstantsRoutes.PRODUCTO_ARCHIVO_AGREGAR, form);
  }
}
