const Usuario = require('../models/usuario');
// const Config = require('../models/config');
// const Mensaje = require('../models/mensaje');
const bcrypt = require('bcryptjs');
const sendGrid = require('../utils/sendGrid');
const usuarioCtrl = {};
const fs = require('fs');
const xlsx = require('xlsx');

usuarioCtrl.getUsuarios = async(req, res) => {
   // user: { type: String, required: true },
   // pass: { type: String, required: true },
   // nombre: { type: String, required: false },
   // rfc: { type: String, required: false },
   // domicilio: { type: String, required: false },
   // tipo: { type: String, required: false },
   // estado: { type: String, required: false },
    try{
        var palabra = req.query.palabra;
        var page = Number(req.query.page);
        var orden = req.query.orden;
        var rusuarios;

        if(palabra != ""){
            rusuarios = await Usuario.find({
                $and: 
                    { user: {$regex: palabra, $options: 'i'}, estado:  '1'},
                    
                   }
                )
            .select('user nombre estado')
            .limit(25)
            .skip(25 * page)
            .sort('user');
        }else{
            rusuarios = await Usuario.find( {estado:  '1'})
            .select('user nombre estado')
            .limit(25)
            .skip(25 * page)
            .sort('user');
        }

        if (!rusuarios) return res.status(404).send('Usuarios no encontrados.');
        res.status(200).send({ success: true, payload: rusuarios });
    }
    catch(e){
        res.status(404).send("Problemas de conexion");
    }
}

usuarioCtrl.cancelar = async (req, res) => {
    // alert("estado " + req.body.estado);
     try{
         const { id } = req.params;
         const usuario = {
             estado: "2",
             
         }
        
       
           var rUsuario = await Usuario.findByIdAndUpdate(id, {$set: usuario}, {new : true});
         
         if (!rUsuario) return res.status(404).send('Usuario NO encontrado para cancelar.');

var respuesta =   rUsuario.id;
         res.status(200).send({ success: true, payload: respuesta});
     }
     catch(e){
         res.status(404).send("Usuario No cambio de estado a cancelado");
     }
 }




module.exports = usuarioCtrl;