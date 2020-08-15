module.exports = {
    
    list(req, res) {
        return res.render('admin/users/users_list.njk')

    },

    create(req, res) {
        return res.render('admin/users/register.njk')
    },

    update(req, res) {
        return res.render('admin/users/edit.njk')
    }
}