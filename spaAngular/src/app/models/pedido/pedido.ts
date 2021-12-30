import { ProductoImagen } from "../producto/productosView";

export class Pedido {
    _id: string;
    fecha: Date;
    folio: number;
    user: string;
    nPiezas: number;
    nModelos: number;
    cantidad: number;
    descuento: number;
    subtotal: number;
    total: number;
    nota: string;
    esMayoreo: boolean;
    sublimado: boolean;
    estado: string;
    pedidoProductos: PedidoProductos[];
}

export class PedidoProductos {
    producto_id: string;
    nombre: string;
    descuento: number;
    mayoreo: number;
    menudeo: number;
    nPiezas: number;
    cantidad: number;
    tipo: string;
    genero: string;
    talla: string;
    imagenes: ProductoImagen[];
    pedidoProductoPiezas: PedidoProductoPiezas[];
}

export class PedidoProductoPiezas {
    descripcion: string;
}