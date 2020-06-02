const data = require('../data.json')

//loob
exports.index = function (req, res) {
    let recipesPop = []

    data.recipes.filter(function (recipe) {
        if(recipesPop.length < 6) {
            recipesPop.push(recipe)
        }
    })

    return res.render("users/index", { recipesPop })
}

//aboutFoodfy
exports.about = function (req, res) {
    return res.render("users/food_about")
}

//recipesAll
exports.recipes = function (req, res) {
    return res.render("users/recipes", { recipes: data.recipes })
}

//recipeDetails
exports.detail = function (req, res) {
    const recipeIndex = req.params.index
    let recipe = data.recipes[recipeIndex]

    recipe = {
        ...recipe,
        recipe_ingredents: recipe.recipe_ingredents.split(","),
        recipe_making: recipe.recipe_making.split(",")
    }

    if (!recipe) return res.send("Recipe not found")
    
    return res.render("users/details", { recipe })
}