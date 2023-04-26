const mongoose = require('mongoose');

const mensajeSchema = new mongoose.Schema({
    contador: {type: Number, required: true},
    email: {type: String, required: true},
    tipo: {type: String, required: true},
    timestamp: {type: String, required: true},
    mensaje: {type: String, required: true},
});

const MensajeDAO = mongoose.model('messages',mensajeSchema);

module.exports = MensajeDAO;