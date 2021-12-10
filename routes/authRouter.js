const Router = require('express')
const {loginController, singUpController, authController} = require('../controllers/authController')

const authRouter = Router()
module.exports = authRouter


authRouter.post('/singIn', loginController)

authRouter.post('/singUp', singUpController)

authRouter.post('/isAuth', authController)