
    const admin =  require("firebase-admin")
    const db =  admin.firestore();
    const query = db.collection('carritos');
    const queryProductos = db.collection('productos');

const Contenedor = require('../models/ProductContenedorFirebase');
const productContenedorFirebase = new Contenedor();

class CarritoContenedorFirebase {
    
    async save(objeto) {
        try {
            const doc = query.doc();
            const carrito = {};
            carrito.productos = objeto;
            carrito.timestamp = new Date();
            await doc.create(carrito);
            carrito.id = doc.id
            return carrito;
        } catch (error) {
            console.log(error.message);       
        }
    }

    async getById(id) {
        try {
            const item = await query.doc(id).get()
            const carrito = item.data();
            if(carrito){
                carrito.id = item.id;
                return carrito;
            }else{
                return {"error": "Carrito no encontrado"};
            }
        } catch (error) {
            console.log(`Error de conexión a la base de datos ${error}`);       
        }
    }

    async getAll() {
        try {
            const querySnapshot = await query.get();
            let docs = querySnapshot.docs;
            const response = docs.map((carr) => ({
                id: carr.id,
                productos: carr.data().productos,
                timestamp: carr.data().timestamp
            }));
            return response;
        } catch (error) {
            console.log(`Error de conexión a la base de datos ${error}`);       
        }
    } 

    async deleteById(id) {
        try {
            const item = query.doc(id);
            const carrito = await item.get();
            if(carrito.data()){
                await item.delete();
                return (`Carrito ${id} borrado`)
            }else{
                return {"error": "Carrito no encontrado"};
            };
        } catch (error) {
            console.log(`Error de conexión a la base de datos ${error}`);       
        }
    }

    async addProductById(carritoId, productoId) {
        try {
            const doc = query.doc(carritoId);
            let carrito = await doc.get();

            if(carrito.data()){
                let carritoProductos = carrito.data().productos;
                console.log(carritoProductos);
                let item = await productContenedorFirebase.getById(productoId.id);
                let newCarrito = {item, carritoProductos}
                if(item.error){
                    return item;
                }else{
                    await doc.update({productos: newCarrito, timestamp: new Date() });
                    return (`Carrito '${carritoId}' actualizado`);
                }
            }else{
                return {"error": "Carrito no encontrado"};
            }
        } catch (error) {
            console.log(`Error de conexión a la base de datos ${error}`);       
        }
    }

    async delProductFromCarrt(idCarrito,idProducto){
        try {
            const doc = query.doc(idCarrito);
            let carrito = await doc.get();
            console.log(carrito);
            if(carrito.data()){
                let carritoProductos = carrito.data().productos;
                carritoProductos.splice(carritoProductos.findIndex((e) => e.id == idProducto),1);
                await doc.update({productos: carritoProductos, timestamp: new Date()});                
            }else{
                return {"error": "Carrito no encontrado"};
            }
        } catch (error) {
            console.error(error);            
        }
    }
}

module.exports = CarritoContenedorFirebase;
