const express = require('express');
const router = express.Router();
var VerifyToken  = require('../includes/verifyToken');
var VerifyTokenAdmin  = require('../includes/verifyTokenAdmin');
var uploadFile = require('../includes/handleFile');
const productoCtrl = require('../controllers/producto.controller');
var uploadMultipleFileImagen = require('../includes/handleMultipleFileCuota');

router.get('/list', VerifyToken, productoCtrl.getProductos);
router.get('/:id', VerifyToken, productoCtrl.getProducto);
router.post('/', VerifyTokenAdmin, productoCtrl.createProducto);
router.put('/:id', VerifyTokenAdmin, productoCtrl.editProducto);
router.delete('/:id', VerifyTokenAdmin, productoCtrl.deleteProducto);
router.post('/imagen/eliminar', VerifyTokenAdmin, productoCtrl.eliminarImagen);
router.post('/imagen', uploadMultipleFileImagen.array('files', 5), productoCtrl.agregarImagen);

module.exports = router;