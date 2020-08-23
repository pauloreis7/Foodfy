const User = require('../models/User')
const mailer = require('../../lib/mail')

const { hash } = require('bcryptjs')
const crypto = require('crypto')

module.exports = {
    loginForm(req, res) {

        try {

            const user = req.query

            return res.render('session/login', { user })

        } catch (err) {
            return res.redirect('/?error=Erro ao acessar login de usuário, tente novamente!!')
        }
    },
    
    login(req, res) {

        try {
            
            const { user } = req

            req.session.userId = user.id

            const isAdmin = user.is_admin == true ?  true : false

            req.session.isAdmin = isAdmin

            return res.redirect('/admin/profile')

        } catch (err) {
            console.error(err)

            const { email } = req.body
//depajo1107
            return res.render('session/login', { 
                user: { email },
                error: "Erro ao efetuar login, tente novamente!!"
            })
        }    
    },

    logout(req, res) {
        try {

            req.session.destroy()

            return res.redirect('/')
            
        } catch (err) {
            console.error(err)

            return res.redirect('/admin/profile?error=Error ao sair da sessão, tente novamente!!')
        }
    },

    forgotForm(req, res) {

        try {

            return res.render('session/password-recovery/forgot-password')
        } catch (err) {
            console.error(err)

            return res.render('session/login', { error: "Erro ao acessar a recuperação de senha, tente novamente!!"})
        }
    },

    async forgot(req, res) {

        try {

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
            
        } catch (err) {

            console.error(err)

            return res.render('session/password-recovery/forgot-password', { 
                error: "Erro ao recuperar senha, tente novamente!!",
                user: req.body
            })
        }
    },

    resetForm(req, res) {
        
        try {
            
            const { email, token } = req.query

            return res.render('session/password-recovery/reset-password', { email, token })

        } catch (err) {
            console.error(err)

            return res.render('session/password-recovery/forgot-password', { 
                error: "Erro ao acessar a recuperação de senha, tente novamente!!"
            })
        }
    },

    async reset(req, res) {

        try {

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

        } catch (err) {
            console.error(err)

            const { email, token } = req.body
            
            return res.render('session/password-recovery/reset-password', {
                error: "Erro ao recuperar senha, tente novamente!!",
                email,
                token
            })
        }
    },
}