const mongoose = require('mongoose');
const CarritosDAO = require('../daos/carritoDaoMongoDB')

//Se importa ProductContenedorMongoDB para utilizar la clase 'Contenedor'
const Contenedor = require('../models/ProductContenedorMongoDB');
const productContenedorMongoDB = new Contenedor();

/* const carritoSchema = new mongoose.Schema({
    productos: {type: Array, required: true},
    timestamp: {type: Date, required: true},
});

const CarritosDAO = mongoose.model('carritos',carritoSchema); */
const URL = 'mongodb+srv://user:user@cluster0.krw096n.mongodb.net/ecommerce?retryWrites=true&w=majority';

class CarritoContenedorMongoDB {
    
    async save(objeto) {
        try {
            await mongoose.connect(URL, {serverSelectionTimeoutMS: 5000});
            try{
                let carrito = {productos: objeto, timestamp: new Date()}
                const idCarrito = await CarritosDAO.create(carrito);
                return idCarrito
            }catch {
                return {'error': 'Faltan campos requeridos'};
            } finally {
                await mongoose.disconnect();
            }
        } catch (error) {
            console.log(`Error de conexión a la base de datos ${error}`);       
        }
    }

    async getById(id) {
        try {
            await mongoose.connect(URL, {serverSelectionTimeoutMS: 5000});
            try{
                const producto = await CarritosDAO.find({_id: id},{productos:1, _id:0});
                return producto
            }catch {
                return {'error': 'Producto no encontrado'};
            } finally {
                await mongoose.disconnect();
            }
        } catch (error) {
            console.log(`Error de conexión a la base de datos ${error}`);       
        }
    }

    async getAll() {
        try {
            await mongoose.connect(URL, {serverSelectionTimeoutMS: 5000});
            try{
                const productos = await CarritosDAO.find({});
                return productos
            }catch (error){
                console.log(`Error en operación de base de datos ${error}`);
            } finally {
                await mongoose.disconnect();
            }
        } catch (error) {
            console.log(`Error de conexión a la base de datos ${error}`);       
        }
    } 

    async deleteById(id) {
        try {
            await mongoose.connect(URL, {serverSelectionTimeoutMS: 5000});
            try{
                const idProducto = await CarritosDAO.deleteOne({_id: id});
                if (idProducto.acknowledged & idProducto.deletedCount === 0){
                    return {'error': 'Carrito borrado anteriormente'}
                }else {
                    return (`Carrito '${id}' borrado`)
                }
            }catch {
                return {'error': 'Carrito no encontrado'};
            } finally {
                await mongoose.disconnect();
            }
        } catch (error) {
            console.log(`Error de conexión a la base de datos ${error}`);       
        }
    }

    async addProductById(id, product) {
        try {
            await mongoose.connect(URL, {serverSelectionTimeoutMS: 5000});
            try{
                let productosCarrito = await CarritosDAO.findOne({_id: id});
                let producto = await productContenedorMongoDB.getById(product.id);
                if(producto){
                    productosCarrito.productos.push(producto[0]);
                    productosCarrito.timestamp = new Date();
                    await mongoose.connect(URL, {serverSelectionTimeoutMS: 5000});
                    await CarritosDAO.updateOne({_id: id}, productosCarrito);
                    return (`Carrito '${id}' actualizado`);
                }else{
                    return {'error': 'Producto no encontrado'};
                }
            }catch (error){
                console.log(error.message);
                return {"error":error}
            } finally {
                await mongoose.disconnect();
            }
        } catch (error) {
            console.log(`Error de conexión a la base de datos ${error}`);       
        }
    }

    async delProductFromCarrt(idCarrito,idProducto){
        try {
            await mongoose.connect(URL, {serverSelectionTimeoutMS: 5000});
            try{
                let carrito = await CarritosDAO.findOne({_id: idCarrito});
                if(carrito.productos.find(e=>e._id == idProducto)){
                    carrito.productos.splice(carrito.productos.findIndex(e => e.id === idProducto),1);
                    carrito.timestamp = new Date();
                    await CarritosDAO.updateOne({_id: idCarrito}, carrito);
                    return (`Producto ${idProducto} borrado del carrito ${idCarrito}`);
                }else{
                    return {'error': 'Producto no encontrado'};  
                }
                
            }catch (error){
                console.log(error.message);;
            } finally {
                await mongoose.disconnect();
            }
        } catch (error) {
            console.error(error);            
        }
    }
}

module.exports = CarritoContenedorMongoDB;
