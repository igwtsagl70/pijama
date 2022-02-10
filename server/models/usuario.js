const mongoose = require('mongoose');
const { Schema} = mongoose;

const UsuarioSchema = new Schema({
    user: { type: String, required: true },
    pass: { type: String, required: true },
    nombre: { type: String, required: false },
    rfc: { type: String, required: false },
    domicilio: { type: String, required: false },
    tipo: { type: String, required: false },
    estado: { type: String, required: false },
});

module.exports = mongoose.model('Usuario', UsuarioSchema);