import { PedidoView } from "../pedido/pedidoSimpleView";
import { PedidosSublimado, SublimadoModelo } from "./sublimado";

export class SublimadoPedidosView {
    _id: string;
    fecha: Date;
    folio: number;
    nPiezas: number;
    nModelos: number;
    estado: string;
    sublimadoModelo: SublimadoModelo[];
    pedidos: PedidosSublimado[];
    
  //  pedidos: PedidoView[];
}

