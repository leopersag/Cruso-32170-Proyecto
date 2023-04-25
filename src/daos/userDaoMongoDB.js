const mongoose = require('mongoose');

const usuariosSchema = new mongoose.Schema({
    name: {type: String, required: true},
    lastName: {type: String, required: true},
    address: {type: String, required: true},
    countryCode: {type: Number, required: true},
    phone: {type: Number, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
});

const UsuariosDAO = mongoose.model('usuarios',usuariosSchema);

module.exports = UsuariosDAO;