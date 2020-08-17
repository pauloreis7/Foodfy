const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes')
const methodOverride = require('method-override')
const session = require('./config/session')

const server = express()

server.locals = {
    name: "PAULO",
    house: "RED"
}

server.use((req, res, next) => {
    let isAdmin = false

    if(req.session && req.session.isAdmin) isAdmin = true

    res.locals.user = {
        isLogged: req.session,
        isAdmin: isAdmin
    }

    next()
})

server.use(session)

server.use(express.urlencoded({extended: true}))
server.use(express.static('public'))
server.use(methodOverride('_method'))
server.use(routes)

server.set("view engine", "njk")

nunjucks.configure("src/app/views", {
    express:server,
    autoescape:false,
    noCache: true,
    watch: true
})

server.listen(5000)