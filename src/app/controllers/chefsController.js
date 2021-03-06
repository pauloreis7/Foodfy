const Chef = require('../models/Chef')
const File = require('../models/File')
const Recipe = require('../models/Recipe')

const { date } = require('../../lib/utils')

module.exports = {

    //chefsLoob
    async index(req, res) {

        try {

            let results = await Chef.all()

            if(!results.rows) return res.render('admin/chefs/chefs_list', { 
                error: "Não encontramos nenhum chef!!"
            })

            async function getAvatar(fileId) {
                results = await Chef.file(fileId)
                const file = results.rows[0]

                const avatar = `${ req.protocol }://${ req.headers.host }${ file.path.replace("public", "") }`

                return avatar
            }
            
            const chefsPromise = results.rows.map( async chef => {
                chef.avatar = await getAvatar(chef.file_id)

                return chef
            } )

            const chefs = await Promise.all(chefsPromise)
            
            if (req.url == '/allChefs') return res.render("users/chefs", { chefs })

            const error = req.query.error || null

            return res.render("admin/chefs/chefs_list", { chefs, error })

        } catch (err) {
            console.error(err)
            
            return res.render('admin/chefs/chefs_list', { 
                error: "Erro ao exibir listagem, tente novamente!!"
            })
        }
    },

    //createPage
    create(req, res) {

        try {

            return res.render("admin/chefs/create")

        } catch (err) {
            
            console.error(err)
            
            return res.redirect("/chefs?error=Erro ao acessar criação de chefs, tente novamente!!")
        }

    },

    //createChef
    async post(req, res) {

        try {
            
            const keys = Object.keys(req.body)
        
            for ( key of keys) {
                if (req.body[key] == "") {
                    return res.render("admin/chefs/create", { 
                        error: "Por favor, preencha todos os campos!!",
                        chef: req.body,
                    })
                }
            }

            if (!req.file)  return res.render("admin/chefs/create", { 
                error: "Por favor envie pelo menos uma foto!!",
                chef: req.body,
            })
            
            let results = await File.create(req.file)
            const fileId = results.rows[0].id
            
            results = await Chef.create(req.body, fileId)
            const chefId = results.rows[0].id
            
            return res.redirect(`/chefs/${ chefId }`)

        } catch (err) {
            console.error(err)
            
            return res.render('admin/chefs/create', { 
                error: "Erro ao criar chef, tente novamente!!",
                chef: req.body,
            })
        }
    },

    //details
    async show(req, res) {

        try {
            
            const id = Number(req.params.id)

            let results = await Chef.find(id)
            const chef = results.rows[0]

            if (!chef) return res.render("admin/chefs/show", { err: true })
            
            chef.created_at = date(chef.created_at).format

            results = await Chef.chefRecipes(id)
            const chefRecipes = results.rows

            results = await Chef.file(chef.file_id)
            const avatar = results.rows[0]

            avatar.src = `${ req.protocol }://${ req.headers.host }${ avatar.path.replace("public", "") }`

            async function getImages(recipeId) {
                const fileId = await File.findFileByRecipeId(recipeId)

                results = await Recipe.file(fileId.rows[0].file_id)

                const file = results.rows.map( file => `${ req.protocol }://${ req.headers.host }${ file.path.replace("public", "") }`)

                return file
            }

            const recipesPromise = chefRecipes.map( async chefRecipe => {
                chefRecipe.img = await getImages(chefRecipe.id)

                return chefRecipe
            } )

            const recipes = await Promise.all(recipesPromise)

            if (req.url.replace(/\d/g, "") == "/chefDetails/")
            return res.render("users/chef_details", { chef, recipes, avatar })

            const error = req.query.error

            return res.render("admin/chefs/show", { chef, recipes, avatar, error })

        } catch (err) {
            console.error(err)
            
            return res.redirect("/chefs?error=Erro ao acessar chef, tente novamente!!")
        }

    },

    //editPage
    async edit(req, res) {

        try {
            
            let results = await Chef.find(req.params.id)
            const chef = results.rows[0]

            if (!chef) return res.render("admin/chefs/edit", { err: true })

            results = await Chef.file(chef.file_id)
            const avatar = results.rows[0]

            const error = req.query.error

            return res.render("admin/chefs/edit", { chef, avatar, error })

        } catch (err) {
            const { id } = req.params

            console.error(err)
            
            return res.redirect(`/chefs/${ id }?error=Erro ao acessar edição de chef, tente novamente!!`)
        }
    },

    //editChef
    async put(req, res) {

        try {
            
            const keys = Object.keys(req.body)

            for ( key of keys) {
                if (req.body[key] == "") {
                    return res.redirect(`/chefs/${ req.body.id }/edit?error=Por favor, preencha todos os campos!!`)
                }
            }

            let fileId = req.body.old_file_id

            if(req.file) {
                let results = await File.create(req.file)
                fileId = results.rows[0].id

                await Chef.update(req.body, fileId)

                await File.delete(req.body.old_file_id)

            } else {

                await Chef.update(req.body, fileId)
            }

            return res.redirect(`/chefs/${req.body.id}`)

        } catch (err) {
            console.error(err)
            
            return res.redirect(`/chefs/${ req.body.id }/edit?error=Erro ao atualizar chef, tente novamente!!`)
        }
    },

    //deleteChef
    async delete(req, res) {

        try {
            
            const chefRecipes = Number(req.body.total_recipes)

            if (chefRecipes >= 1) return res.render("admin/chefs/edit", { err: true, text: true })

            const chef = await Chef.find(req.body.id)
            const fileId = chef.rows[0].file_id
            
            await Chef.delete(req.body.id)

            await File.delete(fileId)

            return res.redirect("/chefs")

        } catch (err) {
            console.error(err)

            return res.redirect(`/chefs/${ req.body.id }/edit?error=Erro ao deletar chef, tente novamente!!`)
        }
    },
}