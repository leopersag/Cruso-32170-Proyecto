const { Router } = require ('express');
const authRouter = Router();
const authController = require('../controllers/auth.controller');

authRouter.get('/register', authController.getRegister);

authRouter.post('/register', authController.multer, authController.passportRegister);

authRouter.get('/failregister', authController.getFailRegister);

authRouter.get('/login', authController.getLogin);

authRouter.post('/login', authController.passportLogin);

authRouter.get('/faillogin', authController.getFailLogin);

authRouter.get('/logout', authController.getLogout);

authRouter.get('/datos', authController.isAuth, authController.getDatos)

authRouter.get('/carrito', authController.isAuth, authController.getCarrito);

authRouter.get('/compraOut', authController.isAuth, authController.getCompraOut);

authRouter.get('/', authController.getRoot)

module.exports = authRouter;