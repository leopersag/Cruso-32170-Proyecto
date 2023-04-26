const { Router } = require ('express');
const productRouterMongoDB = Router();
const productoController = require('../controllers/productsMongoDB.controller')

productRouterMongoDB.get('/', productoController.getAllProducts);

productRouterMongoDB.get('/:id', productoController.getByIdProducts);

productRouterMongoDB.get('/category/:category', productoController.getByCategoryProducts);

productRouterMongoDB.post('/', productoController.saveProducts);

productRouterMongoDB.delete('/:id', productoController.deleteByIdProducts);

productRouterMongoDB.put('/:id', productoController.updateProducts);

module.exports = productRouterMongoDB;