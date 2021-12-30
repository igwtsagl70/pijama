import { Injectable } from '@angular/core';
import { IdentityUserService } from '../IdentityUser/identity-user.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as jwtDecode from 'jwt-decode';
import { TokenDecode } from '../../models/shared/tokenDecode';
import { ConstantsRoutes } from '../constants/ConstantsRoutes';
import { ToastrService } from 'ngx-toastr';
import { IdentityUser } from '../IdentityUser/IdentityUser';
import { ApiResponse } from '../../models/shared/ApiResponse';
import { Pedido } from 'src/app/models/pedido/pedido';
import { PedidoAgregar } from 'src/app/models/pedido/pedidoAgregar';

@Injectable()
export class SessionService {
    redirectUrl: string;

    constructor(
        private toastr: ToastrService,
        private identityUserService: IdentityUserService,
        private router: Router
    ) {
    }

    // Log-out
    public logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('expiresAt');
        this.identityUserService.resetIdentityUser();
        this.identityUserService.resetDatosUser();
        this.router.navigate([ConstantsRoutes.ANGULAR_LOGIN]);
    }

    // Crea token en localStorage y crea la sesion de usuario en el servicio identityUserService
    public setSession(token: string, callBack: string): void {
        localStorage.setItem('token', token);
        const tokenDecode = this.getTokenDecode(token);
        if (this.validateTokenDecode(tokenDecode)) {
            localStorage.setItem('expiresAt', tokenDecode.expires);
            if (this.identityUserService.createIdentityUser(tokenDecode)) {
                if (callBack != null || callBack !== undefined) { this.sessionRedirect(callBack); } else { this.sessionRedirect(); }
            } else { this.sessionRedirect(ConstantsRoutes.ANGULAR_LOGIN); }
        } else { this.toastr.error('Token inválido', 'Error - E206'); }
    }

    // Valida objeto TokenDecode
    private validateTokenDecode(token: TokenDecode): boolean {
        if (token == null) { return false; }
        if (token.userId === 'NA' || token.userId === undefined) { return false; }
        if (token.expires === '' || token.expires === undefined) { return false; }
        return true;
    }

    // Decode el Token
    private getTokenDecode(token: string): TokenDecode {
        const tokenDecode = new TokenDecode('NA');
        if (token != null) {
            try {
                const t: any = jwtDecode(token);
                if (t != null) {
                    tokenDecode.userId = t.userId;
                    tokenDecode.user = t.user;
                    tokenDecode.tipo = t.tipo;
                    tokenDecode.expires = t.exp;
                }
            } catch (e) {
                console.log('-> Error: ' + e);
            }
        }
        return tokenDecode;
    }

    // Redirecciona session por Rol o URl específica
    public sessionRedirect(url?: string, callBack?: string): void {
        // Te lleva a login con un link de respuesta
        if (url && callBack) { this.router.navigate([url], { queryParams: { callBack } }); } else {
            if (url) { this.router.navigate([url]); } else { switch (this.identityUserService.getUserTipo()) {
                case 'admin': this.router.navigate([ConstantsRoutes.ANGULAR_ADMIN]);
                              break;
                case 'user': this.router.navigate([ConstantsRoutes.ANGULAR_INICIO]);
                             break;
            }
            }
        }
    }

    // Valida sesion en single-layout
    public validateSession(url?: string): void {
        if (this.isTokenSet()) {
            if (this.isTokenActive()) {
                if (this.isAuthenticated()) {
                    console.log('Token y usuario correctos');
                    this.sessionRedirect(url);
                } else {
                    this.getUserSessionFromApi(url);
                }
            } else { this.logout(); }
        }
    }

    // Valida la existencia de token y expires en el localStorage
    public isTokenSet(): boolean {
        const token = localStorage.getItem('token');
        const expiresAt = localStorage.getItem('expiresAt');

        if (token != null && expiresAt != null && token !== '' && expiresAt !== '') {
            return true;
        }
        return false;
    }

    // Valida la caducidad ddel token
    public isTokenActive(): boolean {
        const expiresAt = localStorage.getItem('expiresAt');

        if (expiresAt != null) {
            const expires = Number.parseInt(expiresAt, 32);
            const timeNow = Math.floor(new Date().getTime() / 1000);
            if (expires > timeNow) {
                return true;
            }
        }
        return false;
    }

    // Valida la existencia del Objeto identityUser y sus atributos
    public isAuthenticated(): boolean {
        const user = this.identityUserService.getIdentityUser();

        if (user == null || user === undefined) {
            return false;
        } else {
            if (user.userId !== 'NA' && user.tipo !== '' && user.user !== '') { return true; }
        }
        return false;
    }

    // Obtiene valores de usuario en session llamado a la API
    public getUserSessionFromApi(callBack?: string) {
        const token = localStorage.getItem('token');
        if (token != null) {
            const userName = this.getTokenDecode(token).user;
            if (userName !== 'NA' && userName !== undefined) {
                this.identityUserService.getApiIdentityUser(userName)
                    .subscribe(
                    user => {
                        if (user.success) {
                            this.createSessionFromApi(user, callBack);
                        } else { this.toastr.error('Token inválido', 'Error - E206'); }
                    }
                    , error => {
                        this.toastr.error(error.error.message, 'Error - ' + error.error.errorCode);
                        this.sessionRedirect(ConstantsRoutes.ANGULAR_LOGIN);
                    }
                );
            }
        }
    }

    //  Crea session de usuario con los datos de la API
    public createSessionFromApi(user: ApiResponse<IdentityUser>, callBack?: string) {
        const tokenDecode = new TokenDecode(user.payload.userId);
        tokenDecode.userId = user.payload.userId;
        tokenDecode.user = user.payload.user;
        tokenDecode.tipo = user.payload.tipo;

        this.identityUserService.createIdentityUser(tokenDecode);
        if (this.router.url === ConstantsRoutes.ANGULAR_LOGIN) { this.sessionRedirect(); } else {
            if (callBack) { this.sessionRedirect(callBack); } else { this.sessionRedirect(this.router.url); }
        }
    }

    //COOKIES
    setCookie(name: string, value: string,days: number) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }

    getCookie(name: string) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
    
    eraseCookie(name: string) {   
        document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    crearCookiePedido(pedido: PedidoAgregar){
        this.deleteCookiePedido();
        this.setCookie("pedido", this.Json_PedidoToJson(pedido), 5);
    }

    getCookiePedido(): PedidoAgregar{
        var sJson = this.getCookie("pedido");
        if(sJson == null) return null;
        return this.Json_JsonToPedido(sJson);
    }

    deleteCookiePedido(){
        this.eraseCookie("pedido");
    }

    Json_PedidoToJson(pedido: PedidoAgregar): string{
        return JSON.stringify(pedido);
    }

    Json_JsonToPedido(cadena: string): PedidoAgregar{
        return JSON.parse(cadena);
    }
}
