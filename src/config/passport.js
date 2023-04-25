const LocalStrategy = require ('passport-local').Strategy;
const logger = require ('./log4js')

// Bcrypt
    const bCrypt = require ('bcrypt');
        
    function isValidPassword (user, password) {
        return bCrypt.compareSync(password, user.password); 
    };

    function createHash (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10));
    };

const passportConfig = (passport, usersContenedorMongoDB, TEST_MAIL, transporter, carritoContenedorMongoDB) => {

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
                    lastName: req.body.lastName,
                    address: req.body.address,
                    countryCode: req.body.countryCode,
                    phone: req.body.phone,
                    password: createHash(password),
                    email: username
                }
                carrito = {
                    email: username,
                    address: req.body.address,
                    productos: [],
                }
            } catch {
                return done (null, false);
            }
            const resultado = await usersContenedorMongoDB.save(user);
            const resultadoCarrito = await carritoContenedorMongoDB.save(carrito);

            if (resultado == false) {
                logger.error('Error en la creación del usuario');
                return done(null, false);
            } else if (resultadoCarrito == false) {
                logger.error('Error en la creación del carrito');
                return done(null, false);
            } 

            const mailOptions = {
                from: 'Leonardo@CoderHouse.com',
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
}

module.exports = passportConfig;