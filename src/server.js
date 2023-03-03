
// DAOS
    const usersContenedor = require('./models/UserContenedorMongoDB');
    const usersContenedorMongoDB = new usersContenedor();
    const productContenedor = require('./models/ProductContenedorMongoDB');
    const productContenedorMongoDB = new productContenedor();

// Log4js
    const logger  = require ('./config/log4js');

// Variables de Entorno
    const vars = require ('./config/config');
    const { SECRET, MONGO_URL, COOKIE_TIME, TWILIO_ACCOUNTSID, TWILIO_AUTH_TOKEN, TWILIO_FROM, TWILIO_TO} = vars;

// Nodemailer
    const { createTransport } = require ('nodemailer');

    const TEST_MAIL = 'ethel.legros@ethereal.email'
    const transporter = createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: TEST_MAIL,
            pass: 'ywFkCDVuw36gThTJ3t'
        }
    });

// Twilio (Whatsapp)
    const client = require('twilio')(TWILIO_ACCOUNTSID, TWILIO_AUTH_TOKEN);

    try {
        client.messages.create({
            body: 'HOla, tu pedido está listo',
            from: TWILIO_FROM,
            to: TWILIO_TO,
        })
    } catch (error) {
        logger.error(error)
    }; 

// Bcrypt
    const bCrypt = require ('bcrypt');
    
    function isValidPassword (user, password) {
        return bCrypt.compareSync(password, user.password); 
    };

    function createHash (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10));
    };

// Passport
    const passport = require ('passport');
    const LocalStrategy = require ('passport-local').Strategy;

    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: "email", // Para usar el campo 'email' cuando llame a 'username'
        },
        async (req, username, password, done) => {
            const usuarios = await usersContenedorMongoDB.getAll();
            const usuario = usuarios.find((usuario) => usuario.email == username);
            if (usuario) {
                logger.warn('User already exists')
                return done(null, false);
            }
            let user = []
            try {
                user = {
                    name: req.body.name,
                    address: req.body.address,
                    age: req.body.age,
                    phone: req.body.phone,
                    avatar: req.file.path,
                    password: createHash(password),
                    email: username
                }
            } catch {
                return done (null, false);
            }
            const resultado = await usersContenedorMongoDB.save(user)
            if (resultado == false) {
                logger.error('Error in SingUp');
                return done(null, false);
            }

            const mailOptions = {
                from: 'Leonardo@PerSag.com',
                to: TEST_MAIL,
                subject: 'Nuevo registro',
                text: JSON.stringify(user),
                html: `<p>${JSON.stringify(user)}</p>`
            };
            
            try {
                await transporter.sendMail(mailOptions);
            } catch (error) {
                logger.error(error);
            }

            return done(null, user);
        }
    ));

    passport.use('login', new LocalStrategy(
        {
            usernameField: 'email', // Para usar el campo 'email' cuando llame a 'username'
        },
        async (username, password, done) => {
            const usuarios = await usersContenedorMongoDB.getAll();
            const user =  usuarios.find((usuario) => usuario.email == username);
            if (!user) {
                return done(null, false);
            };
            if (!isValidPassword(user, password)) {
                logger.warn ('Invalid Password');
                return done (null, false)
            }
            user.contador = 0;
            return done(null, user);
        },
    ));

    passport.serializeUser(function(user, done) {
        done(null, user.email); // Recomendación: en el 2° parámetro usar el user._id (si la persistencia es en una DB)
    });

    passport.deserializeUser(async function (useremail,done) {
        const usuarios = await usersContenedorMongoDB.getAll();
        const usuario = usuarios.find((usuario) => usuario.email == useremail);
        done(null, usuario.email);
    });

// Cluster
    const cluster = require ('cluster');
    if (process.argv[3] === 'CLUSTER' && cluster.isPrimary) {
        const numCPUs = require ('os').cpus().length;

        for (let index = 0; index < numCPUs; index++) {
            cluster.fork();
        }
    } else {

        // Express
            const express = require ('express');
            const session = require ('express-session');
            const cookieParser = require ('cookie-parser');
            const MongoStore = require ('connect-mongo');
            const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true};

            // Multer
            const multer  = require('multer');
            const upload = multer({ 
                dest: './public/uploads/',
                fileFilter: (req, file, done) => {
                    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
                    return done (null, true);
                    }
                    logger.warn("Invalid type of file")
                    return done (null, false);
                }
             });
            
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
            app.use(session({
                store: MongoStore.create({
                    mongoUrl: MONGO_URL,
                    mongoOptions: advancedOptions,
                    ttl: 60,
                }),
                secret: SECRET,
                resave: false,
                saveUninitialized: false,
                rolling: true,
                cookie: { maxAge: COOKIE_TIME },
            }));

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
        */

        // End Points
            // Registro
            app.get('/register', (req, res) => {
                res.render('pages/Auth/register')
            });

            app.post('/register', upload.single('avatar'), passport.authenticate('register', {
                failureRedirect: "/failregister",
                successRedirect: "/datos",
            }));

            app.get('/failregister', (req, res) => {
                res.render('pages/Auth/failregister')
            });

            // Login
            app.get('/login', (req, res) => {
                res.render('pages/Auth/login')
            });

            app.post('/login', passport.authenticate('login', {
                failureRedirect: '/faillogin',
                successRedirect: '/datos',
            }));
            
            app.get('/faillogin', (req, res) => {
                res.render('pages/Auth/faillogin')
            });

            // Logout
            app.get('/logout', async (req, res) => {;
                req.session.destroy(() => {
                    res.render('pages/Auth/logout', {user: req.user});
                });
            });

            // Datos
            function isAuth (req, res, next) {
                if (req.isAuthenticated()) {
                    next();
                } else {
                    res.redirect('/login');
                }
            };

            app.get('/datos', isAuth, async (req, res) => {
                if (!req.user.contador) {
                    req.user.contador = 0;
                }
                req.session.nombre = req.user;
                req.user.contador++;
                let listaProductos = await productContenedorMongoDB.getAll();
                const usuarios = await usersContenedorMongoDB.getAll();
                res.render('pages/index', 
                    {
                        user: usuarios.find((usuario) => usuario.email == req.user).email,
                        lista: listaProductos,
                        avatar: usuarios.find((usuario) => usuario.email == req.user).avatar,
                    }
                )
            });

            app.get('/', (req, res) => {
                const { nameSession } = req.query;
                if(!req.session.contador) {
                    req.session.nombre = nameSession;
                    req.session.contador = 1;
                }
                req.session.contador++;
                res.redirect('/datos');
            }); 

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