const fs = require('fs');

//Se importa ProductContenedor
const ProductContenedor = require('../models/ProductContenedor');
const productContenedor = new ProductContenedor ();

let id = 0;
let carritos = [];
let archivo = './src/repository/carritos.txt';

class Contenedor{
    constructor() {
    }

    save(objeto){
        try {
            carritos = JSON.parse(fs.readFileSync(archivo,'utf-8'));
            Math.max(...carritos.map(e => e.id)) + 1 < 0
                ? id = 1
                : id = Math.max(...carritos.map(e=>e.id))+1;
            objeto.timestamp = new Date();
            objeto.id = id;
            carritos.push(objeto);
            fs.writeFileSync(archivo,JSON.stringify(carritos));   
            return objeto;
        } catch (error) {
            console.log(error);
            id++;
            objeto.timestamp = new Date();
            objeto.id = id;
            carritos.push(objeto);
            fs.writeFileSync(archivo,JSON.stringify(carritos));
            return objeto;
        }  
    }

    addProductById(id, objeto){
        try {
            carritos = JSON.parse(fs.readFileSync(archivo,'utf-8'));
            if(carritos.find(e=>e.id === id) == undefined){
                return {'error': 'Carrito no encontrado'};
            }else{
                let carrito = carritos.find(e=>e.id ===id);
                let producto = productContenedor.getById(parseInt(objeto));
                if(producto.error){
                    return {'error': 'Producto no encontrado'};
                }else{
                    carrito.productos.push(producto[0]);
                    let timestamp=new Date();
                    carritos.splice(carritos.findIndex(e => e.id === id),1, {...carrito, timestamp, id})
                    fs.writeFileSync(archivo, JSON.stringify(carritos));
                    return;
                }
            }
        } catch (error) {
            console.error(error);            
        }
    }

    getById(id){
        try {
            carritos = JSON.parse(fs.readFileSync(archivo,'utf-8'));
            if(carritos.find(e=>e.id === id) == undefined){
                return {'error': 'Carrito no encontrado'};
            }else{
                return carritos.filter(e=>e.id===id);
            }
        } catch (error) {
            console.error(error);            
        }
    }

    getAll(){
       carritos = JSON.parse(fs.readFileSync(archivo,'utf-8'));
       return carritos;
    }

    deleteById(id){
        carritos = JSON.parse(fs.readFileSync(archivo,'utf-8'));
        if(carritos.find(e=>e.id === id) === undefined){
            return {'error': 'Carrito no encontrado'};
        }else{
            carritos.splice(carritos.findIndex(e => e.id === id),1);
            fs.writeFileSync(archivo, JSON.stringify(carritos));
            return (console.log(`Carrito borrado`));
        }
    }
    
    delProductFromCarrt(idCarrito,idProducto){
        try {
            carritos = JSON.parse(fs.readFileSync(archivo,'utf-8'));
            if(carritos.find(e=>e.id === idCarrito) == undefined){
                return {'error': 'Carrito no encontrado'};
            }else{
                let carrito = carritos.find(e=>e.id ===idCarrito); 
                if(carrito.productos.find(e=>e.id === idProducto)){
                    carrito.productos.splice(carrito.productos.findIndex(e => e.id === idProducto),1);
                    let timestamp = new Date();
                    carritos.splice(carritos.findIndex(e => e.id === idCarrito),1, {...carrito, timestamp, 'id':idCarrito });
                    fs.writeFileSync(archivo, JSON.stringify(carritos));
                    return;
                }else{
                    return {'error': 'Producto no encontrado'};  
                }
            }
        } catch (error) {
            console.error(error);            
        }
    }
}
    
module.exports = Contenedor;
