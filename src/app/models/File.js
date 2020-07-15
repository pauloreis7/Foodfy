const db = require('../../config/db')

module.exports = {

    create({ name, path }) {
        const query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ($1, $2)
            RETURNING id
        `

        const values = [
            name,
            path
        ]

        return db.query(query, values)
    },

    createAtRecipeFiles ({ fileId,  recipeId}) {

        const query = `
            INSET INTO recipe_files (
                recipe_id,
                file_id
            ) VALUES ( $1, $2 )
            RETURNING id
        `

        const values = [
            recipeId,
            fileId
        ]

        return db.query(query, values)
    }
}