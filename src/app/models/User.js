const db = require('../../config/db')
const crypto = require('crypto')
const { hash } = require('bcryptjs')

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

        const results = await db.query(query, values)

        return password
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
        return db.query(`DELETE FROM users WHERE id = ${ id }`)
    }
}