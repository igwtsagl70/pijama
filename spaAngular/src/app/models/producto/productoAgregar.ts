import { ProductoImagen } from "./productosView";

export class ProductoAgregar {
    _id: string;
    nombre: string;
    descripcion: string;
    nPiezas: number;
    descuento: number;
    mayoreo: number;
    menudeo: number;
    imagenes: ProductoImagen[];
}