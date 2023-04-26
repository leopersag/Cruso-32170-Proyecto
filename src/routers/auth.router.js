const { Router } = require ('express');
const authRouter = Router();
const authController = require('../controllers/auth.controller');
const productoController = require('../controllers/productsMongoDB.controller')

authRouter.get('/register', authController.getRegister);

authRouter.post('/register', authController.multer, authController.passportRegister);

authRouter.get('/failregister', authController.getFailRegister);

authRouter.get('/login', authController.getLogin);

authRouter.post('/login', authController.passportLogin);

authRouter.get('/faillogin', authController.getFailLogin);

authRouter.get('/logout', authController.getLogout);

authRouter.get('/productos', authController.isAuth, authController.getDatos);

authRouter.get('/productos/:id', authController.isAuth, productoController.getByIdProducts);

authRouter.get('/productos/category/:category', authController.isAuth, productoController.getByCategoryProducts);

authRouter.get('/carrito', authController.isAuth, authController.getCarrito);

authRouter.get('/compraOut', authController.isAuth, authController.getCompraOut);

authRouter.get('/chat', authController.isAuth, authController.getChat);

authRouter.get('/', authController.getRoot);

module.exports = authRouter;