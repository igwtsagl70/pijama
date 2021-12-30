const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductoSchema = new Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: false },
    nPiezas: { type: Number, required: true },
    descuento: { type: Number, required: true },
    mayoreo: { type: Number, required: false },
    menudeo: { type: Number, required: true },
    tInfantil: { type: Boolean, required: true },
    tDama: { type: Boolean, required: true },
    tCaballero: { type: Boolean, required: true },
    imagenes: [{
        _id: String,
        nombre: String,
        url: String     
    }],
    estado: { type: String, required: true }
});

module.exports = mongoose.model('Producto', ProductoSchema);