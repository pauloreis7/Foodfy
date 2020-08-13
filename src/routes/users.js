const express = require('express')
const routes = express.Router()

const profileController = require('../app/controllers/profileController')
const userController = require('../app/controllers/userController')

// routes.get('/profile', profileController.index)

// routes.put('/profile', profileController.put)

//admin user
// routes.get('/users', userController.list)

// routes.post('/users', userController.post) 

// routes.put('/users', userController.put)

// routes.delete('/users', userController.delete)

module.exports = routes