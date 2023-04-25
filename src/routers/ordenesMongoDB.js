const { Router } = require ('express');
const ordenesRouterMongoDB = Router();
const ordenesController = require('../controllers/ordenesMongoDB.controller');

ordenesRouterMongoDB.post('/', ordenesController.saveOrden);

ordenesRouterMongoDB.delete('/:id', ordenesController.deleteByIdOrden);

ordenesRouterMongoDB.get('/:id/productos', ordenesController.getByIdOrden);

ordenesRouterMongoDB.get('/', ordenesController.getAllOrden);

ordenesRouterMongoDB.post('/:id/productos', ordenesController.addProductByIdOrden);

ordenesRouterMongoDB.delete('/:id/productos/:id_prod', ordenesController.delProductFromCartOrden);

module.exports = ordenesRouterMongoDB;