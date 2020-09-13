const express = require('express')
const routes = express.Router()

const users = require('./users')
const recipes = require('./recipes')
const chefs = require('./chefs')

const accessCredentials = require('../app/middlewares/session')

const home = require('../app/controllers/home')
const chefsController = require('../app/controllers/chefsController')


routes.use('/', users)
routes.use('/recipes', accessCredentials.onlyUsers, recipes)
routes.use('/chefs', accessCredentials.onlyUsers, chefs)

routes.get("/", home.index)

routes.get("/food_about", home.about)
 
routes.get("/allRecipes", home.recipes)

routes.get("/recipeDetails/:id", home.recipeDetails)

routes.get("/allChefs", chefsController.index)

routes.get("/chefDetails/:id", chefsController.show)

module.exports = routes