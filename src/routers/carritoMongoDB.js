const { Router } = require ('express');
const carritoRouterMongoDB = Router();
const carritoController = require('../controllers/carritoMongoDB.controller');

carritoRouterMongoDB.post('/', carritoController.saveCarrito);

carritoRouterMongoDB.delete('/:id', carritoController.deleteByIdCarrito);

carritoRouterMongoDB.get('/:id/productos', carritoController.getByIdCarrito);

carritoRouterMongoDB.get('/', carritoController.getAllCarrito);

carritoRouterMongoDB.post('/:id/productos', carritoController.addProductByIdCarrito);

carritoRouterMongoDB.delete('/:id/productos/:id_prod', carritoController.delProductFromCartCarrito);

module.exports = carritoRouterMongoDB;