const path = require('path');
const uuidv4 = require('uuid/v4')
const multer = require('multer');
var dir = './public/uploads/archivos/';
var jwt = require('jsonwebtoken');
var config = require('../config/config');

//Storage
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            var token = req.headers['x-access-token'];
            if (!token)
                return res.status(403).send('Sin token.');

            jwt.verify(token, config.secret_jwt, function (err, decoded) {
                if (err)
                    return res.status(500).send('Token no autorizado.');

                req.userId = decoded.id;
            });
        }
        catch (e) {
            return false;
        }
        cb(null, dir)
    },
    filename: (req, file, cb) => {
        var uuid = uuidv4();
        cb(null, uuid + path.extname(file.originalname))
    }
});

//will be using this for uplading
const uploadArchivos = multer({ storage: storage });

module.exports = uploadArchivos;