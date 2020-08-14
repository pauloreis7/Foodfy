const express = require('express')
const routes = express.Router()

const profileController = require('../app/controllers/profileController')
const userController = require('../app/controllers/userController')
const sessionController = require('../app/controllers/sessionController')

//session
routes.get('/login', sessionController.loginForm)

routes.post('/login', sessionController.login)

routes.post('/logout', sessionController.logout)

//Forgot password

routes.get('/forgot-password', sessionController.forgotForm)

routes.post('/forgot-password', sessionController.forgot)

routes.get('/reset-password', sessionController.resetForm)

routes.post('/reset-password', sessionController.reset)


//users
// routes.get('admin/profile', profileController.index)

// routes.put('admin/profile', profileController.put)

//admin user
// routes.get('admin/users', userController.list)

// routes.post('admin/users', userController.post) 

// routes.put('admin/users', userController.put)

// routes.delete('admin/users', userController.delete)

module.exports = routes