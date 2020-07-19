const Recipe = require('../models/Recipe')
const File = require('../models/File')
const { file } = require('../models/Recipe')

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

        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        results = await File.findFileByRecipeId(req.params.id)
        const filesId = results.rows

        results = filesId.map(id => Recipe.file(id.file_id))
        let filesPromise = await Promise.all(results)
        filesPromise = filesPromise.map(file => file.rows[0])

        const files = filesPromise.map(file => ({
            ...file,
            src: `${ req.protocol }://${ req.headers.host }${ file.path.replace("public", "") }`
        }))

        return res.render("users/details", { recipe, files })
    },
}