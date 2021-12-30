const express = require('express');
const router = express.Router();
var VerifyToken  = require('../includes/verifyToken');
var VerifyTokenAdmin  = require('../includes/verifyTokenAdmin');
const sublimadoCtrl = require('../controllers/sublimado.controller');

router.get('/list', VerifyToken, sublimadoCtrl.getSublimados);
router.get('/:id', VerifyToken, sublimadoCtrl.getSublimado);
router.post('/', VerifyToken, sublimadoCtrl.createSublimado);

module.exports = router;