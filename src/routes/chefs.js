const express = require('express')
const routes = express.Router()

const chefsController = require('../app/controllers/chefsController')
const multer = require('../app/middlewares/multer')

const accessCredentials = require('../app/middlewares/session')

routes.get("/", chefsController.index)

routes.get("/create", accessCredentials.onlyAdmin, chefsController.create) 

routes.post('/', multer.single('photo'), chefsController.post)

routes.get("/:id", chefsController.show)

routes.get("/:id/edit", accessCredentials.onlyAdmin,chefsController.edit)

routes.put("/", multer.single('photo'), chefsController.put)

routes.delete("/", accessCredentials.onlyAdmin,chefsController.delete)

module.exports = routes