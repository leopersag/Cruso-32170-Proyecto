// Conexión a la base de datos de Firebase
    const admin =  require("firebase-admin");
    const serviceAccount = require("../../database/firebaaseCredentials.json");

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    console.log("Base Firebase conectada");

    const db =  admin.firestore();
    const query = db.collection('productos');

class ProductContenedorFirebase {

    async save(objeto) {
        try {
            const doc = query.doc();
            await doc.create(objeto);

            const id = doc.id
            console.log(`Producto ${id} creado`);
            return id;

        } catch (error) {
            console.log(`Error:${error.message}`);       
        }
    }
 
    async getById(id) {
        try {
            const item = await query.doc(id).get();
            const producto = item.data();
            if(producto){
                producto.id = item.id;
                return producto
            }else {
                return {"error": "Producto no encontrado"};
            }
        } catch (error) {
            console.log(`Error:  ${error}`);       
        }
    }

    async getAll() {
        try {
            const querySnapshot = await query.get();
            let docs = querySnapshot.docs;

            const response = docs.map((elem) => ({
                id: elem.id,
                title: elem.data().title,
                price: elem.data().price,
                thumbnail: elem.data().thumbnail,
                Stock: elem.data().Stock
            }));
            return response;
        } catch (error) {
            console.log(`Error: ${error}`);       
        }
    } 

    async deleteById(id) {
        try {
            const doc = query.doc(id);
            const product = await doc.get();
            if (product.data()){
                await doc.delete();
                return (`Producto '${id}' borrado`)
            }else{
                return {"error": "Producto no encontrado"};
            };
        } catch (error) {
            console.log(`Error de conexión a la base de datos ${error}`);       
        }
    }

    async update(id, product) {
        try {
            const doc = query.doc(id);
            const prod = await doc.get();
            if(prod.data()){
                await doc.update(product);
                return (`Producto '${id}' actualizado`);
             }else{
                return {"error": "Producto no encontrado"};
             };
        } catch (error) {
            console.log(`Error de conexión a la base de datos ${error}`);
        }
    }
}

module.exports = ProductContenedorFirebase;
