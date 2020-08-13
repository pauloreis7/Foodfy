const express = require('express')
const routes = express.Router()

const chefsController = require('../app/controllers/chefsController')
const multer = require('../app/middlewares/multer')

routes.get("/", chefsController.index)

routes.get("/create", chefsController.create)

routes.post('/', multer.single("photo"), chefsController.post)

routes.get("/:id", chefsController.show)

routes.get("/:id/edit", chefsController.edit)

routes.put("/", multer.single("photo"), chefsController.put)

routes.delete("/", chefsController.delete)

module.exports = routes