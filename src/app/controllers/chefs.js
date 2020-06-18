
module.exports = {

    //chefsLoob
    index(req, res) {

        return res.render("admin/chefs/chefs_list")
    },

    //createPage
    create(req, res) {

        return res.render("admin/chefs/create")
    },

    //createChef
    post(req, res) {

        const keys = Object.keys(req.body)

        for ( key of keys) {
            if (req.body[key] == "") {
                return res.send('Por favor preencha todos os campos')
            }
        }

        return res.redirect(`/chefs/${chef.id}`)
    },

    //details
    show(req, res) {

        return res.render("admin/chefs/show")
    },

    //editPage
    edit(req, res) {

        return res.render("admin/chefs/edit")
    },

    //editChef
    put(req, res) {

        const keys = Object.keys(req.body)

        for ( key of keys) {
            if (req.body[key] == "") {
                return res.send('Por favor preencha todos os campos')
            }
        }

        if(!chef) return res.send("Chef not found")
        
        return res.redirect(`/chefs/${chef.id}`)
    },

    //deleteChef
    delete(req, res) {

        return res.redirect("/chefs")
    },
}