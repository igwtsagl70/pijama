export class ImportarExcelResponse {
    constructor(
    ) {
       this.totalOk = 0;
       this.totalNok = 0;
       this.errores = new Array();
     }
    public totalOk: number;
    public totalNok: number;
    public errores: string[];
}

export class ImportarExcelResponseErrorList {
    constructor(
        public mensaje: string
    ) { }
}
