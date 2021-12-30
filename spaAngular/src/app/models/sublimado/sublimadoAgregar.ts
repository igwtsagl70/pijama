import { PedidosSublimado, SublimadoModelo } from "./sublimado";

export class SublimadoAgregar {
    _id: string;
    fecha: Date;
    nPiezas: number;
    nModelos: number;
    sublimadoModelo: SublimadoModelo[];
    pedidos: PedidosSublimado[];
}