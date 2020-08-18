const User = require('../models/User')
const checkAllFields = require('../../lib/checkFields')
const { compare } = require('bcryptjs')

async function post(req, res, next) {
    
    const notFillAllFields = checkAllFields(req.body)
    if(notFillAllFields) return res.render('admin/users/register', notFillAllFields)
    
    const user = await User.findOne({
        where: { email: req.body.email }
    })

    if(user) return res.render('admin/users/register' , {
        error: "Esse usuário já existe!!",
        user: req.body
    })

    next()
}

async function show(req, res, next) {

    let id = req.params.id
    const { userId } = req.session

    if (!id) id = userId

    const user = await User.findOne( { where: {id} } )
    if(!user) return res.render('admin/users/register' , {
        error: "Esse usuário não existe!!",
    })

    req.user = user

    next()
}

async function updateLoggedUser(req, res, next) {
    
    const { password } = req.body

    if(!password) return res.render('admin/users/index', {
        error: "Coloque sua senha para atualizar o cadastro!",
        user: req.body
    })

    const notFillAllFields = checkAllFields(req.body)
    if(notFillAllFields) return res.render('admin/users/index', notFillAllFields)

    const user = await User.findOne({
        where: { id: req.session.userId },
    })

    const acceptedPassword = await compare(password, user.password)

    if(!acceptedPassword)  return res.render('admin/users/index', {
        error: "Senha incorreta!!",
        user: req.body
    })

    req.user = user

    next()
}

async function adminUpdateUser(req, res, next) {

    const notFillAllFields = checkAllFields(req.body)
    if(notFillAllFields) return res.render('admin/users/edit', notFillAllFields)

    next()
}

async function deleteUser(req, res, next) {

    if (req.session.userId == req.body.id) {
        return res.redirect('/admin/users?error=Você não pode deletar sua própria conta!!')
    }

    next()
}

module.exports = {
    post,
    show,
    updateLoggedUser,
    adminUpdateUser,
    deleteUser
}