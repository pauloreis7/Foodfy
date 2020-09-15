const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('./src/app/models/User')
const Chef = require('./src/app/models/Chef')
const Recipe = require('./src/app/models/Recipe')
const File = require('./src/app/models/File')

let usersIds = []
let chefsIds = []
let recipesIds = []
let filesIds = []

totalUsers = 3
totalChefs = 5
totalRecipes = 10
totalFiles = 16

async function createUsers() {
    const users = []

    const password = await hash('123', 8)

    while (users.length < totalUsers) {
        users.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password,
            is_admin: users.length > 1 ? true : false
        })
    }

    const usersPromise = await users.map(async user => {
        const userReturn = await User.create(user)
        return userReturn.results.id
    })

    usersIds = await Promise.all(usersPromise)

    let files = []
    while (files.length < totalFiles) {
        files.push({
            filename: faker.image.image(),
            path: `public/images/placeholder.png`,
        })
    }

    const filesPromise = await files.map(file => File.create(file))
    filesIds =  await Promise.all(filesPromise)
}

async function createChefs() {
    const chefs = []

    while (chefs.length < totalChefs) {

        chefs.push({
            name: faker.name.firstName(),
            file_id: filesIds[Math.floor(Math.random() * totalFiles)]
        })
    }

    const chefsPromise = await chefs.map(chef => Chef.create(chef, chef.file_id.rows[0].id))
    chefsIds = await Promise.all(chefsPromise)
}

async function createRecipes() {
    const recipes = []

    while (recipes.length < totalRecipes) {

        recipes.push({
            chef_id: chefsIds[Math.floor(Math.random() * totalChefs)], 
            title: faker.name.title(),
            ingredients: [faker.random.word(), faker.random.word(), faker.random.word()],
            preparation: [faker.random.word(), faker.random.word(), faker.random.word()],
            information: faker.lorem.words(10),
            user_id: usersIds[Math.floor(Math.random() * totalUsers)]
        })
    }

    const recipesPromise = await recipes.map(recipe => {

        recipe.chef_id = recipe.chef_id.rows[0].id

        return Recipe.create(recipe)
    })

    recipesIds = await Promise.all(recipesPromise)

    let recipeFiles = []
    while (recipeFiles.length < totalFiles) {

        recipeFiles.push({
            recipe_id: recipesIds[Math.floor(Math.random() * totalRecipes)],
            file_id: filesIds[Math.floor(Math.random() * totalFiles)]
        })
    }

    const recipeFilesPromise = await recipeFiles.map(file => {
        File.createAtRecipeFiles(file.file_id.rows[0].id, file.recipe_id.rows[0].id)
    })
    await Promise.all(recipeFilesPromise)
}

async function init() {
    await createUsers()
    await createChefs()
    await createRecipes()
}

init()