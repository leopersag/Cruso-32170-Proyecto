const Contenedor = require('../models/ProductContenedorMongoDB');
const productContenedorMongoDB = new Contenedor();
const carritoContenedor = require('../models/CarritoContenedorMongoDB');
const carritoContenedorMongoDB = new carritoContenedor();

exports.getAllProducts = async (req, res) => {
    const productList = await productContenedorMongoDB.getAll();
    res.json(productList);
};

exports.getByIdProducts = async (req, res) => {
    const productList = await productContenedorMongoDB.getById(req.params.id);
    const carrito = await carritoContenedorMongoDB.getById(req.user)
    console.log(productList.error == "Producto no encontrado");
    res.render('pages/index',
        {
            user: req.user,
            lista: productList,
            carritoId: carrito._id,
        }
    );
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