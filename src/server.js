const usersContenedor = require('./models/UserContenedorMongoDB');
const usersContenedorMongoDB = new usersContenedor();
const logger  = require ('./config/log4js');
const vars = require ('./config/config');
const { TEST_MAIL } = vars;
const passport = require ('passport');
const transporter = require ('./config/nodemailer');
const passportConfig = require('./config/passport');
passportConfig (passport, usersContenedorMongoDB, TEST_MAIL, transporter);
const cluster = require ('cluster');

if (process.argv[3] === 'CLUSTER' && cluster.isPrimary) {
    const numCPUs = require ('os').cpus().length;

    for (let index = 0; index < numCPUs; index++) {
        cluster.fork();
    }
} else {

    // Express
        const express = require ('express');
        const cookieParser = require ('cookie-parser');
        const session = require ('./config/session');
        
        // Inicialización app con express
        const app = express();

        // Capturando la información de la URL y el Método de todas las peticiones al servidor
        app.use((req, res, next) => {
            logger.info(`URL: ${req.url}; METHOD: ${req.method}`);
            next();
        });

        const PORT = process.env.PORT || process.argv[2] || 8080; // Railway asigna el puerto en 'process.env.PORT'
        app.use(express.json());
        app.use(express.urlencoded ({extended: true}));
        app.use(cookieParser());
        app.use(session);

        app.use(passport.initialize());
        app.use(passport.session());

        //Indica el motor de plantillas a usar (por defecto la carpeta ./views)
        app.set('view engine', 'ejs');

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
        const authRouter = require ('./routers/auth.router');
        app.use('/', authRouter);
        /* 
        // Router de Firebase
        const productRouterFirebase = require ('./routers/productsFirebase');
        app.use('/firebase/products', productRouterFirebase);
        const carritoRouterFirebase = require('./routers/carritoFirebase');
        app.use('/firebase/carrito', carritoRouterFirebase);
        */

    // En caso de que la ruta no esté asignada
        app.all('*',(req,res) => {
            logger.warn (`URL: "${req.url}" no asignada`);
            res.send({warning: "ruta no encontrada"});
        });

    // Inicialización del server express
        const server = app.listen(PORT, ()=>{
            console.log(`Servidor Http escuchando en el puerto ${server.address().port}`);
        });
        server.on("error", error => console.log(`Error en servidor ${error}`));
}