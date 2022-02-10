export class ConstantsRoutes {
    /* ANGULAR ROUTES */
    public static get ANGULAR_LOGIN(): string { return '/auth/login'; }
    public static get ANGULAR_REGISTRO(): string { return '/auth/registro'; }
    public static get ANGULAR_RESET(): string { return '/auth/reset'; }
    public static get ANGULAR_INICIO(): string { return '/inicio/usuario'; }
    public static get ANGULAR_ADMIN(): string { return '/admin/productos'; }

    /* API ROUTES*/
    public static get LOGIN(): string { return '/api/auth/login'; }
    public static get REGISTRO(): string { return '/api/auth/registro'; }
    public static get RESET(): string { return '/api/auth/reset'; }
    public static get IDENTITY_USER(): string { return '/api/auth/getIdentityUser'; }
    public static get NAVBAR_USER(): string { return '/api/usuario/NavBarData'; }
    public static get PERFIL_USER_FILE(): string { return '/api/usuario/perfilFile'; }
    public static get PERFIL_USER(): string { return '/api/usuario/perfil'; }
    public static get BUSCAR_MENSAJES(): string { return '/api/mensajes'; }
    public static get PERFIL_BORRAR_IMG(): string { return '/api/usuario/borraFile'; }

    /* API PRODCUTOS*/
    public static get PRODUCTOS(): string { return '/api/producto/list'; }
    public static get PRODUCTO_GET(): string { return '/api/producto'; }
    public static get PRODUCTO_AGREGAR(): string { return '/api/producto'; }
    public static get PRODUCTO_EDITAR(): string { return '/api/producto'; }
    public static get PRODUCTO_ELIMINAR(): string { return '/api/producto'; }
    public static get PRODUCTO_ARCHIVO_ELIMINAR(): string { return '/api/producto/imagen/eliminar'; }
    public static get PRODUCTO_ARCHIVO_AGREGAR(): string { return '/api/producto/imagen'; }

    /* API PEDIDOS*/
    public static get PEDIDOS(): string { return '/api/pedido/list'; }
    public static get PEDIDOS_PARA_SUBLIMAR(): string { return '/api/pedido/sublimado'; }
    public static get PEDIDO_GET(): string { return '/api/pedido'; }
    public static get PEDIDO_AGREGAR(): string { return '/api/pedido'; }
    public static get PEDIDO_EDITAR(): string { return '/api/pedido'; }
    public static get PEDIDO_ELIMINAR(): string { return '/api/pedido'; }
    public static get PEDIDO_CONFIRMAR(): string { return '/api/pedido/confirmar'; }
    public static get PEDIDOS_USUARIO(): string { return '/api/pedido/usuario/list'; }
    public static get PEDIDO_PDF(): string { return '/api/pedido/pdf'; }
    /* API SUBLIMADOS*/
    public static get SUBLIMADOS(): string { return '/api/sublimado/list'; }
    public static get SUBLIMADO_GET(): string { return '/api/sublimado'; }
    public static get SUBLIMADO_PEDIDOS(): string { return '/api/sublimado/pedidos'; }
    public static get SUBLIMADO_AGREGAR(): string { return '/api/sublimado'; }
    public static get SUBLIMADO_EDITAR(): string { return '/api/sublimado'; }
    public static get SUBLIMADO_ELIMINAR(): string { return '/api/sublimado/cancelar'; }
    public static get SUBLIMADO_CONFIRMADO_TERMINADO(): string { return '/api/sublimado/confirmar/terminar'; }
    public static get SUBLIMADO_GET_PDF(): string { return '/api/sublimado/pdf'; }
    public static get SUBLIMADO_GET_PLAYERA_PDF(): string { return '/api/sublimado/playera/pdf'; }

 /* API USUARIOS*/
 public static get USUARIOS(): string { return '/api/usuario/list'; }
 public static get USUARIOS_CANCELAR(): string { return '/api/usuario'; }
}