const User = require('../models/User')

module.exports = {

   index(req, res) {
      const { user } = req
      
      return res.render('admin/users/index', { user })
   },

   async update(req, res) {
      const { user } = req

      const { name, email } = req.body

      await User.update(user.id, {
         name,
         email
      })

      return res.render('admin/users/index', {
         success: "Conta atualizada com sucesso!!",
         user: req.body
      })
   }
}