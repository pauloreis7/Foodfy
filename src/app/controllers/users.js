const Recipe = require('../models/Recipe.js')

module.exports = {

    //loob
    index(req, res) {

        Recipe.all(function (recipes) {
            
            let recipesPop = recipes.filter(function (recipe) {
                return recipes.indexOf(recipe) < 6
            })
            
            return res.render("users/index", { recipesPop })
        })
    },

    //aboutFoodfy
    about(req, res) {

        return res.render("users/food_about")
    },

    //recipesList
    recipes(req, res) {

        return res.render("users/recipes")

    },

    //details
    details(req, res) {

        Recipe.find(req.params.id, function (recipe) {

            recipe.ingredients = recipe.ingredients[0].split(",")
            recipe.preparation = recipe.preparation[0].split(",")

            return res.render("users/details", { recipe })
        })
    },

}