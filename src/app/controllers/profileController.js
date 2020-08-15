module.exports = {

   index(req, res) {
      return res.render('admin/users/index.njk')
   },

   update(req, res) {
      return res.render('admin/users/')
   }
}