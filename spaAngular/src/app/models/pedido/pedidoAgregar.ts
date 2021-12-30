import { PedidoProductos } from "./pedido";

export class PedidoAgregar {
    constructor(){
        this.nota = "";
    }

    _id: string;
    fecha: Date;
    user: string;
    nPiezas: number;
    nModelos: number;
    cantidad: number;
    descuento: number;
    subtotal: number;
    total: number;
    nota: string;
    esMayoreo: boolean;
    pedidoProductos: PedidoProductos[];
}

