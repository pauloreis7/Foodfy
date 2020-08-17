const express = require('express')
const routes = express.Router()

const profileController = require('../app/controllers/profileController')
const userController = require('../app/controllers/userController')
const sessionController = require('../app/controllers/sessionController')

const userValidator = require('../app/validators/userValidator')
const sessionValidator = require('../app/validators/sessionValidator')

const accessCredentials = require('../app/middlewares/session')

//session
routes.get('/login', sessionController.loginForm)

routes.post('/login', sessionValidator.login, sessionController.login)

routes.post('/logout', sessionController.logout)

//Forgot password

routes.get('/forgot-password', sessionController.forgotForm)

// routes.post('/forgot-password', sessionController.forgot)

routes.get('/reset-password', sessionController.resetForm)

// routes.post('/reset-password', sessionController.reset)


//users
routes.get('/admin/profile', accessCredentials.onlyUsers, userValidator.show, profileController.index)

routes.put('/admin/profile', accessCredentials.onlyUsers, userValidator.updateLoggedUser, profileController.update)

//admin user
routes.get('/admin/users', userController.list)

routes.get('/admin/users/register', userController.create)

routes.post('/admin/users', userValidator.post, userController.post)

routes.get('/admin/:id/update', userValidator.show, userController.update)

routes.put('/admin/users', userValidator.adminUpdateUser, userController.put)

routes.delete('/admin/users', userController.delete)

module.exports = routes