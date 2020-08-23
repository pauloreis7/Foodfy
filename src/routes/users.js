const express = require('express')
const routes = express.Router()

const profileController = require('../app/controllers/profileController')
const userController = require('../app/controllers/userController')
const sessionController = require('../app/controllers/sessionController')

const userValidator = require('../app/validators/userValidator')
const sessionValidator = require('../app/validators/sessionValidator')

const accessCredentials = require('../app/middlewares/session')

//session
routes.get('/login', accessCredentials.redirectUserByCredential, sessionController.loginForm)

routes.post('/login', sessionValidator.login, sessionController.login)

routes.post('/logout', sessionController.logout)

//Forgot password

routes.get('/forgot-password', sessionController.forgotForm)

routes.post('/forgot-password', sessionValidator.forgot,sessionController.forgot)

routes.get('/reset-password', sessionController.resetForm)

routes.post('/reset-password', sessionValidator.reset,sessionController.reset)


//users
routes.get('/admin/profile', accessCredentials.onlyUsers, userValidator.show, profileController.index)

routes.put('/admin/profile', accessCredentials.onlyUsers, userValidator.updateLoggedUser, profileController.update)

//admin user
routes.get('/admin/users', accessCredentials.onlyAdmin,userController.list)

routes.get('/admin/users/register', accessCredentials.onlyAdmin, userController.create)

routes.post('/admin/users', userValidator.post, accessCredentials.onlyAdmin, userController.post)

routes.get('/admin/:id/update', userValidator.show, accessCredentials.onlyAdmin, userController.update)

routes.put('/admin/users', userValidator.adminUpdateUser, accessCredentials.onlyAdmin, userController.put)

routes.delete('/admin/users', userValidator.deleteUser, accessCredentials.onlyAdmin, userController.delete)

module.exports = routes

// admin: 0ff388
// normal: 8e71e3