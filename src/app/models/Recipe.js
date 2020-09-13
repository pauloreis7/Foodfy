const db = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {

    all() {
        return db.query(`SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY recipes.created_at DESC`)
    },
    
    search(search) {

        let query = ""
            querySearch = ""

        if (search) {

            querySearch = `
            WHERE recipes.title ILIKE '%${ search }%'
            `
        }

        query = `SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ${ querySearch }
        ORDER by updated_at DESC
        `

        return db.query(query)
    },

    create(data) {

        const query = `
            INSERT INTO recipes (
                chef_id,
                title,
                ingredients,
                preparation,
                information,
                user_id,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `

        const values = [
            data.chef_id,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.userId,
            date(Date.now()).iso
        ]

        return db.query(query, values)
    },

    find(id) {

        const query = 
        `
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes 
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id = ${ id }
        `

        return db.query(query)
    },

    file (fileId) {

        return db.query(`SELECT * FROM files WHERE id = ${ fileId }`)
    },

    chefsSelectOption() {

        return db.query(`SELECT name, id FROM chefs`)
    },

    update(data) {

        const query = `
        UPDATE recipes SET
        chef_id = ($1),
        title = ($2),
        ingredients = ($3),
        preparation = ($4),
        information = ($5)
        WHERE id = ${ data.id }
        `
        
        const values = [
            data.chef_id,
            data.title,
            data.ingredients,
            data.preparation,
            data.information
        ]

        return db.query(query, values)

    },

    delete(id) {

        return db.query(`DELETE FROM recipes WHERE id = ${ id }`)
    },
}