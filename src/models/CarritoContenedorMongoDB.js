const mongoose = require('mongoose');

//Se importa ProductContenedorMongoDB para utilizar la clase 'Contenedor'
const Contenedor = require('../models/ProductContenedorMongoDB');
const productContenedorMongoDB = new Contenedor();

const carritoSchema = new mongoose.Schema({
    productos: {type: Object, required: true},
    timestamp: {type: Date, required: true},
});

const CarritosDAO = mongoose.model('carritos',carritoSchema);
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
                    return {'error': 'Producto borrado anteriormente'}
                }else {
                    return (`Producto '${id}' borrado`)
                }
            }catch {
                return {'error': 'Producto no encontrado'};
            } finally {
                await mongoose.disconnect();
            }
        } catch (error) {
            console.log(`Error de conexión a la base de datos ${error}`);       
        }
    }

    //Algo no funciona... REVISAR
    async addProductById(id, product) {
        try {
            await mongoose.connect(URL, {serverSelectionTimeoutMS: 5000});
            try{
                let productosCarrito = await CarritosDAO.find({_id: id},{productos:1, _id:0});
                console.log(productosCarrito);
                let producto = await productContenedorMongoDB.getById(product);
                console.log(producto);
                if(producto.error){
                    return {'error': 'Producto no encontrado'};
                }else{
                    console.log("estoy aca");
                   //productosCarrito.productos.push(producto[0]);
                   //await CarritosDAO.updateOne({_id: id}, {$set: {productos: productosCarrito}});
                   let newTime = new Date();
                   await CarritosDAO.updateOne({_id: id}, {$set: {"timestamp": newTime}});
                }
                return (`Carrito '${id}' actualizado`);
            }catch (error){
                return {'error': error};
            } finally {
                await mongoose.disconnect();
            }
        } catch (error) {
            console.log(`Error de conexión a la base de datos ${error}`);       
        }
    }

    //Algo no funciona... REVISAR
    async delProductFromCarrt(idCarrito,idProducto){
        try {
            await mongoose.connect(URL, {serverSelectionTimeoutMS: 5000});
            try{
                let carrito = await CarritosDAO.find({_id: idCarrito});
                let producto = carrito[0].productos;
                console.log(producto);
                if(carrito[0].productos.find(e=>e.id === idProducto)){
                    console.log("estoy aca");
                    carrito.productos.splice(carrito.productos.findIndex(e => e.id === idProducto),1);
                    let timestamp = new Date();
                    //await CarritosDAO.updateOne({_id: idCarrito}, {$set: {productos: carrito}});
                    //await CarritosDAO.updateOne({_id: idCarrito}, {$set: {timestamp: timestamp}});
                    return;
                }else{
                    return {'error': 'Producto no encontrado'};  
                }
                
            }catch {
                return {'error': 'Carrito NO encontrado'};
            } finally {
                await mongoose.disconnect();
            }
        } catch (error) {
            console.error(error);            
        }
    }
}

module.exports = CarritoContenedorMongoDB;
