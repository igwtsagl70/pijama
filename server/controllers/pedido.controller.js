const Pedido = require('../models/pedido');
const bcrypt = require('bcryptjs');
const pedidoCtrl = {};
const fs = require('fs');
const xlsx = require('xlsx');

pedidoCtrl.createPedido = async (req, res) => {
	try{

        //Folio
        var rFolio = await Pedido.find({ estado: '1' }).select('folio').limit(1).sort('-folio');  
        var nFolio = rFolio == null || rFolio == NaN || rFolio.length == 0 ? 0 : Number(rFolio[0].folio) + 1;

        //Crear pedido
        const pedido = new Pedido();
        pedido.fecha = req.body.fecha;
        pedido.folio = nFolio;
        pedido.user = req.body.user;
        pedido.nPiezas = req.body.nPiezas;
        pedido.nModelos = req.body.nModelos;
        pedido.cantidad = req.body.cantidad;
        pedido.descuento = req.body.descuento;
        pedido.subtotal = req.body.subtotal;
        pedido.total = req.body.total;
        pedido.nota = req.body.nota;
        pedido.esMayoreo = req.body.esMayoreo;
        pedido.sublimado = false;
        pedido.estado = '1';
        //Crear productos
        pedido.pedidoProductos = new Array();
        for(var i = 0; i < req.body.pedidoProductos.length; i++ ){
            //short
            var p = req.body.pedidoProductos[i];

            //Descripcciens piezas
            var descripciones = new Array();
            for(var j = 0; j < req.body.pedidoProductos[i].pedidoProductoPiezas.length; j++ ){
                descripciones.push({'descripcion': p.pedidoProductoPiezas[j].descripcion});
            }

            //Crear objeto
            var nProducto = {
                'producto_id' : p.producto_id,             
                'nombre' : p.nombre,             
                'descuento' : p.descuento,             
                'mayoreo' : p.mayoreo,             
                'menudeo' : p.menudeo,             
                'nPiezas' : p.nPiezas,             
                'cantidad' : p.cantidad,             
                'tipo' : p.tipo,  
                'genero' : p.genero,  
                'talla' : p.talla,
                'pedidoProductoPiezas': descripciones
            };

            //Agregar
            pedido.pedidoProductos.push(nProducto);
        }
    
        var rPedido = await pedido.save();    
        if (!rPedido) return res.status(404).send('Pedido no creado.');

        res.status(200).send({ success: true, payload: rPedido._id });
    }
    catch(e){
        console.log(e);
        res.status(404).send("Pedido no creado");
    }
}

pedidoCtrl.getPedidos = async(req, res) => {
	try{
        var sFI = req.query.fechaInicial;
        var sFF = req.query.fechaFinal;
        var fInicial = new Date(sFI);
        var fFinal = new Date(sFF);
        fFinal.setDate(fFinal.getDate() + 1);
        var palabra = req.query.palabra;
        var page = Number(req.query.page);
        var orden = req.query.orden;
        var rpedidos;

        if(palabra != ""){
            rpedidos = await Pedido.find({
                $and: [
                    { user: {$regex: palabra, $options: 'i'}, estado: '1', fecha: { $gte: fInicial, $lte: fFinal }},
                    { }
                ]}
                )
            .select('fecha folio user cantidad total estado sublimado nModelos')
            .limit(25)
            .skip(25 * page)
            .sort('folio');
        }else{
            rpedidos = await Pedido.find({ estado: '1', fecha: { $gte: fInicial, $lte: fFinal }})
            .select('fecha folio user cantidad total estado sublimado nModelos')
            .limit(25)
            .skip(25 * page)
            .sort('folio');
        }

        if (!rpedidos) return res.status(404).send('Pedidos no encontrados.');
        res.status(200).send({ success: true, payload: rpedidos });
    }
    catch(e){
        res.status(404).send("Problemas de conexion");
    }
}

pedidoCtrl.getPedido = async (req, res) => {
	try{
        const rPedido = await Pedido.findById(req.params.id,{ estado: 0, __v: 0 });
        if (!rPedido) return res.status(404).send('Pedido no encontrado.');
        res.status(200).send({ success: true, payload: rPedido });
    }
    catch(e){
        res.status(404).send("Pedido No encontrado");
    } 
}

pedidoCtrl.editPedido = async (req, res) => {
	try{
        const { id } = req.params;
        var pedido = {
            nPiezas: req.body.nPiezas,
            nModelos: req.body.nModelos,
            cantidad: req.body.cantidad,
            descuento: req.body.descuento,
            subtotal: req.body.subtotal,
            total: req.body.total,
            nota: req.body.nota,
            esMayoreo: req.body.esMayoreo,
            pedidoProductos: new Array()
        };
        
        //Crear productos
        for(var i = 0; i < req.body.pedidoProductos.length; i++ ){
            //short
            var p = req.body.pedidoProductos[i];

            //Descripcciens piezas
            var descripciones = new Array();
            for(var j = 0; j < req.body.pedidoProductos[i].pedidoProductoPiezas.length; j++ ){
                descripciones.push({'descripcion': p.pedidoProductoPiezas[j].descripcion});
            }

            //Crear objeto
            var nProducto = {
                'producto_id' : p.producto_id,             
                'nombre' : p.nombre,             
                'descuento' : p.descuento,             
                'mayoreo' : p.mayoreo,             
                'menudeo' : p.menudeo,             
                'nPiezas' : p.nPiezas,             
                'cantidad' : p.cantidad,             
                'tipo' : p.tipo,  
                'genero' : p.genero,  
                'talla' : p.talla,
                'pedidoProductoPiezas': descripciones
            };

            //Agregar
            pedido.pedidoProductos.push(nProducto);
        }
    
        var rPedido = await Pedido.findByIdAndUpdate(id, {$set: pedido}, {new : true});
        if (!rPedido) return res.status(404).send('Pedido no actualizado.');
        res.status(200).send({ success: true, payload: rPedido._id });
    }
    catch(e){
        res.status(404).send("Pedido No actualizada");
    }
}


pedidoCtrl.getPedidosParaSublimado = async(req, res) => {
	try{
        var sFI = req.query.fechaInicial;
        var sFF = req.query.fechaFinal;
        var fInicial = new Date(sFI);
        var fFinal = new Date(sFF);
        fFinal.setDate(fFinal.getDate() + 1);
        var palabra = req.query.palabra;
        var page = Number(req.query.page);
        var orden = req.query.orden;
        var rpedidos;

        if(palabra != ""){
            rpedidos = await Pedido.find({
                $and: [
                    { folio: {$regex: palabra, $options: 'i'}, estado: '1', sublimado: false, fecha: { $gte: fInicial, $lte: fFinal }},
                    { }
                ]}
                )
            .select('fecha folio user cantidad total estado sublimado nModelos pedidoProductos')
            .limit(25)
            .skip(25 * page)
            .sort('folio');
        }else{
            rpedidos = await Pedido.find({ estado: '1', sublimado: false, fecha: { $gte: fInicial, $lte: fFinal }})
            .select('fecha folio user cantidad total estado sublimado nModelos pedidoProductos')
            .limit(25)
            .skip(25 * page)
            .sort('folio');
        }

        if (!rpedidos) return res.status(404).send('Pedidos no encontrados.');
        res.status(200).send({ success: true, payload: rpedidos });
    }
    catch(e){
        res.status(404).send("Problemas de conexion");
    }
}

module.exports = pedidoCtrl;