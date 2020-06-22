const db  = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {

    all(callback) {

        db.query(`SELECT * FROM chefs ORDER BY id ASC`, function (err, results) {
            if (err) throw `Erro ao encontrar chefs! ${ err }`
            
            callback(results.rows)
        })

    },

    create(data, callback) {

        const query = `
            INSERT INTO chefs (
                name,
                avatar_url,
                created_at
            ) VALUES ($1, $2, $3)
            RETURNING id
        `

        const values = [
            data.name,
            data.avatar_url,
            date(Date.now()).iso
        ]

        db.query(query, values, function (err, results) {
            if (err) throw `Erro ao cadastrar chef! ${ err }`
            
            callback(results.rows[0])
        })
    },

    find(id, callback) {

        db.query(`SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        WHERE chefs.id = ${ id }
        GROUP BY chefs.id`, function (err, results) {
            if (err) throw `Erro ao encontrar chef! ${ err }`

            callback(results.rows[0])
        })
    },

    chefRecipes(id, callback) {

        db.query(`SELECT * FROM recipes WHERE chef_id = ${ id }`, function (err, results) {
            if (err) throw `Erro ao encontrar receitas do chef! ${ err }`
             

            callback(results.rows)
        })

    },

    update(data, callback) {

        const query = `
        UPDATE chefs SET
        name = ($1),
        avatar_url = ($2)
        WHERE id = ${ data.id }
        `

        const values = [
            data.name,
            data.avatar_url,
        ]
        
        db.query(query, values, function (err, results) {
            if (err) throw `Erro ao atualizar chef! ${ err }`
            
            callback()
        })
    },

    delete(id, callback) {

        db.query(`DELETE FROM chefs WHERE id = ${ id }`, function (err, results) {
            if (err) throw `Erro ao deletar chef! ${ err }`
            
            callback()
        })
    },
}