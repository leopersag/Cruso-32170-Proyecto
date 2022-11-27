const fs = require('fs');

let id = 0;
let productos = [];
let archivo = './src/repository/productos.txt';

class Contenedor{
    constructor() {
    }

    save(objeto){
        try {
            productos = JSON.parse(fs.readFileSync(archivo,'utf-8'));
            Math.max(...productos.map(e => e.id)) + 1 < 0
                ? id = 1
                : id = Math.max(...productos.map(e=>e.id))+1;
            objeto.timestamp = new Date();
            objeto.id = id;
            productos.push(objeto);
            fs.writeFileSync(archivo,JSON.stringify(productos));   
            return objeto;
        } catch (error) {
            console.log(error);
            id++;
            objeto.timestamp = new Date();
            objeto.id = id;
            productos.push(objeto);
            fs.writeFileSync(archivo,JSON.stringify(productos));
            return objeto;
        }  
    }

    getById(id){
        try {
            productos = JSON.parse(fs.readFileSync(archivo,'utf-8'));
            if(productos.find(e=>e.id === id) == undefined){
                return {'error': 'Producto no encontrado'};
            }else{
                return productos.filter(e=>e.id===id);
            }
        } catch (error) {
            console.error(error);            
        }
    }

    getAll(){
       productos = JSON.parse(fs.readFileSync(archivo,'utf-8'));
       return productos;
    }

    deleteById(id){
        productos = JSON.parse(fs.readFileSync(archivo,'utf-8'));
        if(productos.find(e=>e.id === id) === undefined){
            return {'error': 'Producto no encontrado'};
        }else{
            productos.splice(productos.findIndex(e => e.id === id),1);
            fs.writeFileSync(archivo, JSON.stringify(productos));
            return (console.log(`Producto borrado`));
        }
    }

    update(id, objeto){
        try {
            productos = JSON.parse(fs.readFileSync(archivo,'utf-8'));
            if(productos.find(e=>e.id === id) == undefined){
                return {'error': 'Producto no encontrado'};
            }else{
                let timestamp=new Date();
                productos.splice(productos.findIndex(e => e.id === id),1, {...objeto, timestamp, id})
                fs.writeFileSync(archivo, JSON.stringify(productos));
                return;
            }
        } catch (error) {
            console.error(error);            
        }
    }
}

module.exports = Contenedor;
