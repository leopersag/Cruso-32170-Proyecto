const Contenedor = require('../models/MensajesContenedorMongoDB');
const mensajesContenedorMongoDB = new Contenedor();

exports.getAllMensajes = async (req, res) => {
    const productList = await mensajesContenedorMongoDB.getAll();
    res.json(productList);
};

exports.saveMensajes = async (req, res) => {
    const productId = await mensajesContenedorMongoDB.save(req.body);
    res.json(productId);
};

exports.getByCategoryMensajes = async (req, res) => {
    const productList = await mensajesContenedorMongoDB.getByCategory(req.params.category);
    const carrito = await carritoContenedorMongoDB.getById(req.user);
    if (productList == []){
        productList = {error: "Carrito no encontrado"}
    };
    res.render('pages/index',
        {
            user: req.user,
            lista: productList,
            carritoId: carrito._id,
        }
    );
};

exports.getByIdMensajes = async (req, res) => {
    const productList = await mensajesContenedorMongoDB.getById(req.params.id);
    const carrito = await carritoContenedorMongoDB.getById(req.user);
    res.render('pages/index',
        {
            user: req.user,
            lista: productList,
            carritoId: carrito._id,
        }
    );
};

exports.deleteByIdMensajes = async (req, res) => {
    const productId = await mensajesContenedorMongoDB.deleteById(req.params.id);    
    res.json(productId);
};

exports.updateMensajes = async (req, res) => {
    const productId = await mensajesContenedorMongoDB.update(req.params.id, req.body);    
    res.json(productId);
};