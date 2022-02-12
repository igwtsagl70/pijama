const Sublimado = require('../models/sublimado');
const Pedido = require('../models/pedido');
const bcrypt = require('bcryptjs');
const sublimadoCtrl = {};
const fs = require('fs');
const xlsx = require('xlsx');
const PDF = require('pdfkit-construct');

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

sublimadoCtrl.editSublimado = async (req, res) => {
	try{

        //Encuentra sublimado a editar
        var rSublimado = await Sublimado.findById(req.params._id);  
        if (!rSublimado)   return res.status(404).send('Sublimado no cencontrado en edición.');
         var sublim = rSublimado;
        //Eliminamos el esatado de los pedidos relacionados previos
        for(var i = 0; i < sublim.pedidos.length; i++){
            console.log("edicion sublimado pedido id: " + sublim.pedidos[i]._id);
            const pedido = { sublimado: true};
            var rPedido = await Pedido.findByIdAndUpdate(sublim.pedidos[i]._id, {$set: pedido}, {new : true});                      
        }
        //Edita sublimvarado
        const sublimado = new Sublimado();
        sublimado.fecha = req.body.fecha;
        sublimado.folio = nFolio;
        sublimado.nPiezas = req.body.nPiezas;
        sublimado.nModelos = req.body.nModelos;
    
        
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
    
     
        //Aqui se modifican los pedidos a estado sublimado
        for(var i = 0; i < sublimado.pedidos.length; i++){
            const pedido = { sublimado: true};
            var rPedido = await Pedido.findByIdAndUpdate(sublimado.pedidos[i]._id, {$set: pedido}, {new : true});                      
        }

    // Se modifican los pedidos y modelos
    rSublimado.sublimadoModelo = sublimado.sublimadoModelo;
    rSublimado.pedidos = sublimado.pedidos;
    var sublimadoRes = rSublimado;

    // Se modifica el sublimado
    var rSublimadoPedidos = await Pedido.findByIdAndUpdate(sublimadoRes._id, {$set: sublimadoRes}, {new : true});  
    if (!rSublimadoPedidos)   return res.status(404).send('Sublimado no se pudo modifcar para edición.');

        //Se envia respuesta
        res.status(200).send({ success: true, payload: rSublimado._id });
    }
    catch(e){
        console.log(e);
        res.status(404).send("Sublimado no creado");
    }
}

sublimadoCtrl.getSublimadoPedidos = async(req, res) => {
	try{
        var id = req.params.id;
        var rSublimado;
     

        console.log("id edicion pedidos sublimado" + id);
            rSublimado =  await Sublimado.findById(id);
            if (!rSublimado) return res.status(404).send('Sublimado no encontrado');
         
          
             var sublimado = rSublimado;
        
        
               res.status(200).send({ success: true, payload: sublimado });
    }
    catch(e){
        res.status(404).send("Problemas de conexión en obtener pedidos para sublimado");
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
                    { user: {$regex: palabra, $options: 'i'}, $or: [{estado:  '1'}, {estado: '3' }, {estado: '4' }], fecha: { $gte: fInicial, $lte: fFinal }},
                    { }
                ]}
                )
            .select('fecha folio nPiezas nModelos estado pedidos')
            .limit(25)
            .skip(25 * page)
            .sort('folio');
        }else{
            rsublimados = await Sublimado.find({ $or: [{estado:  '1'}, {estado: '3' }, {estado: '4' }], fecha: { $gte: fInicial, $lte: fFinal }})
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
        res.status(404).send("Sublimado No encontrado en get");
    } 
}

