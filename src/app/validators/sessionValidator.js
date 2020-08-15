const User = require('../models/User')
const checkAllFields = require('../../lib/checkFields')
const { compare } = require('bcryptjs')

async function login(req, res, next) {
    
    const notFillAllFields = checkAllFields(req.body)
    if(notFillAllFields) return res.render('session/login', notFillAllFields)

    const { email, password } = req.body

    const user = await User.findOne({
        where: { email }
    })

    if(!user) return res.render('session/login', {
        error: "Esse usuário não existe!!",
        user: req.body
    })

    const acceptedPassword = await compare(password, user.password)

    if(!acceptedPassword)  return res.render('session/login', {
        error: "Senha incorreta!!",
        user: { email }
    })

    req.user = user

    next()
}


module.exports = {
    login
}