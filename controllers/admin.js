const fs = require('fs')
const data = require('../data.json')
const utils = require('../utils')

//index
exports.index = function (req, res) {
    return res.render("chefs/recipe_manager")
}

//create
exports.create =  function (req, res) {
    return res.render("chefs/create")
}

//post
exports.post = function (req, res) {
    const keys = Object.keys(req.body)

    for ( key of keys) {
        if (req.body[key] == "") {
            return res.send('Por favor preencha todos os campos')
        }
    }

    let { recipe_url, recipe_ingredents, recipe_making, recipe_specs } = req.body

    data.recipes.push({
        recipe_url,
        recipe_ingredents,
        recipe_making,
        recipe_specs
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
        if (err) return res.send("Erro ao escrever o arquivo!! Tente novamente")

        return res.redirect("/admin")
    })

}

//show
exports.show = function (req, res) {
    const recipeIndex = req.params.index
    let recipe = data.recipes[recipeIndex]

    if(!recipe) return res.send("Recipe not found")

    recipe = {
        ...recipe,
        recipe_ingredents: recipe.recipe_ingredents.split(","),
        recipe_making: recipe.recipe_making.split(",")
    }

    return res.render("chefs/show.njk", { recipe, recipeIndex })
}

//edit
exports.edit = function (req, res) {
    const recipeIndex = req.params.index
    let recipe = data.recipes[recipeIndex]

    if(!recipe) return res.send("Recipe not found")

    return res.render("chefs/edit.njk", { recipe, recipeIndex })
}

//put
exports.put = function (req, res) {
    
    const recipe = {
        ...data.recipes[req.body.index],
        ...req.body
    }
    
    if(!recipe) return res.send("Recipe not found")
    
    data.recipes[recipe.index] = recipe

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
      if (err) return res.send("Erro ao editar receita!! Tente novamente")

       return res.redirect(`/admin/${recipe.index}`)
    })
}

//delete
exports.delete = function (req, res) {
    const { index } = req.body

    const recipeFilter = data.recipes.filter(function (recipe) {
        return data.recipes[recipe] !=index
    })
}