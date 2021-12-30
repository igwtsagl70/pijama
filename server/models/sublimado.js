const mongoose = require('mongoose');
const { Schema } = mongoose;

const SublimadoSchema = new Schema({
    fecha: { type: Date, required: false },
    folio: { type: Number, required: false },
    nPiezas: { type: Number, required: true },
    nModelos: { type: Number, required: true },
    estado: { type: String, required: true }, //1 capturado, 2 cancelado, 3 confirmado, 4 terminado
    sublimadoModelo: [{
        _id: String,
        producto_id: String,
        modelo: String,
        pantalonHG: Number,
        pantalonHM: Number, 
        pantalonMXL: Number, 
        pantalonMU: Number, 
        pantalonN: Number, 
        shortH: Number, 
        shortM: Number, 
        shortN: Number,
        camison: Number,
        playeraHG: Number,
        playeraHM: Number,
        playeraMXL: Number,
        playeraMU: Number,
        playeraN4: Number,
        playeraN8: Number,
        playeraN12: Number,
    }],
    pedidos: [{
        _id: String,
        folio: Number
    }],
});

module.exports = mongoose.model('Sublimado', SublimadoSchema);