const usersContenedor = require('../models/UserContenedorMongoDB');
const usersContenedorMongoDB = new usersContenedor();
const carritoContenedor = require('../models/CarritoContenedorMongoDB');
const carritoContenedorMongoDB = new carritoContenedor();
const productContenedor = require('../models/ProductContenedorMongoDB');
const productContenedorMongoDB = new productContenedor();
const logger  = require ('../config/log4js');
const vars = require ('../config/config');
const { TEST_MAIL, TWILIO_FROM, TWILIO_TO, TWILIO_ACCOUNTSID, TWILIO_AUTH_TOKEN } = vars;
const transporter = require ('../config/nodemailer');
const client = require('twilio')(TWILIO_ACCOUNTSID, TWILIO_AUTH_TOKEN);
const upload = require('../config/multer');
const passport = require ('passport');
const passportConfig = require('../config/passport');
passportConfig (passport, usersContenedorMongoDB, TEST_MAIL, transporter);


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
    const usuarios = await usersContenedorMongoDB.getAll();
    const usuario = usuarios.find((usuario) => usuario.email == req.user);
    res.render('pages/index', 
        {
            user: usuario.email,
            lista: listaProductos,
            avatar: usuario.avatar,
        }
    )
};

exports.getCarrito = async (req, res) => {
    let listaCarrito = await carritoContenedorMongoDB.getAll();
    const usuarios = await usersContenedorMongoDB.getAll();
    const usuario = usuarios.find((usuario) => usuario.email == req.user);
    res.render('pages/carrito',
        {
            name: usuario.name,
            user: usuario.email,
            lista: listaCarrito[0].productos,
            avatar: usuario.avatar,
        }
    )
};

exports.getCompraOut = async (req, res) => {
    let listaCarrito = await carritoContenedorMongoDB.getAll();
    const usuarios = await usersContenedorMongoDB.getAll();
    const usuario = usuarios.find((usuario) => usuario.email == req.user);
    
    const mailOptions = {
        from: 'Leonardo@PerSag.com',
        to: TEST_MAIL,
        subject: `Nuevo pedido de ${usuario.name} (${usuario.email})`,
        text: JSON.stringify(listaCarrito),
        html: `<p>${JSON.stringify(listaCarrito)}</p>`
    };
    
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        logger.error(error);
    };

    try {
        client.messages.create({
            body: `Nuevo pedido de ${usuario.name} (${usuario.email})`,
            from: TWILIO_FROM,
            to: TWILIO_TO,
        })
    } catch (error) {
        logger.error(error)
    }; 
    res.render('pages/Auth/compraOut', {user: req.user});
};

exports.getRoot = (req, res) => {
    const { nameSession } = req.query;
    if(!req.session.contador) {
        req.session.nombre = nameSession;
        req.session.contador = 1;
    }
    req.session.contador++;
    res.redirect('/datos');
};

exports.multer = upload.single('avatar');

exports.passportRegister = passport.authenticate('register', {
    failureRedirect: "/failregister",
    successRedirect: "/datos",
});

exports.passportLogin = passport.authenticate('login', {
    failureRedirect: '/faillogin',
    successRedirect: '/datos',
});
