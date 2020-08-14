// const User = require('../models/User')

module.exports = {
    loginForm(req, res) {

        return res.render('session/login')
    },

    login(req, res) {

        return res.send(req.body)
    },

    logout(req, res) {
        return res.send("SAI")
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