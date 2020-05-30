const fs = require('fs')
const data = require('../data.json')

//index
exports.index = function (req, res) {

    return res.render("chefs/recipe_manager", { recipes: data.recipes })
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

    let { recipe_url, recipe_ingredents, recipe_making, recipe_specs, title, author } = req.body

    data.recipes.push({
        title,
        author,
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
        ...recipe
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

    let recipeFilter = []
    for ( recipe of data.recipes) {
        if (recipe != data.recipes[index]) {
            recipeFilter.push({
                ...recipe
            })
        }
    }

    data.recipes = recipeFilter

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
        if (err) return res.send("Erro ao deltar o arquivo!! Porfavor tente novamente")

        return res.redirect("/admin")
    })

}
//const recipeFilter = data.recipes.filter(function (recipe) {
      //  return recipe != data.recipes[index]
    //})