// const User = require('../models/User')

module.exports = {
    loginForm(req, res) {

        const user = req.query
        return res.render('session/login', { user })
    },
    
    login(req, res) {
        req.session.userId = req.user.id

        return res.redirect('/admin/profile')
    },

    logout(req, res) {
        req.session.destroy()

        return res.redirect('/')
    },

    forgotForm(req, res) {

        return res.render('session/password-recovery/forgot-password')
    },

    forgot(req, res) {

        return res.send(req.body)
    },

    resetForm(req, res) {

        return res.render('session/password-recovery/reset-password')
    },

    reset(req, res) {

        return res.send(req.body)
    },
}