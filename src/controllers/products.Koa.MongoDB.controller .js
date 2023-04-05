const Contenedor = require('../models/ProductContenedorMongoDB');
const productContenedorMongoDB = new Contenedor();

exports.getAllProducts = async ctx => {
    ctx.body = await productContenedorMongoDB.getAll();
    //ctx.response.json(productList);
};

exports.getByIdProducts = async ctx => {
    ctx.body = await productContenedorMongoDB.getById(ctx.params.id);
    //res.json(productList);
};

exports.saveProducts = async ctx => {
    ctx.body = await productContenedorMongoDB.save(ctx.request.body);
    //res.json(productId);
};

exports.deleteByIdProducts = async ctx => {
    ctx.body = await productContenedorMongoDB.deleteById(ctx.params.id);    
    //res.json(productId);
};

exports.updateProducts = async ctx => {
    ctx.body = await productContenedorMongoDB.update(ctx.params.id, ctx.request.body);    
    //res.json(productId);
};