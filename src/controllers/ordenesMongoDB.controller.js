const Contenedor = require('../models/OrdenesContenedorMongoDB');
const OrdenesContenedorMongoDB = new Contenedor ();

exports.saveOrden =  async (req,res) => {
    let orden = {...req.body};
    let newOrden = await OrdenesContenedorMongoDB.save(orden);
    res.json(newOrden);
    console.log('Id de la orden creada:',newOrden._id);
};

exports.deleteByIdOrden = async (request,response) => {
    console.log('Borrar la orden', request.params.id);
    response.json(await OrdenesContenedorMongoDB.deleteById(request.params.id));
};

exports.getByIdOrden = async (req,res) => {
    console.log('Get de la orden '+ req.params.id);
    res.json(await OrdenesContenedorMongoDB.getById(req.params.id));
};

exports.getAllOrden = async (req, res) => {
    console.log('GET de todas las Ordenes');
    res.json(await OrdenesContenedorMongoDB.getAll());
};

exports.addProductByIdOrden = async (req,res) => {
    console.log('Se agregan productos a la orden',req.params.id);
    res.json(await OrdenesContenedorMongoDB.addProductById(req.params.id,req.body));
};

exports.delProductFromCartOrden = async (req,res) => {
    console.log("Se borra un producto de orden");
    res.json(await OrdenesContenedorMongoDB.delProductFromCarrt(req.params.id,req.params.id_prod));
};