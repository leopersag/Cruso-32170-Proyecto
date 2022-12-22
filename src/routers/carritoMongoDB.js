const { Router } = require ('express');
const carritoRouterMongoDB = Router();

//Se importa CarritoContenedor para utilizar la clase 'Contenedor'
const Contenedor = require('../models/CarritoContenedorMongoDB');
const CarritoContenedorMongoDB = new Contenedor ();

// Inciso 2.a de la primera entrega del proyecto final
carritoRouterMongoDB.post('/', async (req,res) => {
    let carrito = {...req.body};
    let newCarrito = await CarritoContenedorMongoDB.save(carrito);
    res.json(newCarrito);
    console.log('Id del carrito creado:',newCarrito._id);
});

// Inciso 2.b de la primera entrega del proyecto final
carritoRouterMongoDB.delete('/:id', async (request,response) => {
    console.log('Borrar el carrito', request.params.id);
    response.json(await CarritoContenedorMongoDB.deleteById(request.params.id));
});

// Inciso 2.c de la primera entrega del proyecto final
carritoRouterMongoDB.get('/:id/productos', async (req,res) => {
    console.log('Get del carrito '+ req.params.id);
    res.json(await CarritoContenedorMongoDB.getById(req.params.id));
});

carritoRouterMongoDB.get('/', async (req, res) => {
    console.log('GET de todos los carritos');
    res.json(await CarritoContenedorMongoDB.getAll());
});

// Inciso 2.d de la primera entrega del proyecto final
carritoRouterMongoDB.post('/:id/productos', async (req,res) => {
    console.log('Se agregan productos al carrito',req.params.id);
    res.json(await CarritoContenedorMongoDB.addProductById(req.params.id,req.body));
});

// Incicso 2.e de la primera entrega del proyecto final
carritoRouterMongoDB.delete('/:id/productos/:id_prod', async (req,res) => {
    console.log("Se borra un producto de carrito");
    res.json(await CarritoContenedorMongoDB.delProductFromCarrt(req.params.id,req.params.id_prod));
});

module.exports = carritoRouterMongoDB;