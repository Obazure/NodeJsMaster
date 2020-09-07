const express = require('express')
const path = require('path')
const csrf = require('csurf')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const {connection} = require('./config/config')
const authRoutes = require('./routes/auth')
const homeRoutes = require('./routes/home')
const cartRoutes = require('./routes/cart')
const coursesRoutes = require('./routes/courses')
const ordersRoutes = require('./routes/orders')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',

})
const store = new MongoStore({
    collection: 'sessions',
    uri: connection
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: false}))
app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(csrf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes)
app.use('/auth', authRoutes)
app.use('/cart', cartRoutes)
app.use('/courses', coursesRoutes)
app.use('/orders', ordersRoutes)

const PORT = process.env.PORT || 3000

async function start() {
    try {
        await mongoose.connect(connection, {
            useNewUrlParser: true,
            useFindAndModify: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}...`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()
