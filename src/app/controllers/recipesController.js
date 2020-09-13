const Recipe = require('../models/Recipe')
const File = require('../models/File')
const { date } = require('../../lib/utils')

module.exports = {

    //recipesLoob
    async index(req, res) {

        try {
            let results = await Recipe.all()

            if (!results.rows) return res.render('admin/recipes/recipes_list', { 
                error: "Não encontramos nenhuma receita!!"
            })

            async function getImages(recipeId) {
                const fileId = await File.findFileByRecipeId(recipeId)

                results = await Recipe.file(fileId.rows[0].file_id)

                const file = results.rows.map( file => `${ req.protocol }://${ req.headers.host }${ file.path.replace("public", "") }`)

                return file
            }

            const recipesPromise = results.rows.map( async recipe => {
                recipe.img = await getImages(recipe.id)

                return recipe
            } )

            const recipes = await Promise.all(recipesPromise)

            const error = req.query.error || null

            return res.render('admin/recipes/recipes_list', { recipes, error })
            
        } catch (err) {
            console.error(err)
                   
            return res.render('admin/recipes/recipes_list', { 
                error: "Erro ao exibir listagem, tente novamente!!"
            })
        }
    },

    //createPage
    async create(req, res) {

        try {

            const results = await Recipe.chefsSelectOption()
            const options = results.rows

            return res.render("admin/recipes/create", { options })
            
        } catch (err) {
            console.error(err)
            
            return res.redirect("/recipes?error=Erro ao acessar criação de receita, tente novamente!!")
        }
    },

    //createRecipe
    async post(req, res) {
        try {

            let results = await Recipe.chefsSelectOption()
            const options = results.rows

            const keys = Object.keys(req.body)

            for ( key of keys) {
                if (req.body[key] == "") {
                    return res.render("admin/recipes/create", { 
                        error: "Por favor, preencha todos os campos!!",
                        recipe: req.body,
                        options
                    })
                }
            }

            if (req.files.length == 0) return res.render("admin/recipes/create", { 
                error: "Por favor envie pelo menos uma foto!!",
                recipe: req.body,
                options
            })

            req.body.userId = req.session.userId

            results = await Recipe.create(req.body)
            const recipeId = results.rows[0].id

            const filesPromise = req.files.map( file => File.create(file))
            const filesResults = await Promise.all(filesPromise)

            const recipeFilesPromise = filesResults.map(file => {
                const fileId = file.rows[0].id

                File.createAtRecipeFiles(fileId, recipeId)
            })
            await Promise.all(recipeFilesPromise)

            return res.redirect(`/recipes/${ recipeId }`)

        } catch (err) {
            console.error(err)
            
            let results = await Recipe.chefsSelectOption()
            const options = results.rows
            
            return res.render("admin/recipes/create", { 
                error: "Erro ao criar receita, tente novamente!!",
                recipe: req.body,
                options
            })
        }
    },

    //details
    async show(req, res) {

        try {
            
            let results = await Recipe.find(req.params.id)
            const recipe = results.rows[0]

            const recipesOldIngredients = recipe.ingredients[0].split(",")
            recipe.ingredients.splice(0, 1)

            for (recipesOldIngredient of recipesOldIngredients) {
                recipe.ingredients.push(recipesOldIngredient)
            }

            const recipesOldsteps = recipe.preparation[0].split(",")
            recipe.preparation.splice(0, 1)

            for (recipesOldstep of recipesOldsteps) {
                recipe.preparation.push(recipesOldstep)
            }

            if (!recipe) return res.render("admin/recipes/show", { err: true })

            results = await File.findFileByRecipeId(req.params.id)
            const filesId = results.rows

            results = filesId.map(id => Recipe.file(id.file_id))
            let filesPromise = await Promise.all(results)
            filesPromise = filesPromise.map(file => file.rows[0])
            
            const files = filesPromise.map(file => ({
                ...file,
                src: `${ req.protocol }://${ req.headers.host }${ file.path.replace("public", "") }`
            }))

            const error = req.query.error

            return res.render("admin/recipes/show", { recipe, files, error })

        } catch (err) {
            
            console.error(err)
            
            return res.redirect("/recipes?error=Erro ao acessar receita, tente novamente!!")
        }
        
        
    },

    //editPage
    async edit(req, res) {

        try {

            const { id } = req.params

            let results = await Recipe.find(id)
            const recipe = results.rows[0]

            if (!recipe) return res.render("admin/recipes/show", { err: true })    

            results = await File.findFileByRecipeId(id)
            const filesId = results.rows
            
            results = filesId.map(fileId => Recipe.file(fileId.file_id))
            let filesPromise = await Promise.all(results)
            filesPromise = filesPromise.map(file => file.rows[0])

            const files = filesPromise.map(file => ({
                ...file,
                src: `${ req.protocol }://${ req.headers.host }${ file.path.replace("public", "") }`
            }))

            results = await Recipe.chefsSelectOption()
            const options = results.rows

            const error = req.query.error

            return res.render("admin/recipes/edit", { recipe, options, files, error })

        } catch (err) {
            
            const { id } = req.params

            console.error(err)
            
            return res.redirect(`/recipes/${ id }?error=Erro ao acessar edição da receita, tente novamente!!`)
        }         
    },

    //editRecipe
    async put(req, res) {

        try {

            const keys = Object.keys(req.body)

            for ( key of keys) {
                if (req.body[key] == "" && key != "removed_files") {
                    return res.redirect(`/recipes/${ req.body.id }/edit?error=Por favor, preencha todos os campos!!`)
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

                const promiseFiles = removedFiles.map(id => File.delete(id))
                await Promise.all(promiseFiles)
            }

            await Recipe.update(req.body)

            return res.redirect(`/recipes/${ req.body.id }`)
            
        } catch (err) {
            console.error(err)
            
            return res.redirect(`/recipes/${ req.body.id }/edit?error=Erro ao atualizar receita, tente novamente!!`)
        }
    },

    //deleteRecipe
    async delete(req, res) {

        try {

            let results = await File.findFileByRecipeId(req.body.id)
            const filesId = results.rows

            const promiseFiles = filesId.map(id => File.delete(id.file_id))
            await Promise.all(promiseFiles)
            
            await Recipe.delete(req.body.id)

            return res.redirect("/recipes")
            
        } catch (err) {
            console.error(err)
            
            return res.redirect(`/recipes/${ req.body.id }/edit?error=Erro ao deletar receita, tente novamente!!`)
        }
    }
}