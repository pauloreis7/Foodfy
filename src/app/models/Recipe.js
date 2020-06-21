const db = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {
    
    all(callback) {
        
        db.query(`SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        `, function (err, results) {
            if (err) throw `Erro ao encontrar receitas! ${ err }`
            
            callback(results.rows)
        })
    },

    create(data, callback) {

        const query = `
            INSERT INTO recipes (
                chef_id,
                image,
                title,
                ingredients,
                preparation,
                information,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `

        const values = [
            data.chef_id,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso
        ]

        db.query(query, values, function (err, results) {
            if (err) throw `Erro ao cadastrar receita! ${ err }`

            callback(results.rows[0])
        })
    },

    find(id, callback) {

        db.query(`SELECT recipes.*, chefs.name AS chef_name
        FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = ${ id }`, function (err, results) {
            if (err) throw `Erro ao encontrar receita! ${ err }`
            
            callback(results.rows[0])
        })
    },

    chefsSelectOption(callback) {

        db.query(`SELECT name, id FROM chefs`, function (err, results) {
            if (err) throw `Erro ao encontrar receita! ${ err }`
            
            callback(results.rows)
        })
    },

    update(data, callback) {

        const query = `
        UPDATE recipes SET
        chef_id = ($1),
        image = ($2),
        title = ($3),
        ingredients = ($4),
        preparation = ($5),
        information = ($6)
        WHERE id = ${ data.id }
        `
        const values = [
            data.chef_id,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information
        ]

        db.query(query, values, function (err, results) {
            if (err) throw `Erro ao atualizar receita! ${ err }`
            
            callback()
        })

    },

    delete(id, callback) {

        db.query(`DELETE FROM recipes WHERE id = ${ id }`, function (err, results) {
            if (err) throw `Erro ao deletar receita! ${ err }`
            
            callback()
        })
    },
}