import { PedidosSublimado } from "./sublimado";

export class SublimadoSimpleView {
    _id: string;
    fecha: Date;
    folio: number;
    nPiezas: number;
    nModelos: number;
    estado: string;
    pedidos: PedidosSublimado[];
}
