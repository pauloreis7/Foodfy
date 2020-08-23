const User = require('../models/User')
const Recipe = require('../models/Recipe')
const File = require('../models/File')

module.exports = {

   async index(req, res) {

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

         const error = req.query.error || null
         const success = req.query.success

         return res.render('admin/users/index', { user, recipes, error, success })

      } catch (err) {
         console.error(err)

         return res.redirect("/recipes?error=Erro ao acessar informações de usuário, tente novamente!!")
      }  
   },

   async update(req, res) {
      
      try {
         
         const { user } = req

         const { name, email } = req.body

         await User.update(user.id, {
            name,
            email
         })

         return res.redirect("/admin/profile?success=Conta atualizada com sucesso!!")

      } catch (err) {
         console.error(err)

         return res.redirect("/admin/profile?error=Erro ao atualizar usuário, tente novamente!!")
      }
   }
}