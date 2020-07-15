const Recipe = require('../models/Recipe')
const File = require('../models/File')
const { date } = require('../../lib/utils')

module.exports = {

    //recipesLoob
    async index(req, res) {

        const results = await Recipe.all(search = false)
        const recipes = results.rows
        
        return res.render("admin/recipes/recipes_list", { recipes })
    },

    //createPage
    async create(req, res) {

        const results = await Recipe.chefsSelectOption()
        const options = results.rows

        return res.render("admin/recipes/create", { options })
    },

    //createRecipe
    async post(req, res) {

        const keys = Object.keys(req.body)

        for ( key of keys) {
            if (req.body[key] == "") {
                return res.send('Por favor preencha todos os campos')
            }
        }

        if (req.files.length == 0) return res.send("Por favor coloque pelo menos uma foto!!")

        let results = await Recipe.create(req.body)
        const recipeId = results.rows[0].id

        // Implementar inserção de imagens no banco
        return 
    
    },

    //details
    async show(req, res) {
        
        const results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        if (!recipe) return res.render("admin/recipes/show", { err: true })

        return res.render("admin/recipes/show", { recipe })
    },

    //editPage
    async edit(req, res) {

        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        if (!recipe) return res.render("admin/recipes/show", { err: true})    

        results = await Recipe.chefsSelectOption()
        const options = results.rows

        return res.render("admin/recipes/edit", { recipe, options })
    },

    //editRecipe
    async put(req, res) {

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
    async delete(req, res) {
        
        await Recipe.delete(req.body.id)

        return res.redirect("/recipes")
    }
}