const usersContenedor = require('../models/UserContenedorMongoDB');
const usersContenedorMongoDB = new usersContenedor();
const carritoContenedor = require('../models/CarritoContenedorMongoDB');
const carritoContenedorMongoDB = new carritoContenedor();
const ordenesContenedor = require('../models/OrdenesContenedorMongoDB');
const ordenesContenedorMongoDB = new ordenesContenedor();
const productContenedor = require('../models/ProductContenedorMongoDB');
const productContenedorMongoDB = new productContenedor();
const mensajesContenedor = require('../models/MensajesContenedorMongoDB');
const mensajesContenedorMongoDB = new mensajesContenedor();
const logger  = require ('../config/log4js');
const vars = require ('../config/config');
const { TEST_MAIL, TWILIO_FROM, TWILIO_TO, TWILIO_ACCOUNTSID, TWILIO_AUTH_TOKEN } = vars;
const transporter = require ('../config/nodemailer');
const client = require('twilio')(TWILIO_ACCOUNTSID, TWILIO_AUTH_TOKEN);
const upload = require('../config/multer');
const passport = require ('passport');
const passportConfig = require('../config/passport');
passportConfig (passport, usersContenedorMongoDB, TEST_MAIL, transporter, carritoContenedorMongoDB);


exports.getRegister = (req, res) => {
    res.render('pages/Auth/register');
};

exports.getFailRegister = (req, res) => {
    res.render('pages/Auth/failregister')
};

exports.getLogin = (req, res) => {
    res.render('pages/Auth/login')
};

exports.getFailLogin = (req, res) => {
    res.render('pages/Auth/faillogin')
};

exports.getLogout =  async (req, res) => {
    req.session.destroy(() => {
        res.render('pages/Auth/logout', {user: req.user});
    });
};

exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
};

exports.getDatos = async (req, res) => {
    if (!req.user.contador) {
        req.user.contador = 0;
    }
    req.session.nombre = req.user;
    req.user.contador++;
    let listaProductos = await productContenedorMongoDB.getAll();
    const usuario = await usersContenedorMongoDB.getById(req.user);
    const carrito = await carritoContenedorMongoDB.getById(req.user);
    res.render('pages/index', 
        {
            user: usuario[0].email,
            lista: listaProductos,
            carritoId: carrito._id,
        }
    )
};

exports.getCarrito = async (req, res) => {
    const usuario = await usersContenedorMongoDB.getById(req.user);
    const carrito = await carritoContenedorMongoDB.getById(req.user);
    res.render('pages/carrito',
        {
            user: usuario[0].email,
            lista: carrito.productos,
            carritoId: carrito._id,
        }
    )
};


exports.getChat = async (req, res) => {
    const usuario = await usersContenedorMongoDB.getById(req.user);
    res.render('pages/chat',
        {
            user: usuario[0].email,
        }
    )
};

exports.getCompraOut = async (req, res) => {
    const usuario = await usersContenedorMongoDB.getById(req.user);
    const carrito = await carritoContenedorMongoDB.getById(req.user);
    const ordenes = await ordenesContenedorMongoDB.getAll(); 

    const orden = {
        items: carrito.productos,
        orderNumber: ordenes.length+1,
        timeStamp: new Date(),
        estado: 'Generada',
        email: req.user,
    };

    await ordenesContenedorMongoDB.save(orden);
    await carritoContenedorMongoDB.vaciarCarrito(carrito._id);
    
    const mailOptions = {
        from: 'Leonardo@CoderHouse.com',
        to: TEST_MAIL,
        subject: `Nuevo pedido de ${usuario.name} (${usuario.email})`,
        text: JSON.stringify(orden),
        html: `<p>${JSON.stringify(orden)}</p>`
    };
    
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        logger.error(error);
    };

/*     try {
        client.messages.create({
            body: `Nuevo pedido de ${usuario.name} (${usuario.email})`,
            from: TWILIO_FROM,
            to: TWILIO_TO,
        })
    } catch (error) {
        logger.error(error)
    };  */

    res.render('pages/Auth/compraOut',
        {
            user: req.user,
            orden: orden.orderNumber,
        }
    );
};

exports.getRoot = (req, res) => {
    const { nameSession } = req.query;
    if(!req.session.contador) {
        req.session.nombre = nameSession;
        req.session.contador = 1;
    }
    req.session.contador++;
    res.redirect('/productos');
};

exports.multer = upload.single('avatar');

exports.passportRegister = passport.authenticate('register', {
    failureRedirect: "/failregister",
    successRedirect: "/productos",
});

exports.passportLogin = passport.authenticate('login', {
    failureRedirect: '/faillogin',
    successRedirect: '/productos',
});