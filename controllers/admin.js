const fs = require('fs')
const data = require('../data.json')
const utils = require('../utils')

//index
exports.show = function (req, res) {
    const recipeIndex = req.params.index
    const recipe = data[recipeIndex]

    if(!recipe) return res.send("Recipe not found") 
    
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

        return res.send("Sará q foi??")
    })

}