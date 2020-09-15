const User = require('../models/User')
const Recipe = require('../models/Recipe')
const File = require('../models/File')

const mailer = require('../../lib/mail')

module.exports = {
    
    async list(req, res) {
        try {

            let results = await User.all()
            const users = results.rows

            const error = req.query.error
            const success = req.query.success
            
            return res.render('admin/users/users_list', { users, error, success })

        } catch (err) {
            console.error(err)

            return res.render('admin/users/users_list', { 
                error: "Erro ao exibir listagem, tente novamente!!"
            })
        }
    },

    create(req, res) {
        
        try {
            
            return res.render('admin/users/register')
        } catch (err) {
            console.error(err)

            return res.redirect("/admin/users?error=Erro ao acessar criação de usuário, tente novamente!!")
        }
    },

    async post(req, res) {

        try {
            
            const userPassword = await User.create(req.body).password

            await mailer.sendMail({
                to: req.body.email,
                from: 'foodfy@gmail.com',
                subject: '👨‍🍳 Cadastro Foodfy',
                html: `
                    <h1>✅ Olá ${ req.body.name } seu Cadastro foi feito com sucesso!!!</h1>

                    <p>Seu cadastro no Foodfy foi efetuado!!!<br />
                    Agora faça seu login e aproveite 😍😍
                    </p>

                    <h2>Confira suas credenciais de acesso:</h2>

                    <p><strong>login:</strong> <a href='http://localhost:3000/login?email=${ req.body.email }&&password=${ userPassword }' target='_blank'>Fazer meu login</a></p>
                    <p><strong>Email de cadastro:</strong> ${ req.body.email }</p>
                    <p><strong>Senha:</strong> ${ userPassword }</p>
                
                `
            })

            return res.render('admin/users/register', {
                success: "Usuário registrado com sucesso!!"
            })

        } catch (err) {
            console.error(err)

            return res.render("admin/users/register", { 
                error: "Erro ao criar usuário, tente novamente!!",
                user: req.body,
            })
        }
        
    },

    async update(req, res) {

        try {

            const { user } = req

            const userRecipes = await User.findUserRecipes(user.id)

            async function getImages(recipeId) {
                const fileId = await File.findFileByRecipeId(recipeId)

                results = await Recipe.file(fileId.rows[0].file_id)

                const files = results.rows.map( file => `${ req.protocol }://${ req.headers.host }${ file.path.replace("public", "") }`)

                return files[0]
            }

            const recipesPromise = userRecipes.map( async recipe => {
                recipe.img = await getImages(recipe.id)

                return recipe
            })

            const recipes = await Promise.all(recipesPromise)

            const error = req.query.error
            
            return res.render('admin/users/edit', { user, recipes, error })

        } catch (err) {
            console.error(err)

            return res.redirect("/admin/users?error=Erro ao acessar edição de usuário, tente novamente!!")
        }       
    },

    async put(req, res) {

        try {
            
            const { id, name, email, is_admin } = req.body

            let isAdmin = false
            if(is_admin) isAdmin = true
        
            await User.update(id, {
                name,
                email,
                is_admin: isAdmin
            })

            const userRecipes = await User.findUserRecipes(id)

            async function getImages(recipeId) {
                const fileId = await File.findFileByRecipeId(recipeId)

                results = await Recipe.file(fileId.rows[0].file_id)

                const files = results.rows.map( file => `${ req.protocol }://${ req.headers.host }${ file.path.replace("public", "") }`)

                return files[0]
            }

            const recipesPromise = userRecipes.map( async recipe => {
                recipe.img = await getImages(recipe.id)

                return recipe
            })

            const recipes = await Promise.all(recipesPromise)

            
            return res.render(`admin/users/edit`, {
                success: `Conta de ${ name } atualizada com sucesso!!`,
                user: req.body,
                recipes
            })

        } catch (err) {
            console.error(err)

            return res.redirect(`/admin/${ req.body.id }/update?error=Erro ao atualizar usuário, tente novamente!!`)
        } 
    },

    async delete(req, res) {
        try {
            
            await User.delete(req.body.id)
        
            return res.redirect('/admin/users?success=Conta deletada com sucesso!!')
        } catch (err) {
            console.error(err)

            return res.redirect(`/admin/${ req.body.id }/update?error=Erro ao deletar usuário, tente novamente!!`)
        }
    }
}