const mongoose = require('mongoose');
const CarritosDAO = require('../daos/carritoDaoMongoDB')

//Se importa ProductContenedorMongoDB para utilizar la clase 'Contenedor'
const Contenedor = require('../models/ProductContenedorMongoDB');
const productContenedorMongoDB = new Contenedor();

const URL = 'mongodb+srv://user:user@cluster0.krw096n.mongodb.net/ecommerce?retryWrites=true&w=majority';

class CarritoContenedorMongoDB {
    
    async save(objeto) {
        try {
            await mongoose.connect(URL, {serverSelectionTimeoutMS: 5000});
            try{
                let carrito = {email: objeto.email, address: objeto.address, productos: objeto.productos, timestamp: new Date()}
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
                const producto = await CarritosDAO.find({email: id});
                return producto[0]
            }catch {
                return {'error': 'Carrito no encontrado'};
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
                await mongoose.connect(URL, {serverSelectionTimeoutMS: 5000})
                let productosCarrito = await CarritosDAO.findOne({_id: id});
                let producto = await productContenedorMongoDB.getById(product._id);
                if(producto){
                    const prod = productosCarrito.productos.find((elemento) => elemento._id == product._id);
                    let item= {};
                    if (prod) {
                        item = {
                            _id: producto[0]._id,
                            title: producto[0].title,
                            qty: prod.qty+1,
                            unitPrice: producto[0].price,
                            totalPrice: producto[0].price*(prod.qty+1),
                            thumbnail: producto[0].thumbnail,
                        };
                        productosCarrito.productos.splice(productosCarrito.productos.findIndex((elem) => elem._id == product._id),1,item)
                    } else {
                        item = {
                            _id: producto[0]._id,
                            title: producto[0].title,
                            qty: 1,
                            unitPrice: producto[0].price,
                            totalPrice:producto[0].price,
                            thumbnail: producto[0].thumbnail,
                        };
                        productosCarrito.productos.push(item);
                    }
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
        console.log(idProducto);
        try {
            await mongoose.connect(URL, {serverSelectionTimeoutMS: 5000});
            try{
                let carrito = await CarritosDAO.findOne({_id: idCarrito});
                if(carrito.productos.find(e=>e._id == idProducto)){
                    carrito.productos.splice(carrito.productos.findIndex(e => e._id == idProducto),1);
                    carrito.timestamp = new Date();
                    await mongoose.connect(URL, {serverSelectionTimeoutMS: 5000});
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

    async vaciarCarrito(idCarrito) {
        try {
            await mongoose.connect(URL, {serverSelectionTimeoutMS: 5000});
            try{
                let carrito = await CarritosDAO.findOne({_id: idCarrito});
                carrito.productos = [];
                carrito.timestamp = new Date();
                await mongoose.connect(URL, {serverSelectionTimeoutMS: 5000});
                await CarritosDAO.updateOne({_id: idCarrito}, carrito);
                return (`Carrito ${idCarrito} vaciado`);                
            }catch (error){
                console.log(error.message);
            } finally {
                await mongoose.disconnect();
            }
        } catch (error) {
            console.error(error);            
        }
    }

}

module.exports = CarritoContenedorMongoDB;
