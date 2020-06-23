const Chef = require('../models/Chef')
const { date } = require('../../lib/utils')

module.exports = {

    //chefsLoob
    index(req, res) {

        Chef.all(function (chefs) {
            
            return res.render("admin/chefs/chefs_list", { chefs })
        })
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
        
        Chef.create(req.body, function (chef) {
            
            return res.redirect(`/chefs/${ chef.id }`)
        }) 
    },

    //details
    show(req, res) {

        const id =  Number(req.params.id)

        Chef.find(id, function (chef) {
            if (!chef) return res.render("admin/chefs/show", { err: true })

            Chef.chefRecipes(id, function (recipes) {

                return res.render("admin/chefs/show", { chef, recipes })
            })
        })
    },

    //editPage
    edit(req, res) {
        
        Chef.find(req.params.id, function (chef) {
            if (!chef) return res.render("admin/chefs/edit", { err: true })

            return res.render("admin/chefs/edit", { chef })
        })
    },

    //editChef
    put(req, res) {

        const keys = Object.keys(req.body)

        for ( key of keys) {
            if (req.body[key] == "") {
                return res.send('Por favor preencha todos os campos')
            }
        }

        Chef.update(req.body, function () {

            return res.redirect(`/chefs/${req.body.id}`)
        })  
    },

    //deleteChef
    delete(req, res) {

        const chefRecipes = Number(req.body.total_recipes)

        if (chefRecipes >= 1) return res.render("admin/chefs/edit", { err: true, text: true })
        
        Chef.delete(req.body.id, function () {
            
            return res.redirect("/chefs")
        })
    },
}