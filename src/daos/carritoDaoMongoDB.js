const mongoose = require('mongoose');

const carritoSchema = new mongoose.Schema({
    productos: {type: Array, required: true},
    timestamp: {type: Date, required: true},
});

const CarritosDAO = mongoose.model('carritos',carritoSchema);

module.exports = CarritosDAO