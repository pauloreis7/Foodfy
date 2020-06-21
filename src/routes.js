const express = require('express')
const routes = express.Router()

const users = require('./app/controllers/users')
const recipes = require('./app/controllers/recipes')
const chefs = require('./app/controllers/chefs')

//Users
routes.get("/", function (req, res) { 
    return res.redirect("/loob")
})

routes.get("/loob", users.index)
 
routes.get("/food_about", users.about)
 
routes.get("/recipes/allRecipes", users.recipes)

routes.get("/details/:id", users.details)

//Recipes
routes.get("/recipes", recipes.index)

routes.get("/recipes/create", recipes.create)

routes.post('/recipes', recipes.post)

routes.get("/recipes/:id", recipes.show)

routes.get("/recipes/:id/edit", recipes.edit)

routes.put("/recipes", recipes.put)

routes.delete("/recipes", recipes.delete)

//Chefs
routes.get("/chefs", chefs.index)

routes.get("/chefs/create", chefs.create)

routes.post('/chefs', chefs.post)

routes.get("/chefs/:id", chefs.show)

routes.get("/chefs/:id/edit", chefs.edit)

routes.put("/chefs", chefs.put)

routes.delete("/chefs", chefs.delete)

module.exports = routes