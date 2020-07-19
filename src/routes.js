const express = require('express')
const routes = express.Router()
const multer = require('./app/middlewares/multer')

const users = require('./app/controllers/users')
const recipes = require('./app/controllers/recipes')
const chefs = require('./app/controllers/chefs')

//Users
routes.get("/", users.index)

routes.get("/food_about", users.about)
 
routes.get("/recipes/allRecipes", users.recipes)

routes.get("/details/:id", users.details)

//Recipes
routes.get("/recipes", recipes.index)

routes.get("/recipes/create", recipes.create)

routes.post('/recipes', multer.array("photos", 5), recipes.post)

routes.get("/recipes/:id", recipes.show)

routes.get("/recipes/:id/edit", recipes.edit)

routes.put("/recipes", multer.array("photos", 5), recipes.put)

routes.delete("/recipes", recipes.delete)

//Chefs
routes.get("/chefs", chefs.index)

routes.get("/chefs/create", chefs.create)

routes.post('/chefs', multer.array("photo", 1), chefs.post)

routes.get("/chefs/:id", chefs.show)

routes.get("/chefs/:id/edit", chefs.edit)

routes.put("/chefs", multer.array("photo", 1), chefs.put)

routes.delete("/chefs", chefs.delete)
 
module.exports = routes