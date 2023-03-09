const Contenedor = require('../models/CarritoContenedorMongoDB');
const CarritoContenedorMongoDB = new Contenedor ();

exports.saveCarrito =  async (req,res) => {
    let carrito = {...req.body};
    let newCarrito = await CarritoContenedorMongoDB.save(carrito);
    res.json(newCarrito);
    console.log('Id del carrito creado:',newCarrito._id);
};

exports.deleteByIdCarrito = async (request,response) => {
    console.log('Borrar el carrito', request.params.id);
    response.json(await CarritoContenedorMongoDB.deleteById(request.params.id));
};

exports.getByIdCarrito = async (req,res) => {
    console.log('Get del carrito '+ req.params.id);
    res.json(await CarritoContenedorMongoDB.getById(req.params.id));
};

exports.getAllCarrito = async (req, res) => {
    console.log('GET de todos los carritos');
    res.json(await CarritoContenedorMongoDB.getAll());
};

exports.addProductByIdCarrito = async (req,res) => {
    console.log('Se agregan productos al carrito',req.params.id);
    res.json(await CarritoContenedorMongoDB.addProductById(req.params.id,req.body));
};

exports.delProductFromCartCarrito = async (req,res) => {
    console.log("Se borra un producto de carrito");
    res.json(await CarritoContenedorMongoDB.delProductFromCarrt(req.params.id,req.params.id_prod));
};