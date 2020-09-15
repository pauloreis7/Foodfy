const db = require('../../config/db')
const crypto = require('crypto')
const { hash } = require('bcryptjs')
const fs = require('fs')

const Recipe = require('../models/Recipe')
const File = require('../models/File')

module.exports = {

    all() {

        return db.query(`SELECT * FROM users`)
    },

    async findOne(filters) {

        let query = `SELECT * FROM users`

        Object.keys(filters).map((key) => {

            query = `${ query }
                ${ key }
            `

            Object.keys(filters[key]).map((field) => {
                
                query = `${ query }
                    ${ field } = '${ filters[key][field] }'
                `
            })
        })


        const user = await db.query(query)

        return user.rows[0]
    },

    async findUserRecipes(userId) {
        const userRecipes = await db.query(`SELECT * from recipes WHERE user_id = ${ userId }`)

        return userRecipes.rows
    },

    async create(data) {

        const query = `
            INSERT INTO users (
                name,
                email,
                password,
                is_admin
            ) VALUES ($1, $2, $3, $4)
            RETURNING id
        `
        const password = crypto.randomBytes(3).toString('hex')

        const passwordHash = await hash(password, 8)

        let isAdmin = false

        if(data.is_admin) isAdmin = true

        const values = [
            data.name,
            data.email,
            passwordHash,
            isAdmin
        ]

        let results = await db.query(query, values)
        results = results.rows[0]

        return { results, password }
    },

    async update(id, fields) {

        let query = "UPDATE users SET"

        Object.keys(fields).map((field, index, array ) => {
            if((index + 1) < array.length) {
                query = `${ query }
                    ${ field } = '${ fields[field] }',
                `
            } else {
                query = `${ query }
                    ${ field } = '${ fields[field] }'
                    WHERE id = ${ id }
                `
            }           
        })

        await db.query(query)

        return
    },

    async delete(id) {

        let results = await db.query(`SELECT * FROM recipes WHERE user_id = ${ id }`)
        const recipes = results.rows

        const FilesPromise = recipes.map( async recipe => {
            const fileId = await File.findFileByRecipeId(recipe.id)
            results = await Recipe.file(fileId.rows[0].file_id)
            
            const file = results.rows[0]
            await File.delete(file.id)

            return
        })

        const files = await Promise.all(FilesPromise)

        await db.query(`DELETE FROM users WHERE id = ${ id }`)
    }
}