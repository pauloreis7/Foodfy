
module.exports = {

    //loob
    index(req, res) {

        return res.render("users/index")

    },

    //aboutFoodfy
    about(req, res) {

        return res.render("users/food_about")
    },

    //recipesList
    recipes(req, res) {

        return res.render("users/recipes")

    },

    //details
    detail(req, res) {

        return res.render("users/details")
    },

}