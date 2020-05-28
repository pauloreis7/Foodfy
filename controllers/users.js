const recipes = require('../data')

//loob
exports.index = function (req, res) {
    const recipesPop = recipes.filter((recipes, index) => index < 6 ? false : true)
 
    return res.render("users/index", { recipesPop })
}

//aboutFoodfy
exports.about = function (req, res) {
    return res.render("users/food_about")
}

//recipesAll
exports.recipes = function (req, res) {
    return res.render("users/recipes", { recipes })
}

//recipeDetails
exports.detail = function (req, res) {
    const recipeIndex = req.params.index
    const recipe = recipes[recipeIndex]

    if (!recipe) return res.send("Recipe not found")
    
    return res.render("users/details", {recipe})
}