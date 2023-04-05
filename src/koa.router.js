const Router = require('koa-router');
const productoController = require('./controllers/products.Koa.MongoDB.controller ')

const routerKoa = new Router({
    prefix: '/koa'
});

routerKoa.get('/', productoController.getAllProducts);

routerKoa.get('/:id', productoController.getByIdProducts);

routerKoa.post('/', productoController.saveProducts);

routerKoa.delete('/:id', productoController.deleteByIdProducts);

routerKoa.put('/:id', productoController.updateProducts);

module.exports = routerKoa;