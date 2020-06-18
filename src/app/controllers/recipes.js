const { date } = require('../../lib/utils')
const Recipe = require('../models/Recipe')

module.exports = {

    //recipesLoob
    index(req, res) {

        return res.render("admin/recipes/recipe_manager")
    },

    //createPage
    create(req, res) {

        return res.render("admin/recipes/create")
    },

    //createRecipe
    post(req, res) {

        const keys = Object.keys(req.body)

        for ( key of keys) {
            if (req.body[key] == "") {
                return res.send('Por favor preencha todos os campos')
            }
        }


        Recipe.create(req.body, function (recipe) {

            return res.redirect(`/recipes/recipe_manager`)
        })
    },

    //details
    show(req, res) {

        return res.render("admin/recipes/show")
    },

    //editPage
    edit(req, res) {

        return res.render("admin/recipes/edit")
    },

    //editRecipe
    put(req, res) {

        const keys = Object.keys(req.body)

        for ( key of keys) {
            if (req.body[key] == "") {
                return res.send('Por favor preencha todos os campos')
            }
        }

        if(!recipe) return res.send("Recipe not found")
        
        return res.redirect(`admin/recipes/${recipe.index}`)
    },

    //deleteRecipe
    delete(req, res) {

        return res.redirect("/recipes/recipe_manager")
    },
}