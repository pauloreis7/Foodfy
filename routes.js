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
routes.get("/admin", admin.index)

routes.get("/admin/create", admin.create)

routes.post('/admin', admin.post)

routes.get("/admin/:index", admin.show)

routes.get("/admin/:index/edit", admin.edit)

routes.put("/admin", admin.put)

routes.delete("/admin", admin.delete)

module.exports = routes