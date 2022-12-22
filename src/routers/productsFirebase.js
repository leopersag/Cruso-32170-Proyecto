const { Router } = require ('express');
const productRouterFirebase = Router();

//Se importa ProductContenedorFirebase para utilizar la clase 'Contenedor'
const Contenedor = require('../models/ProductContenedorFirebase');
const productContenedorFirebase = new Contenedor();

productRouterFirebase.get('/', async (req, res) => {
    const productList = await productContenedorFirebase.getAll();
    res.json(productList);
});

productRouterFirebase.get('/:id', async (req, res) => {
    const productList = await productContenedorFirebase.getById(req.params.id);
    res.json(productList);
});

productRouterFirebase.post('/', async (req, res) => {
    const productId = await productContenedorFirebase.save(req.body);
    res.json(productId);
});

productRouterFirebase.delete('/:id', async (req, res) => {
    const productId = await productContenedorFirebase.deleteById(req.params.id);    
    res.json(productId);
});

productRouterFirebase.put('/:id', async (req, res) => {
    const productId = await productContenedorFirebase.update(req.params.id, req.body);    
    res.json(productId);
});

module.exports = productRouterFirebase;