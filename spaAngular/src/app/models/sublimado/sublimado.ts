export class Sublimado {
    _id: string;
    fecha: Date;
    folio: number;
    nPiezas: number;
    nModelos: number;
    estado: string;
    sublimadoModelo: SublimadoModelo[];
    pedidos: PedidosSublimado[];
}

export class SublimadoModelo {
    constructor(){    
        this.pantalonHG = 0;
        this.pantalonHM = 0;
        this.pantalonMXL = 0;
        this.pantalonMU = 0;
        this.pantalonN = 0;
        this.shortH = 0;
        this.shortM = 0;
        this.shortN = 0;
        this.camison = 0;
        this.playeraHG = 0;
        this.playeraHM = 0;
        this.playeraMXL = 0;
        this.playeraMU = 0;
        this.playeraN4 = 0;
        this.playeraN8 = 0;
        this.playeraN12 = 0;
    }

    _id: string;
    producto_id: string;
    modelo: string;
    pantalonHG: number;
    pantalonHM: number; 
    pantalonMXL: number; 
    pantalonMU: number;
    pantalonN: number;
    shortH: number;
    shortM: number; 
    shortN: number;
    camison: number;
    playeraHG: number;
    playeraHM: number;
    playeraMXL: number;
    playeraMU: number;
    playeraN4: number;
    playeraN8: number;
    playeraN12: number;
}

export class PedidosSublimado {
    _id: string;
    folio: number;
}
