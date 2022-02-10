const express = require('express');
const router = express.Router();
var VerifyToken  = require('../includes/verifyToken');
var VerifyTokenAdmin  = require('../includes/verifyTokenAdmin');
const pedidoCtrl = require('../controllers/pedido.controller');
//var uploadArchivos = require('../includes/uploadArchivos');

router.get('/list', VerifyToken, pedidoCtrl.getPedidos);
router.get('/sublimado', VerifyToken, pedidoCtrl.getPedidosParaSublimado);
router.get('/:id', VerifyToken, pedidoCtrl.getPedido);
router.post('/', VerifyToken, pedidoCtrl.createPedido);
router.put('/:id', VerifyTokenAdmin, pedidoCtrl.editPedido);
router.delete('/:id', VerifyTokenAdmin, pedidoCtrl.deletePedido);
router.put('/confirmar/:id', VerifyTokenAdmin, pedidoCtrl.confirmarPedido);
router.get('/usuario/list', VerifyToken, pedidoCtrl.getPedidosUsuario);
router.get('/pdf/:id', VerifyToken, pedidoCtrl.getPedidoPdf);
module.exports = router;