const Recipe = require('../models/Recipe.js')

module.exports = {

    //loob
    async index(req, res) {

        const results = await Recipe.all(search = false)
        const recipes = results.rows

        let recipesPop = recipes.filter(function (recipe) {
            return recipes.indexOf(recipe) < 6
        })
            
        return res.render("users/index", { recipesPop })

    },

    //aboutFoodfy
    about(req, res) {

        return res.render("users/food_about")
    },

    //recipesList
    async recipes(req, res) {
        
        let { search } = req.query

        const results = await Recipe.all(search)
        const recipes = results.rows

        return res.render("users/recipes", { recipes, search })
    },

    //details
    async details(req, res) {

        const results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        return res.render("users/details", { recipe })
    },
}