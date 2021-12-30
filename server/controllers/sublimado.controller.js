const Sublimado = require('../models/sublimado');
const Pedido = require('../models/pedido');
const bcrypt = require('bcryptjs');
const sublimadoCtrl = {};
const fs = require('fs');
const xlsx = require('xlsx');

sublimadoCtrl.createSublimado = async (req, res) => {
	try{

        //Folio
        var rFolio = await Sublimado.find({ estado: '1' }).select('folio').limit(1).sort('-folio');  
        var nFolio = rFolio == null || rFolio == NaN || rFolio.length == 0 ? 0 : Number(rFolio[0].folio) + 1;

        //Crear sublimado
        const sublimado = new Sublimado();
        sublimado.fecha = req.body.fecha;
        sublimado.folio = nFolio;
        sublimado.nPiezas = req.body.nPiezas;
        sublimado.nModelos = req.body.nModelos;
        sublimado.estado = '1';
        
        //Crear productos
        sublimado.sublimadoModelo = new Array();
        for(var i = 0; i < req.body.sublimadoModelo.length; i++ ){
            //short
            var p = req.body.sublimadoModelo[i];

            //Crear objeto
            var nProducto = {
                'producto_id' : p.producto_id,             
                'modelo' : p.modelo,             
                'pantalonHG' : p.pantalonHG,             
                'pantalonHM' : p.pantalonHM,             
                'pantalonMXL' : p.pantalonMXL,             
                'pantalonMU' : p.pantalonMU,             
                'pantalonN' : p.pantalonN,             
                'shortH' : p.shortH,  
                'shortM' : p.shortM,  
                'shortN' : p.shortN,
                'camison' : p.camison,
                'playeraHG' : p.playeraHG,
                'playeraHM' : p.playeraHM,
                'playeraMXL' : p.playeraMXL,
                'playeraMU' : p.playeraMU,
                'playeraN4' : p.playeraN4,
                'playeraN8' : p.playeraN8,
                'playeraN12' : p.playeraN12
            };

            //Agregar
            sublimado.sublimadoModelo.push(nProducto);
        }
        
        //Crear pedidos
        sublimado.pedidos = new Array();
        for(var i = 0; i < req.body.pedidos.length; i++ ){
            //short
            var p = req.body.pedidos[i];

            //Crear objeto
            var nProducto = {
                '_id' : p._id,             
                'folio' : p.folio
            };

            //Agregar
            sublimado.pedidos.push(nProducto);
        }
    
        var rSublimado = await sublimado.save();    
        if (!rSublimado) return res.status(404).send('Sublimado no creado.');

        //Aqui se modifican los pedidos a estado sublimado
        for(var i = 0; i < sublimado.pedidos.length; i++){
            const pedido = { sublimado: true};
            var rPedido = await Pedido.findByIdAndUpdate(sublimado.pedidos[i]._id, {$set: pedido}, {new : true});                      
        }

        //Se envia respuesta
        res.status(200).send({ success: true, payload: rSublimado._id });
    }
    catch(e){
        console.log(e);
        res.status(404).send("Sublimado no creado");
    }
}

sublimadoCtrl.getSublimados = async(req, res) => {
	try{
        var sFI = req.query.fechaInicial;
        var sFF = req.query.fechaFinal;
        var fInicial = new Date(sFI);
        var fFinal = new Date(sFF);
        fFinal.setDate(fFinal.getDate() + 1);
        var palabra = req.query.palabra;
        var page = Number(req.query.page);
        var orden = req.query.orden;
        var rsublimados;

        if(palabra != ""){
            rsublimados = await Sublimado.find({
                $and: [
                    { user: {$regex: palabra, $options: 'i'}, estado: '1', fecha: { $gte: fInicial, $lte: fFinal }},
                    { }
                ]}
                )
            .select('fecha folio nPiezas nModelos estado pedidos')
            .limit(25)
            .skip(25 * page)
            .sort('folio');
        }else{
            rsublimados = await Sublimado.find({ estado: '1', fecha: { $gte: fInicial, $lte: fFinal }})
            .select('fecha folio nPiezas nModelos estado pedidos')
            .limit(25)
            .skip(25 * page)
            .sort('folio');
        }

        if (!rsublimados) return res.status(404).send('Sublimados no encontrados.');
        res.status(200).send({ success: true, payload: rsublimados });
    }
    catch(e){
        res.status(404).send("Problemas de conexion");
    }
}

sublimadoCtrl.getSublimado = async (req, res) => {
	try{
        const rSublimado = await Sublimado.findById(req.params.id,{ estado: 0, __v: 0 });
        if (!rSublimado) return res.status(404).send('Sublimado no encontrado.');
        res.status(200).send({ success: true, payload: rSublimado });
    }
    catch(e){
        res.status(404).send("Sublimado No encontrado");
    } 
}

module.exports = sublimadoCtrl;