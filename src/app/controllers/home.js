const Recipe = require('../models/Recipe')
const File = require('../models/File')


module.exports = {

    //loob
    async index(req, res) {
        try {
            let results = await Recipe.search(search = false)

            if(!results.rows) return res.send("Não encontramos nenhuma receita!!")

            async function getImages(recipeId) {
                const fileId = await File.findFileByRecipeId(recipeId)

                results = await Recipe.file(fileId.rows[0].file_id)
                
                const file = results.rows.map( file => `${ req.protocol }://${ req.headers.host }${ file.path.replace("public", "") }` )

                return file
            }

            const recipesPromise = results.rows.map( async recipe => {
                recipe.img = await getImages(recipe.id)

                return recipe
            } ).filter( ( recipe, index ) => index > 5 ? false : true )

            const recipes = await Promise.all(recipesPromise)

            const error = req.query.error || null

            return res.render("users/index", { recipes, error })

        } catch (err) {
            console.error(err)

            return res.render('users/index', { 
                error: "Erro ao exibir listagem, tente novamente!!"
            })
        }
    },

    //aboutFoodfy
    about(req, res) {
        
        try {
            return res.render("users/food_about")

        } catch (err) {
            console.log(err)

            return res.redirect('/?error=Erro ao carregar página, tente novamente!!')
        }
    },

    //recipesList
    async recipes(req, res) {

        try {

            let { search } = req.query

            let results = await Recipe.search(search)

            if(!results.rows) return res.send("Não encontramos nenhuma receita!!")
            
            async function getImages(recipeId) {
                const fileId = await File.findFileByRecipeId(recipeId)
                
                results = await Recipe.file(fileId.rows[0].file_id)

                const file = results.rows.map( file => `${ req.protocol }://${ req.headers.host }${ file.path.replace("public", "") }` )

                return file[0]
            }

            const recipesPromise = results.rows.map( async recipe => {
                recipe.img = await getImages(recipe.id)

                return recipe
            } )

            const recipes = await Promise.all(recipesPromise)

            return res.render("users/recipes", { recipes, search })

        } catch (err) {
            console.error(err)

            return res.render('users/recipes', {
                error: "Erro ao exibir listagem de receitas, tente novamente!!"
            })
        }
    },

    //details
    async recipeDetails(req, res) {

        try {

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
            
        } catch (err) {
            console.error(err)

            return res.redirect('/?error=Erro ao acessar receita, tente novamente!!')
        }
    }
}