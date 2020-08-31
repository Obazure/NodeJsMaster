const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const {connection} = require('./config/config')
const homeRoutes = require('./routes/home')
const cartRoutes = require('./routes/cart')
const coursesRoutes = require('./routes/courses')

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: false}))
app.use('/', homeRoutes)
app.use('/cart', cartRoutes)
app.use('/courses', coursesRoutes)

async function start() {
    try {
        await mongosee.connect(connection, {useNewUrlParser: true})
        const PORT = process.env.PORT || 3000
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}...`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()
