const mongoose = require('mongoose');

const carritoSchema = new mongoose.Schema({
    email: {type: String, required: true},
    address: {type: String, required: true},
    productos: {type: Array, required: true},
    timestamp: {type: String, required: true},
});

const CarritosDAO = mongoose.model('carritos',carritoSchema);

module.exports = CarritosDAO