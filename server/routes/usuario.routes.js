const express = require('express');
const router = express.Router();
var VerifyToken  = require('../includes/verifyToken');
var VerifyTokenAdmin  = require('../includes/verifyTokenAdmin');
const usuarioCtrl = require('../controllers/usuario.controller');


router.get('/list', VerifyToken, usuarioCtrl.getUsuarios);
router.delete('/:id', VerifyTokenAdmin,usuarioCtrl.cancelar);
// router.get('/list', VerifyTokenAdmin, usuarioCtrl.getUsuarios);
// router.get('/casa', VerifyTokenAdmin, usuarioCtrl.getUsuariosCasa);
// router.get('/:id', VerifyToken, usuarioCtrl.getUsuario);
// router.post('/', VerifyTokenAdmin,usuarioCtrl.createUsuario);
// router.put('/:id', VerifyTokenAdmin,usuarioCtrl.editUsuario);

// router.post('/estado', VerifyTokenAdmin,usuarioCtrl.cambiarEstadoUsuario);
// router.post('/invitacion', VerifyTokenAdmin,usuarioCtrl.enviarInvitacion);
// router.post('/mensaje', VerifyTokenAdmin,usuarioCtrl.enviarMensaje);
// router.post('/layout', uploadLayout.single('file'), usuarioCtrl.layoutUsuario);

// router.post('/NavBarData', VerifyToken, usuarioCtrl.getUserData);
// router.put('/perfil/:id', VerifyToken, usuarioCtrl.editPerfilUsuario);
// router.get('/perfil/:id', VerifyToken, usuarioCtrl.getPerfilUsuario);
// router.post('/perfilFile/:dir/:id', uploadFile.single('file'), usuarioCtrl.setPerfilImagen);


module.exports = router;