export class DatosUsuario {
    public nombre: string;
    public imagen: string;
    public casa: string;
    public casaNumero: number;
    public casaLetra: string;

    constructor(nombre = '', casa = '', imagen = '', casaNumero = 0, casaLetra = '') {
        this.nombre = nombre;
        this.casa = casa;
        this.imagen = imagen;
        this.casaNumero = casaNumero;
        this.casaLetra = casaLetra;
    }
}