sublimadoCtrl.confirmarTerminarSublimado = async (req, res) => {
    // alert("estado " + req.body.estado);
     try{
         const { id } = req.params;
         const sublimado = {
             estado: req.body.estado
         };
     
         var rSublimado = await Sublimado.findByIdAndUpdate(id, {$set: sublimado}, {new : true});
         if (!rSublimado) return res.status(404).send('Sublimado actualizado.');
         
         res.status(200).send({ success: true, payload: rSublimado._id });
     }
     catch(e){
         res.status(404).send("Sublimado No cambio de estado");
     }
 }

 sublimadoCtrl.cancelarSublimado = async (req, res) => {
    // alert("estado " + req.body.estado);
     try{
         const { id } = req.params;
         const sublimado = {
             estado: "2",
             
         }
         var rSublimadoPedidos = await Sublimado.findById(id);
         if (!rSublimadoPedidos) return res.status(404).send('Sublimado no encontrado en cancelación.');

           //Aqui se modifican los pedidos a estado no sublimado al cancelar
          
       for(var i = 0; i < rSublimadoPedidos.pedidos.length; i++){
        console.log("i " + i);  
          const pedido = { sublimado: false};
           var rPedido = await Pedido.findByIdAndUpdate(rSublimadoPedidos.pedidos[i]._id, {$set: pedido}, {new : true}); 
           if (!rPedido) return res.status(404).send('Problema al hacer update sobre el pedido.');
       }   

      
           rSublimadoPedidos.estado = sublimado.estado;

           var rSublimado = await Sublimado.findByIdAndUpdate(id, {$set: sublimado}, {new : true});
         
         if (!rSublimado) return res.status(404).send('Sublimado actualizado.');
var respuesta =   rSublimado.id;
         res.status(200).send({ success: true, payload: respuesta});
     }
     catch(e){
         res.status(404).send("Sublimado No cambio de estado");
     }
 }


 // PDFs
 sublimadoCtrl.obtenerSublimadoPdf = async (req, res) => {

    

	try{
        
        var id = req.params.id;
     

        var url = './public/archivos/';
 
        console.log(" entrando  id " +  id + " url " + url);
       
    //Encuentra sublimado a editar
   var rSublimado = await Sublimado.findById(id);  
   if (!rSublimado)   return res.status(404).send('Sublimado no cencontrado en pdf.');
  
console.log("antes del doc");
    var doc = new PDF({
        size: 'Letter',
      margins: {top: 20, left: 10, right: 10, bottom: 20},
      layout: 'landscape',
        bufferPages: true,
    });
        
     const filename = `SublimadoLichita${Date.now()}.pdf`;
   
     
             
     console.log("antes del objeto fecha sublimado " + rSublimado.fecha );
 
   //Edita sublimvarado
   var sublimado = new Sublimado();
   sublimado.fecha = rSublimado.fecha;
   sublimado.folio = rSublimado.folio;
   sublimado.nPiezas = rSublimado.nPiezas;
   sublimado.nModelos = rSublimado.nModelos;

   console.log("antes del array sublimado de longitud " +  rSublimado.sublimadoModelo.length);
   //Crear productorSublimados
   sublimado.sublimadoModelo = new Array();
   var productos = new Array();
   for(var i = 0; i < rSublimado.sublimadoModelo.length; i++ ){
       //short
       var p = rSublimado.sublimadoModelo[i];

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

       console.log("adentro for array  " + p.pantalonN);
       //Crear productorSublimados
   //Agregar
   productos.push(nProducto);
    
};



console.log("después del array sublimado PRODUCTOS longitud " + productos.length);


    console.log("después del recorrimiento de productos");
   //doc.pipe(file);

doc.setDocumentHeader({

}, () => {


      doc.fontSize(12)
        .text("Detalle de sublimado : Pantalón", {
align: 'center'
        });

        doc.fontSize(10);
        doc.text("Fecha: " + sublimado.fecha.toLocaleDateString(), {
            align: 'left'
                    });
        doc.text("Folio: " + sublimado.folio, {
    align: 'left'
            });

doc.text("Numero de piezas: " + sublimado.nPiezas, {
    align: 'left'
            });
doc.text("Número de modelos: " + sublimado.nModelos, {
                align: 'left'
                        });
});


    doc.addTable(
        [
            
              

   
            {key: 'modelo', label: 'Nombre', align: 'center'},
             {key: 'pantalonHG', label: 'Grande\nHombre', align: 'center'},
            {key: 'pantalonHM', label: 'Mediano\nHombre', align: 'center'},
            {key: 'pantalonMXL', label: 'XL\nMujer', align: 'center'},
            {key: 'pantalonMU', label: 'MU\nMujer', align: 'center'},
            {key: 'pantalonN', label: '\nNiño', align: 'center'},
            {key: 'shortH', label: 'Short\nHombre', align: 'center'},
            {key: 'shortM', label: 'Short\nMujer', align: 'center'},
            {key: 'shortN', label: 'Short\nNiño', align: 'center'},
            {key: 'camison', label: 'Camisón', align: 'center'}
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
                marginRight: 0,
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
       return res.status(404).send("sublimado No encontrado en pdf pantalón");
    } 
}


sublimadoCtrl.obtenerSublimadoPlayeraPdf = async (req, res) => {

    

	try{
        
        var id = req.params.id;
  

        var url = './public/archivos/';
 
        console.log(" entrando  id " +  id + " url " + url );
       
    //Encuentra sublimado a editar
   var rSublimado = await Sublimado.findById(id);  
   if (!rSublimado)   return res.status(404).send('Sublimado no cencontrado en pdf.');
  
console.log("antes del doc");
    var doc = new PDF({
        size: 'Letter',
      margins: {top: 20, left: 10, right: 10, bottom: 20},
      layout: 'landscape',
        bufferPages: true,
    });
        
     const filename = `SublimadoLichita${Date.now()}.pdf`;
   
     
             
     console.log("antes del objeto fecha sublimado " + rSublimado.fecha );
 
   //Edita sublimvarado
   var sublimado = new Sublimado();
   sublimado.fecha = rSublimado.fecha;
   sublimado.folio = rSublimado.folio;
   sublimado.nPiezas = rSublimado.nPiezas;
   sublimado.nModelos = rSublimado.nModelos;

   console.log("antes del array sublimado de longitud " +  rSublimado.sublimadoModelo.length);
   //Crear productorSublimados
   sublimado.sublimadoModelo = new Array();
   var productos = new Array();
   for(var i = 0; i < rSublimado.sublimadoModelo.length; i++ ){
       //short
       var p = rSublimado.sublimadoModelo[i];

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

       console.log("adentro for array  " + p.pantalonN);
       //Crear productorSublimados
   //Agregar
   productos.push(nProducto);
    
};


console.log("después del array sublimado PRODUCTOS longitud " + productos.length);


    console.log("después del recorrimiento de productos");
   //doc.pipe(file);
  
doc.setDocumentHeader({

}, () => {


      doc.fontSize(12)
        .text("Detalle de sublimado : Playera", {
align: 'center'
        });

        doc.fontSize(10);
        doc.text("Fecha: " + sublimado.fecha.toLocaleDateString(), {
            align: 'left'
                    });
        doc.text("Folio: " + sublimado.folio, {
    align: 'left'
            });

doc.text("Numero de piezas: " + sublimado.nPiezas, {
    align: 'left'
            });
doc.text("Número de modelos: " + sublimado.nModelos, {
                align: 'left'
                        });
});


               doc.addTable(
                    [
                        {key: 'modelo', label: 'Nombre', align: 'center'},
                        {key: 'playeraHG', label: 'Grande\nHombre', align: 'center'},
                         {key: 'playeraHM', label: 'Mediano\nHombre', align: 'center'},
                         {key: 'playeraMXL', label: 'XL Mujer', align: 'center'},
                        {key: 'playeraMU', label: 'MU\nMujer', align: 'center'},
                        {key: 'playeraN12', label: 'Niño 12', align: 'center'},
                        {key: 'playeraN8', label: 'Niño 8', align: 'center'},
                        {key: 'playeraN4', label: 'Niño 4', align: 'center'}
                       
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
                            marginRight: 0,
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
       return res.status(404).send("sublimado No encontrado en pdf playera");
    } 
}

module.exports = sublimadoCtrl; 