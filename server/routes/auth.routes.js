const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

router.post('/registro', authCtrl.register);
router.post('/getIdentityUser', authCtrl.getIdentityUser);
router.post('/login', authCtrl.login);
router.get('/logout', authCtrl.logout);
router.post('/reset', authCtrl.resetPass);

module.exports = router;