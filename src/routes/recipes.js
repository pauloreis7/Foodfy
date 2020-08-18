const express = require('express')
const routes = express.Router()

const recipesController = require('../app/controllers/recipesController')
const multer = require('../app/middlewares/multer')

const recipesValidator = require('../app/validators/recipesValidator')

routes.get("/",recipesController.index)

routes.get("/create", recipesController.create)

routes.post('/', multer.array("photos", 5), recipesController.post)

routes.get("/:id", recipesController.show)

routes.get("/:id/edit", recipesValidator, recipesController.edit)

routes.put("/", multer.array("photos", 5), recipesController.put)

routes.delete("/", recipesController.delete)

module.exports = routes