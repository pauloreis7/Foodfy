const express = require('express')
const routes = express.Router()

const users = require('./users')
const recipes = require('./recipes')
const chefs = require('./chefs')

const home = require('../app/controllers/home')

routes.use('/', users)
routes.use('/recipes', recipes)
routes.use('/chefs', chefs)

routes.get("/", home.index)

routes.get("/food_about", home.about)
 
routes.get("/allRecipes", home.recipes)

routes.get("/details/:id", home.details)

module.exports = routes