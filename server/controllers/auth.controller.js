const authCtrl = {};
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const configJwt = require('../config/config');
const sendGrid = require('../utils/sendGrid');

authCtrl.getUsuarios = async (req, res) => {
    try{
        const usuarios = await Usuario.find();
        res.json(usuarios);
    }
    catch(e){
        res.status(404).send("Sin conexion");
    } 
}

authCtrl.register = async (req, res) => {
    //Validar existencia usuario 
    var fUsuario = await Usuario.findOne({ user: req.body.email, estado: '1' });
    if (fUsuario) return res.status(404).send('Ya existe usuario con ese nombre.');

    var hashedPassword = req.body.password;
    Usuario.create({
        user: req.body.email,
        pass: hashedPassword,
        nombre: 'Chava',
        rfc: '',
        domicilio: 'Lichita 777',
        tipo: 'user',
        estado: '1'
    }).then(r => {
        try{
        var token = jwt.sign({ id: r._id, tipo: r.tipo, user: r.user }, configJwt.secret_jwt, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.status(200).send({ auth: true, token: token });}
      catch(e){
        res.status(404).send("Token No creado");

      }
    }).catch(e => {
        res.status(404).send("Usuario No creado email" + req.body.email + " password " + req.body.password + " error " + e);
    })
}

authCtrl.getIdentityUser = async(req, res) => {
    try{
        var token = req.headers['x-access-token'];
        if (!token) return res.status(401).send('Sin autorizacion.');
    
        jwt.verify(token, configJwt.secret_jwt, function(err, decoded) {
          if (err) return res.status(500).send('Token invalido.');
          
          res.status(200).send({ success: true, payload: decoded });
        });
    }
    catch(e){
        return res.status(404).send("No se pudo procesar el token");
    }
}

authCtrl.login = async(req, res) => {
	try{
        var fUsuario = await Usuario.findOne({ user: req.body.NameUser, estado: '1' });
        if (!fUsuario) return res.status(404).send('Usuario no encontrado.');
        
        var hashedPassword = req.body.PasswordHash;
        if(fUsuario.pass != hashedPassword) return res.status(400).send('Contraseña incorrecta.');

        var token = jwt.sign({ userId: fUsuario.id, tipo: fUsuario.tipo, user: fUsuario.user }, configJwt.secret_jwt, {
            expiresIn: 86400 // expires in 24 hours
        });
    
        const s = new Person();
        s.id = fUsuario.id;
        s.correo = fUsuario.user;
        s.token = token;
    
        res.status(200).send({ success: true, payload: s });
    }
    catch(e){
        res.status(404).send("Usuario No creado");
    }    
}

function Person() {
    this.id = '';
    this.correo = '';
    this.token = '';
}

authCtrl.logout = (req, res) => {    
  res.status(200).send({ auth: false, token: null });
}

authCtrl.resetPass = async (req, res) => { 
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

module.exports = authCtrl;