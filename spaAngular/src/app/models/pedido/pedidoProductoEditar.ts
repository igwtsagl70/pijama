import { ProductoImagen } from "../producto/productosView";

export class PedidoProductoEditar { 
    producto_id: string;
    nombre: string;
    descripcion: string;
    nPiezas: number;
    descuento: number;
    mayoreo: number;
    menudeo: number;
    imagenes: ProductoImagen[];
    cantidad: number;
    genero: string;
    tipo: string;
    talla: string;
}