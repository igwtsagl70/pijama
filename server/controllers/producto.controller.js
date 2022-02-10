const Producto = require('../models/producto');
const bcrypt = require('bcryptjs');
const productoCtrl = {};
const fs = require('fs');
const xlsx = require('xlsx');

productoCtrl.createProducto = async (req, res) => {
	try{
        const producto = new Producto();
        producto.nombre = req.body.nombre;
        producto.descripcion = req.body.descripcion;
        producto.descuento = 0;
        producto.nPiezas = req.body.nPiezas;
        producto.mayoreo = req.body.mayoreo;
        producto.menudeo = req.body.menudeo;
        producto.tInfantil = true;
        producto.tDama = true;
        producto.tCaballero = true;
        producto.estado = '1';
    
        var rProducto = await producto.save();    
        if (!rProducto) return res.status(404).send('Producto no creado 1.');

        res.status(200).send({ success: true, payload: rProducto._id });
    }
    catch(e){
        res.status(404).send("Producto no creado");
    }
}

productoCtrl.getProductos = async(req, res) => {
	try{
        var palabra = req.query.palabra;
        var page = Number(req.query.page);
        var orden = req.query.orden;
        var rproductos;

        if(palabra != ""){
            rproductos = await Producto.find({
                $and: [
                    { nombre: {$regex: palabra, $options: 'i'}, estado: '1'},
                    { }
                ]}
                )
            .select('nombre descuento mayoreo menudeo imagenes')
            .limit(25)
            .skip(25 * page)
            .sort(orden);
        }else{
            rproductos = await Producto.find({ estado: '1'})
            .select('nombre descuento mayoreo menudeo imagenes')
            .limit(25)
            .skip(25 * page)
            .sort(orden);
        }

        if (!rproductos) return res.status(404).send('Productos no encontrados.');
        res.status(200).send({ success: true, payload: rproductos });
    }
    catch(e){
        res.status(404).send("Problemas de conexion");
    }
}

productoCtrl.getProducto = async (req, res) => {
	try{
        const rProducto = await Producto.findById(req.params.id,{ estado: 0, __v: 0 });
        if (!rProducto) return res.status(404).send('Producto no encontrado.');
        res.status(200).send({ success: true, payload: rProducto });
    }
    catch(e){
        res.status(404).send("Producto No encontrado");
    } 
}

productoCtrl.editProducto = async (req, res) => {
	try{
        const { id } = req.params;
        const producto = {
            descripcion: req.body.descripcion,
            nombre: req.body.nombre,
            mayoreo: req.body.mayoreo,
            menudeo: req.body.menudeo
        };
    console.log(" nombre " + req.body.nombre);
        var rProducto = await Producto.findByIdAndUpdate(id, {$set: producto}, {new : true});
        if (!rProducto) return res.status(404).send('Producto no actualizado.');
        res.status(200).send({ success: true, payload: rProducto._id });
    }
    catch(e){
        res.status(404).send("Producto No actualizada");
    }
}

productoCtrl.deleteProducto = async (req, res) => {
	try{
        const { id } = req.params;
        console.log("req.body.estado");
        const producto = {
            estado: req.body.estado
        };
    
        var rProducto = await Producto.findByIdAndUpdate(id, {$set: producto}, {new : true});
        if (!rProducto) return res.status(404).send('Producto no actualizado.');
        res.status(200).send({ success: true, payload: rProducto._id });
    }
    catch(e){
        res.status(404).send("Producto No eliminada");
    }
}

productoCtrl.agregarImagen = async (req, res) => {
	try{        
        const rProducto = await Producto.findById(req.body.producto);
        if (!rProducto) return res.status(404).send('Producto no encontrado.');
        
        if(rProducto.imagenes == null || rProducto.imagenes.length == 0) rProducto.imagenes = new Array();
        var archivos = req.files;
        
        console.log("produto");
        for(let i = 0; i < archivos.length; i++){ 
            
        console.log("produto2");       
            //Set archivo
            const archivo = {};
            archivo._id = archivos[i].filename;
            archivo.nombre = archivos[i].originalname;
            const url = archivos[i].path.replace(/\\/g,'/');
            archivo.url = 'api/' + url;
            console.log(archivo.url);
            rProducto.imagenes.push(archivo);
        }
        console.log("p3");
        var sCuota = await rProducto.save();    
        if (!sCuota) return res.status(404).send('Imagen no creada.');
        res.status(200).send({ success: true, payload: sCuota });
    }
    catch(e){
        console.log(e);
        res.status(404).send("Imagen no creada");
    }
}

productoCtrl.eliminarImagen = async (req, res) => {
	try{
        var id = req.body._id;
        var archivo = req.body.archivoId;        
        var url = 'public/uploads/archivos/';
        console.log("  id " +  id + " archivo " + archivo);
        // delete file named 'sample.txt'
        // fs.unlink(url + archivo, function (err) {
        //     if (err) res.status(404).send("Imagen No eliminada");
        // }); 
        const rProd = await Producto.findById(id);
        if (!rProd) return res.status(404).send('Producto no encontrado.');
       var imagenes = new Array()
       for(var i = 0; i < rProd.imagenes.length; i++){
    
             console.log("imagen  id " + rProd.imagenes[i]._id + " archivo " + archivo)
            if (rProd.imagenes[i]._id != archivo)
             {
                const file = {};
                file._id = rProd.imagenes[i]._id;
                file.nombre = rProd.imagenes[i].nombre;
                file.url = rProd.imagenes[i].url;
                imagenes.push(file);
             }else
             {
             console.log("iguales");

             }
         }
       //  imagenes = rProd.imagenes;
        // console.log("  long rprod imagen " +  rProd.imagenes.length);
        // console.log("  long  imagenes " +  imagenes.length);
       
  
         rProd.imagenes = new Array();
         for(var i = 0; i < imagenes.length; i++){
    
            console.log("imagen 2 id " + imagenes[i]._id + " archivo  2 " + archivo)
          
               const file = {};
               file._id = imagenes[i]._id;
               file.nombre = imagenes[i].nombre;
               file.url = imagenes[i].url;
               rProd.imagenes.push(file);
            
        }
        
        // rProd.imagenes = imgs;
        console.log("  long rprod imagen 2 " +  rProd.imagenes.length);
        console.log("  long  imagenes 2 " +  imagenes.length);
        var rProducto = rProd.save();
        if (!rProducto) return res.status(404).send('Imagen no eliminada después de save.');
        res.status(200).send({ success: true, payload: "ok" });
    }
    catch(e){
        res.status(404).send("Imagen no eliminada en catch");
    }
}


module.exports = productoCtrl;