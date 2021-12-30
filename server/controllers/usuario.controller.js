const Usuario = require('../models/usuario');
// const Config = require('../models/config');
// const Mensaje = require('../models/mensaje');
const bcrypt = require('bcryptjs');
const sendGrid = require('../utils/sendGrid');
const usuarioCtrl = {};
const fs = require('fs');
const xlsx = require('xlsx');

usuarioCtrl.getUsuarios = async(req, res) => {
    
}

module.exports = usuarioCtrl;