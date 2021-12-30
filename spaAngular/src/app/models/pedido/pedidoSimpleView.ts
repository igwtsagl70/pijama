import { PedidoProductos } from "./pedido";

export class PedidoSimpleView {
    _id: string;
    fecha: Date;
    folio: number;
    user: string;
    cantidad: number;
    total: number;
    estado: string;
    sublimado: boolean;
    nModelos: number;
}

export class PedidoView {
    _id: string;
    fecha: Date;
    folio: number;
    user: string;
    cantidad: number;
    total: number;
    estado: string;
    sublimado: boolean;
    nModelos: number;
    pedidoProductos: PedidoProductos[];
}
