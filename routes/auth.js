const {Router} = require('express')
const router = Router()

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'LogIn',
        isAuth: true,
    })
})

router.post('/login', async (req, res) => {
    res.redirect('/courses')
})

router.post('/register', async (req, res) => {
    res.redirect('/auth/login')
})

module.exports = router