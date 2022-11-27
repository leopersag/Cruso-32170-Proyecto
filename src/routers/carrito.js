const { Router } = require ('express');
const carritoRouter = Router();

//Se importa CarritoContenedor para utilizar la clase 'Contenedor'
const Contenedor = require('../models/CarritoContenedor');
const prueba = new Contenedor ();

// Inciso 2.a de la primera entrega del proyecto final
carritoRouter.post('/', (req,res) => {
    let carrito = {...req.body};
    let newCarrito = prueba.save(carrito);
    res.json(newCarrito);
    console.log('Id del carrito creado:',newCarrito.id);
});

// Inciso 2.b de la primera entrega del proyecto final
carritoRouter.delete('/:id', (request,response) => {
    console.log('Borrar el carrito', request.params.id);
    response.json(prueba.deleteById(parseInt(request.params.id)));
});

// Inciso 2.c de la primera entrega del proyecto final
carritoRouter.get('/:id/productos', (req,res) => {
    console.log('Get del carrito '+ req.params.id);
    res.json(prueba.getById(parseInt(req.params.id))[0].productos);
});

carritoRouter.get('/', (req, res) => {
    console.log('GET de todos los carritos');
    res.json(prueba.getAll());
});

// Inciso 2.d de la primera entrega del proyecto final
carritoRouter.post('/:id/productos',(req,res) => {
    console.log('Se agregan productos al carrito',req.params.id);
    res.json(prueba.addProductById(parseInt(req.params.id),req.body));
});

// Incicso 2.e de la primera entrega del proyecto final
carritoRouter.delete('/:id/productos/:id_prod',(req,res) => {
    console.log("Se borra un producto de carrito");
    res.json(prueba.delProductFromCarrt(parseInt(req.params.id),parseInt(req.params.id_prod)));
});

module.exports = carritoRouter;