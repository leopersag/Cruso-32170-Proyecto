const { Router } = require ('express');
const productRouterMongoDB = Router();

//Se importa ProductContenedorMongoDB para utilizar la clase 'Contenedor'
const Contenedor = require('../models/ProductContenedorMongoDB');
const productContenedorMongoDB = new Contenedor();

productRouterMongoDB.get('/', async (req, res) => {
    const productList = await productContenedorMongoDB.getAll();
    res.json(productList);
});

productRouterMongoDB.get('/:id', async (req, res) => {
    const productList = await productContenedorMongoDB.getById(req.params.id);
    res.json(productList);
});

productRouterMongoDB.post('/', async (req, res) => {
    const productId = await productContenedorMongoDB.save(req.body);
    res.json(productId);
});

productRouterMongoDB.delete('/:id', async (req, res) => {
    const productId = await productContenedorMongoDB.deleteById(req.params.id);    
    res.json(productId);
});

productRouterMongoDB.put('/:id', async (req, res) => {
    const productId = await productContenedorMongoDB.update(req.params.id, req.body);    
    res.json(productId);
});

module.exports = productRouterMongoDB;