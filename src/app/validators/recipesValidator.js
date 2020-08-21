const Recipe = require('../models/Recipe')

module.exports = async (req, res, next) => {

    let results = await Recipe.find(req.params.id)
    const recipe = results.rows[0]

    if(req.session.userId != recipe.user_id && !req.session.isAdmin) return res.redirect(`/recipes/${ recipe.id }?error=Somente o dono dessa receita ou administradores podem fazer isso!!`)

    next()
}