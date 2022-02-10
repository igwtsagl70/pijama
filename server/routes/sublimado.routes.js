const express = require('express');
const router = express.Router();
var VerifyToken  = require('../includes/verifyToken');
var VerifyTokenAdmin  = require('../includes/verifyTokenAdmin');
const sublimadoCtrl = require('../controllers/sublimado.controller');

router.get('/list', VerifyToken, sublimadoCtrl.getSublimados);
router.get('/:id', VerifyToken, sublimadoCtrl.getSublimado);
router.post('/', VerifyToken, sublimadoCtrl.createSublimado);
router.put('/:id', VerifyToken, sublimadoCtrl.editSublimado);
router.put('/confirmar/terminar/:id', VerifyToken, sublimadoCtrl.confirmarTerminarSublimado);
router.delete('/cancelar/:id', VerifyToken, sublimadoCtrl.cancelarSublimado);
router.get('/pdf/:id', VerifyToken, sublimadoCtrl.obtenerSublimadoPdf);
router.get('/playera/pdf/:id', VerifyToken, sublimadoCtrl.obtenerSublimadoPlayeraPdf);


module.exports = router;