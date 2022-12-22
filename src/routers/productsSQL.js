const { Router } = require ('express');
const mysqlConnection = require('../../database/mysqlConnection');

const productRouterSQL = Router();
const ProductContenedorSQL = require('../models/ProductContenedorSQL');

const productContenedorSQL = new ProductContenedorSQL(mysqlConnection, 'productos');

productRouterSQL.get('/', async (req, res) => {
    const productList = await productContenedorSQL.getAll();
    res.json(productList);
});

productRouterSQL.get('/:id', async (req, res) => {
    const productList = await productContenedorSQL.getById(req.params.id);
    res.json(productList);
});

productRouterSQL.post('/', async (req, res) => {
    const productId = await productContenedorSQL.save(req.body);
    res.json(productId);
});

productRouterSQL.delete('/:id', async (req, res) => {
    await productContenedorSQL.deleteById(req.params.id);    
    res.json(`${req.params.id} eliminado`);
});

productRouterSQL.put('/:id', async (req, res) => {
    await productContenedorSQL.update(req.params.id, req.body);    
    res.json(`${req.params.id} actualizado`);
});

module.exports = productRouterSQL;