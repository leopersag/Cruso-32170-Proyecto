const mongoose = require('mongoose');
const MensajesDAO = require('../daos/mensajesDaoMongoDB');
const URL = 'mongodb+srv://user:user@cluster0.krw096n.mongodb.net/ecommerce?retryWrites=true&w=majority';
let contador = 0;
let mensajes = [];

class MensajesContenedorMongoDB{
    constructor() {
    }

    async save(objeto){
        try {
            await mongoose.connect(URL, {serverSelectionTimeoutMS: 5000});
            try{
                mensajes = await MensajesDAO.find({});
                Math.max(...mensajes.map(e => e.contador)) + 1 < 0
                    ? contador = 1
                    : contador = Math.max(...mensajes.map(e=>e.contador))+1;
                objeto.contador = contador;
                mensajes.push(objeto);
                try {
                    await MensajesDAO.create(mensajes);
                    return objeto;
                } catch (error) {
                    console.log("Error en la escritura 2" + error)
                }

            } catch (error) {
                console.log(error);
                contador++;
                objeto.contador = contador;
                mensajes.push(objeto);
                try {
                    await mongoose.connect(URL, {serverSelectionTimeoutMS: 5000});
                    await MensajesDAO.create(mensajes);
                    return objeto;
                } catch (error) {
                    console.log("Error en la escritura 1");
                }
            }
        } catch (error) {
            console.log(`Error de conexión a la base de datos (escritura) ${error}`);       
        }
    }

    async getAll(){
        try {
            await mongoose.connect(URL, {serverSelectionTimeoutMS: 5000});
            try{
                const mensajes = await MensajesDAO.find({});
                return mensajes
            }catch (error){
                console.log(`Error en operación de base de datos ${error}`);
            }
        } catch (error) {
            console.log(`Error de conexión a la base de datos (lectura) ${error}`);       
        }
    }
}

module.exports = MensajesContenedorMongoDB;
