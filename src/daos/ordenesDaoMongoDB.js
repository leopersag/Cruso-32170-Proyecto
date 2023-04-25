const mongoose = require('mongoose');

const ordenesSchema = new mongoose.Schema({
    items: {type: Array, required: true},
    orderNumber: {type: Number, required: true},
    timeStamp: {type: Date, required: true},
    estado: {type: String, required: true},
    email: {type: String, required: true}
});

const OrdenesDAO = mongoose.model('ordenes',ordenesSchema);

module.exports = OrdenesDAO