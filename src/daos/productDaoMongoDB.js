const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    title: {type: String, required: true},
    price: {type: Number, required: true},
    thumbnail: {type: String, required: true},
    Stock: {type: Number, required: true},
    category: {type: String, required: true},
    description: {type: String, required: true}
});

const ProductosDAO = mongoose.model('productos',productoSchema);

module.exports = ProductosDAO;