const express = require ('express');

// Inicialización app con express
const app = express();
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded ({extended: true}));

app.use('/', express.static('public'));

// Utilización de Routers
/* 
//Router de archivos
const productRouter = require('./routers/products');
const carritoRouter = require('./routers/carrito');
app.use('/carrito', carritoRouter);
app.use('/productos', productRouter);

// Router de MySQL
const productRouterSQL = require ('./routers/productsSQL');
app.use('/api/products', productRouterSQL)
 */
// Router de MongoDB
const productRouterMongoDB = require ('./routers/productsMongoDB');
app.use('/mongo/products', productRouterMongoDB);
const carritoRouterMongoDB = require('./routers/carritoMongoDB');
app.use('/mongo/carrito', carritoRouterMongoDB);

// Router de Firebase
const productRouterFirebase = require ('./routers/productsFirebase');
app.use('/firebase/products', productRouterFirebase);
const carritoRouterFirebase = require('./routers/carritoFirebase');
app.use('/firebase/carrito', carritoRouterFirebase);

// En caso de que la ruta no esté asignada
app.use('*',(req,res) => {
    res.json({error: -2, descripcion: `ruta ${req.originalUrl} método ${req.method} no implementada`})
})

// Inicialización del server express
const server = app.listen(PORT, ()=>{
    console.log(`Servidor Http escuchando en el puerto ${server.address().port}`);
});
server.on("error", error => console.log(`Error en servidor ${error}`));
