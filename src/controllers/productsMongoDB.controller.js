const Contenedor = require('../models/ProductContenedorMongoDB');
const productContenedorMongoDB = new Contenedor();

exports.getAllProducts = async (req, res) => {
    const productList = await productContenedorMongoDB.getAll();
    res.json(productList);
};

exports.getByIdProducts = async (req, res) => {
    const productList = await productContenedorMongoDB.getById(req.params.id);
    res.json(productList);
};

exports.saveProducts = async (req, res) => {
    const productId = await productContenedorMongoDB.save(req.body);
    res.json(productId);
};

exports.deleteByIdProducts = async (req, res) => {
    const productId = await productContenedorMongoDB.deleteById(req.params.id);    
    res.json(productId);
};

exports.updateProducts = async (req, res) => {
    const productId = await productContenedorMongoDB.update(req.params.id, req.body);    
    res.json(productId);
};