const express = require('express');
const router = express.Router();
var VerifyToken  = require('../includes/verifyToken');
var VerifyTokenAdmin  = require('../includes/verifyTokenAdmin');
const pedidoCtrl = require('../controllers/pedido.controller');

router.get('/list', VerifyToken, pedidoCtrl.getPedidos);
router.get('/sublimar', VerifyToken, pedidoCtrl.getPedidosParaSublimado);
router.get('/:id', VerifyToken, pedidoCtrl.getPedido);
router.post('/', VerifyToken, pedidoCtrl.createPedido);
router.put('/:id', VerifyTokenAdmin, pedidoCtrl.editPedido);
//router.delete('/:id', VerifyTokenAdmin, pedidoCtrl.deletePedido);


module.exports = router;