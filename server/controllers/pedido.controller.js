const Pedido = require('../models/pedido');
const Sublimado = require('../models/sublimado');
const bcrypt = require('bcryptjs');
const pedidoCtrl = {};
const fs = require('fs');
const xlsx = require('xlsx');
//const PDF = require('pdfkit');
//const blobStream = require('blob-stream');
//const { StreamingQuerystring } = require('formidable/parsers');
const PDF = require('pdfkit-construct');
const blobStream = require('blob-stream');
const getStream = require('get-stream')
const { domainToASCII } = require('url');
const { Stream } = require('stream');

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
                    { user: {$regex: palabra, $options: 'i'}, $or: [{estado:  '1'}, {estado: '3' }] , fecha: { $gte: fInicial, $lte: fFinal }},
                    { }
                ]}
                )
            .select('fecha folio user cantidad total estado sublimado nModelos')
            .limit(25)
            .skip(25 * page)
            .sort('folio');
        }else{
            rpedidos = await Pedido.find( { $or: [{estado:  '1'}, {estado: '3' }], fecha: { $gte: fInicial, $lte: fFinal }})
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

pedidoCtrl.getPedidosUsuario = async(req, res) => {
	try{
        var sFI = req.query.fechaInicial;
        var sFF = req.query.fechaFinal;
        var fInicial = new Date(sFI);
        var fFinal = new Date(sFF);
        var usuario = req.query.user
        fFinal.setDate(fFinal.getDate() + 1);
        var palabra = req.query.palabra;
        var page = Number(req.query.page);
        var orden = req.query.orden;
        var rpedidos;

        console.log("usuario " + usuario);
            rpedidos = await Pedido.find({  user: usuario, estado:  '1', fecha: { $gte: fInicial, $lte: fFinal } })
            .select('fecha folio user cantidad total estado sublimado nModelos')
            .limit(25)
            .skip(25 * page)
            .sort('folio');
        
        if (!rpedidos) return res.status(404).send('Pedidos no encontrados.');
        res.status(200).send({ success: true, payload: rpedidos });
    }
    catch(e){
        res.status(404).send("Problemas de conexion en pedidos usuario");
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

pedidoCtrl.deletePedido = async (req, res) => {
   // alert("estado " + req.body.estado);
	try{
        const { id } = req.params;
        const pedido = {
            estado: "2"
        };
    
        var rPedido = await Pedido.findByIdAndUpdate(id, {$set: pedido}, {new : true});
        if (!rPedido) return res.status(404).send('Pedido actualizado.');
        res.status(200).send({ success: true, payload: rPedido._id });
    }
    catch(e){
        res.status(404).send("Pedido No eliminado");
    }
}

pedidoCtrl.confirmarPedido = async (req, res) => {
    // alert("estado " + req.body.estado);
     try{
         const { id } = req.params;
         const pedido = {
             estado: "3"
         };
     
         var rPedido = await Pedido.findByIdAndUpdate(id, {$set: pedido}, {new : true});
         if (!rPedido) return res.status(404).send('Pedido actualizado.');
         res.status(200).send({ success: true, payload: rPedido._id });
     }
     catch(e){
         res.status(404).send("Pedido No confirmado");
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
                    { folio: {$regex: palabra, $options: 'i'}, $or: [{estado:  '1'}, {estado: '3' }, {estado: '4' }], sublimado: false, fecha: { $gte: fInicial, $lte: fFinal }},
                    { }
                ]}
                )
            .select('fecha folio user cantidad total estado sublimado nModelos pedidoProductos')
            .limit(25)
            .skip(25 * page)
            .sort('folio');
        }else{
            rpedidos = await Pedido.find({ $or: [{estado:  '1'}, {estado: '3' }, {estado: '4' }], sublimado: false, fecha: { $gte: fInicial, $lte: fFinal }})
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

// PDFs
pedidoCtrl.getPedidoPdf = async (req, res) => {

    

	try{
        
        var id = req.params.id;
        var url = './public/archivos/';
        var docContent;
        console.log(" entrando  id " +  id + " url " + url);
       
        const rPedido = await Pedido.findById(id);
        if (!rPedido) return res.status(404).send('Pedido no encontrado.');
console.log("antes del doc");
    var doc = new PDF({
        size: 'Letter',
      margins: {top: 40, left: 10, right: 5, bottom: 20},
        bufferPages: true,
        layout: 'landscape',
        
    });
        
     const filename = `PedidoLichita${Date.now()}.pdf`
   
     
             
  
    var pedido = {
        folio: rPedido.folio,
        fecha: rPedido,fecha,
        nPiezas: rPedido.nPiezas,
        nModelos:  rPedido.nModelos,
        cantidad: rPedido.cantidad,
        descuento: rPedido.descuento,
        subtotal: rPedido.subtotal,
        total: rPedido.total,
        nota: rPedido.nota,
        esMayoreo: rPedido.esMayoreo,
        //pedidoProductos: new Array()
    };
    var user = rPedido.user;
    var folio = rPedido.folio;
    var fecha = rPedido.fecha.toLocaleDateString();
    //Crear productos
    var productos = new Array()
    var descripciones = new Array();
    for(var i = 0; i < rPedido.pedidoProductos.length; i++ ){
        //short
        var p = rPedido.pedidoProductos[i];

        //Descripcciens piezas
        var descripciones = new Array();
        for(var j = 0; j < rPedido.pedidoProductos[i].pedidoProductoPiezas.length; j++ ){
            descripciones.push({'descripcion': p.pedidoProductoPiezas[j].descripcion});
        }
        var tipo = "";
        var genero = "";
        var talla = "";
        console.log("antes del switch");
         
        switch(p.genero){
              case "1": genero = "Infantil"; break;
              case "2": genero =  "Dama"; break;
              case "3": genero =  "Caballero"; break;
            }
          
        
            console.log(" genero ", genero);
            switch(p.talla){
              case "1": talla =  "2/4"; break;
              case "2":  talla =  "6/8"; break;
              case "3": talla =  "10/12"; break;
              case "4": talla =  "Unitalla"; break;
              case "5": talla =   "XL"; break;
              case "6": talla =   "28/32"; break;
              case "7": talla =   "34/36"; break;
            }
            console.log(" talla ", talla);
          
            switch(p.tipo){
                case "1":  tipo =  "Playera y pantalón"; break;
                case "2":  tipo =  "Playera y short"; break;
                case "3": tipo =  "Camisón"; break;
                case "4": tipo =  "Sólo playera"; break;
                case "5": tipo =   "Sólo pantalón"; break;
                case "6": tipo =   "Sólo short"; break;
               
              }

              console.log(" tipo ", tipo);
              console.log("despues del switch");
           
        //Crear objeto
        var nProducto = {
        
            'producto_id' : p.producto_id,             
            'nombre' : p.nombre,             
            'descuento' : p.descuento,             
            'mayoreo' : p.mayoreo,             
            'menudeo' : p.menudeo,             
            'nPiezas' : p.nPiezas,             
            'cantidad' : p.cantidad,             
            'tipo' : tipo,  
            'genero' : genero,  
            'talla' : talla,
            'pedidoProductoPiezas': descripciones
        };

        //Agregar
        productos.push(nProducto);
    }
    productos.sort(function (a, b) {
        return (a.talla - b.talla)
    });


    console.log("después del recorrimiento de productos");
   //doc.pipe(file); 

doc.setDocumentHeader({
height: '12'
}, () => {


      doc.fontSize(12)
        .text("Detalle de pedido", {
align: 'center'
        });

        doc.fontSize(10);
        doc.text("Cliente: " + user, {
            align: 'left'
                    });
        doc.text("Folio: " + folio, {
    align: 'left'
            });

doc.text("Fecha del pedido: " + fecha, {
    align: 'left'
            });
doc.text("Cantidad: " + pedido.cantidad, {
                align: 'left'
                        });
doc.text("Total: $" + new Intl.NumberFormat('es-MX', {minimumFractionDigits: 2}).format(pedido.total), {
                            align: 'left'
                                    });
});

    doc.addTable(
        [
            {key: 'nombre', label: 'Nombre', align: 'left'},
            // {key: 'mayoreo', label: 'Cantidad mayoreo', align: 'left'},
            // {key: 'menudeo', label: 'Cantidad menudeo', align: 'right'},
            {key: 'nPiezas', label: 'Existencia'},
            {key: 'cantidad', label: 'Cantidad', align: 'right'},
            {key: 'tipo', label: 'Tipo', align: 'right'},
            {key: 'genero', label: 'Genero', align: 'right'},
            {key: 'talla', label: 'Talla', align: 'right'}
        ],     
            productos, {
              border: null,
                width: "fill_body",
                striped: true,
                //border : {size: 0.1, color: '#0000'},
                stripedColors: ["#ffffff", "#deeff3"],
                headColor : "#FFFFFF",
                headFont : "Helvetica-Bold",
                headBackground : "#464646",
                cellsPadding: 10,
                marginLeft: 0,
                marginRight: 5,
                headAlign: 'center'
            
            });
            console.log("después del table ");
     doc.render();
     console.log("después del render");
    
  
// enviar los datos al archivo path+nombre de archivo en public\archivos
  
        
    doc.pipe(fs.createWriteStream(url+ `${filename}` ));
    console.log("después del pipe");
    doc.end();



    console.log("después del doc end y del finish");
 

     const readStream = fs.createReadStream(url+ `${filename}`, {highWaterMark: 16});
    const data = [];
    
  
    console.log(" antes del read stream name " ,  url+ `${filename}`);

    readStream.on('data', (chunk) => {
        data.push(chunk);
        console.log('data :', chunk, chunk.length);
        // data : <Buffer 49 20 61 6d 20 74 72 61 6e 73 66 65 72 72 69 6e> 16
        // data : <Buffer 67 20 69 6e 20 62 79 74 65 73 20 62 79 20 62 79> 16
        // data : <Buffer 74 65 73 20 63 61 6c 6c 65 64 20 63 68 75 6e 6b> 16
    });
readStream.on('end', () => {
       console.log('end :', Buffer.concat(data).toString());
      
  


   const datos = Buffer.concat(data).toString('base64');
   
        // end : I am transferring in bytes by bytes called chunk


 console.log(" datos dentro >>>>>>>>>>>>>>>>>> \n" , datos);

 // Borrando Archivo
   fs.unlink(url+ `${filename}`, function (err) {
     if (err) //res.status(404).send(" No eliminada");
 console.log("Problema al aliminar archivo temporal ");
    }); 

 return res.status(200).send({ success: true, payload: datos  });

    
    });

 readStream.on('error', (err) => {
        console.log('error :', err)
    });
 
    }
    catch(e){
       return res.status(404).send("Pedido No encontrado en catch");
    } 
}

module.exports = pedidoCtrl;