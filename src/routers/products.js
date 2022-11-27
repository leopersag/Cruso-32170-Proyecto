const { Router } = require ('express');
const productRouter = Router();

//Se importa login
const administrador = require('../models/login');

//Se importa ProductContenedor para utilizar la clase 'Contenedor'
const Contenedor = require('../models/ProductContenedor');
const prueba = new Contenedor ();

// Inciso 1.a de la primera entrega del proyecto final
productRouter.get('/', (req, res) => {
    console.log('GET de todos los productos');
    res.json(prueba.getAll());
});

productRouter.get('/:id', (req,res) => {
    console.log('Get del producto '+ req.params.id);
    res.json(prueba.getById(parseInt(req.params.id)));
});

// Inciso 1.b de la primera entrega del proyecto final
productRouter.post('/', (req,res) => {
        if (administrador){
            console.log('Crear el producto', req.body);
            let producto = {...req.body};
            res.json(prueba.save(producto));
        }else{
            res.json({error: -1, descripcion: `ruta ${req.originalUrl} método ${req.method} no autorizada`});
        }
    });

// Inciso 1.c de la primera entrega del proyecto final
productRouter.put('/:id', (request,response) => {
    if (administrador){
        console.log('Actualizar el producto ' + request.params.id, request.body);
        prueba.update(parseInt(request.params.id),request.body)
        response.json(console.log("Producto actualizado"));
    }else{
        response.json({error: -1, descripcion: `ruta ${request.originalUrl} método ${request.method} no autorizada`});
    }
});

// Inciso 1.d de la primera entrega del proyecto final
productRouter.delete('/:id', (request,response) => {
    if (administrador){
        console.log('Borrar el producto', request.params.id);
        response.json(prueba.deleteById(parseInt(request.params.id)));
    }else{
        response.json({error: -1, descripcion: `ruta ${request.originalUrl} método ${request.method} no autorizada`});
    }
});

module.exports = productRouter;