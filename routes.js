const express = require('express')
const routes = express.Router()

const users = require('./controllers/users')
const admin = require('./controllers/admin')

//Users
routes.get("/", function (req, res) { 
    return res.redirect("/loob")
})

routes.get("/loob", users.index)
 
routes.get("/food_about", users.about)
 
routes.get("/recipes", users.recipes)
 
routes.get("/details/:index", users.detail)

//Chefs
routes.get("/admin/create", admin.create)

routes.get("/admin/:index", admin.show)

routes.post('/admin', admin.post)


module.exports = routes