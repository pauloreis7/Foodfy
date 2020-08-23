const db  = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {

    all() {

        const query = 
        `
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs 
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            GROUP BY chefs.id
            ORDER BY id ASC 
        `

        return db.query(query)
    },

    create({ name }, fileId) {

        const query = `
            INSERT INTO chefs (
                name,
                created_at,
                file_id
            ) VALUES ($1, $2, $3)
            RETURNING id
        `

        const values = [
            name,
            date(Date.now()).iso,
            fileId
        ]

        return db.query(query, values)
    },

    find(id) {

        const query = 
        `
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            WHERE chefs.id = ${ id }
            GROUP BY chefs.id
        `

        return db.query(query)
    },

    file(id) {
        return db.query(`SELECT * FROM files WHERE id = ${ id }`)
    },

    chefRecipes(id) {

        return db.query(`SELECT * FROM recipes WHERE chef_id = ${ id }`)
    },

    update({ name, id }, fileId) {

        const query = `
        UPDATE chefs SET
        name = ($1),
        file_id = ($2)
        WHERE id = ${ id }
        `

        const values = [
            name,
            fileId
        ]
        
        return db.query(query, values)
    },

    delete(id) {

        return db.query(`DELETE FROM chefs WHERE id = ${ id }`)
    },
}