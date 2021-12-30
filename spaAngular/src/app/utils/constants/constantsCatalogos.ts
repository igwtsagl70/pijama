import { WrapCatalogo, WrapCatalogoNumber } from 'src/app/models/shared/WrapCatalogo';

export class ConstantsCatalogos {
    public static get URL_PUBLIC(): string {
        return '';
    }

    public static getMes(mes: number): string {
        let sMes = '';

        switch (mes) {
            case 0: sMes = 'Enero'; break;
            case 1: sMes = 'Febrero'; break;
            case 2: sMes = 'Marzo'; break;
            case 3: sMes = 'Abril'; break;
            case 4: sMes = 'Mayo'; break;
            case 5: sMes = 'Junio'; break;
            case 6: sMes = 'Julio'; break;
            case 7: sMes = 'Agosto'; break;
            case 8: sMes = 'Septiembre'; break;
            case 9: sMes = 'Octubre'; break;
            case 10: sMes = 'Noviembre'; break;
            case 11: sMes = 'Diciembre'; break;
        }

        return sMes;
    }

    public static get MESES(): WrapCatalogoNumber[] {
        const a = new Array();
        a.push({ key: 0, value: 'Enero' });
        a.push({ key: 1, value: 'Febrero' });
        a.push({ key: 2, value: 'Marzo' });
        a.push({ key: 3, value: 'Abril' });
        a.push({ key: 4, value: 'Mayo' });
        a.push({ key: 5, value: 'Junio' });
        a.push({ key: 6, value: 'Julio' });
        a.push({ key: 7, value: 'Agosto' });
        a.push({ key: 8, value: 'Septiembre' });
        a.push({ key: 9, value: 'Octubre' });
        a.push({ key: 10, value: 'Noviembre' });
        a.push({ key: 11, value: 'Diciembre' });
        return a;
    }

    public static get PERIODOS(): WrapCatalogo[] {
        const a = new Array();
        a.push({ key: '0', value: 'Hoy' });
        a.push({ key: '1', value: 'Ayer' });
        a.push({ key: '2', value: 'Mes actual' });
        a.push({ key: '3', value: 'Mes anterior' });
        a.push({ key: '4', value: 'Bimestre actual' });
        a.push({ key: '5', value: 'Bimestre anterior' });
        a.push({ key: '6', value: 'Año actual' });
        a.push({ key: '7', value: 'Año anterior' });
        a.push({ key: '8', value: 'Desde siempre' });
        a.push({ key: '9', value: 'Personalizado' });
        return a;
    }

    public static get EXT_EXCEL(): string[] {
        return ['xls', 'xlsx'];
    }

    public static get EXT_XML(): string[] {
        return ['xml', 'XML'];
    }

    public static get EXT_IMG(): string[] {
        return ['png', 'svg', 'jpg', 'jepg', 'jpeg'];
    }

    public static get EXT_FILE(): string[] {
        return ['png', 'svg', 'jpg', 'jepg', 'xls', 'xlsx', 'pdf', 'rar', 'zip', 'doc', 'docx', 'txt', 'xml'];
    }

    public static get PRINT_STYLE(): string {
        // tslint:disable-next-line: max-line-length
        return '@font-face {    font-family: \'montserrat\';    src: url(\'../font/montserrat-medium.ttf\') format(\'truetype\');    font-weight: normal;    font-style: normal;}@font-face {    font-family: \'montserrat\';    src: url(\'../font/montserrat-semibold.ttf\') format(\'truetype\');    font-weight: 500;    font-style: normal}body { font-family: \'montserrat\', sans-serif !important;    position: relative;    color: #343944;}.main-header {    display: none !important;}.main-sidenav-menu {    display: none !important;}.header-main-outlet {    display: none !important;}.reporte-print {    margin-top: 25px;    position: relative;    display: block;    background: #fff;    padding: 10px;    border-radius: 5px;    box-shadow: 0px 1px 6px -1px #222;    width: 100%;}.titulo p{    font-size: 1.3rem;    color: #343a40;    margin: 0px;    margin-top: 10px;    margin-bottom: 10px;}.reporte-resultado {    font-size: 0.8rem;    color: #343a40;}.reporte-resultado table{    margin: 0 auto;    border-collapse: collapse;}.reporte-resultado thead{    border-bottom: 1px solid #bec5cb;}.reporte-resultado tbody{    position: relative;}.reporte-resultado tbody tr{    border-bottom: 1px solid #bec5cb;}.reporte-resultado tbody tr td{    padding-top: 10px;    padding: 3px;}.reporte-resultado tfoot tr{    border-top: 2px solid #bec5cb;}.reporte-resultado tfoot tr td{    font-size: 0.9rem;    font-weight: bold;    padding: 5px;} .col-titulo{display: inline-block;width: 350px;vertical-align: top;}';
    }
}
