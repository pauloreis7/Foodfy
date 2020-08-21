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

async function forgot(req, res, next) {
    const { email } = req.body
    
    const notFillAllFields = checkAllFields(req.body)

    if(notFillAllFields) 
    return res.render('session/password-recovery/forgot-password', notFillAllFields)

    const user = await User.findOne({
        where: { email }
    })
    
    if (!user) return res.render('session/password-recovery/forgot-password', {
        error: "Esse usuário não existe!!",
        user: { email }
    })

    req.user = user

    next()
}

async function reset(req, res, next) {
    const { email, token, password, password_repeat } = req.body
    
    const notFillAllFields = checkAllFields(req.body)

    if(notFillAllFields) 
    return res.render('session/password-recovery/reset-password', {
        error: "Por favor preencha todo os campos!!",
        email,
        token
    })

    const user = await User.findOne({
        where: { email }
    })

    if (!user) return res.render('session/password-recovery/reset-password', {
        error: "Esse usuário não existe!!",
        email,
        token
    })

    if (password != password_repeat ) return res.render('session/password-recovery/reset-password', {
        error: "A senha e a repetição devem ser iguais!!",
        email,
        token
    })

    let now = new Date
    now = now.setHours(now.getHours()) 

    if(now > user.reset_token_expires) return res.render('session/password-recovery/reset-password', {
        error: "Sua chave expirou!! Requisite uma nova recuperação",
        email,
        token
    })

    if(token != user.reset_token) return res.render('session/password-recovery/reset-password', {
        error: "Sua chave para mudar senha está inválida!! Requisite uma nova recuperação",
        email,
        token
    })

    req.user = user
    
    next()
}

module.exports = {
    login,
    forgot,
    reset
}