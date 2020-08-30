const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const coursesRoutes = require('./routes/courses')
const manageRoutes = require('./routes/manage')


const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static('public'))
app.use('/', homeRoutes)
app.use('/courses', coursesRoutes)
app.use('/manage', manageRoutes)

const PORT = process.env.PORT || 3000


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`)
})