const express = require ('express');

// Inicialización app con express
const app = express();
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded ({extended: true}));

app.use('/', express.static('public'));

// Utilización de Routers
const productRouter = require('./routers/products');
const carritoRouter = require('./routers/carrito');
app.use('/carrito', carritoRouter);
app.use('/productos', productRouter);

// En caso de que la ruta no esté asignada
app.use('*',(req,res) => {
    res.json({error: -2, descripcion: `ruta ${req.originalUrl} método ${req.method} no implementada`})
})

// Inicialización del server express
const server = app.listen(PORT, ()=>{
    console.log(`Servidor Http escuchando en el puerto ${server.address().port}`);
});
server.on("error", error => console.log(`Error en servidor ${error}`));
