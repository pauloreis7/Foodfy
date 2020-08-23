function onlyUsers(req, res, next) {

    if(!req.session.userId) return res.render('session/login', {
        error: "Faça seu login antes de continuar!!"
    })
    
    next()
}

function onlyAdmin(req, res, next) {

    if(!req.session.userId || !req.session.isAdmin == true) return res.redirect('/admin/profile?error=Somente administradores podem fazer isso!!')

    next()
}

function redirectUserByCredential(req, res, next) {

    if (req.session.userId) return res.redirect('/admin/users')

    next()
}

module.exports = {
    onlyUsers,
    onlyAdmin,
    redirectUserByCredential
}