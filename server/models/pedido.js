const mongoose = require('mongoose');
const { Schema } = mongoose;

const PedidoSchema = new Schema({
    fecha: { type: Date, required: false },
    folio: { type: Number, required: false },
    user: { type: String, required: true },
    nPiezas: { type: Number, required: true },
    nModelos: { type: Number, required: true },
    cantidad: { type: Number, required: true },
    descuento: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    nota: { type: String, required: false },
    esMayoreo: { type: Boolean, required: true },
    sublimado: { type: Boolean, required: true },
    estado: { type: String, required: true }, //1 capturado, 2 cancelado, 3 confirmado, 4 terminado
    pedidoProductos: [{
        producto_id: String,
        nombre: String,
        descuento: Number,
        mayoreo: Number,
        menudeo: Number,
        nPiezas: Number,
        cantidad: Number,
        tipo: String,
        genero: String,
        talla: String,
        pedidoProductoPiezas: [{
            descripcion: String
        }],
    }],
});

module.exports = mongoose.model('Pedido', PedidoSchema);