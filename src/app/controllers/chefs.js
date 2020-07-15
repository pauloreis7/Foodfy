const Chef = require('../models/Chef')
const { date } = require('../../lib/utils')

module.exports = {

    //chefsLoob
    async index(req, res) {

        const results = await Chef.all()
        const chefs = results.rows

        return res.render("admin/chefs/chefs_list", { chefs })
    },

    //createPage
    async create(req, res) {

        return res.render("admin/chefs/create")
    },

    //createChef
    async post(req, res) {
        
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
    async show(req, res) {

        const id =  Number(req.params.id)

        let results = await Chef.find(id)
        const chef = results.rows[0]

        if (!chef) return res.render("admin/chefs/show", { err: true })
        
        chef.created_at = date(chef.created_at).format

        results = await Chef.chefRecipes(id)
        const recipes = results.rows

        return res.render("admin/chefs/show", { chef, recipes })
    },

    //editPage
    async edit(req, res) {
        
        const results = await Chef.find(req.params.id)
        const chef = results.rows[0]

        if (!chef) return res.render("admin/chefs/edit", { err: true })

        return res.render("admin/chefs/edit", { chef })
    },

    //editChef
    async put(req, res) {

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
    async delete(req, res) {

        const chefRecipes = Number(req.body.total_recipes)

        if (chefRecipes >= 1) return res.render("admin/chefs/edit", { err: true, text: true })
        
        await Chef.delete(req.body.id)

        return res.redirect("/chefs")
    },
}