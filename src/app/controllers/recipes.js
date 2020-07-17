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

        if (req.files.length == 0) return res.send("Por favor envie pelo menos uma foto!!")

        let results = await Recipe.create(req.body)
        const recipeId = results.rows[0].id

        const filesPromise = req.files.map( file => File.create(file))
        const filesResults = await Promise.all(filesPromise)

        const recipeFilesPromise = filesResults.map(file => {
            const fileId = file.rows[0].id

            File.createAtRecipeFiles(fileId, recipeId)
        })
        await Promise.all(recipeFilesPromise)

        return res.redirect(`/recipes/${ recipeId }`)
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

        const { id } = req.params

        let results = await Recipe.find(id)
        const recipe = results.rows[0]

        if (!recipe) return res.render("admin/recipes/show", { err: true})    

        results = await File.findFileByRecipeId(id)
        const filesId = results.rows
        
        const filesPromise = filesId.map(fileId => Recipe.file(fileId.file_id))
        let filesPromiseResults = await Promise.all(filesPromise)
        filesPromiseResults = filesPromiseResults.map(file => file.rows)

        const files = filesPromiseResults.map(file => ({
            ...file[0],
            src: `${ req.protocol }://${ req.headers.host }${ file[0].path.replace("public", "") }`
        }))

        results = await Recipe.chefsSelectOption()
        const options = results.rows

        return res.render("admin/recipes/edit", { recipe, options, files })
    },

    //editRecipe
    async put(req, res) {

        const keys = Object.keys(req.body)

        for ( key of keys) {
            if (req.body[key] == "" && key != "removed_files") {
                return res.send('Por favor preencha todos os campos')
            }
        }

        if(req.files.length != 0 ) {
            const newFilesPromise = req.files.map(newFile => File.create(newFile))
            const filesResults = await Promise.all(newFilesPromise)
            
            const newRecipeFilesPromise = filesResults.map(newRecipeFile => {
                const fileId = newRecipeFile.rows[0].id

                File.createAtRecipeFiles(fileId, req.body.id)
            })
            await Promise.all(newRecipeFilesPromise)
        }

        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",")
            const latsIndex = removedFiles.length - 1
            removedFiles.splice(latsIndex, 1)

            let promiseFiles = removedFiles.map(id => File.delete(id))
            await Promise.all(promiseFiles)
        }

        await Recipe.update(req.body)

        return res.redirect(`/recipes/${ req.body.id }`)
    },

    //deleteRecipe
    async delete(req, res) {
        
        await Recipe.delete(req.body.id)

        return res.redirect("/recipes")
    }
}