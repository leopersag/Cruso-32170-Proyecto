const mongoose = require('mongoose');
const UsuariosDAO = require('../daos/userDaoMongoDB');
const URL = 'mongodb+srv://user:user@cluster0.krw096n.mongodb.net/ecommerce?retryWrites=true&w=majority';

class userContenedorMongoDB {

    async save(objeto) {
        try {
            await mongoose.connect(URL, {serverSelectionTimeoutMS: 5000});
            try{
                const id = await UsuariosDAO.create(objeto);
                return id
            }catch {
                return false;
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
                const producto = await UsuariosDAO.find({_id: id});
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
                const productos = await UsuariosDAO.find({});
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
                const idProducto = await UsuariosDAO.deleteOne({_id: id});
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

    async update(id, product) {
        try {
            await mongoose.connect(URL, {serverSelectionTimeoutMS: 5000});
            try{
                await UsuariosDAO.updateOne({_id: id},product);
                return (`Producto '${id}' actualizado`);
            }catch {
                return {'error': 'Producto no encontrado'};
            } finally {
                await mongoose.disconnect();
            }
        } catch (error) {
            console.log(`Error de conexión a la base de datos ${error}`);       
        }
    }
}

module.exports = userContenedorMongoDB;
