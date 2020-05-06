const express = require('express')
const nunjucks = require('nunjucks')

const server = express()
const recipes = require('./data')

server.use(express.static('public'))

server.set("view engine", "njk")

nunjucks.configure("views", {
    express:server,
    autoescape:false,
    noCache: true
})

server.get("/", function (req, res) { 
   const recipesPop = recipes.filter((recipes, index) => index < 6 ? false : true)

    return res.render("index", { recipesPop })
})

server.get("/food_about", function (req, res) {
    return res.render("food_about")
})

server.get("/recipes", function (req, res) {
    return res.render("recipes", { recipes })
})

server.get("/details/:index", function (req, res) {
    const recipeIndex = req.params.index
    const recipe = recipes[recipeIndex]

    if (!recipe) {
        return res.send("OPA")
    }

    return res.render("details", {recipe})
})

server.listen(5000)