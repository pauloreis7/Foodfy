const Recipe = require('../models/Recipe')
const { date } = require('../../lib/utils')

module.exports = {

    //recipesLoob
    index(req, res) {

        Recipe.all(function (recipes) {
            
            return res.render("admin/recipes/recipes_list", { recipes })
        })

    },

    //createPage
    create(req, res) {

        Recipe.chefsSelectOption(function (options) {
            
            return res.render("admin/recipes/create", { options })
        })
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

            return res.redirect(`/recipes/${ recipe.id }`)
        })
    },

    //details
    show(req, res) {
        
        Recipe.find(req.params.id, function (recipe) {
          if (!recipe) return res.send("Receita não encontrada")
          
            recipe.ingredients = recipe.ingredients[0].split(",")
            recipe.preparation = recipe.preparation[0].split(",")
            
            // const indexPreparation = recipe.preparation.indexOf("")
            // const indexIngredients = recipe.ingredients.indexOf("")

            // if (indexPreparation != -1) {
            //     recipe.preparation.splice(indexPreparation, 1)
            // }

            // if (indexIngredients != -1) {
            //     recipe.ingredients.splice(indexIngredients, 1)
            // }

            return res.render("admin/recipes/show", { recipe })
        })

    },

    //editPage
    edit(req, res) {

        Recipe.find(req.params.id, function (recipe) {
          if (!recipe) return res.send("Receita não encontrada")      
            
            Recipe.chefsSelectOption(function (options) {

                return res.render("admin/recipes/edit", { recipe, options })
            })
        })
    },

    //editRecipe
    put(req, res) {

        const keys = Object.keys(req.body)

        for ( key of keys) {
            if (req.body[key] == "") {
                return res.send('Por favor preencha todos os campos')
            }
        }

        Recipe.update(req.body, function () {
            
            return res.redirect(`/recipes/${req.body.id}`)
        })
        
    },

    //deleteRecipe
    delete(req, res) {
        
        Recipe.delete(req.body.id, function () {
            
            return res.redirect("/recipes")
        })
    },
}