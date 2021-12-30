import { ProductoImagen } from "./productosView";

export class ProductoSimpleView {
    _id: string;
    nombre: string;
    mayoreo: number;
    menudeo: number;
    imagenes: ProductoImagen[];
    estado: string;
}