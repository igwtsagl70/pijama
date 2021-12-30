export class ProductoView {
    _id: string;
    nombre: string;
    descripcion: string;
    nPiezas: number;
    descuento: string;
    mayoreo: number;
    menudeo: number;
    imagenes: ProductoImagen[];
    estado: string;
}

export class ProductoImagen {
    _id: string;
    nombre: string;
    url: string;
}