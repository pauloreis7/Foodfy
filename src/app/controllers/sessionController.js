const User = require('../models/User')
const mailer = require('../../lib/mail')

const { hash } = require('bcryptjs')
const crypto = require('crypto')

module.exports = {
    loginForm(req, res) {
        const user = req.query

        return res.render('session/login', { user })
    },
    
    login(req, res) {
        
        const { user } = req

        req.session.userId = user.id

        const isAdmin = user.is_admin == true ?  true : false

        req.session.isAdmin = isAdmin

        return res.redirect('/admin/profile')
    },

    logout(req, res) {
        req.session.destroy()

        return res.redirect('/')
    },

    forgotForm(req, res) {

        return res.render('session/password-recovery/forgot-password')
    },

    async forgot(req, res) {

        const { user } = req

        const token = crypto.randomBytes(20).toString('hex')

        let expiresTime = new Date()
        expiresTime = expiresTime.setHours(expiresTime.getHours() + 1)
        
        await User.update(user.id, {
            reset_token: token,
            reset_token_expires: expiresTime
        })

        await mailer.sendMail({
            to: req.body.email,
            from: 'foodfy@gmail.com',
            subject: '👨‍🍳 Recuperação de senha Foodfy',
            html: `
                <h1>✅ Olá ${ user.name } Perdeu sua senha? <br />
                    Não se preocupevamos recuperar para você!!!
                </h1>

                <p>Sua solicitação para uma nova senha foi efetuada com sucesso!!!<br />
                Agora clique no link abaixo para pegar sua nova senha 😍😍
                </p>

                <hr />
                <span>Obs: a solicitação de nova senha só é válida durante 1hr para garantir a segurança de sua conta!</span>

                <h2>Confira suas credenciais de acesso:</h2>

                <p><strong>Link para recuperar senha:</strong> <a href='http://localhost:3000/reset-password?email=${ user.email }&&token=${ token }' target='_blank'>Recuperar minha senha</a></p>

                <p><strong>Email de cadastro:</strong> ${ user.email }</p>
                    
            `
        })

        return res.render('session/password-recovery/forgot-password', { 
            success: "Sucesso, te enviamos um email para recuperar a senha!!!"
        })

    },

    resetForm(req, res) {
        const { email, token } = req.query

        return res.render('session/password-recovery/reset-password', { email, token })
    },

    async reset(req, res) {

        const { password } = req.body
        const { user } = req

        const newPassword = await hash(password, 8)

        await User.update(user.id, {
            password: newPassword,
            reset_token: "",
            reset_token_expires: ""
        })

        return res.render('session/login', { 
            success: "Senha atualizada com sucesso!! Faça seu login"
        })
    },
}