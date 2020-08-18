const User = require('../models/User')
const mailer = require('../../lib/mail')

module.exports = {
    
    async list(req, res) {
        let results = await User.all()
        const users = results.rows

        const error = req.query
        
        return res.render('admin/users/users_list', { users, error })
    },

    create(req, res) {
        return res.render('admin/users/register')
    },

    async post(req, res) {

        try {
            
            const userPassword = await User.create(req.body)

            await mailer.sendMail({
                to: req.body.email,
                from: 'foodfy@gmail.com',
                subject: '👨‍🍳 Cadastro Foodfy',
                html: `
                    <h1>✅ Olá ${ req.body.name } seu Cadastro foi feito com sucesso!!!</h1>

                    <p>Seu cadastro no Foodfy foi efetuado!!!<br />
                    Agora faça seu login e aproveite 😍😍
                    </p>

                    <h2>Confira suas credenciais de acesso:</h2>

                    <p><strong>login:</strong> <a href='http://localhost:3000/login?email=${ req.body.email }&&password=${ userPassword }' target='_blank'>Fazer meu login</a></p>
                    <p><strong>Email de cadastro:</strong> ${ req.body.email }</p>
                    <p><strong>Senha:</strong> ${ userPassword }</p>
                
                `
            })

            return res.redirect('/admin/users')

        } catch (err) {
            console.error(err)
        }
        
    },

    update(req, res) {
        
        const { user } = req
        
        return res.render('admin/users/edit', { user })
    },

    async put(req, res) {
        const { id, name, email, is_admin } = req.body

        let isAdmin = false
        if(is_admin) isAdmin = true
    
        await User.update(id, {
            name,
            email,
            is_admin: isAdmin
        })
        
        return res.render(`admin/users/edit`, {
            success: `Conta de ${ name } atualizada com sucesso!!`,
            user: req.body
        })
    },

    async delete(req, res) {
        await User.delete(req.body.id)

        if(req.body.id == req.session.userId) {
            req.session.destroy()

            return res.render('session/login', {
                success: "Conta deletada com sucesso!!"
            })
        }
        
        return res.redirect('/admin/users')
    }
}