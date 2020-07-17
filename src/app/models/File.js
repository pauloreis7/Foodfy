const db = require('../../config/db')
const fs = require('fs')

module.exports = {

    create({ filename, path }) {
        const query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ($1, $2)
            RETURNING id
        `

        const values = [
            filename,
            path
        ]

        return db.query(query, values)
    },

    createAtRecipeFiles (fileId,  recipeId) {

        const query = `
            INSERT INTO recipe_files (
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
    },

    findFileByRecipeId(id) {

        return db.query(`SELECT file_id FROM recipe_files WHERE recipe_id = ${ id }`)
    },

    async delete(id) {
        
        const results = await db.query(`SELECT * FROM files WHERE id = ${ id }`)
        const file = results.rows[0]

        fs.unlinkSync(file.path)

        await db.query(`DELETE FROM recipe_files WHERE file_id = ${ id }`)

        return db.query(`DELETE FROM files WHERE id = ${ id }`)
    },
}