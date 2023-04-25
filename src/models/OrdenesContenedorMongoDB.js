const mongoose = require('mongoose');
const OrdenesDAO = require('../daos/ordenesDaoMongoDB')

//Se importa ProductContenedorMongoDB para utilizar la clase 'Contenedor'
const Contenedor = require('./ProductContenedorMongoDB');
const productContenedorMongoDB = new Contenedor();

const URL = 'mongodb+srv://user:user@cluster0.krw096n.mongodb.net/ecommerce?retryWrites=true&w=majority';

class OrdenesContenedorMongoDB {
    
    async save(objeto) {
        try {
            await mongoose.connect(URL, {serverSelectionTimeoutMS: 5000});
            try{
                const idOrden = await OrdenesDAO.create(objeto);
                return idOrden
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
                const producto = await OrdenesDAO.find({_id: id},{productos:1, _id:0});
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
                const productos = await OrdenesDAO.find({});
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
                const idProducto = await OrdenesDAO.deleteOne({_id: id});
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
                let productosOrden = await OrdenesDAO.findOne({_id: id});
                let producto = await productContenedorMongoDB.getById(product.id);
                if(producto){
                    productosOrden.productos.push(producto[0]);
                    productosOrden.timestamp = new Date();
                    await mongoose.connect(URL, {serverSelectionTimeoutMS: 5000});
                    await OrdenesDAO.updateOne({_id: id}, productosOrden);
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

    async delProductFromCarrt(idOrden,idProducto){
        try {
            await mongoose.connect(URL, {serverSelectionTimeoutMS: 5000});
            try{
                let orden = await OrdenesDAO.findOne({_id: idOrden});
                if(orden.productos.find(e=>e._id == idProducto)){
                    orden.productos.splice(orden.productos.findIndex(e => e.id === idProducto),1);
                    orden.timestamp = new Date();
                    await OrdenesDAO.updateOne({_id: idOrden}, orden);
                    return (`Producto ${idProducto} borrado del orden ${idOrden}`);
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

module.exports = OrdenesContenedorMongoDB;
